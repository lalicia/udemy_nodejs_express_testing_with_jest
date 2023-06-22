import { TodoModel } from "../mongooseModelFunctions/todoModel";

export function todoController() {}

export function createTodo(req, res, next) {
  const createdTodo = TodoModel.create(req.body);
  res.status(201).send(createdTodo);
}
