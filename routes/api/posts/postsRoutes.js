const express = require("express");
const multer = require('multer');
const { validation } = require("../../../services/validation");
const { userAuth } = require("../../../middlewares/checkAuth");
const postsMiddleware = require('../../../middlewares/postsMiddleware');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, callback){
        callback(null, destinationDir);
    },

    filename: function(req, file, callback){
        callback(null, new Date().toISOString().replace(/:/g, '_') + '_' + file.originalname);
    }
});

const upload = multer({ storage });
router.post('/create',
    userAuth,
    validation({title:'required', description: 'required', categoryId: 'required|exist:Category'}),
    upload.single('image'),
    postsMiddleware.create
);

router.put('/:id/update',
    userAuth,
    validation({categoryId: 'exist:Category'}),
    validation({id: 'required|exist:Post'}, true),
    postsMiddleware.update
);

router.delete('/:id/delete',
    userAuth,
    validation({id: 'required|exist:Post'}, true),
    postsMiddleware.remove
);

router.get('/',
    postsMiddleware.get
);

router.get('/:userId',
    validation({userId: 'required|exist:User'}, true),
    postsMiddleware.get
);

module.exports = router;