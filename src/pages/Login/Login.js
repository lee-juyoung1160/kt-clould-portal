import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가
import React, { useState } from 'react';
import '../../assets/styles/pages/login.scss';
import Box from '../../components/common/Box';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Checkbox from '../../components/common/Checkbox';
import IconMove from '../../assets/images/ico_line_16.svg';
import IconDown from '../../assets/images/ic_down_16.svg';

const Login = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 hook
  
  // 임의의 아이디/패스워드 설정
  const DEMO_USER = {
    email: 'test@test.com',
    password: '1234'
  };
  
  // 폼 데이터 상태 관리
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  // 오류 상태 관리
  const [errors, setErrors] = useState({
    email: false,
    emailFormat: false,
    password: false
  });

  // 이메일 유효성 검사 함수
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
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
        
        return newErrors;
      });
    }
  };

  // 로그인 버튼 클릭 핸들러
  const handleLogin = (e) => {
    e.preventDefault();
    
    // 빈 값 및 이메일 형식 검사
    const newErrors = {
      email: !formData.email || formData.email.trim() === '',
      emailFormat: formData.email.trim() !== '' && !validateEmail(formData.email),
      password: !formData.password || formData.password.trim() === ''
    };
    
    setErrors(newErrors);
    
    // 오류가 없는 경우 로그인 처리
    if (!newErrors.email && !newErrors.emailFormat && !newErrors.password) {
      // 아이디/패스워드 일치 확인
      if (formData.email === DEMO_USER.email && formData.password === DEMO_USER.password) {
        // 로그인 성공 시 홈으로 이동
        navigate('/home');
      } else {
        // 로그인 실패 시 알림
        alert('아이디 또는 비밀번호가 일치하지 않습니다.');
      }
    }
  };

  return (
    <article className='login-page'>
      <div className="login-container">
        <Box radius="20" padding="32">
          <h2 className='text-center'>로그인</h2>
          <form noValidate onSubmit={handleLogin}>
            <div className='input-wrap'>
              <Input
                id="email"
                type="email"
                label="이메일"
                placeholder="이메일을 입력해주세요."
                value={formData.email || ''}
                onChange={handleInputChange}
                errorMessage={errors.emailFormat ? "유효한 이메일 형식이 아닙니다." : "이메일을 입력해주세요."}
                showError={errors.email || errors.emailFormat}
              />
              <Input
                id="password"
                type="password"
                label="비밀번호"
                placeholder="비밀번호을 입력해주세요."
                value={formData.password || ''}
                onChange={handleInputChange}
                errorMessage="비밀번호을 입력해주세요."
                showError={errors.password}
              />
            
              <div className='flex justify-between items-center'>
                <Checkbox
                  id="saveLoginId"
                  name="saveLoginId"
                  label="아이디 저장"
                  tabIndex={3}
                />
                <Link to="/login/unlock" className='btn-move flex items-center font-size__14'>
                  잠금 해제 <img src={IconMove} alt="이동" />
                </Link>
              </div>
              <Button 
                type="submit" 
                variant="success" 
                size="large" 
                className='btn-login'
              >
                로그인
              </Button>
            </div>
          </form>
          <div className='flex justify-center items-center font-size__14'>
            <span className='text-color__grey'>처음 사용하시나요?</span>
            <button type="button" className='btn-fill__down flex items-center'>초기설치파일 다운 <img src={IconDown} alt='' /></button>
          </div>
          <Box bgColor='gray' padding='12' radius='12' className='info-grid__wrap'>
            <div className="info-grid">
              <div className="info-grid__label">• KTalk</div>
              <div className="info-grid__value">검색: "Cloud PC"</div>
              <div className="info-grid__label">• ISC Center</div>
              <div className="info-grid__value">1588-3391(ARS#8)</div>
              <div className="info-grid__label">• 상담 시간</div>
              <div className="info-grid__value">평일 09:00 ~ 18:00</div>
            </div>
          </Box>
        </Box>
        <footer>
          <p>테스트를 위한 계정정보 입니다.<br />아이디: test@test.com / 비밀번호: 1234</p>
        </footer>
      </div>
    </article>
  );
};

export default Login;