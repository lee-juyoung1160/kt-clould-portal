import React, { useState } from "react";
import logo from '../../assets/images/logo.svg';

const Header = () => {
    
    const [show, setShow] = useState(false);
    const toggleMenu = () => {
        setShow((prevShow) => !prevShow);
    };

    return(
    <header id="header">
        <h1 className="header__logo"><a href="./"><img src={logo} alt="logo" /></a></h1>
        <nav className={`header__nav ${show ? "show" : ""}`} aria-label="메인 메뉴">
            <ul>
                <li><a href="/">홈</a></li>
                <li>
                    <a href="/notice">공지 및 자료실</a>
                    <ol className="sub__menu" aria-label="서브 메뉴">
                        <li><a href="/notice">공지사항</a></li>
                        <li><a href="/guide">가이드 게시판</a></li>
                        <li><a href="/data">자료실</a></li>
                    </ol>
                </li>
                <li>
                    <a href="/faq">사용 문의</a>
                    <ol className="sub__menu" aria-label="서브 메뉴">
                        <li><a href="/faq">자주묻는질문</a></li>
                        <li><a href="/Qna">Q&A</a></li>
                    </ol>
                </li>
                <li>
                    <a href="/notice">Cloud PC 관리</a>
                    <ol className="sub__menu" aria-label="서브 메뉴">
                        <li><a href="/notice">Cloud PC 작업신청</a></li>
                    </ol>
                </li>
                <li>
                    <a href="/notice">망연계관리</a>
                    <ol className="sub__menu" aria-label="서브 메뉴">
                        <li><a href="/notice">반출 신청 파일 다운로드</a></li>
                        <li><a href="/notice">URL Redirection</a></li>
                    </ol>
                </li>
            </ul>
        </nav>
        <button type="button">프로필</button>
        <button type="button" 
        className="header__nav__mo" 
        onClick={toggleMenu}>
            <span></span>
        </button>
    </header>

    );
};
export default Header;