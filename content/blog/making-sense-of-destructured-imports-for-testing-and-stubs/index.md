---
title: Making sense of destructured imports for testing and stubs
date: '2020-04-16T13:39:58.233Z'
---

Testing is an immensely useful skill to have in your utility belt.

![Batman Utility Belt](./batman_utility_belt.gif)

Fortunately, I had the privilege of learning to write tests recently. When I learned JavaScript, it was with ES5 and Promises and all the modern goodies of JavaScript, so all my code heavily relies on ES5+ features and barely includes any callbacks (Say no to callback hell)

I faced this issue recently where we are using destructured imports in our node.js file and stubbing a few HTTP methods. All our stubs failed and our tests started making HTTP calls to actual APIs. I ran down this path of trying to google what was going wrong yet no results could be found. What I learned from here mainly applies to testing but its applications could be anywhere we want to reuse a module/package instead of creating new instances of a package

We are using [got](https://www.npmjs.com/package/got) as an HTTP library in our node.js backend. `GOT` has been designed in such a way where the specific methods that are needed can be destructured and imported so we do not import the whole package. Nice!!

```javascript
// lib/func/index.js

const { get } = require('got'); // Only import get and no other methods

// More code here

const fakeFunc = async () => {
  const result = await get('API');
  return result;
};

module.exports = fakeFunc;
```

Not really. We started facing an issue when we write tests, and stub the methods from got

```javascript
// lib/func/index.spec.js

const got = require('got');
const sinon = require('sinon');

const fakeFunc = require('.');

// More code here

describe('Test API Calls', function (done) {
  const stub = sinon.stub(got, 'get');
  fakeFunc().then((data) => {
    // Write your tests here
  });
});
```

You can see that we stub the get function from the got package. We would now expect our test to not make an HTTP call to the API specified in the code.

Sadly, this is not what happens. In the `lib/func/index.js` file when we write `const { get } = require('got')`, we get a new instance of the get module from `GOT`. This is not the same instance as the one that is stubbed. So at this point, we have 2 get methods, one in the test file (The stubbed value) and one in our function (Not the stubbed value).

When we destructure an import, we effectively imported a new instance of the get module that is not tied to the stub that we created. This means that the test will hit the API and get actual data. (Big no-no)

To fix this problem, We import `GOT` as a whole library and use the modules from the `GOT` package without destructuring. Small sacrifice for a bigger win.

## How we temporarily fixed this problem

We had not yet realized that destructuring would be creating new instances of modules. So upon googling for a solution, we found a library called [proxyquire](https://www.npmjs.com/package/proxyquire) which will mock our dependencies in the functions. This would mean we can replace the non-stubbed version of the get instance in our function with a stubbed value from the test.

```javascript
// lib/func/index.spec.js

const got = require('got');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

// We do not import our function here
// const fakeFunc = require('.');

// More code here

describe('Test API Calls', function (done) {
  const stub = sinon.stub(got, 'get'); // Notice how we do not stub the got module here

  // Mock the get module in the got dependency with our stub here
  const functionHolder = proxyquire('.', {
    got: {
      get: stub,
    },
  });

  functionHolder.fakeFunc().then((data) => {
    // Write your tests here
  });
});
```

This fixed the problem for a while until we ended up using `PROXYQUIRE` everywhere, even when it is not needed. This is not the best way to go about it as we are now mocking our dependencies instead of fixing a problem

In the end, we steered clear of proxyquire and stopped destructuring imports for the `GOT` package

![Working cat](./working_cat.gif)
