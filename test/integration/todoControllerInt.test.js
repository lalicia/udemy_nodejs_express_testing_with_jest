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
