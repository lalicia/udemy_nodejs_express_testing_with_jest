# Things of note

## The Course

[Nodejs Express - unit testing/integration tests with Jest](https://www.udemy.com/share/101KZ63@50pwxLBCy1FSFEeoP9a6PPyOo9lzjg-fr5aQ8hxwWzGRY74W-uKZ9hxwXovfIpN87Q==/) by Stefan Hyltoft

## General

- I needed to update as I went to use modules rather than CommonJS
- due to this, I needed to add ```--experimental-vm-modules node_modules/jest/bin/jest.js``` to the test script to allow Jest to work, otherwise the test suite failed to run
- ```--watchAll``` flag allows the test suite to keep running and picks up changes so you don't have to keep re-running test script
- jest error: ```TypeError: jest.fn is not a function``` - needed to import jest from "jest-mock" at the top of test file [stackoverflow](https://stackoverflow.com/questions/46086970/getting-typeerror-jest-fn-is-not-a-function) (but please see further notes on jest.mock below, where this import was replaced/updated)
- the code changes between videos and I'm not sure why that is (it's not addressed). One example being .send changed to .json - when I tried .json it didn't work with the test so I use .send as originally demonstrated
- needed to split out app.listen as this caused an error with jest - [stackoverflow](https://stackoverflow.com/questions/55038813/cannot-log-after-tests-are-done-in-jestjs) - this is covered late in the course and I'd had to investigate and remedy by myself before the tutor covered it

## Spy vs. Mock

A spy means you still have the original implementation but can spy on whether it's being called, whereas a mock (jest.fn()) does not call the original implementation but sees whether it's called, and you can return predefined values.

## How to import json

[stackoverflow](https://stackoverflow.com/questions/34944099/how-to-import-a-json-file-in-ecmascript-6)

I could not get these to work properly in the integration tests so created variables for testing at the top of the file. There's probably a way to fix this, but that was my workaround.

## Imports beyond what's explictly mentioned in the course title

Node-Mocks-HTTP
[npm library](https://www.npmjs.com/package/node-mocks-http)

Supertest (for integration testing)

## Async/await

The course covers this but after you've seen the error for a while - the unit tests broke once the createTodo function was made into async/await when creating the db connection. Adding async/await into the unit tests resolved this and the suite passed again.

## mlab

The course features mlab for setting up a browser-based database, but this is now defunct and out of date. Trying to reach mlab will lead you to MongoDB Atlas, which is the Mongo in-house offering that is the replacement. Note: you can only have one free cluster in Atlas on your account, so for this course I needed to delete a cluster from a previous course in order to be able to set it up.

## Environment Variables

The course doesn't use environment variables, but as this is better practice I've done this. You probably don't need to bother if you're not posting/pushing the code anywhere.

## jest.mock()

Absolute nightmare pain in the a\*se. You might not encounter any difficulty if copying the course line for line, but if you use ESM like I did (because I'm trying to learn testing in line with how the project I work on professionally is written) then beware.

This was put in the course as a throwaway section right near the end and ruined 4 hours of my life. Essentially, if you're using ESM rather than CommonJS Jest support is patchy and 'experimental'. After much googling and despair, I'll try and summarise in an understandable fashion the problems you'll encounter...

What happens with mock is that it's hoisted above any of your imports or declarations. Which means that unless you import jest explicitly (and correctly - the import I was using at first didn't allow access to the mock function ```import jest from "jest-mock"```) then you will get the error that jest.mock is not a function.

The 'correct' way to import jest FYI, is ```import { jest } from "@jest/globals"``` (for the purpose of this issue, anyways).

You will, with this, have access to mock as well as jest.fn.

You will also, after resolving that problem, then encounter the next problem which is ```ReferenceError: require is not defined```. Basically, mock is trying to require the path you've given it, but you're using ESM which isn't require syntax and you likely have ```"type": "module"``` in your package.json - all of which is to say, it's pitching a fit about that.

Now I tried a lot of different workarounds I found online but couldn't get any of them to work in the end. Here are some links for reading so you can see for yourself that I did try...

[jest.mock of ES6 class yields ReferenceError: require is not defined](https://stackoverflow.com/questions/64582674/jest-mock-of-es6-class-yields-referenceerror-require-is-not-defined)

[JEST.MOCK OF ES6 CLASS YIELDS REFERENCEERROR: REQUIRE IS NOT DEFINED](https://www.appsloveworld.com/jestjs/4/jest-mock-of-es6-class-yields-referenceerror-require-is-not-defined)

[Jest Docs](https://jestjs.io/docs/ecmascript-modules)

[How to overcome jest "Cannot access before initialization" problem?](https://stackoverflow.com/questions/61843762/how-to-overcome-jest-cannot-access-before-initialization-problem)

What you'll notice is the warning that you can do all of this and it still won't work. Because experimental. Absolute effing b\*allache.

In the end the closest I got was trying to use these imports to bring in require:
```js
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
```
But the outcome of that was: ```ReferenceError: Cannot access 'require' before initialization```

Yet again, mock was being hoisted above what it needed and ruining my day.

I'm sure there's a way around this, but nothing I tried worked.
