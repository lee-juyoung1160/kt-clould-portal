import React from 'react'
import { useLocation } from 'react-router-dom';
import Header from './Header'
import HeaderOnlyLogo from './HeaderOnlyLogo'

function HeaderController() {
    const location = useLocation();
  
    if (location.pathname.startsWith('/login')) {
        return <HeaderOnlyLogo />;  // 로그인 페이지에서는 특별 헤더만 렌더링
      } else {
        return <Header />;  // 다른 페이지에서는 기본 헤더만 렌더링
      }
}

export default HeaderController
