/**
 * Contains libraries specific to the application. These build off of the
 * common utilities and third-party libraries.
 * -------------------------------------------------------------------------- */

var RequestUriParser = function(){
	// Wrapper for parseUri library
	// parseUri 1.2.2 (c) Steven Levithan <stevenlevithan.com> MIT License
	'use strict';

	var parsedUri,
		parserOptions,
		utilities = new Utilities();

	var initParserOptions = function(){
		parserOptions = {
			strictMode: true,
			key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
			q:   {
				name:   "queryKey",
				parser: /(?:^|&)([^&=]*)=?([^&]*)/g
			},
			parser: {
				strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
				loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
			}
		};
	};

	var parse = function(request_uri) {
		var	o   = parserOptions,
			m   = o.parser[o.strictMode ? "strict" : "loose"].exec(request_uri),
			uri = {},
			i   = 14;

		while (i--) uri[o.key[i]] = m[i] || "";

		uri[o.q.name] = {};
		uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
			if ($1) uri[o.q.name][$1] = $2;
		});

		parsedUri = uri;
	};

	var init = function(){
		initParserOptions();
	}();

	return {
		setOption: function(option_key, option_value){
			parserOptions[option_key] = option_value;
			return this;
		},
		returnOption: function(option_key){
			return parserOptions[option_key];
		},
		setUri: function(request_uri){
			parse(request_uri);
			return this;
		},
		returnParsed: function(){
			return parsedUri;
		},
		returnSection: function(name){
			if( utilities.object.hasProperty(parsedUri, name) ){
				return parsedUri[name];
			}else{
				return false;
			}
		}
	};
};

/* -------------------------------------------------------------------------- */

var RequestHistoryParser = function(){
	'use strict';

	var history,
		utilities = new Utilities();

	var returnPatternVisitCount = function(pattern){
		var matchingHistory = returnMatchingHistory(pattern);
		return matchingHistory.length;
	};

	var returnMatchingHistory = function(pattern){
		var date = new DateTime().returnDate(),
			hasProperty = utilities.object.hasProperty;
		if( ! hasProperty(history, date) ){
			return [];
		}
		if( ! hasProperty(history[date], pattern) ){
			return [];
		}
		return history[date][pattern];
	};

	var returnLastVisitTimestamp = function(pattern){
		var matchingHistory = returnMatchingHistory(pattern),
			matchingLength = matchingHistory.length,
			matchingIndex = matchingLength - 1;
		if( matchingLength === 0 ){
			return 0;
		}else{
			return matchingHistory[matchingIndex];
		}
	};

	return {
		setHistory: function(value){
			history = value;
			return this;
		},
		returnHistory: function(){
			return history;
		},
		returnVisitCount: function(pattern){
			return returnPatternVisitCount(pattern);
		},
		returnLastVisitTimestamp: function(pattern){
			return returnLastVisitTimestamp(pattern);
		}
	};
};

/* -------------------------------------------------------------------------- */

var RequestHistoryLogger = function(){
	'use strict';

	var storage = new ChromeStorage(),
		storage_key = 'site-visit-limiter-history',
		utilities = new Utilities();

	var asyncLoadHistory = function(callback){
		storage.asyncReturnKey(storage_key, function(history){
			callback(history);
		});
	};

	var asyncSaveHistory = function(history, callback){
		storage.asyncSet(storage_key, history, callback);
	};

	var addItemToHistoryAndSave = function(rule_pattern, history, callback){
		var modified_history = addItemToHistory(rule_pattern, history);
		asyncSaveHistory(modified_history, callback);
	};

	var addItemToHistory = function(rule_pattern, history){
		var date = new DateTime().returnDate(),
			timestamp = new DateTime().returnUnixTimestamp();
		if( history === undefined ){
			history = {};
		}
		if( ! utilities.object.hasProperty(history, date) ){
			history[date] = {};
		}
		if( ! utilities.object.hasProperty(history[date], rule_pattern) ){
			history[date][rule_pattern] = [];
		}
		history[date][rule_pattern].push(timestamp);
		return history
	};

	return {
		asyncReturnHistory: function(callback){
			asyncLoadHistory(callback);
		},
		asyncSaveItem: function(pattern, callback){
			asyncLoadHistory(function(history){
				addItemToHistoryAndSave(pattern, history, callback);
			});
		}
	};
};

/* -------------------------------------------------------------------------- */

var RequestRulesParser = function(){
	'use strict';

	var rules = [];

	var isValidRule = function(rule){
		var utilities = new Utilities(),
			hasProperty = utilities.object.hasProperty,
			isNumeric = utilities.isNumeric;

		if( ! hasProperty(rule, 'pattern') ){ return false; }
		if( ! hasProperty(rule, 'visit_limit') ){ return false; }
		if( ! hasProperty(rule, 'grace_period') ){ return false; }
		if( ! hasProperty(rule, 'cooldown_period') ){ return false; }

		if( ! rule.pattern ){ return false; }
		if( ! rule.visit_limit ){ return false; }
		if( ! rule.grace_period ){ return false; }
		if( ! rule.cooldown_period ){ return false; }

		if( typeof rule.pattern !== 'string' ){ return false; }

		if( ! isNumeric(rule.visit_limit) ){ return false; }
		if( ! isNumeric(rule.grace_period) ){ return false; }
		if( ! isNumeric(rule.cooldown_period) ){ return false; }

		if( rule.visit_limit < 0 ){ return false; }
		if( rule.grace_period < 0 ){ return false; }
		if( rule.cooldown_period < 0 ){ return false; }

		return true;
	};

	var matchClosestRule = function(host){
		var rules_array_size = rules.length,
			longest_match = 0,
			longest_pattern_tiebreak = 0,
			closest_matched_rule = {},
			i;
		for(i = 0; i < rules_array_size; i++){
			var item = rules[i],
				pattern = item.pattern,
				pattern_match_length;
			pattern_match_length = returnPatternMatchLength(host, pattern);
			if( pattern_match_length == 0 ){
				continue;
			}
			if( pattern_match_length === longest_match && pattern.length > longest_pattern_tiebreak ){
				closest_matched_rule = item;
				longest_match = pattern_match_length;
				longest_pattern_tiebreak = pattern.length;
			}else if( pattern_match_length > longest_match ){
				closest_matched_rule = item;
				longest_match = pattern_match_length;
				longest_pattern_tiebreak = pattern.length;
			}
		}
		return closest_matched_rule;
	};

	var returnPatternMatchLength = function(host, pattern){
		var regex = new RegExp(pattern, 'i'),
			match;
		match = regex.exec(host);
		if( match === null ){
			return 0;
		}
		return match[0].length;
	};

	return {
		validateRule: function(rule){
			return isValidRule(rule);
		},
		setRules: function(value){
			rules = value;
			return this;
		},
		returnRules: function(){
			return rules;
		},
		returnRuleForHost: function(host){
			return matchClosestRule(host);
		},
		returnPattern: function(rule){
			return rule.pattern || '';
		},
		returnVisitLimit: function(rule){
			return rule.visit_limit || 0;
		},
		returnGracePeriod: function(rule){
			return rule.grace_period || 0;
		},
		returnCooldownPeriod: function(rule){
			return rule.cooldown_period || 0;
		}
	};
};

/* -------------------------------------------------------------------------- */

var RequestRulesLogger = function(){
	'use strict';

	var rulesParser = new RequestRulesParser(),
		storage = new ChromeStorage(),
		storage_key = 'site-visit-limiter-rules';

	var asyncLoadRules = function(callback){
		storage.asyncReturnKey(storage_key, function(rules){
			callback(rules);
		});
	};

	var asyncSaveRules = function(rules, callback){
		storage.asyncSet(storage_key, rules, callback);
	};

	var addItemToRulesAndSave = function(new_rule, rules, callback){
		var modified_rules = addItemToRules(new_rule, rules);
		asyncSaveRules(modified_rules, callback);
	};

	var addItemToRules = function(new_rule, rules){
		var pattern = rulesParser.returnPattern(new_rule);
		rules.push(new_rule);
		return rules;
	};

	return {
		asyncReturnRules: function(callback){
			asyncLoadRules(callback);
		},
		asyncSaveItem: function(new_rule, callback){
			asyncLoadRules(function(rules){
				addItemToRulesAndSave(new_rule, rules, callback);
			});
		}
	};
};

/* -------------------------------------------------------------------------- */

var Request = function(){
	'use strict';

	var historyLogger = new RequestHistoryLogger(),
		historyParser = new RequestHistoryParser(),
		rulesLogger = new RequestRulesLogger(),
		rulesParser = new RequestRulesParser(),
		uriParser = new RequestUriParser(),
		datetime = new DateTime(),
		utilities = new Utilities(),
		matched_rule,
		rule_pattern,
		minutes_since_last_visit;

	var parseRequest = function(){
		setMatchedRule();
		if( requestHasMatchedRule() ){
			setRulePattern();
			setMinutesSinceLastVisit();
		}
	};

	var setMatchedRule = function(){
		var host = uriParser.returnSection('host');
		matched_rule = rulesParser.returnRuleForHost(host);
	};

	var requestHasMatchedRule = function(){
		return utilities.object.isObject(matched_rule);
	};

	var setRulePattern = function(){
		rule_pattern = rulesParser.returnPattern(matched_rule);
	};

	var setMinutesSinceLastVisit = function(){
		var last_visit_timestamp = historyParser.returnLastVisitTimestamp(rule_pattern),
			current_timestamp = new DateTime().returnUnixTimestamp(),
			difference_in_minutes;
		if( last_visit_timestamp ){
			difference_in_minutes = datetime.returnUnixTimestampDifferenceInMinutes(
				last_visit_timestamp,
				current_timestamp
			);
			minutes_since_last_visit = difference_in_minutes;
		}else{
			minutes_since_last_visit = 0;
		}
	};

	var requestIsOverLimit = function(){
		if( requestHasMatchedRule() && requestIsOverRuleLimit() ){
			return true;
		}
		return false;
	};

	var requestIsOverRuleLimit = function(){
		if( ! lastVisitExists() ){
			recordRequestHistory();
			return false;
		}
		if( isOverVisitLimit() ){
			return true;
		}
		if( isInGracePeriod() ){
			return false;
		}
		if( isInCooldownPeriod() ){
			return true;
		}
		recordRequestHistory();
		return false;
	};

	var returnVisitCount = function(){
		return historyParser.returnVisitCount(rule_pattern);
	};

	var isOverVisitLimit = function(){
		var visit_limit = rulesParser.returnVisitLimit(matched_rule),
			visit_count = returnVisitCount();
		return visit_count >= visit_limit;
	};

	var lastVisitExists = function(){
		return minutes_since_last_visit > 0;
	};

	var isInGracePeriod = function(){
		var grace_period = rulesParser.returnGracePeriod(matched_rule);
		return minutes_since_last_visit <= grace_period;
	};

	var isInCooldownPeriod = function(){
		var cooldown_period = rulesParser.returnCooldownPeriod(matched_rule);
		return minutes_since_last_visit <= cooldown_period;
	};

	var recordRequestHistory = function(){
		historyLogger.asyncSaveItem(rule_pattern);
	};

	return {
		setUri: function(uri){
			uriParser.setUri(uri);
			return this;
		},
		setHistory: function(history){
			historyParser.setHistory(history);
			return this;
		},
		setRules: function(rules){
			rulesParser.setRules(rules);
			return this;
		},
		isOverTheLimit: function(){
			parseRequest();
			return requestIsOverLimit();
		}
	};
};

/* -------------------------------------------------------------------------- */

var RequestHandler = function(){
	'use strict';

	var requestHistoryLogger,
		requestRulesLogger;

	var initializePeristentVariables = function(){
		requestHistoryLogger = new RequestHistoryLogger();
		requestRulesLogger = new RequestRulesLogger();
	};

	var createRequest = function(uri, history, rules){
		var request = new Request();
		request.setUri(uri);
		request.setHistory(history);
		request.setRules(rules);
		return request;
	};

	var init = function(){
		initializePeristentVariables();
	}();

	return {
		asyncProcessAndReturnRequest: function(uri, callback){
			requestHistoryLogger.asyncReturnHistory(function(history){
				requestRulesLogger.asyncReturnRules(function(rules){
					var request = createRequest(uri, history, rules);
					callback(request);
				});
			});
		}
	};
};

/* -------------------------------------------------------------------------- */
