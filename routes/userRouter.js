require("dotenv").config();
const express = require("express");
const userRouter = express.Router();
userRouter.use(express.json());
const db = require("../database/client");
const { validationResult } = require("express-validator");
const validateUser = require("../validators/validateUsers");

// 1.Get all:
userRouter.get("/", (req, res) => {
  db.query("SELECT * FROM users ORDER BY id ASC")
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
  db.query(getOneUser)
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
  db.query(createOne)
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
  db.query(updateUser)
    .then((data) => res.json(data.rows))
    .catch((error) => res.sendStatus(500));
});

// 5.Delete one:
userRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  const deleteUser = {
    text: `DELETE FROM users
            WHERE id = $1
            RETURNING *`,
    values: [id],
  };
  db.query(deleteUser)
    .then((data) => {
      // if (!data.rows.length) {
      //   return res.status(404).send("This order wasn't found");
      // }
      res.status(204).json(data.rows);
    })
    .catch((error) => res.sendStatus(500));
});

// Bonus: get all orders linked to a specific user
userRouter.get("/:id/orders", (req, res) => {
  const { id } = req.params;
  const getUserOrders = {
    text: `SELECT
          first_name,
          last_name,
          orders.id,
          price, 
          date
          FROM
          users
          INNER JOIN orders
           ON user_id = users.id
          WHERE users.id = $1;`,
    values: [id],
  };
  db.query(getUserOrders)
    .then((data) => {
      if (!data.rows.length) {
        return res.status(404).send("User not found");
      }
      res.json(data.rows);
    })
    .catch((error) => res.status(500).send(error.message));
});

//Bonus: set a user as inactive if they have never ordered anything
userRouter.put("/:id/check-inactive", (req, res) => {
  const { id } = req.params;
  const checkInactive = {
    text: `SELECT first_name, last_name, COUNT(user_id) AS order_count 
            FROM users
            LEFT JOIN orders
              ON users.id = orders.user_id
            WHERE users.id = $1
            GROUP BY first_name, last_name
            ;`,
    values: [id],
  };
  db.query(checkInactive)
    .then((data) => {
      console.log(data.rows);
      if (!data.rows.length) {
        return res.status(404).send("Not found");
      }
      if (Number(data.rows[0].order_count) < 1) {
        const setInactive = {
          text: `UPDATE users
                  SET active = false
                  WHERE id = $1
                  RETURNING *`,
          values: [id],
        };
        return db.query(setInactive);
      } else {
        return res.send("The user has already placed one or more orders before.");
      }
    })
    .then((data) => res.json(data.rows))
    .catch((error) => res.status(500).send(error.message));
});

module.exports = userRouter;
