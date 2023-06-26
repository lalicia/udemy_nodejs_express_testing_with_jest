// needed to give access to jest.fn
import jest from "jest-mock";
import httpMocks from "node-mocks-http";
import {
  getTodos,
  createTodo,
  getTodoByID,
} from "../../controllers/todoController.js";
import { TodoModel } from "../../mongooseModelFunctions/todoModel.js";
import * as newTodo from "../mockData/newTodo.json";
import * as allTodos from "../mockData/allTodos.json";
import * as todoID from "../mockData/todoID.json";

// create a mock on a function on the TodoModel method; mongoose has different methods - create, delete, etc - mongoose handles this
// create mock implementation using jest.fn which spies on function to see if it's being called
TodoModel.create = jest.fn();
TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();

let req, res, next;
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
    req.params.todoId = "64958bbf077b9e54cf051217";
    await getTodoByID(req, res, next);
    expect(TodoModel.findById).toBeCalledWith("64958bbf077b9e54cf051217");
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
