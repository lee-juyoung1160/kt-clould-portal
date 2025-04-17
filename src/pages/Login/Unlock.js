import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/styles/pages/login.scss';
import Box from '../../components/common/Box';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useToast } from '../../components/common/Toast.js';

function Unlock() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    // 데모 사용자 정보
    const DEMO_USER = {
        email: 'test@test.com',
        authNum: '123456'
    };

    // 폼 데이터 상태 관리
    const [formData, setFormData] = useState({
        email: '',
        phoneNum: '',
        authNum: ''
    });

    // 오류 상태 관리
    const [errors, setErrors] = useState({
        email: false,
        emailFormat: false,
        phoneNum: false,
        phoneFormat: false,
        authNum: false,
        timer: false // 타이머 만료 에러 추가
    });

    // 인증 상태 관리
    const [authState, setAuthState] = useState({
        isAuthRequested: false,
        buttonText: '인증 받기'
    });

    // 타이머 상태 관리
    const [timer, setTimer] = useState(180); // 3분 (180초)
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // 컴포넌트 마운트 시 sessionStorage에서 상태 복원
    useEffect(() => {
        const savedAuthState = sessionStorage.getItem('authState');
        const savedTimer = sessionStorage.getItem('timer');
        const savedTimerRunning = sessionStorage.getItem('isTimerRunning');
        
        if (savedAuthState) {
            setAuthState(JSON.parse(savedAuthState));
        }
        
        if (savedTimer) {
            const parsedTimer = parseInt(savedTimer, 10);
            setTimer(parsedTimer);
            
            // 타이머가 만료되었는지 확인
            if (parsedTimer <= 0) {
                setErrors(prev => ({ ...prev, timer: true }));
                setIsTimerRunning(false);
                setAuthState({
                    isAuthRequested: true,
                    buttonText: '재요청'
                });
            } else if (savedTimerRunning === 'true') {
                setIsTimerRunning(true);
            }
        }
    }, []);

    // 타이머 포맷 함수
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // 타이머 시작 함수
    useEffect(() => {
        let interval;
        
        if (isTimerRunning && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => {
                    const newTimer = prevTimer - 1;
                    // 타이머 상태 저장
                    sessionStorage.setItem('timer', newTimer.toString());
                    
                    if (newTimer <= 0) {
                        // 타이머 만료 시
                        clearInterval(interval);
                        setIsTimerRunning(false);
                        sessionStorage.setItem('isTimerRunning', 'false');
                        
                        setErrors(prev => ({
                            ...prev,
                            timer: true
                        }));
                        
                        const expiredAuthState = {
                            isAuthRequested: true,
                            buttonText: '재요청'
                        };
                        setAuthState(expiredAuthState);
                        sessionStorage.setItem('authState', JSON.stringify(expiredAuthState));
                        
                        // 인증번호 무효화
                        setFormData(prev => ({
                            ...prev,
                            authNum: ''
                        }));
                        
                        return 0;
                    }
                    return newTimer;
                });
            }, 1000);
        }

        // 타이머 상태 저장
        sessionStorage.setItem('isTimerRunning', isTimerRunning.toString());

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isTimerRunning, timer]);

    // 이메일 유효성 검사
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return emailRegex.test(email);
    };

    // 휴대폰 번호 유효성 검사
    const validatePhoneNumber = (phoneNum) => {
        const phoneRegex = /^01[016789]\d{7,8}$/;
        return phoneRegex.test(phoneNum);
    };

    // 입력 필드 변경 핸들러
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [id]: value
        }));

        // 값이 입력되면 해당 필드의 에러 상태 제거
        if (value.trim() !== '') {
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors, [id]: false };
                
                // 이메일 형식 검사
                if (id === 'email') {
                    newErrors.emailFormat = value.trim() !== '' && !validateEmail(value);
                }
                
                // 휴대폰 번호 형식 검사
                if (id === 'phoneNum') {
                    newErrors.phoneFormat = value.trim() !== '' && !validatePhoneNumber(value);
                }
                
                return newErrors;
            });
        }
    };

    // 인증번호 요청 핸들러
    const onClickAuthNumBtn = () => {
        // 이메일 입력 및 형식 검증
        if (!formData.email || formData.email.trim() === '') {
            setErrors(prev => ({
                ...prev,
                email: true
            }));
            return;
        }
        
        if (!validateEmail(formData.email)) {
            setErrors(prev => ({
                ...prev,
                emailFormat: true
            }));
            return;
        }

        // 휴대폰 번호 입력 및 형식 검증
        if (!formData.phoneNum || formData.phoneNum.trim() === '') {
            setErrors(prev => ({
                ...prev,
                phoneNum: true
            }));
            return;
        }
        
        if (!validatePhoneNumber(formData.phoneNum)) {
            setErrors(prev => ({
                ...prev,
                phoneFormat: true
            }));
            return;
        }

        // 인증 상태 및 타이머 초기화
        const newAuthState = {
            isAuthRequested: true,
            buttonText: '재요청'
        };
        setAuthState(newAuthState);
        sessionStorage.setItem('authState', JSON.stringify(newAuthState));
        
        setIsTimerRunning(true);
        setTimer(180); // 3분으로 초기화
        sessionStorage.setItem('timer', '180');
        sessionStorage.setItem('isTimerRunning', 'true');
        
        setErrors(prev => ({
            ...prev,
            timer: false
        }));
        
        // 이미 입력된 인증번호가 있다면 초기화
        if (formData.authNum) {
            setFormData(prev => ({
                ...prev,
                authNum: ''
            }));
        }
        
        // 실제 환경에서는 여기서 API 호출하여 인증번호 요청
        alert('인증번호가 발송되었습니다. (테스트 환경에서는 123456 입력)');
    };

    // 잠금 해제 버튼 클릭 핸들러
    const handleUnlock = (e) => {
        e.preventDefault();
        
        // 빈 값 검사
        const newErrors = {
            email: !formData.email || formData.email.trim() === '',
            emailFormat: formData.email.trim() !== '' && !validateEmail(formData.email),
            phoneNum: !formData.phoneNum || formData.phoneNum.trim() === '',
            phoneFormat: formData.phoneNum.trim() !== '' && !validatePhoneNumber(formData.phoneNum),
            authNum: !formData.authNum || formData.authNum.trim() === '',
            timer: timer === 0 // 타이머 만료 체크 추가
        };
        
        setErrors(newErrors);
        
        // 에러 체크
        if (!Object.values(newErrors).some(error => error)) {
            // 아이디/패스워드 일치 확인
            if (formData.email === DEMO_USER.email && formData.authNum === DEMO_USER.authNum) {
                // 성공 시 세션 스토리지 정리
                sessionStorage.removeItem('authState');
                sessionStorage.removeItem('timer');
                sessionStorage.removeItem('isTimerRunning');
                
                // 잠금해제 성공 시 토스트 표시
                showToast('toastUnlockSuccess');
            } else {
                // 로그인 실패 시 알림
                alert('인증번호가 일치하지 않습니다.');
            }
        }
    };

    // 취소 버튼 클릭 시 로그인 페이지 이동
    const onClickMoveLogin = () => {
        // 세션 스토리지 정리
        sessionStorage.removeItem('authState');
        sessionStorage.removeItem('timer');
        sessionStorage.removeItem('isTimerRunning');
        
        navigate('/login');
    };

    return (
        <article className='login-page'>
            <div className="login-container">
                <Box radius="20" padding="32">
                    <h2 className='text-center'>잠금해제</h2>
                    <p className='desc text-center'>계정의 안전한 보호를 위해 추가 인증 절차를 진행합니다.</p>
                    <div className='input-wrap'>
                        <Box bgColor='gray' radius='12' padding='12' className='info__wrap text-color__grey'>
                            • 사용자 정보를 정확히 입력해주세요.<br />• 입력하신 정보로 인증번호가 발송됩니다.
                        </Box>
                        <form noValidate onSubmit={handleUnlock}>
                            <Input
                                id="email"
                                type="email"
                                label="이메일"
                                placeholder="이메일을 입력해주세요."
                                errorMessage={errors.emailFormat ? "유효한 이메일 형식이 아닙니다." : "이메일을 입력해주세요."}
                                value={formData.email || ''}
                                onChange={handleInputChange}
                                showError={errors.email || errors.emailFormat}
                            />
                            <Input
                                id="phoneNum"
                                type="tel"
                                label="휴대폰 인증"
                                placeholder="'-'를 제외하고 숫자 입력"
                                errorMessage={errors.phoneFormat ? "유효한 휴대폰 번호가 아닙니다." : "휴대폰 번호를 입력해주세요."}
                                maxLength={11}
                                actionButtonProps={{ variant: 'secondary', size: 'small' }}
                                actionButtonText={authState.buttonText}
                                actionButtonDisabled={isTimerRunning && timer > 0 && timer < 175} // 인증번호 요청 후 5초 동안 비활성화
                                onActionClick={onClickAuthNumBtn}
                                value={formData.phoneNum || ''}
                                onChange={handleInputChange}
                                showError={errors.phoneNum || errors.phoneFormat}
                            />
                            
                            {/* 인증 요청 후에만 인증번호 입력란을 표시 */}
                            {authState.isAuthRequested && (
                                <>
                                    <Input
                                        id="authNum"
                                        type="tel"
                                        placeholder="인증번호 6자리 숫자 입력"
                                        errorMessage="인증번호를 입력해주세요."
                                        maxLength={6}
                                        value={formData.authNum || ''}
                                        onChange={handleInputChange}
                                        showError={errors.authNum}
                                        disabled={(timer === 0 && errors.timer)} // 타이머 만료 시 비활성화
                                    />
                                    <p className='timer-text'>
                                        남은 인증시간은 <span>{formatTime(timer)}</span> 입니다.
                                    </p>
                                    {errors.timer && (
                                        <p className='error-text text-red-500'>
                                            인증시간이 만료되었습니다. 재요청 해주세요.
                                        </p>
                                    )}
                                </>
                            )}
                            
                            <div className='button__wrap flex justify-between'>
                                <Button 
                                    type="button" 
                                    variant="cancel" 
                                    size="medium" 
                                    onClick={onClickMoveLogin}
                                >
                                    취소
                                </Button>
                                <Button 
                                    type="submit" 
                                    variant="success" 
                                    size="medium"
                                    disabled={!authState.isAuthRequested || (timer === 0 && errors.timer)} // 인증 요청 전이나 타이머 만료 시 비활성화
                                >
                                    잠금해제
                                </Button>
                            </div>
                        </form>
                    </div>
                </Box>

                <footer>
                    <p>
                        테스트를 위한 계정정보 입니다. 인증번호는 전송되지 않습니다.<br />
                        아이디: test@test.com / 인증번호: 123456
                    </p>
                </footer>
            </div>
        </article>
    );
}

export default Unlock;