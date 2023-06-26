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

export async function getTodos(req, res, next) {
  try {
    const allTodos = await TodoModel.find({});
    res.status(200).send(allTodos);
  } catch (error) {
    next(error);
  }
}

export async function getTodoByID(req, res, next) {
  try {
    const todoID = await TodoModel.findById(req.params.todoId);
    res.status(200).send(todoID);
  } catch (error) {
    next(error);
  }
}
