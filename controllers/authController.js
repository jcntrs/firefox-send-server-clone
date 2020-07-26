const User = require('../models/User');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: 'var.env' });

exports.authenticateUser = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(401).json({ msg: 'El usuario no existe' });
        return next();
    }

    if (!bcrypt.compareSync(password, user.password)) {
        res.status(401).json({ msg: 'Contraseña incorrecta' });
        return next();
    }

    const token = jwt.sign({
        userID: user._id,
        name: user.name,
        email: user.email
    }, process.env.SECRET, { expiresIn: '8h' });

    res.status(200).json({ token });

}

exports.getAuthenticatedUser = (req, res) => {
    res.status(200).json({ user: req.user });
}