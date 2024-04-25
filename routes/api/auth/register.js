const express = require("express");
const { register } = require("../../../middlewares/authMiddleware");
const { validation } = require("../../../services/validation");
const router = express.Router();

router.post('/register',
    validation({username:'required',password:'required|complex',email:'required|email|unique:User,email', firstName: 'required', lastName: 'required', phoneNumber: 'required|unique:User,phoneNumber'}),
    register
);

module.exports = router;