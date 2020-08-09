const Links = require('../models/Links');
const multer = require('multer');
const shortid = require('shortid');
const fs = require('fs');

exports.uploadFile = async (req, res) => {
    const multerConfig = {
        limits: { fileSize: req.user ? 1024 * 1024 * 10 : 1024 * 1024 }, //1000000
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname + '/../uploads');
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'));
                cb(null, `${shortid.generate()}${extension}`);
            },
            /* fileFilter:() => {
                if (file.mimetype === 'application/pdf') {
                    return cb(null, true);
                }
            } */
        })
    }

    const upload = multer(multerConfig).single('file');

    upload(req, res, error => {
        if (!error) {
            res.status(200).json({ file: req.file.filename });
        } else {
            res.status(400).json({ error });
        }
    })
}

exports.downloadFile = async (req, res, next) => {
    const { file } = req.params;
    const link = await Links.findOne({ name: file });

    const downloadfile = __dirname + '/../uploads/' + file;
    res.download(downloadfile); // Content-Disposition

    const { downloads, name, url } = link;
    if (downloads === 1) {
        req.filename = name;
        await Links.findOneAndRemove({ url });
        next();
    } else {
        link.downloads--;
        await link.save();
    }
}

exports.deleteFile = (req, res) => {
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.filename}`);
    } catch (error) {
        console.log('No es posible eliminar el archivo solicitado.', error);
    }
}