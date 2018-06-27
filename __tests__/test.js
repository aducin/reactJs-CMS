const assert = require('chai').assert;
const first = require('../first');
const sum = require('../sum');

describe('First', function() {
	it('should return hello world', function() {
		assert.equal(first(), 'hello world');
	});
	it('should return a string', function() {
		assert.typeOf(first(), 'string');
	});
});
describe('Sum', function() {
	var result;
	it('should return 9', function() {
		result = sum(4);
		assert.equal(result, 9);
	});
	it('should by a type of number', function() {
		result = sum(5);
		assert.typeOf(result, 'number');
	});
});