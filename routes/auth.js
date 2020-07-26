const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

router.post('/',
    [
        check('email', 'Email no válido').isEmail(),
        check('password', 'Contraseña no válida').not().isEmpty()
    ],
    authController.authenticateUser
);

router.get('/',
    auth,
    authController.getAuthenticatedUser
);

module.exports = router;