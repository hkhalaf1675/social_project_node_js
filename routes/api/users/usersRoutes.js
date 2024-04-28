const express = require("express");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { validation } = require("../../../services/validation");
const { adminAuth, userAuth } = require("../../../middlewares/checkAuth");
const usersMiddleware = require('../../../middlewares/usersMiddleware');
const router = express.Router();

router.post('/create',
    adminAuth,
    validation({username:'required',password:'required',email:'required|email|unique:User,email', firstName: 'required', lastName: 'required', phoneNumber: 'unique:User,phoneNumber', role: 'required|enum:admin,user', isActive: 'required|boolean'}),
    usersMiddleware.create
);

router.put('/update/:id',
    userAuth,
    validation({email:'email'}),
    validation({id: 'required|exist:User'}, true),
    usersMiddleware.update
);

router.put('/activate/:id',
    adminAuth,
    validation({id: 'required|exist:User'}, true),
    usersMiddleware.activateUser
);

router.put('/block/:id',
    adminAuth,
    validation({id: 'required|exist:User'}, true),
    usersMiddleware.blockUser
);

router.put('/toggle-activation/:id',
    adminAuth,
    validation({id: 'required|exist:User'}, true),
    usersMiddleware.toggleActivation
);

router.get('/',
    validation({active: 'enum:0,1'}, false, true),
    usersMiddleware.get
);

router.delete('/delete/:id',
    adminAuth,
    validation({id: 'required|exist:User'}, true),
    usersMiddleware.remove
);

// const destinationDir = path.join(__dirname, "../../../images");
// if(!fs.existsSync(destinationDir)){
//     fs.mkdirSync(destinationDir);
// }

// const storage = multer.diskStorage({
//     destination: function (req, file, callback){
//         callback(null, destinationDir);
//     },

//     filename: function(req, file, callback){
//         callback(null, new Date().toISOString().replace(/:/g, '_') + '_' + file.originalname);
//     }
// });

// const upload = multer({ storage });
// router.put('/change-profile-picture/:id', 
//     userAuth,
//     validation({id: 'required|exist:User'}, true),
//     upload.single('profilePicture'),
//     usersMiddleware.changeProfilePicture
// );

module.exports = router;