import React, { Component } from 'react';
import Masonry from 'masonry-layout';

class Form extends Component {
	checkLink(e) {
		const dispatch = this.props.dispatch;
		const link = document.forms.form.image.value;
		if (/https?:\/\/.+\.(?:png|gif|jpg|svg|jpeg|bmp|tiff){1}$/gi.test(link)) {
			$('#popover').click();
			$.post('/post', $('form').serialize(), (res) => {
				dispatch({ type: 'REFRESH_PINS', payload: res });
				$('input[name="image"]').val('');
				$('input[name="desc"]').val('');
				const mason = new Masonry(document.querySelector('.content'), {
					columnWidth: '.cardbox',
					itemSelector: '.cardbox',
				});
				mason.layout();
				$('.card-img-top')
					.on('error', function fixError() {
						$(this).attr('src', '/404.png');
					});
				$('.content').css('min-height', '100%');
				$('.bg').css('min-height', '100%');
			});
		} else {
			alert('That is not an acceptable image URL.');
		}
		e.preventDefault();
	}
	render = () =>
	<form name='form' onSubmit={this.checkLink.bind(this)} action='/post'
		method='post' id="create-pin" className="white">
		<div className='form-group'>
			<label>Image URL</label>
			<input required name='image' placeholder='http://...' type='text' className='form-control'/>
		</div>
		<div className='form-group'>
			<label>Description</label>
			<input placeholder='optional' name='desc' type='text' className='form-control'/>
		</div>
		<button className='btn btn-outline-secondary pull-xs-right'>Pin</button>
	</form>;
}

export default Form;
