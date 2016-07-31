import React from 'react';
import { connect } from 'react-redux';
import Form from './Form.jsx';

const NavRight = ({ user, dispatch }) =>
<ul className="nav navbar-nav pull-xs-left pull-md-right right-links">
	<li className="nav-item">
		<a className="nav-link" id="popover">+ Create Pin</a>
	</li>
	{user.name
		? <li className="nav-item">
				<a className="nav-link" href={`/?author=${user.handle}`}>My Pins</a>
			</li>
		: null}
	{user.name
		? <li className="nav-item">
				<a className="nav-link" href="/logout">Logout</a>
			</li>
		: <li className="nav-item">
			<a className="nav-link" href="/auth/twitter">Login with Twitter</a>
		</li>}
	<Form dispatch={ dispatch }/>
</ul>;

const mapStateToProps = state => ({ user: state.user });

export default connect(mapStateToProps)(NavRight);
