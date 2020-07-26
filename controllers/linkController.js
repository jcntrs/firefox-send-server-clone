const Links = require('../models/Links');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.createLink = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { originalName } = req.body;
    const link = new Links();

    link.url = shortid.generate();
    link.name = shortid.generate();
    link.originalName = originalName;

    if (req.user) {
        const { password, downloads } = req.body;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            link.password = await bcrypt.hash(password, salt);
        }
        if (downloads) {
            link.downloads = downloads
        }

        link.author = req.user.id
    }

    try {
        await link.save();
        res.status(201).json({ msg: link.url });
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: 'Hubo un error.' });
    }
}