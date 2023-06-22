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
