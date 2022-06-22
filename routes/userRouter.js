require("dotenv").config();
const express = require("express");
const userRouter = express.Router();
userRouter.use(express.json());
// const db = require("../database/client");
const { Pool } = require("pg");
const pool = new Pool();
const { validationResult } = require("express-validator");
const validateUser = require("../validators/validateUsers");

// 1.Get all:
userRouter.get("/", (req, res) => {
  pool
    .query("SELECT * FROM users ORDER BY id ASC")
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
userRouter.post("/", validateUser, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
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
    .catch((error) => res.sendStatus(500).send(e.message));
});

// 4. Update one (put):
userRouter.put("/:id", validateUser, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { id } = req.params;
  const { first_name, last_name, age, active } = req.body;
  const updateUser = {
    text: `UPDATE users
            SET first_name = $1,
                last_name = $2,
                age = $3,
                active = $4
           WHERE id = $5
           RETURNING *`,
    values: [first_name, last_name, age, active, id],
  };
  pool
    .query(updateUser)
    .then((data) => res.json(data.rows))
    .catch((error) => res.sendStatus(500));
});

// 5.Delete one:
userRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  const deleteUser = {
    text: `DELETE FROM orders
            WHERE id = $1
            RETURNING *`,
    values: [id],
  };
  pool
    .query(deleteUser)
    .then((data) => {
      // if (!data.rows.length) {
      //   return res.status(404).send("This order wasn't found");
      // }
      res.status(204).json(data.rows);
    })
    .catch((error) => res.sendStatus(500));
});

module.exports = userRouter;
