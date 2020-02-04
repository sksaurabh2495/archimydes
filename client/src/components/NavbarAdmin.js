import React  from 'react';

const NavbarAdmin = (props) => {
    return (
    	<nav className="nav-bar">
          <ul className="nav-bg">
            <li><a href="./admin" >Story</a></li>
            <li onClick={props.logout} style={{marginLeft: 'auto', cursor: 'pointer'}}>Logout</li>
          </ul>
        </nav>
    );
};

export default NavbarAdmin;
