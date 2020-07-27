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
        console.log(req.file)
        if (!error) {
            res.status(200).json({ file: req.file.filename });
        } else {
            res.status(400).json({ error });
        }
    })
}

exports.deleteFile = async (req, res) => {
    try {
        fs.unlinkSync(__dirname + `/../uploads/${req.filename}`);
        res.status(200).json({ msg: 'Archivo eliminado.' });
    } catch (error) {
        res.status(400).json({ msg: 'No es posible eliminar el archivo solicitado.', error });
    }
}