import React, { useState } from 'react';
import Navbar from '../layouts/navbar/Navbar';

const NavbarPages = () => {

  const [active, setActive] = useState('Home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const token = localStorage.getItem("accessToken");
  const navbarItems =  token ? ['Home', 'About', 'Professional Feed' ]  : ['Home', 'About', 'Professional Feed' , 'Login'] 
  
  const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
    };
  return (
    <div >
      
    <Navbar
    active={active}
    setActive={setActive}
    isMenuOpen={isMenuOpen}
    setIsMenuOpen={setIsMenuOpen}
    navbarItems={navbarItems}
    toggleMenu={toggleMenu}

    /> 
    </div>
  );
}

export default NavbarPages;



