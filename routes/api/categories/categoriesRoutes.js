const express = require("express");
const { validation } = require("../../../services/validation");
const { adminAuth, userAuth } = require("../../../middlewares/checkAuth");
const categoriesMiddleware = require('../../../middlewares/categoriesMiddleware');
const router = express.Router();

router.post('/create',
    adminAuth,
    validation({name:'required', section: 'required|enum:Movies,Tv shows,Video games,Books'}),
    categoriesMiddleware.create
);

router.put('/:id/update',
    adminAuth,
    validation({section: 'enum:Movies,Tv shows,Video games,Books'}),
    validation({id: 'required|exist:Category'}, true),
    categoriesMiddleware.update
);

router.delete('/:id/delete',
    adminAuth,
    validation({id: 'required|exist:Category'}, true),
    categoriesMiddleware.remove
);

router.get('/',
    userAuth,
    categoriesMiddleware.get
);

module.exports = router;