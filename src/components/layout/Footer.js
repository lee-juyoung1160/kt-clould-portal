import React from "react";
import { useLocation } from 'react-router-dom';

const Footer = () => {
    const location = useLocation();
    // 푸터를 숨길 페이지 경로 목록
    const hideFooterPaths = ['/login'];
    
    // 현재 경로가 푸터를 숨길 경로인지 확인
    const shouldHideFooter = hideFooterPaths.some(path => 
        location.pathname.includes(path)
    );
    
    // 숨겨야 할 경로면 null 반환 (아무것도 렌더링하지 않음)
    if (shouldHideFooter) {
        return null;
    }
    return (
        <footer>
        <h2 className="hidden">하단 영역</h2>
        <div className="footer__text">
            <span>Do You Like This Portfolio ?</span>
            <h3>CONTACT</h3>
        </div>
    </footer>
    
    );
};

export default Footer;