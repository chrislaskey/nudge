/* -------------------------------------------------------------------------- */

var WebRequestHandler = function(){
	'use strict';

	var requests_handler = new RequestHandler();

	var redirect_callback = function(tab_id, request){
		if( request.isOverTheLimit() ){
			var update = {
				url: 'http://google.com'
			};
			chrome.tabs.update(tab_id, update);
		}
	};

	return {
		request: function(url, tab_id){
			requests_handler.asyncProcessAndReturnRequest(url, function(request){
				redirect_callback(tab_id, request);
			});
		}
	};
};

/* -------------------------------------------------------------------------- */

var WebRequestBinder = function(){
	'use strict';

	var bindNavigationRequests = function(){
		var callback = returnCallback(),
			requestFilter = returnRequestFilter(),
			opt_extraInfoSpec = [];
		chrome.webRequest.onBeforeRequest.addListener(
			callback,
			requestFilter,
			opt_extraInfoSpec
		);
	}

	var returnCallback = function(){
		return function(details){
			var url = details.url,
				tab_id = details.tabId,
				webRequestHandler = new WebRequestHandler();
			webRequestHandler.request(url, tab_id);
		};
	};

	var returnRequestFilter = function(){
		return {
			types: ['main_frame'],
			urls: ['http://*/*', 'https://*/*']
		};
	};

	return {
		init: function(){
			bindNavigationRequests();
		}
	};
};

/* -------------------------------------------------------------------------- */

var HistoryReseter = function(){
	'use strict';

	var storage = new ChromeStorage();

	return {
		resetKey: function(history_key){
			storage.asyncRemoveKey(history_key);
			storage.consoleLogAll();
		}
	};
};

/* -------------------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', function(){
	// new WebRequestBinder().init();

	// new HistoryReseter().resetKey('site-visit-limiter-history');
	// new ChromeStorage().consoleLogAll();
});

/* -------------------------------------------------------------------------- */
