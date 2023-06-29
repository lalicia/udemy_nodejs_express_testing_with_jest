import express from "express";
import {
  createTodo,
  getTodos,
  getTodoByID,
} from "../controllers/todoController.js";

export const router = express.Router();

router.post("/", createTodo);

router.get("/", getTodos);

router.get("/:todoId", getTodoByID);
