// needed to give access to jest.fn - discovered can be replaced with import { jest } from "@jest/globals" which also circumvents hoisting issue with jest.mock()
//import jest from "jest-mock";
import { jest } from "@jest/globals";
import httpMocks from "node-mocks-http";
import {
  getTodos,
  createTodo,
  getTodoByID,
  updateTodo,
} from "../../controllers/todoController.js";
import { TodoModel } from "../../mongooseModelFunctions/todoModel.js";
import * as newTodo from "../mockData/newTodo.json";
import * as allTodos from "../mockData/allTodos.json";
import * as todoID from "../mockData/todoID.json";

// create mocks on functions on the TodoModel method; mongoose has different methods - create, delete, etc - mongoose handles this
// create mock implementation using jest.fn which spies on function to see if it's being called
TodoModel.create = jest.fn();
TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();
TodoModel.findByIdAndUpdate = jest.fn();
TodoModel.findByIdAndDelete = jest.fn();

// is a shortcut in Jest to mock a whole model or class or module etc, but there is an issue with ESM and mock hoisting, see README
//jest.mock("../../mongooseModelFunctions/todoModel");

let req, res, next;
const todoId = "64958bbf077b9e54cf051217";
beforeEach(() => {
  //creating mocks that the original implementation has
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
});

describe("getTodos", () => {
  it("should be a function", () => {
    expect(typeof getTodos).toBe("function");
  });

  it("should call TodoModel.find({})", async () => {
    await getTodos(req, res, next);
    expect(TodoModel.find).toBeCalled();
    expect(TodoModel.find).toBeCalledWith({});
  });

  it("should return response with status 200 and all todos", async () => {
    //creating a mock return that we are going to expect back
    TodoModel.find.mockReturnValue(allTodos);
    await getTodos(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
    expect(res._getData()).toStrictEqual(allTodos);
  });

  it("should handle errors", async () => {
    //need to arrange the setup for the test
    const errorMessage = { message: "Error finding Todos" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.find.mockReturnValue(rejectedPromise);

    await getTodos(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

describe("getTodoByID", () => {
  it("should be a function", () => {
    expect(typeof getTodoByID).toBe("function");
  });

  it("should call TodoModel.findById withe route parameters", async () => {
    req.params.todoId = todoId;
    await getTodoByID(req, res, next);
    expect(TodoModel.findById).toBeCalledWith(todoId);
  });

  it("should return json body and response code 200", async () => {
    //creating a mock return that we are going to expect back
    TodoModel.findById.mockReturnValue(todoID);
    // do not need to pass in param as we've already tested this works, we're now testing for a return to the function
    //req.params.todoId = "64958bbf077b9e54cf051217";
    await getTodoByID(req, res, next);

    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled).toBeTruthy();
    expect(res._getData()).toStrictEqual(todoID);
  });

  it("should handle errors", async () => {
    //need to arrange the setup for the test
    const errorMessage = { message: "Couldn't retrieve that Todo" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findById.mockReturnValue(rejectedPromise);

    await getTodoByID(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });

  it("should return 404 when Todo doesn't exist", async () => {
    TodoModel.findById.mockReturnValue(null);

    await getTodoByID(req, res, next);
    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled).toBeTruthy();
  });
});

// POST tests
describe("createTodo", () => {
  beforeEach(() => {
    //using mock data we've imported in
    req.body = newTodo;
  });
  it("should be a function", () => {
    expect(typeof createTodo).toBe("function");
  });

  // we don't want to test the mongoose functionality because that should work as it's supposed to - we want to test that OUR code is working
  it("should call TodoModel.create", () => {
    createTodo(req, res, next);
    expect(TodoModel.create).toBeCalledWith(newTodo);
  });

  it("should return a 201 response code", async () => {
    await createTodo(req, res, next);
    expect(res.statusCode).toBe(201);
    //_isEndCalled from node-mocks-http
    expect(res._isEndCalled()).toBeTruthy();
  });

  it("should return json body in response", async () => {
    //creating a mock return that we are going to expect back
    TodoModel.create.mockReturnValue(newTodo);
    //console.log("newTodo = ", newTodo);

    await createTodo(req, res, next);
    //_getJSONData not working, something to do with importing of json file
    expect(res._getData()).toStrictEqual(newTodo);
  });

  it("should handle errors", async () => {
    //need to arrange the setup for the test
    const errorMessage = { message: "Required property missing" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.create.mockReturnValue(rejectedPromise);

    await createTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
});

//UPDATE tests
describe("updateTodo", () => {
  it("should be a function", () => {
    expect(typeof updateTodo).toBe("function");
  });

  it("should update with TodoModel.findByIdAndUpdate", async () => {
    //need to set some variables on our request object
    req.params.todoId = todoId;
    req.body = newTodo;

    await updateTodo(req, res, next);
    expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, {
      new: true,
      useFindAndModify: false,
    });
  });

  it("should return a 200 response code and the todo", async () => {
    req.params.todoId = todoId;
    req.body = newTodo;
    TodoModel.findByIdAndUpdate.mockReturnValue(newTodo);

    await updateTodo(req, res, next);

    expect(res._isEndCalled()).toBeTruthy();
    expect(res.statusCode).toBe(200);
    expect(res._getData()).toStrictEqual(newTodo);
  });

  it("should handle errors", async () => {
    const errorMessage = { message: "Couldn't update Todo" };
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);

    await updateTodo(req, res, next);

    expect(next).toBeCalledWith(errorMessage);
  });

  it("should return 404 if there's no body for the Todo", async () => {
    TodoModel.findByIdAndUpdate.mockReturnValue(null);

    await updateTodo(req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res._isEndCalled()).toBeTruthy();
  });
});
