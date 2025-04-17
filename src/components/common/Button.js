import React from 'react';
import PropTypes from 'prop-types';
import styles from '../../assets/styles/components/button.module.scss';

/**
 * 애플리케이션 전체에서 사용되는 기본 버튼 컴포넌트
 */
const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'medium', 
  disabled = false, 
  onClick, 
  className = '', 
  ...rest 
}) => {
  return (
    <button
      type={type}
      className={`${styles.button} ${styles[`button--${variant}`]} ${styles[`button--${size}`]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

// PropTypes 정의 부분은 그대로 유지
Button.propTypes = {
  /** 버튼 내용 */
  children: PropTypes.node.isRequired,
  /** 버튼 타입 (HTML button type 속성) */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  /** 버튼 스타일 변형 */
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'cancel', 'success']),
  /** 버튼 크기 */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** 버튼 비활성화 여부 */
  disabled: PropTypes.bool,
  /** 클릭 이벤트 핸들러 */
  onClick: PropTypes.func,
  /** 추가 CSS 클래스 */
  className: PropTypes.string,
};

export default Button;