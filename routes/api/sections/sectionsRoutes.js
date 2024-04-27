const express = require("express");
const { validation } = require("../../../services/validation");
const { adminAuth, userAuth } = require("../../../middlewares/checkAuth");
const sectionsMiddleware = require('../../../middlewares/sectionsMiddleware');
const router = express.Router();


router.get('/',
    sectionsMiddleware.get
);


module.exports = router;