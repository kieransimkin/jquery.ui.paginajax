/*  jQuery.ui.paginajax.js
 *  Ver: 1.0
 *  by Kieran Simkin - http://SlinQ.com/
 *
 *  Copyright (c) 2011-2012, Kieran Simkin
 *  All rights reserved.
 *
 *  Redistribution and use, with or without modification, are permitted provided that the following condition is met:
 * 
 *  -  Redistributions of this code must retain the above copyright notice, this condition and the following disclaimer.
 * 
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

(function( $ ) {
$.widget( "slinq.paginajax", {
	// These options will be used as defaults
	options: {
		ajax_fragments: { 
			initial_page_already_loaded: true,
			url: '',
			options: {},
			response_format: 'json', // Can be 'json' or 'html'
			page_count: null 
		},
		html_fragments: [], // Alternative to Ajax requests - the fragments can be specified at initialization time
		initial_page: 1,
		animation_type: 'slide', // Can be 'slide' or 'fade'
		control_position: 'top', // Can be either 'top', 'bottom', or an element to which the controls will be added
		disabled: false
	},
	// Set up the widget
	_create: function() {
		if (this._is_ignoring_serverside_page_count() && this.options.initial_page > this.options.ajax_fragments.page_count) { 
			alert('Paginajax: initial_page > page_count');
			return;
		}
		if (this.is_ajax() && this.options.ajax_fragments.initial_page_already_loaded && this.options.ajax_fragments.page_count === null) { 
			alert('Paginajax: if the initial page is already loaded, you must specify page_count');
			return;
		}
		this._do_html_setup();
	},
	_do_html_setup: function() { 

	},
	is_html: function() { 
		if (this.options.html_fragments.length) { 
			return true;
		} else { 
			return false;
		}
	},
	is_ajax: function() { 
		return !this.is_html();
	},
	_is_ignoring_serverside_page_count: function() { 
		if (this.is_ajax() && this.options.ajax_fragments.page_count!==null) { 
			return true;
		} else { 
			return false;
		}
	},
	// Use the _setOption method to respond to changes to options
	_setOption: function( key, value ) {
		switch( key ) {

			case "disabled":
			// handle changes to disabled option

			break;

		}

		$.Widget.prototype._setOption.apply( this, arguments );
	},
	destroy: function() {
		$.Widget.prototype.destroy.call( this );

	}
	
});
}(jQuery));
