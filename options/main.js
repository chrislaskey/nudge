/* -------------------------------------------------------------------------- */

var pageLoader = function(){
	'use strict';

	var target_iframe;

	return{
		setTarget: function(selector){
			target_iframe = $(selector);
		},
		bindClick: function(selector){
			$(selector).on('click', function(){
				var source = $(this).attr('data-source');
				target_iframe.attr('src', source);
			});
		}
	};
};

/* -------------------------------------------------------------------------- */

var init = function(){
	'use strict';

	return {
		pageLoader: function(){
			var page_loader = new pageLoader();
			page_loader.setTarget('iframe.content-target');
			page_loader.bindClick('#navigation ul li button');
		}
	};
}();

/* -------------------------------------------------------------------------- */

$(function(){
	init.pageLoader();
});

/* -------------------------------------------------------------------------- */
