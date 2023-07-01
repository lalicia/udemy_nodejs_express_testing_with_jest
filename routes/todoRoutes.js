import express from "express";
import {
  createTodo,
  getTodos,
  getTodoByID,
  updateTodo,
} from "../controllers/todoController.js";

export const router = express.Router();

router.post("/", createTodo);

router.get("/", getTodos);

router.get("/:todoId", getTodoByID);

router.put("/:todoId", updateTodo);
