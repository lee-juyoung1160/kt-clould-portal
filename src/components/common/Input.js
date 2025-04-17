// src/components/common/Input.js
import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';
import '../../assets/styles/components/input.scss';
import btnClearInput from '../../assets/images/ic_close_fill_20.svg';
import pwHidden from '../../assets/images/ic_visibility_off_20.svg';
import pwShow from '../../assets/images/ic_visibility_on_20.svg';
import iconError from '../../assets/images/icn_error.svg'

const Input = ({ 
  id, 
  type = 'text', 
  label, 
  placeholder, 
  value, 
  onChange, 
  errorMessage, 
  showError = false,
  tabIndex,
  maxLength,
  actionButtonText = null,
  onActionClick,
  actionDisabled = false,
  actionButtonProps = {}
}) => {
  const [inputType, setInputType] = useState(type);
  const [showClearButton, setShowClearButton] = useState(!!value);
  const inputRef = useRef(null);

  // value가 변경될 때 clearButton 표시 여부 업데이트
  useEffect(() => {
    setShowClearButton(!!value);
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    
    // 전화번호 입력 시 숫자만 허용
    if (type === 'tel') {
      // 숫자가 아닌 문자가 있는지 확인
      if (/[^0-9]/.test(newValue)) {
        // 숫자만 필터링된 값
        const filteredValue = newValue.replace(/[^0-9]/g, '');
        
        // 필터링된 값으로 input 요소 값 직접 업데이트
        if (inputRef.current) {
          inputRef.current.value = filteredValue;
        }
        
        // onChange 이벤트 호출 시 필터링된 값 전달
        if (typeof onChange === 'function') {
          const syntheticEvent = { 
            target: { 
              id, 
              value: filteredValue 
            } 
          };
          onChange(syntheticEvent);
        }
        
        setShowClearButton(!!filteredValue);
        return; // 여기서 함수 종료
      }
    }
    
    // 일반 입력의 경우 또는 tel이지만 이미 숫자만 있는 경우
    if (typeof onChange === 'function') {
      onChange(e);
    }
    
    setShowClearButton(!!newValue);
  };

  const handleClearClick = () => {
    // input 요소의 value를 직접 빈 문자열로 설정
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    
    // 상위 컴포넌트 onChange 호출 (있는 경우에만)
    if (typeof onChange === 'function') {
      const event = { 
        target: { 
          id, 
          value: '' 
        } 
      };
      onChange(event);
    }
    
    setShowClearButton(false);
    inputRef.current.focus();
  };
  
  const togglePasswordVisibility = () => {
    setInputType(prevType => prevType === 'password' ? 'text' : 'password');
  };

  const isPassword = type === 'password';
  const hasActionButton = actionButtonText !== null;

  // 키 다운 이벤트 핸들러 추가
  const handleKeyDown = (e) => {
    // tel 타입일 때 숫자, 백스페이스, 화살표 키 등 허용되는 키 외에는 입력 방지
    if (type === 'tel') {
      // 허용되는 키 목록
      const allowedKeys = [
        'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',
        'Home', 'End', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
      ];
      
      // 허용된 키가 아니고, 컨트롤 키나 메타 키가 눌리지 않은 경우에만 이벤트 방지
      if (!allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
      }
    }
  };

  return (
    <div className="input-item">
      {label && <span className="input-title">{label}</span>}
      <div className={`input ${hasActionButton ? 'input-with-action' : ''}`}>
        <input
          ref={inputRef}
          type={type === 'tel' ? 'tel' : inputType}
          id={id}
          className={`custom-input ${hasActionButton ? 'input-action' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown} // 키 다운 이벤트 추가
          tabIndex={tabIndex}
          maxLength={maxLength}
          inputMode={type === 'tel' ? 'numeric' : undefined}
        />
        
        {!isPassword && !hasActionButton && showClearButton && (
          <button 
            type="button" 
            className="clear-btn" 
            onClick={handleClearClick}
          >
            <img src={btnClearInput} alt="지우기" />
          </button>
        )}
        
        {isPassword && !hasActionButton && (
          <button 
            type="button" 
            className="toggle-password" 
            onClick={togglePasswordVisibility}
          >
            <img 
              className={inputType === 'password' ? 'eyes-off' : 'eyes-on-hidden'} 
              src={pwHidden} 
              alt="비밀번호 숨기기" 
            />
            <img 
              className={inputType === 'text' ? 'eyes-on' : 'eyes-off-hidden'} 
              src={pwShow} 
              alt="비밀번호 보기" 
            />
          </button>
        )}
        
        {hasActionButton && (
          <Button 
            type="button"
            onClick={onActionClick}
            disabled={actionDisabled}
            className="input-action-button"
            variant="primary"
            {...actionButtonProps}
          >
            {actionButtonText}
          </Button>
        )}
      </div>
      
      {showError && errorMessage && (
        <span className="input-error-message">
          <i><img src={iconError} alt="에러" /></i>
          <span>{errorMessage}</span>
        </span>
      )}
    </div>
  );
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'tel']),
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  showError: PropTypes.bool,
  tabIndex: PropTypes.number,
  maxLength: PropTypes.number,
  actionButtonText: PropTypes.string,
  onActionClick: PropTypes.func,
  actionDisabled: PropTypes.bool,
  actionButtonProps: PropTypes.object
};

export default Input;