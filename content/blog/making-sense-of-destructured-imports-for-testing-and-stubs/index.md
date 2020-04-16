---
title: Making sense of destructured imports for testing and stubs
date: '2020-04-16T13:39:58.233Z'
---

We are using [got](https://www.npmjs.com/package/got) as a http library in our node.js backend. Got is structured in such a way where the specific methods that are needed can be destructured and imported so we do not import the whole package. Nice!!

    // lib/func/index.js

    const { get } = require('got'); // Only import get and no other methods
    ...
    const fakeFunc = async () => {
    	const result = await get('API');
    	return result;
    }

    module.exports = fakeFunc;

Not really. We started facing an issue when we write tests, and stub the methods from got

    // lib/func/index.spec.js

    const got = require('got');
    const sinon = require('sinon');

    const fakeFunc = require('.');
    ...
    describe('Test API Calls', function (done) {
    	const stub = sinon.stub(got, 'get');
    	fakeFunc().then(data => {
    		// Write expects here
    	});
    });

You can see that we stub the get module for the got package. We now expect our test to not actually make a HTTP call to the API specified in the code.

Sadly, this is not what happens. In the `index.js` file when we import {get}, we get a new instance of the get module from got. This is not the same instance as the one that got stubbed. So at this point, we have 2 get methods, One stubbed, and the other which will make the HTTP call. We stub the module in the test but the code has the module which will not be stubbed.

When we destructure an import, we effectively imported a new instance of the get module that is not tied to the stub that we created. This means that the test will actually hit the API and get actual data. (Big no no)

To fix this problem, We import got as a whole library and use the modules from the got package without destructuring. Small sacrifice for a bigger win

### Other Problems

We did not realise that destructuing imports would be causing new instances, so upon googling what could be the issue, some people suggested to mock our dependencies. So we started mocking dependencies with the proxyquire package. This fixed the problem for a while till we had a lot of proxyquires that were not actually needed. This is not the best way to go about it as we are now mocking our dependencies instead of fixing a problem

TLDR: Import the whole package instead of destructured imports if a specific module needs to be stubbed
