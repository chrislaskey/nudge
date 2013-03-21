var utilities;

module('Utilities - ObjectUtilities Tests', {
	setup: function(){
		utilities = new Utilities();
	},
	teardown: function(){

	}
});

test('Object Utilities - isObject method test', function() {
	var input,
		method = utilities.object.isObject,
		result;

	input = 'A String';
	result = method(input);
	equal(result, false, 'String');

	input = [];
	result = method(input);
	equal(result, false, 'Empty Array');

	input = ['value'];
	result = method(input);
	equal(result, false, 'Array with values');

	input = {};
	result = method(input);
	equal(result, true, 'Empty Object');

	input = {0: 'value', 1: 'value'};
	result = method(input);
	equal(result, true, 'Object with numeric keys');

	input = {key: 'value'};
	result = method(input);
	equal(result, true, 'Object with named keys');
});

test('Object Utilities - hasProperty method test', function() {
	var input,
		method = utilities.object.hasProperty,
		result;

	input_object = 'A String';
	input_property = 'my_property';
	result = method(input_object, input_property);
	equal(result, false, 'Non-object haystack');

	input_object = {};
	input_property = 'my_property';
	result = method(input_object, input_property);
	equal(result, false, 'Empty Object haystack');

	input_object = {'other_property': 'value'};
	input_property = 'my_property';
	result = method(input_object, input_property);
	equal(result, false, 'Haystack does not contain property');

	input_object = {'other_property': 'value'};
	input_property = {'other_property': 'value'};
	result = method(input_object, input_property);
	equal(result, false, 'Invalid property, passing an object');

	input_object = {0: 'value'};
	input_property = 0;
	result = method(input_object, input_property);
	equal(result, true, 'Numeric property');

	input_object = {0: 'value'};
	input_property = '0';
	result = method(input_object, input_property);
	equal(result, true, 'Numeric property as string');

	input_object = {'my_property': 'value'};
	input_property = 'my_property';
	result = method(input_object, input_property);
	equal(result, true, 'Haystack contains property');

	input_object = {my_property: 'value'};
	input_property = 'my_property';
	result = method(input_object, input_property);
	equal(result, true, 'Haystack defined without quotes');
});

test('isNumeric method', function() {
	// Test methods from: http://stackoverflow.com/a/1830844/657661
	var method = utilities.isNumeric;

	ok( method('-10'), 'Negative integer string');
	ok( method('0'), 'Zero string');
	ok( method('5'), 'Positive integer string');
	ok( method(-16), 'Negative integer number');
	ok( method(0), 'Zero integer number');
	ok( method(32), 'Positive integer number');
	ok( method('040'), 'Octal integer literal string');
	ok( method(0144), 'Octal integer literal');
	ok( method('0xFF'), 'Hexadecimal integer literal string');
	ok( method(0xFFF), 'Hexadecimal integer literal');

	ok( method('-1.6'), 'Negative floating point string');
	ok( method('4.536'), 'Positive floating point string');
	ok( method(-2.6), 'Negative floating point number');
	ok( method(3.1415), 'Positive floating point number');
	ok( method(8e5), 'Exponential notation');
	ok( method('123e-2'), 'Exponential notation string');

	equal( method(''), false, 'Empty string');
	equal( method('        '), false, 'Whitespace characters string');
	equal( method('\t\t'), false, 'Tab characters string');
	equal( method('abcdefghijklm1234567890'), false, 'Alphanumeric character string');
	equal( method('xabcdefx'), false, 'Non-numeric character string');
	equal( method(true), false, 'Boolean true literal');
	equal( method(false), false, 'Boolean false literal');
	equal( method('bcfed5.2'), false, 'Number with preceding non-numeric characters');
	equal( method('7.2acdgs'), false, 'Number with trailling non-numeric characters');
	equal( method(undefined), false, 'Undefined value');
	equal( method(null), false, 'Null value');
	equal( method(NaN), false, 'NaN value');
	equal( method(Infinity), false, 'Infinity primitive');
	equal( method(Number.POSITIVE_INFINITY), false, 'Positive Infinity');
	equal( method(Number.NEGATIVE_INFINITY), false, 'Negative Infinity');
	equal( method(new Date(2009,1,1)), false, 'Date object');
	equal( method(new Object()), false, 'Empty object');
	equal( method(function(){}), false, 'Instance of a function');
});

