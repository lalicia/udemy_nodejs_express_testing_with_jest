import request from "supertest";
import { app } from "../../app.js";

//the json doesn't work, it's not being handed correctly and therefore the required parts of the schema weren't being recognised. Will also be why has problems with JSON test in unit. Created as object and passed integration test a-ok and appears in db correctly
// import * as newTodo from "../mockData/newTodo.json";
// console.log("this is new todo", newTodo);

const newTodo = { title: "Make first unit test", done: false };
const allTodos = [
  {
    title: "First response for test",
    done: false,
  },
  {
    title: "Second response for test",
    done: false,
  },
];

//got GET by ID we're dealing with a live db, so how to we get a specific one? Here we declare a variable and then in our GET test we can set the first value as the variable
let firstTodo;

const endpointUrl = "/todos/";

describe(endpointUrl, () => {
  // test and it are the same/interchangeable - just use the best for reading for you
  test("GET" + endpointUrl, async () => {
    const response = await request(app).get(endpointUrl).send(allTodos);

    expect(response.statusCode).toBe(200);
    // cannot do typeof with array
    //expect(typeof response.body).toBe("array");
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].title).toBeDefined();
    expect(response.body[0].done).toBeDefined();
    // setting variable for GET by ID
    firstTodo = response.body[0];
  });

  test("GET by ID" + endpointUrl, async () => {
    // uses firstTodo which we set in the GET request
    const response = await request(app).get(endpointUrl + firstTodo._id);

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(firstTodo.title);
    expect(response.body.done).toBe(firstTodo.done);
  });

  test("GET todo by ID doesn't exist" + endpointUrl, async () => {
    // needs to be an ID that doesn't exist but in correct format, otherwise mongoose will identify it's not a valid ID and will throw a 500 error instead of 404
    const response = await request(app).get(
      endpointUrl + "6435a3f4510949223f5a0805"
    );

    expect(response.statusCode).toBe(404);
  });

  it(
    "POST" + endpointUrl,
    async () => {
      const response = await request(app).post(endpointUrl).send(newTodo);

      expect(response.statusCode).toBe(201);
      expect(response.body.title).toBe(newTodo.title);
      expect(response.body.done).toBe(newTodo.done);
    },
    15000
  );

  it(
    "should return error 500 on malformed data with POST" + endpointUrl,
    async () => {
      const response = await request(app)
        .post(endpointUrl)
        .send({ title: "This has no done so it won't work" });

      expect(response.statusCode).toBe(500);
      expect(response.body).toStrictEqual({
        message: "Todo validation failed: done: Path `done` is required.",
      });
    }
  );
});
