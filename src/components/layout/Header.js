import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom'
import Logo from '../../assets/images/logo.svg'
import btnMenuToggleMo from "../../assets/images/ic_menu.svg" 
import btnProfile from '../../assets/images/ic_profile_52.svg'
import btnMenuOpenMo from '../../assets/images/chevron_Icon.svg'
import iconLogout from '../../assets/images/ic_logout_20.svg'
const Header = () => {
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const navRef = useRef(null);
  const overlayRef = useRef(null);

  // Handle mobile menu toggle
  const handleMenuToggle = () => {
    setMobileMenuActive(true);
    document.body.style.overflow = 'hidden';
  };

  // Handle mobile menu close
  const handleMenuClose = () => {
    setMobileMenuActive(false);
    document.body.style.overflow = '';
  };

  // Handle main menu item click
  const handleMainMenuClick = (e, index) => {
    if (window.innerWidth <= 1079) {
      e.preventDefault();
      setActiveSubMenu(activeSubMenu === index ? null : index);
    }
  };

  // 서브메뉴 리플 효과 처리
  const handleSubMenuClick = (e) => {
    // 클릭한 요소에 대한 참조
    const target = e.currentTarget;
    
    // 이미 리플 효과가 있다면 제거
    target.classList.remove('ripple-effect');
    
    // 리플로우를 강제하기 위한 트릭
    void target.offsetWidth;
    
    // 리플 효과 클래스 추가
    target.classList.add('ripple-effect');
    
    // 애니메이션이 끝나면 클래스 제거 (재사용 가능하도록)
    setTimeout(() => {
      target.classList.remove('ripple-effect');
    }, 1000); // 애니메이션 지속 시간보다 약간 길게 설정
  };

  // Reset mobile menu state on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1079) {
        setMobileMenuActive(false);
        document.body.style.overflow = '';
        setActiveSubMenu(null);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Menu structure data
  const menuItems = [
    { text: '홈', link: '/home', pcOnly: true, subItems: [] },
    {
      text: '공지 및 자료실',
      link: '/notice',
      subItems: [
        { text: '공지사항', link: '/notice' },
        { text: '가이드 게시판', link: '/guide' },
        { text: '자료실', link: '/data' }
      ]
    },
    {
      text: '사용 문의',
      link: '/faq',
      subItems: [
        { text: '자주 묻는 질문', link: '/faq' },
        { text: 'Q&A', link: '/qna' }
      ]
    },
    {
      text: 'Cloud PC 관리',
      link: '/cloudpc',
      pcOnly: true,
      subItems: [
        { text: 'Cloud PC 작업 신청', link: '/cloudpc' }
      ]
    },
    {
      text: '망연계 관리',
      link: '#',
      subItems: [
        { text: '반출 신청 파일 다운로드', link: '#' },
        { text: 'URL Redirection', link: '#' }
      ]
    }
  ];

  return (
    <>
      <header>
        <div className="container">
          <h1 className="logo">
            <Link to='/home'>
              <img src={Logo} alt="로고" />
            </Link>
          </h1>
          
          {/* 모바일 햄버거 버튼 */}
          <button className="menu-toggle" onClick={handleMenuToggle}>
            <img src={btnMenuToggleMo} alt="햄버거 메뉴" />
          </button>

          <nav ref={navRef} className={mobileMenuActive ? 'active' : ''}>
            <div className="mobile-menu-header">
              {/* 닫기 */}
              <button className="close-btn" onClick={handleMenuClose}>
                <img src="../assets/images/close.svg" alt="" />
              </button>
            </div>

            <ul className="main-menu">
              {menuItems.map((item, index) => (
                <li key={index} className={item.pcOnly ? 'display-pc' : ''}>
                    <Link to={item.link} onClick={(e) => item.subItems.length > 0 ? handleMainMenuClick(e, index) : null}>
                    <span>{item.text}</span>
                    {item.subItems.length > 0 && (
                      <img 
                        className={`toggle-open-icon ${activeSubMenu === index ? 'active' : ''}`}
                        src={btnMenuOpenMo} 
                        alt="열기" 
                      />
                    )}
                  </Link>
                  
                  {item.subItems.length > 0 && (
                    <ul className={`sub-menu ${activeSubMenu === index ? 'active' : ''}`}>
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex}>
                            <Link to={subItem.link} onClick={handleSubMenuClick}>{subItem.text}</Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>

            {/* 모바일 로그아웃 버튼 */}
            <button type="button" className="mo-btn-logout button">
              로그아웃
            </button>
          </nav>
          
          <div className="header-profile">
            <button type="button" className="btn-profile">
              <img src={btnProfile} alt="프로필" />
            </button>
            <div className="hover-content">
              {/* PC 로그아웃 버튼 */}
              <button type="button" className="btn-logout">
                <span>로그아웃</span>
                <img src={iconLogout} alt="로그아웃" />
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* 모바일 헤더 오버레이 */}
      <div 
        ref={overlayRef} 
        className={`overlay ${mobileMenuActive ? 'active' : ''}`} 
        onClick={handleMenuClose}
      ></div>
    </>
  );
};

export default Header;