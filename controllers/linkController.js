const Links = require('../models/Links');
const shortid = require('shortid');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

exports.createLink = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { originalName, name } = req.body;
    const link = new Links();

    link.url = shortid.generate();
    link.name = name;
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
        res.status(500).json({ msg: 'Hubo un error.' });
    }
}

exports.getAllLinks = async (req, res) => {
    try {
        const links = await Links.find({}).select('url -_id');
        res.status(200).json({ links });
    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error.' });
    }
}

exports.verifyPassword = async (req, res, next) => {
    const { url } = req.params;
    const link = await Links.findOne({ url });

    if (!link) {
        return res.status(404).json({ msg: 'Enlace no existe' });
    }

    if (link.password) {
        return res.json({ password: true, url: link.url, file: link.name });
    }

    next();
}

exports.getLink = async (req, res) => {
    const { url } = req.params;
    const link = await Links.findOne({ url });

    if (!link) {
        return res.status(404).json({ msg: 'Enlace no existe' });
    }

    res.status(200).json({ file: link.name, password: false });
}

exports.checkPassword = async (req, res, next) => {
    const { url } = req.params;
    const { password } = req.body;

    const link = await Links.findOne({ url });

    if (bcrypt.compareSync(password, link.password)) {
        next();
    } else {
        return res.status(404).json({ msg: 'Contraseña incorrecta.' });
    }

}
