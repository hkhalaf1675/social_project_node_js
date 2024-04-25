const express = require("express");
const { validation } = require("../../../services/validation");
const { login } = require("../../../middlewares/authMiddleware");
const router = express.Router();

router.post('/login',
    validation({password:'required',email:'required|email'}),
    login
);

module.exports = router;