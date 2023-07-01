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
const putTodo = { title: "Make integration test for PUT", done: true };

//got GET by ID we're dealing with a live db, so how to we get a specific one? Here we declare a variable and then in our GET test we can set the first value as the variable
let firstTodo, newTodoId;

const endpointUrl = "/todos/";

describe(endpointUrl, () => {
  // test and it are the same/interchangeable - just use the best for reading for you
  // GET TESTS
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

  // POST TESTS
  it(
    "POST" + endpointUrl,
    async () => {
      const response = await request(app).post(endpointUrl).send(newTodo);

      expect(response.statusCode).toBe(201);
      expect(response.body.title).toBe(newTodo.title);
      expect(response.body.done).toBe(newTodo.done);
      //creating variable for testing the PUT
      newTodoId = response.body._id;
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

  // PUT TESTS
  it("PUT" + endpointUrl, async () => {
    //data to send is declared in global scope as testData

    //going to use the newly created todo from the POST (where we set newTodoId)
    const res = await request(app)
      .put(endpointUrl + newTodoId)
      .send(putTodo);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(putTodo.title);
    expect(res.body.done).toBe(putTodo.done);
  });

  it("should return error 404 when no body to PUT" + endpointUrl, async () => {
    const response = await request(app).put(endpointUrl).send();

    expect(response.statusCode).toBe(404);
  });

  it("PUT should return 404 when ID doesn't exist" + endpointUrl, async () => {
    //data to send
    const testData = { title: "Test it doesn't put this", done: true };
    // needs to be an ID that doesn't exist but in correct format, otherwise mongoose will identify it's not a valid ID and will throw a 500 error instead of 404
    const response = await request(app)
      .put(endpointUrl + "6435a3f4510949223f5a0805")
      .send(testData);

    expect(response.statusCode).toBe(404);
  });

  // DELETE TESTS
  test("DELETE by ID" + endpointUrl, async () => {
    // use the newTodoId as previous
    const response = await request(app)
      .delete(endpointUrl + newTodoId)
      .send();
    //not quite sure why the body.title and body.done work...would have thought needed to pass putTodo in but hey

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(putTodo.title);
    expect(response.body.done).toBe(putTodo.done);
  });

  test("DELETE ID doesn't exist returns 404" + endpointUrl, async () => {
    // needs to be an ID that doesn't exist but in correct format, otherwise mongoose will identify it's not a valid ID and will throw a 500 error instead of 404
    const response = await request(app).delete(
      endpointUrl + "6435a3f4510949223f5a0805"
    );

    expect(response.statusCode).toBe(404);
  });
});
