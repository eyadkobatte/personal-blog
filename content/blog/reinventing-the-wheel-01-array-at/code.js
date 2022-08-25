/* eslint-disable no-extend-native */
/* eslint-disable no-console */

Array.prototype.at = function at(index) {
  if (typeof index !== 'number') {
    return this[0];
  }
  if (Math.abs(index) > this.length) {
    return undefined;
  }
  if (index < 0) {
    return this[this.length + index];
  }
  return this[index];
};

const assert = require('assert');

const assertions = () => {
  const numberArray = [1, 2, 3];
  const emptyArray = [];
  // Getting the first element out of an array
  assert.equal(numberArray.at(0), 1);
  // Getting the third element out of an array
  assert.equal(numberArray.at(2), 3);
  // Getting the last element with reverse indexing out of an array
  assert.equal(numberArray.at(-1), 3);
  // Getting the second last element with reverse indexing out of an array
  assert.equal(numberArray.at(-2), 2);
  // Getting the second last element with reverse indexing out of an array
  assert.equal(numberArray.at(4), undefined);
  // Getting the second last element with reverse indexing out of an array
  assert.equal(numberArray.at(-5), undefined);
  // Getting the second last element with reverse indexing out of an array
  assert.equal(numberArray.at('notanumber'), 1);
  // Using the at method on an empty array returns undefined
  assert.equal(emptyArray.at(0), undefined);
  console.log('All tests passed');
};

assertions();
