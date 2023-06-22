import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    required: true,
  },
});

// we're going to make a collection in our Mongo DB that will be called Todos
export const TodoModel = mongoose.model("Todo", TodoSchema);
