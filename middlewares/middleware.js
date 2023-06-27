const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  try {
    next();
  } catch (error) {
    return res.status(400).json({ errorMessage: '' });
  }
};




