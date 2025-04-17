import React from 'react'
import logo from '../../assets/images/logo.svg';

function HeaderOnlyLogo() {
  return (
    <header id="headerOnlyLogo">
        <h1 className='logo'><a href="/"><img src={logo} alt="로고" /></a></h1>
    </header>
  )
}

export default HeaderOnlyLogo
