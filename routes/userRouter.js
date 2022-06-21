require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const pool = new Pool();
const userRouter = express.Router();
userRouter.use(express.json());

// 1.Get all:
userRouter.get("/", (req, res) => {
  pool
    .query("SELECT * FROM users")
    .then((data) => res.json(data.rows))
    .catch((error) => res.sendStatus(500));
});

// 2.Get one
userRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const getOneUser = {
    text: `SELECT * FROM users 
            WHERE id = $1`,
    values: [id],
  };
  pool
    .query(getOneUser)
    .then((data) => res.json(data.rows))
    .catch((error) => res.sendStatus(500));
});

// 3.Create (post):
userRouter.post("/", (req, res) => {
  const { first_name, last_name, age, active } = req.body;
  const createOne = {
    text: `INSERT INTO users 
            (first_name, last_name, age, active)
            VALUES ($1, $2, $3, $4) 
            RETURNING *`,
    values: [first_name, last_name, age, active],
  };
  pool
    .query(createOne)
    .then((data) => res.status(201).json(data.rows))
    .catch((error) => res.sendStatus(500));
});

module.exports = userRouter;
