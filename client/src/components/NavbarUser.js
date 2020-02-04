import React  from 'react';

const NavbarUser = (props) => {
    return (
    	<nav className="nav-bar">
          <ul className="nav-bg">
            <li><a href="./user" >Home</a></li>
            <li><a href="./story" >Story</a></li>
            <li onClick={props.logout} style={{marginLeft: 'auto', cursor: 'pointer'}}>Logout</li>
          </ul>
        </nav>
    );
};

export default NavbarUser;
