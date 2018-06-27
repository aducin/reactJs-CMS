import testing from '../testing';
import { arrayTesting } from '../testing';
import { concat } from '../testing';
import { divide } from '../testing';
import { multiply } from '../testing';
import { getPostal } from '../testing';

import axios from 'axios';
import adapter from 'axios/lib/adapters/http';


var sum = testing.sum;
var minus = testing.minus;
var result;
var nothing;

test('testing some concatenation', () => {
	result = concat('Capuch', 'jakiś');
  	expect(result).toBe('Capuch jakiś');
  	expect(typeof result).toBe('string');
});

test('testing an array', () => {
  	expect(arrayTesting).toContain('variable');
  	expect(arrayTesting[5].success).toBeFalsy();
  	expect(typeof arrayTesting[5]).toBe('object');
});

test('testing a variable', () => {
  	expect(nothing).toBeUndefined();
});

test('testing numbers', () => {
  	var resultSum = sum(arrayTesting[0], arrayTesting[1]);
  	var resultMinus = minus(arrayTesting[2], arrayTesting[1]);
  	var resultMultiply = multiply(arrayTesting[2], arrayTesting[1]);
  	var resultDivision = divide(arrayTesting[3], arrayTesting[1]);
  	expect(resultSum).toEqual(3);
  	expect(resultMinus).toEqual(1);
  	expect(resultMultiply).toEqual(6);
  	expect(resultDivision).toBe(3);
  	expect(typeof resultSum).toBe('number');
});

/*
describe('async test', () => {
	it('works with async/await', async () => {
		try {
			expect.assertions(3);
			const data = await getPostal();
			if (data) {
				expect(data.success).toEqual(true);
				expect(Object.prototype.toString.call(data.list)).toBe('[object Array]');
				expect(isNaN(data.current)).toBeFalsy();
			} else {
				throw new Error('Error occured!');
			}
		} catch (e) {
			console.log(e.message);
		}
	});
});
*/



