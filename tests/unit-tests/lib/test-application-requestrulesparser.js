var request_rules_parser;

module('Application - RequestRulesParser', {
	setup: function(){
		request_rules_parser = new RequestRulesParser();
	},
	teardown: function(){

	}
});

test('validateRule tests', function(){
	var input,
		method = request_rules_parser.validateRule,
		expected,
		result;

	input = undefined;
	expected = false;
	result = method(input);
	equal(result, expected, 'Pass undefined object as rule');

	input = null;
	expected = false;
	result = method(input);
	equal(result, expected, 'Pass null object as rule');

	input = {};
	expected = false;
	result = method(input);
	equal(result, expected, 'Pass empty object as rule');

	input = {
		pattern: {'invalid': 'pattern'},
		visit_limit: '3',
		grace_period: '15',
		cooldown_period: '20'
	};
	expected = false;
	result = method(input);
	equal(result, expected, 'Pass invalid pattern value');

	input = {
		visit_limit: '3',
		grace_period: '15',
		cooldown_period: '20'
	};
	expected = false;
	result = method(input);
	equal(result, expected, 'Pass missing pattern value');

	input = {
		pattern: 'example.com',
		visit_limit: '0invalid',
		grace_period: 15,
		cooldown_period: 20
	};
	expected = false;
	result = method(input);
	equal(result, expected, 'Pass invalid visit_limit value');

	input = {
		pattern: 'example.com',
		visit_limit: 3,
		grace_period: 15,
		cooldown_period: 20
	};
	expected = true;
	result = method(input);
	equal(result, expected, 'Pass valid pattern with number values');

	input = {
		pattern: 'example.com',
		visit_limit: '3',
		grace_period: '15',
		cooldown_period: '20'
	};
	expected = true;
	result = method(input);
	equal(result, expected, 'Pass valid pattern with string number values');
});

test('setRules and returnRules tests', function(){
	var input,
		set_method = request_rules_parser.setRules,
		get_method = request_rules_parser.returnRules,
		expected,
		result;

	input = {'simple': 'object'};
	set_method(input);
	expected = input;
	result = get_method();
	deepEqual(result, expected, 'Set rules to simple object');

	input = returnCompleteRulesObject();
	set_method(input);
	expected = input;
	result = get_method();
	deepEqual(result, expected, 'Set rules to full rules object');
});

test('setRules and returnRules tests', function(){
	var input,
		set_method = request_rules_parser.setRules,
		get_method = request_rules_parser.returnRules,
		expected,
		result;

	input = {'simple': 'object'};
	set_method(input);
	expected = input;
	result = get_method();
	deepEqual(result, expected, 'Set rules to simple object');

	input = returnCompleteRulesObject();
	set_method(input);
	expected = input;
	result = get_method();
	deepEqual(result, expected, 'Set rules to full rules object');
});

test('returnRuleForHost tests', function(){
	var input,
		setup_method = request_rules_parser.setRules,
		method = request_rules_parser.returnRuleForHost,
		expected_rule,
		expected_rule_pattern,
		returned_rule,
		result_pattern,
		rules;

	rules = returnCompleteRulesObject();
	setup_method(rules);

	input = 'no-matching-rule.com';
	expected_rule = {};
	returned_rule = method(input);
	deepEqual(returned_rule, expected_rule, 'Return no matching rule');

	input = 'default';
	expected_rule_pattern = 'default';
	returned_rule = method(input);
	result_pattern = returned_rule.pattern;
	deepEqual(result_pattern, expected_rule_pattern, 'Return exact match rule');

	input = 'basic-string.com';
	expected_rule_pattern = 'basic-string.com';
	returned_rule = method(input);
	result_pattern = returned_rule.pattern;
	deepEqual(result_pattern, expected_rule_pattern, 'Return matching basic string rule');

	input = 'www.basic-string.com.au';
	expected_rule_pattern = 'basic-string.com';
	returned_rule = method(input);
	result_pattern = returned_rule.pattern;
	deepEqual(result_pattern, expected_rule_pattern, 'Return matching basic string rule, showing how explicit pattern wildcards are not needed to multi-match');

	input = 'exact-match-only.com';
	expected_rule_pattern = '^exact-match-only.com$';
	returned_rule = method(input);
	result_pattern = returned_rule.pattern;
	deepEqual(result_pattern, expected_rule_pattern, 'Return exact matching rule');

	input = 'www.exact-match-only.com';
	expected_rule = {};
	returned_rule = method(input);
	deepEqual(returned_rule, expected_rule, 'Return no matching rule, since a subdomain is not included in exact-match rule pattern');

	input = 'test.co.uk';
	expected_rule_pattern = '.*test.co.uk';
	returned_rule = method(input);
	result_pattern = returned_rule.pattern;
	deepEqual(result_pattern, expected_rule_pattern, 'Return subdomain wildcard regex match rule, even when subdomain is not given');

	input = 'www.test.co.uk';
	expected_rule_pattern = '.*test.co.uk';
	returned_rule = method(input);
	result_pattern = returned_rule.pattern;
	deepEqual(result_pattern, expected_rule_pattern, 'Return subdomain wildcard regex match rule, when subdomain is given');

	input = 'example.com';
	expected_rule_pattern = 'example.com';
	returned_rule = method(input);
	result_pattern = returned_rule.pattern;
	deepEqual(result_pattern, expected_rule_pattern, 'Return closest matching rule from multiple matches');

	input = 'www.example.com';
	expected_rule_pattern = '.+.example.com';
	returned_rule = method(input);
	result_pattern = returned_rule.pattern;
	deepEqual(result_pattern, expected_rule_pattern, 'Return closest matching rule from multiple matches');
});

test('return{Pattern,VisitLimit,GracePeriod,CooldownPeriod} tests', function(){
	var input_rule,
		returnPattern = request_rules_parser.returnPattern,
		returnVisitLimit = request_rules_parser.returnVisitLimit,
		returnGracePeriod = request_rules_parser.returnGracePeriod,
		returnCooldownPeriod = request_rules_parser.returnCooldownPeriod;

	input_rule = {};
	equal(returnPattern(input_rule), '', 'Return no matching pattern from empty input');
	equal(returnVisitLimit(input_rule), 0, 'Return no matching visit limit from empty input');
	equal(returnGracePeriod(input_rule), 0, 'Return no matching grace period from empty input');
	equal(returnCooldownPeriod(input_rule), 0, 'Return no matching cooldown period from empty input');

	input_rule = {
		pattern: '.+.example.com',
		visit_limit: 3,
		grace_period: 15,
		cooldown_period: 60
	};
	equal(returnPattern(input_rule), '.+.example.com', 'Return matching pattern');
	equal(returnVisitLimit(input_rule), 3, 'Return matching visit limit');
	equal(returnGracePeriod(input_rule), 15, 'Return matching grace period');
	equal(returnCooldownPeriod(input_rule), 60, 'Return matching cooldown period');
});
