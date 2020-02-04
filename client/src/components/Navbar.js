import React  from 'react';
import logo from './../logo.jpg';

const Navbar = () => {
    return (
    	<nav className="nav-bar">
          <ul className="nav-bg">
            <li><img src={logo} alt="logo" /></li>
            <li className="nav-text"><a href="." >Archimydes Assignment</a></li>
          </ul>
        </nav>
    );
};

export default Navbar;
