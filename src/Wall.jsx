import React from 'react';
import { connect } from 'react-redux';
import Masonry from 'masonry-layout';


const masonIt = () => {
	$('.card-img-top')
		.on('error', function fixError() {
			$(this).attr('src', '/404.png');
		});
	// The blocks can easy overlap if the layout is not reset after every operation
	// in Chrome especially, layout fires before the images are finished rendering in React
	const mason = new Masonry(document.querySelector('.content'), {
		columnWidth: '.cardbox',
		itemSelector: '.cardbox',
	});
	mason.layout();
};

const setSearch = () => {
	if (/\?author=/gi.test(window.location.href)) {
		return /\?author=(.+)/gi.exec(window.location.href)[1];
	}
	return '';
};

const deleter = (id, dispatch) => {
	const search = setSearch();
	$.post('/delete', { id, search }, (res) => {
		if (res) {
			dispatch({ type: 'REFRESH_PINS', payload: res });
			masonIt();
		}
	});
};

const liker = (id, dispatch) => {
	const search = setSearch();
	$.post('/like', { id, search }, (res) => {
		if (res) {
			dispatch({ type: 'REFRESH_PINS', payload: res });
			masonIt();
		}
	});
};

const Card = ({ _id, image, desc, author, likes, likers, dp, user, dispatch }) =>
<div className='cardbox'>
	<div className="card">
		<img className="card-img-top" src={image}/>
		<div className="card-block">
			<p className="card-text">{desc}</p>
			<img className='dp pull-xs-left' onLoad={masonIt} src={dp}/>
			<a href={`/?author=${author}`} className='pull-xs-left'>{author}</a>
			{author === user ?
				<button onClick={deleter.bind(null, _id, dispatch)}
					className='btn btn-sm btn-danger pull-xs-right'>DEL</button> : null
			}
			{likers.includes(author) ?
				<button onClick={liker.bind(null, _id, dispatch)}
					className='liked btn btn-sm pull-xs-right'>{likes} &#9829;</button> :
				<button onClick={liker.bind(null, _id, dispatch)}
					className='btn btn-sm pull-xs-right'>{likes} &#9829;</button> }
		</div>
	</div>
</div>;

const Wall = ({ pins, user, dispatch }) =>
<div id='content' className='container content box-shadow light-gray flexbox'>
	{pins.map(pin =>
	<Card {...pin} user={user} dispatch={dispatch}/>
	)}
</div>;

const mapStateToProps = state => ({ pins: state.pins, user: state.user.handle });

export default connect(mapStateToProps)(Wall);
