import { TodoModel } from "../mongooseModelFunctions/todoModel.js";

export function todoController() {}

export async function createTodo(req, res, next) {
  try {
    const createdTodo = await TodoModel.create(req.body);
    res.status(201).send(createdTodo);
  } catch (error) {
    next(error);
  }
}
