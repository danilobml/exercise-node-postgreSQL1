require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
const { Pool } = require("pg");

const pool = new Pool();

app.get("/api/users", (req, res) => {
  pool
    .query("SELECT * FROM users")
    .then((data) => res.json(data.rows))
    .catch((error) => res.sendStatus(500));
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
