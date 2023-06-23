- updated to use modules rather than common js
- needed to add '--experimental-vm-modules node_modules/jest/bin/jest.js' to test script to allow Jest to work, otherwise test suite failed to run
- watchAll flag allows test suite to keep running so picks up changes and don't have to keep re-running test script
- error with jest: "TypeError: jest.fn is not a function" - need to import jest from "jest-mock" at top of test file (stackoverflow)[https://stackoverflow.com/questions/46086970/getting-typeerror-jest-fn-is-not-a-function]

Spy vs. Mock
A spy means you still have the original implementation but can spy on whether it's being called - a mock (jest.fn()) does not call the original implementation but sees whether it's called, and you can return predefined values.

How to import json
(stackoverflow)[https://stackoverflow.com/questions/34944099/how-to-import-a-json-file-in-ecmascript-6]

Node-Mocks-HTTP
(npm library)[https://www.npmjs.com/package/node-mocks-http]

Supertest
For integration testing

Needed to split out app.listen as causing an error with jest - (stackoverflow)[https://stackoverflow.com/questions/55038813/cannot-log-after-tests-are-done-in-jestjs]

Async/await
The course covers this but after you've seen it for a while - the unit tests broke once the createTodo function was made into async/await when creating the db connection. Adding async/await into the unit tests resolved this and the suite passed again.

mlab
The course features mlab for setting up a browser-based database, but this is now defunct and out of date. Trying to reach mlab will lead you to MongoDB Atlas, which is the Mongo in-house offering that is the replacement. Note: you can only have one free cluster in Atlas on your account, so for this course I needed to delete a cluster from a previous course in order to be able to set it up.

Environment Variables
The course doesn't use environment variables but as this is better practice, I've done this.
