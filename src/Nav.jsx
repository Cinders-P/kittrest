import React from 'react';
import NavLeft from './NavLeft.jsx';
import NavRight from './NavRight.jsx';

const Nav = () =>
<nav className="navbar navbar-fixed-top navbar-dark bg-inverse">
	<div className="container">
		<NavLeft />
		<NavRight />
	</div>
</nav>;

export default Nav;
