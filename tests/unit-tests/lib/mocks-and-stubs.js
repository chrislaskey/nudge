var chrome = {};
chrome.storage = {};

var returnChromeStorageLocalStub = function(){
	'use strict';

	var storage = {};

	return {
		get: function(key, callback){
			var items;
			if( key == null ){
				items = storage;
			}else{
				items = storage[key];
			}
			if( ! items ){
				items = {};
			}
			if( typeof callback === 'function' ){
				callback(items);
			}
		},
		set: function(object, callback){
			var key,
				value,
				attribute;
			for(attribute in object){
				key = attribute;
				value = object[attribute];
				break;
			}
			storage[key] = value;
			if( typeof callback === 'function' ){
				callback();
			}
		},
		remove: function(key_array, callback){
			var length = key_array.length,
				key,
				i;
			for(i = 0; i < length; i++){
				key = key_array[i];
				delete storage[key];
			}
			if( typeof callback === 'function' ){
				callback();
			}
		},
		clear: function(callback){
			storage = {};
			if( typeof callback === 'function' ){
				callback();
			}
		}
	}
};

var _returnRandomTimestampsOnDate = function(date, numberOfTimestamps){
	'use strict';

	var timestamps = [],
		timestamp,
		seconds,
		i;

	for(i = 0; i < numberOfTimestamps; i++){
		timestamp = moment(date);
		seconds = Math.floor(Math.random()*1800);
		timestamp.add('seconds', seconds);
		timestamps.push(timestamp.unix());
	}
	return timestamps;
}

var _returnTimestampsMinutesAgoFromNow = function(minutesList){
	'use strict';

	var minutesLength = minutesList.length,
		timestamps = [],
		timestamp,
		minutes,
		i;

	for(i = 0; i < minutesLength; i++){
		timestamp = moment();
		minutes = minutesList[i];
		timestamp.subtract('minutes', minutes);
		timestamps.push(timestamp.unix());
	}
	return timestamps;
}

var returnCompleteHistoryObject = function(){
	'use strict';

	var complete_history_value = {},
		date = new DateTime().returnDate();

	complete_history_value['2012.12.01'] = {};
	complete_history_value['2012.12.02'] = {
		'default': _returnRandomTimestampsOnDate('2012.12.02', 2),
		'example.com': _returnRandomTimestampsOnDate('2012.12.02', 1)
	};
	complete_history_value[date] = {
		'default': _returnTimestampsMinutesAgoFromNow(['57', '30']),
		'example.com': _returnTimestampsMinutesAgoFromNow([]),
		'.*test.co.uk': _returnTimestampsMinutesAgoFromNow(['5'])
	}
	return complete_history_value;
};

var returnCompleteRulesObject = function(){
	'use strict';

	return [
		{
			pattern: 'default',
			visit_limit: 1,
			grace_period: 15,
			cooldown_period: 60
		},
		{
			pattern: 'basic-string.com',
			visit_limit: 2,
			grace_period: 15,
			cooldown_period: 60
		},
		{
			pattern: '^exact-match-only.com$',
			visit_limit: 3,
			grace_period: 15,
			cooldown_period: 60
		},
		{
			pattern: 'example.com',
			visit_limit: 2,
			grace_period: 15,
			cooldown_period: 60
		},
		{
			pattern: '.+.example.com',
			visit_limit: 3,
			grace_period: 15,
			cooldown_period: 60
		},
		{
			pattern: '.*test.co.uk',
			visit_limit: 3,
			grace_period: 15,
			cooldown_period: 60
		}
	];
};
