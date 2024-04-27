const express = require("express");
const { validation } = require("../../../services/validation");
const { userAuth } = require("../../../middlewares/checkAuth");
const commentsMiddleware = require('../../../middlewares/commentsMiddleware');
const router = express.Router();

router.post('/create',
    userAuth,
    validation({comment_text:'required', postId: 'required|exist:Post'}),
    commentsMiddleware.create
);

router.put('/update/:id',
    userAuth,
    validation({comment_text: 'required'}),
    validation({id: 'required|exist:Comment'}, true),
    commentsMiddleware.update
);

router.delete('/delete/:id',
    userAuth,
    validation({id: 'required|exist:Comment'}, true),
    commentsMiddleware.remove
);

router.get('/',
    validation({postId: 'required|exist:Post'}, false, true),
    commentsMiddleware.get
);

module.exports = router;