const { check } = require("express-validator");

const validateOrder = [check("price").isInt({ min: 0 }).withMessage("The price must be a positive integer."), check("date").isDate().withMessage("The date must be in the format 'AAAA-MM-DD'."), check("user_id").isInt({ min: 0 }).withMessage("The user_id must be a positive integer")];

module.exports = validateOrder;
