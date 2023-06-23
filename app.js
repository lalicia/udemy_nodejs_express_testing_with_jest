import express from "express";
import { router } from "./routes/todoRoutes.js";
import { connect } from "./mongodb/mongodbConnect.js";

export const app = express();
connect();

//middlewear to prevent empty bodies being passed when using json data
app.use(express.json());

app.use("/todos", router);

//middleware for error handling on integration test
app.use((error, req, res, next) => {
  //console.log(error);
  res.status(500).json({ message: error.message });
});

app.get("/", (req, res) => {
  res.json("Yo homie");
});
