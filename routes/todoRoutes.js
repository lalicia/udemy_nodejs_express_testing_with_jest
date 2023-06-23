import express from "express";
import { createTodo } from "../controllers/todoController.js";

export const router = express.Router();

router.post("/", createTodo);
