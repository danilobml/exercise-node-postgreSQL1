require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const pool = new Pool();
const orderRouter = express.Router();
orderRouter.use(express.json());

// 1.get all:
orderRouter.get("/", (req, res) => {
  pool
    .query("SELECT * from orders")
    .then((data) => res.json(data.rows))
    .catch((error) => res.sendStatus(500));
});

// 2.Get one:
orderRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  const getOneOrder = {
    text: `SELECT * from orders 
            WHERE id = $1`,
    values: [id],
  };
  pool
    .query(getOneOrder)
    .then((data) => res.json(data.rows))
    .catch((error) => res.sendStatus(500));
});

// 3. Create new (post):
orderRouter.post("/", (req, res) => {
  const { price, date, user_id } = req.body;
  console.log(req.body);
  const createOneOrder = {
    text: `INSERT INTO orders
              (price, date, user_id)
              VALUES ($1, $2, $3)
              RETURNING *`,
    values: [price, date, user_id],
  };
  pool
    .query(createOneOrder)
    .then((data) => res.sendStatus(201).json(data.rows))
    .catch((error) => res.sendStatus(500));
});

module.exports = orderRouter;
