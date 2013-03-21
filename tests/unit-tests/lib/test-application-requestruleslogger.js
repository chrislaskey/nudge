var request_rules_logger;

module('Application - RequestRulesLogger', {
	setup: function(){
		var rules_object = {};
		rules_object['site-visit-limiter-rules'] = returnCompleteRulesObject();
		chrome.storage.local = returnChromeStorageLocalStub();
		chrome.storage.local.set(rules_object);
		request_rules_logger = new RequestRulesLogger();
	},
	teardown: function(){

	}
});

test('asyncReturnRules tests', function(){
	var method = request_rules_logger.asyncReturnRules,
		expected,
		result;

	expected = returnCompleteRulesObject();
	method(function(result){
		deepEqual(result, expected, 'Verify default rules returned');
	});
});

test('asyncSaveItem tests', function(){
	var input_rule,
		set_method = request_rules_logger.asyncSaveItem,
		get_method = request_rules_logger.asyncReturnRules,
		rules_parser = new RequestRulesParser();

	input_rule = {
		pattern: 'new_pattern',
		visit_limit: 4,
		grace_period: 18,
		cooldown_period: 61
	};
	set_method(input_rule, function(){
		get_method(function(result){
			ok(result, 'Verify all rules still exist after insert.');

			rules_parser.setRules(result);
			new_rule = rules_parser.returnRuleForHost('new_pattern');
			ok(new_rule, 'Verify new rule exists after insert.');

			ok(rules_parser.validateRule(new_rule), 'Verify new rule is properly formed.');
			equal(rules_parser.returnPattern(new_rule), 'new_pattern', 'Verify new rule pattern is correct.');
			equal(rules_parser.returnVisitLimit(new_rule), 4, 'Verify new rule visit limit is correct.');
			equal(rules_parser.returnGracePeriod(new_rule), 18, 'Verify new rule grace period is correct.');
			equal(rules_parser.returnCooldownPeriod(new_rule), 61, 'Verify new rule cooldown period is correct.');
		});
	});
});
