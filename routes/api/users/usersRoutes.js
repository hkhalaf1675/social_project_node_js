const express = require("express");
const multer = require('multer');
const { validation } = require("../../../services/validation");
const { adminAuth, userAuth } = require("../../../middlewares/checkAuth");
const usersMiddleware = require('../../../middlewares/usersMiddleware');
const router = express.Router();

router.post('/create',
    adminAuth,
    validation({username:'required',password:'required|complex',email:'required|email|unique:User,email', firstName: 'required', lastName: 'required', phoneNumber: 'required|unique:User,phoneNumber', role: 'required|enum:admin,user', isActive: 'required|boolean'}),
    usersMiddleware.create
);

router.put('/:id/update',
    userAuth,
    validation({password:'complex',email:'email'}),
    validation({id: 'required|exist:User'}, true),
    usersMiddleware.update
);

router.put('/:id/activate',
    adminAuth,
    validation({id: 'required|exist:User'}, true),
    usersMiddleware.activateUser
);

router.put('/:id/block',
    adminAuth,
    validation({id: 'required|exist:User'}, true),
    usersMiddleware.blockUser
);

router.get('/',
    adminAuth,
    validation({active: 'enum:0,1'}, false, true),
    usersMiddleware.get
);

const upload = multer({dest: 'uploads/'});
router.put('/:id/change-profile-picture', 
    userAuth,
    validation({id: 'required|exist:User'}, true),
    upload.single('profilePicture'),
    usersMiddleware.changeProfilePicture
);

module.exports = router;