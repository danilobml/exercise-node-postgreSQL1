const { check } = require("express-validator");

const validateUser = [check("first_name").isLength({ min: 2 }).withMessage("The first name must have at least 2 letters."), check("last_name").isLength({ min: 2 }).withMessage("The last name must have at least 2 letters."), check("age").isInt({ min: 0 }).withMessage("The age must be a positive integer."), check("active").isBoolean().withMessage("The active field must be true or false.")];

module.exports = validateUser;
