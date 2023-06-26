import express from "express";
import { createTodo, getTodos } from "../controllers/todoController.js";

export const router = express.Router();

router.post("/", createTodo);

router.get("/", getTodos);
