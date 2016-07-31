import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import Masonry from 'masonry-layout';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import App from './App.jsx';
import pins from './pinsReducer.js';

const initialState = {
	pins: [],
	user: {},
};
const middleware = applyMiddleware(logger(), thunk);
const master = combineReducers({
	pins,
	user: (state = {}) => state,
});

const p1 = new Promise((resolve) => {
	window.onload = resolve;
});
// get data while we wait for the body to load
const p2 = new Promise((resolve) => {
	$.get('/user', (res) => {
		initialState.user = res;
		resolve();
	});
});
const p3 = new Promise((resolve) => {
	if (/\?author=/gi.test(window.location.href)) {
		const search = /\?author=(.+)/gi.exec(window.location.href)[1];
		$.get('/pins', { search }, (res) => {
			initialState.pins = res;
			resolve();
		});
	} else {
		$.get('/pins', (res) => {
			initialState.pins = res;
			resolve();
		});
	}
});
Promise.all([p1, p2, p3]).then(() => {
	ReactDOM.render(
			<Provider store={createStore(master, initialState, middleware)}>
				<App />
			</Provider>, document.getElementById('root'));
}).then(() => {
	// Bind after the components have rendered
	$('#popover').click(() => {
		$('#create-pin').slideToggle();
	});

	$('.card-img-top')
		.on('error', function fixError() {
			$(this).attr('src', '/404.png');
		});
	const mason = new Masonry(document.querySelector('.content'), {
		columnWidth: '.cardbox',
		itemSelector: '.cardbox',
	});
	mason.layout();
});
