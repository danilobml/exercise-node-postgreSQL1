require("dotenv").config();
const express = require("express");
const userRouter = express.Router();
app.use(express.json());
const { Pool } = require("pg");

const pool = new Pool();
