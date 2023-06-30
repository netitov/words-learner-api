const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

const uploadFile = [
  upload.single('csvFile'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Missing file (csv)' });
      }
      next();
    } catch (error) {
      res.status(500).json(error);
    }
  },
];

module.exports = uploadFile ;
