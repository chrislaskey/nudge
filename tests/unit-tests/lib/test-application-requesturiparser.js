var request_uri_parser;

module('Application - RequestUriParser', {
	setup: function(){
		request_uri_parser = new RequestUriParser();
	},
	teardown: function(){

	}
});

test('returnOption tests', function(){
	var input,
		method = request_uri_parser.returnOption,
		expected,
		result;

	input = 'strictMode';
	expected = true;
	result = method(input);
	equal(result, expected, 'Return parserOption value');
});

test('setOption tests', function(){
	var input_key,
		input_value,
		set_method = request_uri_parser.setOption,
		get_method = request_uri_parser.returnOption,
		expected,
		result;

	input_key = 'strictMode';
	input_value = false;
	expected = false;
	set_method(input_key, input_value);
	result = get_method(input_key);
	equal(result, expected, 'Set and verify new parserOption value');
});

test('setUri and returnParsed tests', function(){
	var input,
		set_method = request_uri_parser.setUri,
		get_method = request_uri_parser.returnParsed,
		expected,
		result;

	input = 'default';
	expected = {
		'anchor': '',
		'authority': '',
		'directory': '',
		'file': 'default',
		'host': '',
		'password': '',
		'path': 'default',
		'port': '',
		'protocol': '',
		'query': '',
		'queryKey': {},
		'relative': 'default',
		'source': 'default',
		'user': '',
		'userInfo': ''
	};
	set_method(input);
	result = get_method();
	deepEqual(result, expected, 'Parse one-word partial URI (default) and return possibly unexpected results');

	// Note: only missing piece to make this partial a complete minimum URI
	// is a protocol string, e.g. <protocol>://
	input = 'example.com/test';
	expected = {
		'anchor': '',
		'authority': '',
		'directory': 'example.com/',
		'file': 'test',
		'host': '',
		'password': '',
		'path': 'example.com/test',
		'port': '',
		'protocol': '',
		'query': '',
		'queryKey': {},
		'relative': 'example.com/test',
		'source': 'example.com/test',
		'user': '',
		'userInfo': ''
	};
	set_method(input);
	result = get_method();
	deepEqual(result, expected, 'Parse partial URI (example.com/test) and return possibly unexpected results');

	input = 'http://www.example.com/test';
	expected = {
		'anchor': '',
		'authority': 'www.example.com',
		'directory': '/',
		'file': 'test',
		'host': 'www.example.com',
		'password': '',
		'path': '/test',
		'port': '',
		'protocol': 'http',
		'query': '',
		'queryKey': {},
		'relative': '/test',
		'source': 'http://www.example.com/test',
		'user': '',
		'userInfo': ''
	};
	set_method(input);
	result = get_method();
	deepEqual(result, expected, 'Parse basic URI (http://www.example.com/test) and return expected results');

	input = 'http://usr:pwd@www.example.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value#top';
	expected = {
		'anchor': 'top',
		'authority': 'usr:pwd@www.example.com:81',
		'directory': '/dir/dir.2/',
		'file': 'index.htm',
		'host': 'www.example.com',
		'password': 'pwd',
		'path': '/dir/dir.2/index.htm',
		'port': '81',
		'protocol': 'http',
		'query': 'q1=0&&test1&test2=value',
		'queryKey': {
			'q1': '0',
			'test1': '',
			'test2': 'value'
		},
		'relative': '/dir/dir.2/index.htm?q1=0&&test1&test2=value#top',
		'source': 'http://usr:pwd@www.example.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value#top',
		'user': 'usr',
		'userInfo': 'usr:pwd'
	};
	set_method(input);
	result = get_method();
	deepEqual(result, expected, 'Parse complex URI');

	input = 'htp://wwwexamplecom/test??query=value';
	expected = {
		'anchor': '',
		'authority': 'wwwexamplecom',
		'directory': '/',
		'file': 'test',
		'host': 'wwwexamplecom',
		'password': '',
		'path': '/test',
		'port': '',
		'protocol': 'htp',
		'query': '?query=value',
		'queryKey': {
			'?query': 'value'
		},
		'relative': '/test??query=value',
		'source': 'htp://wwwexamplecom/test??query=value',
		'user': '',
		'userInfo': ''
	};
	set_method(input);
	result = get_method();
	deepEqual(result, expected, 'Parsing an invalid URI returns the pieces it can parse.');
});

test('setUri and returnSection tests', function(){
	var input,
		set_method = request_uri_parser.setUri,
		get_method = request_uri_parser.returnSection,
		expected,
		result;

	input = 'http://usr:pwd@www.example.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value#top';
	set_method(input);
	equal(get_method('anchor'), 'top', 'Verifying protocol section');
	equal(get_method('authority'), 'usr:pwd@www.example.com:81', 'Verifying authority section');
	equal(get_method('directory'), '/dir/dir.2/', 'Verifying directory section');
	equal(get_method('file'), 'index.htm', 'Verifying file section');
	equal(get_method('host'), 'www.example.com', 'Verifying host section');
	equal(get_method('password'), 'pwd', 'Verifying password section');
	equal(get_method('path'), '/dir/dir.2/index.htm', 'Verifying path section');
	equal(get_method('port'), '81', 'Verifying port section');
	equal(get_method('protocol'), 'http', 'Verifying protocol section');
	equal(get_method('query'), 'q1=0&&test1&test2=value', 'Verifying query section');
	deepEqual(get_method('queryKey'), {'q1': '0', 'test1': '', 'test2': 'value'}, 'Verifying queryKey section');
	equal(get_method('relative'), '/dir/dir.2/index.htm?q1=0&&test1&test2=value#top', 'Verifying relative section');
	equal(get_method('source'), 'http://usr:pwd@www.example.com:81/dir/dir.2/index.htm?q1=0&&test1&test2=value#top', 'Verifying source section');
	equal(get_method('user'), 'usr', 'Verifying user section');
	equal(get_method('userInfo'), 'usr:pwd', 'Verifying userInfo section');
});
