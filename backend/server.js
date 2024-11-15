const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const UsersModel = require("./module/Users");

dotenv.config();

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === "production") {
  const staticPath = path.resolve(__dirname, "../frontend/build");
  app.use(express.static(staticPath));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(staticPath, "index.html"));
  });
}

mongoose.connect(process.env.MONGO_URI);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log("Server Running at http://localhost:3001");
});

app.get("/", async (req, res) => {
  res.json("Hello");
});

app.get("/api/todos", async (req, res) => {
  try {
    const todos = await UsersModel.find();
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error.message);
    res.status(500).json({ error: "Error Fetching Todos" });
  }
});

app.post("/api/todos", async (req, res) => {
  const { text } = req.body;
  const newTodo = new UsersModel({
    text,
    isChecked: false,
  });

  try {
    const saveTodo = await newTodo.save();
    res.json(saveTodo);
  } catch (error) {
    console.error("Error saving todo:", error.message);
    res.status(500).json({ error: "Error Saving Todo" });
  }
});

app.put("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { isChecked, text } = req.body;

  const updateFields = {};
  if (isChecked !== undefined) updateFields.isChecked = isChecked;
  if (text) updateFields.text = text;

  try {
    const todo = await UsersModel.findByIdAndUpdate(id, updateFields, {
      new: true,
    });
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
    console.error("Error updating todo:", error.message);
    res.status(500).send("Server error");
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  const todoId = req.params.id;
  try {
    const deletedTodo = await UsersModel.findByIdAndDelete(todoId);
    if (!deletedTodo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo Deleted Successfully" });
  } catch (error) {
    console.error("Error deleting todo:", error.message);
    res.status(500).json({ error: "Error Deleting Todo" });
  }
});

// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// const dotenv = require("dotenv");
// const UsersModel = require("./module/Users");
// dotenv.config();

// app.use(express.json());
// app.use(cors());

// mongoose.connect(process.env.MONGO_URI);

// const PORT = process.env.PORT || 3001;

// app.listen(PORT, () => {
//   console.log("Server Running at http://localhost:3001");
// });

// app.get("/", async (req, res) => {
//   res.json("Hello");
// });

// app.get("/api/todos", async (req, res) => {
//   try {
//     const todos = await UsersModel.find();
//     res.json(todos);
//   } catch (error) {
//     res.status(500).json({ error: "Error Fetching Todos" });
//   }
// });

// app.post("/api/todos", async (req, res) => {
//   const { text } = req.body;
//   const newTodo = new UsersModel({
//     text,
//     isChecked: false,
//   });

//   try {
//     const saveTodo = await newTodo.save();
//     res.json(saveTodo);
//   } catch (error) {
//     res.status(500).json({ error: "Error Saving Todo" });
//   }
// });

// // Update todo (toggle isChecked)
// app.put("/api/todos/:id", async (req, res) => {
//   const { id } = req.params;
//   const { isChecked, text } = req.body; // Make sure you also send `isChecked`

//   try {
//     const todo = await Todo.findByIdAndUpdate(
//       id,
//       { isChecked, text }, // Update isChecked and optionally the text
//       { new: true } // Return the updated todo
//     );
//     res.json(todo);
//   } catch (error) {
//     console.error("Error updating todo:", error);
//     res.status(500).send("Server error");
//   }
// });

// app.delete("/api/todos/:id", async (req, res) => {
//   const todoId = req.params.id;
//   try {
//     await UsersModel.findByIdAndDelete(todoId);
//     res.json({ message: "Todo Deleted Successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Error Deleting Todo" });
//   }
// });
