const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

router.post('/',
    [
        check('name', 'Sube un archivo').not().isEmpty(),
        check('originalName', 'Sube un archivo').not().isEmpty()
    ],
    auth,
    linkController.createLink
);

router.post('/:url',
    linkController.checkPassword,
    linkController.getLink
);

router.get('/',
    linkController.getAllLinks
);

router.get('/:url',
    linkController.verifyPassword,
    linkController.getLink
);

module.exports = router;