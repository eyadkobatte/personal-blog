---
title: Reinventing the Wheel - Part 1 - Array#at
date: '2021-09-16T23:14:54.752Z'
---

Node 16 introduced a new Array method `at` which lets us access individual array elements through a method.

I will be going to try and replicate the same method in a polyfill and see how close I can get to the original.

This is only a fun exercise and not meant to be used as an actual polyfill 😀

The requirements for the `at` method.

1. Accept one argument.
2. Return the element at the position that was passed.
3. Accept negative numbers to return an element from the last index.
4. If an element does not exist at the given index, return undefined.
5. By default the first element is returned for arguments that are not numbers.

Lets switch to an older version of node that did not have the `at` method defined

```shell
n 12
```

Trying to use the `at` method on an array now should throw an Error.

To define a method to the Array Object, we can use the prototype to create a new variable under Array.

```javascript
Array.prototype.at = function at() {};
```

Fulfilling each requirement

1. Accept one argument.

```javascript
Array.prototype.at = function at(index) {};
```

2. Return the element at the position that was passed.

```javascript
Array.prototype.at = function at(index) {
  return this[index];
};
```

3. Accept negative numbers to return an element from the last index.

```javascript
Array.prototype.at = function at(index) {
  if (index < 0) {
    return this[this.length + index];
  }
  return this[index];
};
```

4. If an element does not exist at the given index, return undefined.

```javascript
Array.prototype.at = function at(index) {
  if (Math.abs(index) > this.length) {
    return undefined;
  }
  if (index < 0) {
    return this[this.length + index];
  }
  return this[index];
};
```

5. By default the first element is returned for arguments that are not acceptable.

```javascript
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
```

Lets write a few test cases to ensure our new method works as expected

```javascript
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
```

#### Retrospective

The functionality of the function is pretty simple and minimal. Quite a good start to understand how polyfills work to allow compatibility of newer features in older systems.

[Here is a rough polyfill from the proposal](https://github.com/tc39/proposal-relative-indexing-method#polyfill) that has a much more clever solution.
