const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const auth = require('../middleware/auth');

router.post('/',
    auth,
    fileController.uploadFile
);

module.exports = router;