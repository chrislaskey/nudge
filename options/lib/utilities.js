/**
 * Contains libraries useful in Chrome Extensions that are not unique to the 
 * application. These serve as utility functions and building blocks for
 * application specific libraries.
 * -------------------------------------------------------------------------- */

var ObjectUtilities = function(){
	'use strict';

	var isObject = function(test_value){
		var object_string = Object.prototype.toString.call(test_value); 
		return object_string === "[object Object]";
	};

	var convertFromNumberToString = function(property){
		// It is valid to access an object with a numeric key (myObj[0]) in
		// addition to a string key (myObj['0']). However when iterating over
		// an object using for.. in, each property is returned as a string.
		// To ensure hasProperty() returns as expected, a numeric key request
		// is converted to string.
		if( typeof property === 'number' ){
			return property.toString();
		}
		return property;
	};

	return {
		isObject: function(test_value){
			return isObject(test_value);
		},
		hasProperty: function(obj, property){
			var obj_property;
				property = convertFromNumberToString(property);
			if( isObject(obj) ){
				for( obj_property in obj ){
					if( obj_property === property ){
						return true;
					}
				}
			}
			return false;
		}
	};
};

var Utilities = function(obj, query_property){
	'use strict';
	return {
		object: new ObjectUtilities(),
	};
};

/* -------------------------------------------------------------------------- */

var DateTime = function(){
	// DateTime is a simple wrapper for the third-party moment.js library.
	// Moment.js is very powerful, this is a simple subset used to abstract
	// out standard display format for dates.

	'use strict';

	var date_format;

	var initializeFormatVaribles = function(){
		date_format = 'YYYY.MM.DD';
	};

	var init = function(){
		initializeFormatVaribles();
	}();

	return {
		returnDate: function(date){
			return moment(date).format(date_format);
		},
		returnUnixTimestamp: function(timestamp){
			return moment(timestamp).unix();
		},
		returnUnixTimestampDifferenceInMinutes: function(timestamp_one, timestamp_two){
			var unix_time_difference = Math.abs(timestamp_one - timestamp_two),
				duration = moment.duration({seconds: unix_time_difference}),
				duration_as_minutes = duration.asMinutes();
			return Math.ceil(duration_as_minutes);
		}
	};
};

/* -------------------------------------------------------------------------- */

var ChromeStorage = function(){
	'use strict';

	var storage = chrome.storage.local;

	return {
		asyncReturnKey: function(key, callback){
			// Note: get(key, ...) is broken in Chrome 23.0.X.
			// The work around is to get all values via get(null, ...)
			// then return items[key] from the results instead.
			storage.get(null, function(items){
				if( typeof callback === "function" ){
					callback(items[key]);
				}
			});
		},
		asyncReturnAll: function(callback){
			storage.get(null, function(items){
				if( typeof callback === "function" ){
					callback(items);
				}
			});
		},
		asyncSet: function(key, value, callback){
			// Reminder: do not initialize object with {key: value}. Object
			// literal key names do not require quotes, so key will never
			// be evaluated and instead become "key".
			// Instead initialize with {}, then set myObj[key] = value;
			var objectToStore = {};
			objectToStore[key] = value;
			storage.set(objectToStore, function(){
				if( typeof callback === "function" ){
					callback(items);
				}
			});
		},
		asyncRemoveKey: function(key, callback){
			var keyArray = [key];
			storage.remove(keyArray, function(){
				if( typeof callback === "function" ){
					callback();
				}
			});
		},
		asyncRemoveAll: function(callback){
			storage.clear(function(){
				if( typeof callback === "function" ){
					callback();
				}
			});
		},
		consoleLogAll: function(){
			var callback = function(items){
				console.log(items);
			};
			this.asyncReturnAll(callback);
		}
	};
};

/* -------------------------------------------------------------------------- */
