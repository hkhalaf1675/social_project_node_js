const express = require("express");
const { validation } = require("../../../services/validation");
const { userAuth } = require("../../../middlewares/checkAuth");
const postsMiddleware = require('../../../middlewares/postsMiddleware');
const router = express.Router();

// const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: function (req, file, callback){
//         callback(null, destinationDir);
//     },

//     filename: function(req, file, callback){
//         callback(null, new Date().toISOString().replace(/:/g, '_') + '_' + file.originalname);
//     }
// });

// const upload = multer({ storage });

router.post('/create',
    userAuth,
    validation({title:'required', description: 'required', categoryId: 'required|exist:Category', image: 'required'}),
    // upload.single('image'),
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

router.post('/save-post/:postId',
    userAuth,
    validation({postId: 'required|exist:Post'}, true),
    postsMiddleware.savePost
);

router.delete('/unsave-post/:postId',
    userAuth,
    validation({postId: 'required|exist:Post'}, true),
    postsMiddleware.removePostFromSaved
);

router.get('/saved-posts',
    userAuth,
    postsMiddleware.getCurrentUserSavedPosts
);

module.exports = router;