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

router.put('/update/:id',
    userAuth,
    validation({categoryId: 'exist:Category'}),
    validation({id: 'required|exist:Post'}, true),
    postsMiddleware.update
);

router.delete('/delete/:id',
    userAuth,
    validation({id: 'required|exist:Post'}, true),
    postsMiddleware.remove
);

router.get('/',
    postsMiddleware.get
);

router.get('/current-user',
    userAuth,
    postsMiddleware.getCurrentUserPosts
);

router.post('/like-post/:postId',
    userAuth,
    validation({postId: 'required|exist:Post'}, true),
    postsMiddleware.likePost
);

router.post('/dislike-post/:postId',
    userAuth,
    validation({postId: 'required|exist:Post'}, true),
    postsMiddleware.disLikePost
);

module.exports = router;