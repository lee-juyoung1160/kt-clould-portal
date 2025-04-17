import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../assets/styles/components/toast.module.scss';
import iconToast from '../../assets/images/ic_check_fill.svg'

// 메시지 타입 정의
const TOAST_MESSAGES = {
    toastUnlockSuccess: {
      text: '잠금 해제가 완료되었습니다.',
      icon: iconToast,
      redirect: '/login'
    }
  };
  
  // Context 생성
const ToastContext = createContext(null);

// Toast 컴포넌트
const ToastItem = ({ message, icon, type, index, onClose }) => {
  const toastRef = useRef(null);
  
  useEffect(() => {
    const toast = toastRef.current;
    
    // DOM에 추가된 후 애니메이션을 위한 show 클래스 추가
    setTimeout(() => {
      if (toast) toast.classList.add(styles.toastShow);
    }, 10);
    
    // 자동 닫기
    const timer = setTimeout(() => {
      if (toast) toast.classList.remove(styles.toastShow);
      
      // 애니메이션 완료 후 컴포넌트 제거
      setTimeout(() => {
        onClose();
      }, 500);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  const toastClasses = [
    styles.toast,
    type ? styles[type] : '',
    index > 0 ? styles.stackedToast : ''
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={toastRef} className={toastClasses}>
      {icon && (
        <img 
          src={icon} 
          alt="Toast Icon" 
          className={styles.toastIcon}
          onError={(e) => {
            console.error('이미지 로딩 실패:', e.target.src);
            e.target.style.display = 'none';
          }}
        />
      )}
      <span className={styles.toastMessage}>{message}</span>
    </div>
  );
};

// Toast Provider
export function ToastProvider({ children }) {
  const navigate = useNavigate();
  const [toasts, setToasts] = useState([]);
  
  // 토스트 추가 함수
  const showToast = (messageKey, customMessage = null) => {
    const messageObj = TOAST_MESSAGES[messageKey] || TOAST_MESSAGES.error;
    const id = Date.now();
    
    setToasts(prev => [...prev, {
      id,
      message: customMessage || messageObj.text,
      icon: messageObj.icon,
      type: messageKey,
      redirect: messageObj.redirect
    }]);
    
    return id; // ID 반환하여 필요시 특정 토스트 제어 가능
  };
  
  // 토스트 제거 함수
  const removeToast = (id) => {
    const toast = toasts.find(t => t.id === id);
    
    setToasts(prev => prev.filter(t => t.id !== id));
    
    // 리다이렉트 처리
    if (toast && toast.redirect) {
      setTimeout(() => {
        navigate(toast.redirect);
      }, 100);
    }
  };
  
  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      
      {/* 토스트 컨테이너 */}
      {toasts.length > 0 && (
        <div className={styles.toastContainer}>
          {toasts.map((toast, index) => (
            <ToastItem
              key={toast.id}
              message={toast.message}
              icon={toast.icon}
              type={toast.type}
              index={index}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

// 커스텀 훅
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast는 ToastProvider 내부에서 사용해야 합니다.');
  }
  return context;
}

// 이전 버전과의 호환성을 위한 컴포넌트
export function Toast({ children }) {
  return <ToastProvider>{children}</ToastProvider>;
}

export default Toast;