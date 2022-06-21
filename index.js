require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
const { Pool } = require("pg");

const pool = new Pool();

// Users:
// 1.Get all:
app.get("/api/users", (req, res) => {
  pool
    .query("SELECT * FROM users")
    .then((data) => res.json(data.rows))
    .catch((error) => res.sendStatus(500));
});

// 2.Get one
app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const getOne = {
    text: "SELECT * FROM users WHERE id = $1",
    values: [id],
  };
  pool
    .query(getOne)
    .then((data) => res.json(data.rows))
    .catch((error) => res.sendStatus(500));
});

// 3.Create (post):
app.post("/api/users", (req, res) => {
  const { first_name, last_name, age, active } = req.body;
  const createOne = {
    text: `INSERT INTO users (first_name, last_name, age, active)
 VALUES ($1, $2, $3, $4) RETURNING *`,
    values: [first_name, last_name, age, active],
  };
  pool
    .query(createOne)
    .then((data) => res.status(201).json(data.rows))
    .catch((error) => res.sendStatus(500));
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
