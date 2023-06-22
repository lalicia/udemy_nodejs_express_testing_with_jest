import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json("Yo homie");
});

app.post("/todos/", (req, res) => {
  res.json("Posted");
});

export default app;
