import request from "supertest";
import { app } from "../../app.js";

//the json doesn't work, it's not being handed correctly and therefore the required parts of the schema weren't being recognised. Will also be why has problems with JSON test in unit. Created as object and passed integration test a-ok and appears in db correctly
// import * as newTodo from "../mockData/newTodo.json";
// console.log("this is new todo", newTodo);

const newTodo = { title: "Make first unit test", done: false };

const endpointUrl = "/todos/";

describe(endpointUrl, () => {
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
