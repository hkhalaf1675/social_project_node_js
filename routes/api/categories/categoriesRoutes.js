const express = require("express");
const { validation } = require("../../../services/validation");
const { adminAuth, userAuth } = require("../../../middlewares/checkAuth");
const categoriesMiddleware = require('../../../middlewares/categoriesMiddleware');
const router = express.Router();

// enum:Movies,Tv shows,Video games,Books
router.post('/create',
    adminAuth,
    validation({name:'required', sectionId: 'required|exist:Section'}),
    categoriesMiddleware.create
);

router.put('/update/:id',
    adminAuth,
    validation({sectionId: 'exist:Section'}),
    validation({id: 'required|exist:Category'}, true),
    categoriesMiddleware.update
);

router.delete('/delete/:id',
    adminAuth,
    validation({id: 'required|exist:Category'}, true),
    categoriesMiddleware.remove
);

router.get('/',
    categoriesMiddleware.get
);

module.exports = router;