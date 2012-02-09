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
			page_variable: 'page',
			response_format: 'json', // Can be 'json' or 'html'
			page_count: null 
		},
		html_fragments: [], // Alternative to Ajax requests - the fragments can be specified at initialization time
		width: null,
		height: null,
		initial_page: 1,
		animation_type: 'slide', // Can be 'slide' or 'fade'
		control_position: 'top', // Can be either 'top', 'bottom', or an element to which the controls will be added
		navigation_controls_text: false,
		disabled: false
	},
	get_width: function() { 
		if (this.options.width===null) { 
			return '100%';
		} else { 
			return this.options.width+'px';
		}
	},
	get_height: function() { 
		if (this.options.height===null) { 
			return 'auto';
		} else { 
			return this.options.height+'px';
		}
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
		if (this.options.ajax_fragments.page_count !== null && parseInt(this.options.ajax_fragments.page_count)!=this.options.ajax_fragments.page_count) { 
			alert('Paginajax: page_count must be an integer');
			return;
		}
		if ((this.options.width!==null && this.options.width!=parseInt(this.options.width)) || (this.options.height!==null && this.options.height!=parseInt(this.options.height))) { 
			alert('Paginajax: if width or height are specified, they must be integers');
			return;
		}
		this.page=this.options.initial_page;
		this._do_html_setup();
	},
	_do_html_setup: function() { 
                this.element.html('');
		console.log(this.element.height());
		console.log(this.element.width());
		this.maindiv=$('<div></div>')		.addClass('ui-widget')
							.addClass('ui-widget-paginajax-main-div')
							.css({position: 'relative', overflow: 'hidden', 'z-index': 1,'margin':'auto auto'})
							.appendTo(this.element);

		this.maindiv.css({width: this.get_width(),height: this.get_height()});
		this.actual_width=this.maindiv.width();
		this.actual_height=this.maindiv.height();

		this.frame1=$('<div></div>')		.addClass('ui-widget')
							.addClass('ui-widget-paginajax-frame')
							.addClass('ui-widget-paginajax-frame1')
							.css({position: 'absolute', 'top': '0px', 'left': '0px'})
							.appendTo(this.maindiv);

		this.frame2=$('<div></div>')		.addClass('ui-widget')
							.addClass('ui-widget-paginajax-frame')
							.addClass('ui-widget-paginajax-frame2')
							.css({position: 'absolute', 'top': '0px', 'left': '0px', 'opacity': '0'})
							.appendTo(this.maindiv);


		this.controls=$('<div></div>')		.addClass('ui-widget')
							.addClass('ui-widget-content')
							.addClass('ui-corner-all')
							.addClass('ui-widget-paginajax-controls-div')
							.css({'z-index': 1,'margin':'auto auto'});

		this.frame1.width(this.actual_width);
		this.frame2.width(this.actual_width);
		this.frame1.height(this.actual_height);
		this.frame2.height(this.actual_height);
		this.controls.width(this.actual_width);
		this.controls.height(this.actual_height);

		if (this.options.control_position==='top') { 
			this.controls.prependTo(this.element);
		} else if (this.options.control_position==='bottom') { 
			this.controls.appendTo(this.element);
		} else {
			this.controls.appendTo(this.options.control_position);
		}
		this._do_controls_html_setup();

	},
	_do_controls_html_setup: function() { 
		var me = this;
		this.controls_center=$("<div></div>").css({'position': 'absolute','text-align': 'center'}).appendTo(this.controls);
		this.controls_rightfloat=$("<div></div>").css({'position': 'absolute','text-align': 'right'}).appendTo(this.controls);
		this.controls_leftfloat=$("<div></div>").css({'text-align': 'left'}).appendTo(this.controls);

		this.controls_first_button=$("<div></div>")
							.addClass('ui-widget-paginajax-controls-first-button')
							.html((this.options.navigation_controls_text ? 'Beginning' : null))
							.appendTo(this.controls_leftfloat)
							.button({icons: { primary: 'ui-icon-arrowthickstop-1-w', secondary: null}, text: this.options.navigation_controls_text})
							.css({'margin-left':'5px'})
							.click(function() {
								me.first();
							});

		this.controls_previous_button=$("<div></div>")
							.addClass('ui-widget-paginajax-controls-previous-button')
							.html((this.options.navigation_controls_text ? 'Previous' : null))
							.appendTo(this.controls_leftfloat)
							.button({icons: { primary: 'ui-icon-arrowthick-1-w', secondary: null}, text: this.options.navigation_controls_text})
							.click(function() {
								me.previous();
							});

		this.controls_next_button=$("<div></div>")
							.addClass('ui-widget-paginajax-controls-next-button')
							.html((this.options.navigation_controls_text ? 'Next' : null))
							.appendTo(this.controls_rightfloat)
							.button({icons: { primary: null, secondary: 'ui-icon-arrowthick-1-e'}, text: this.options.navigation_controls_text})
							.click(function() {
								me.next();
							});

		this.controls_last_button=$("<div></div>")
							.addClass("ui-widget-paginajax-controls-last-button")
							.html((this.options.navigation_controls_text ? 'End' : null))
							.appendTo(this.controls_rightfloat)
							.button({icons: { primary: null, secondary: 'ui-icon-arrowthickstop-1-e'}, text: this.options.navigation_controls_text})
							.css({'margin-right':'5px'})
							.click(function() {
								   me.last();
							});

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
	_get_ajax_url: function(page) { 
		if (typeof(page)=='undefined') { 
			page=this.page;
		}
		if (typeof(this.options.ajax_fragments.url)=='function') { 
			return this.options.ajax_fragments.url(page);
		} else { 
			return this.options.ajax_fragments.url;
		}
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
