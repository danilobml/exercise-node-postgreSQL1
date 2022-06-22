require("dotenv").config();
const express = require("express");
const orderRouter = express.Router();
orderRouter.use(express.json());
const db = require("../database/client");
const { validationResult } = require("express-validator");
const validateOrder = require("../validators/validateOrders");

// 1.get all:
orderRouter.get("/", (req, res) => {
  db.query("SELECT * from orders ORDER BY id ASC")
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
  db.query(getOneOrder)
    .then((data) => res.json(data.rows))
    .catch((error) => res.sendStatus(500));
});

// 3. Create new (post):
orderRouter.post("/", validateOrder, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { price, date, user_id } = req.body;
  const createOneOrder = {
    text: `INSERT INTO orders
              (price, date, user_id)
              VALUES ($1, $2, $3)
              RETURNING *`,
    values: [price, date, user_id],
  };
  db.query(createOneOrder)
    .then((data) => res.sendStatus(201).json(data.rows))
    .catch((error) => res.sendStatus(500));
});

// 4. Update one (put):
orderRouter.put("/:id", validateOrder, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { id } = req.params;
  const { price, date, user_id } = req.body;
  const updateOrder = {
    text: `UPDATE orders
            SET price = $1,
            date = $2,
            user_id = $3
           WHERE id = $4
           RETURNING *`,
    values: [price, date, user_id, id],
  };
  db.query(updateOrder)
    .then((data) => res.json(data.rows))
    .catch((error) => res.sendStatus(500));
});

// 5.Delete one:
orderRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  const deleteOrder = {
    text: `DELETE FROM orders
            WHERE id = $1
            RETURNING *`,
    values: [id],
  };
  db.query(deleteOrder)
    .then((data) => {
      // if (!data.rows.length) {
      //   return res.status(404).send("This order wasn't found");
      // }
      res.status(204).json(data.rows);
    })
    .catch((error) => res.sendStatus(500));
});

module.exports = orderRouter;
