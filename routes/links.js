const express = require('express');
const router = express.Router();
const linkController = require('../controllers/linkController');
const fileController = require('../controllers/fileController');
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

router.get('/:url',
    linkController.getLink,
    fileController.deleteFile
);

module.exports = router;