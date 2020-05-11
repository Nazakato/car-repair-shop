const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now().toString() + '_' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  console.log(file)
  if (file.mimetype === 'application/x-msdownload' || file.mimetype === 'text/javascript') {
    cb(new Error('Dangerous file type.'), false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 },
  fileFilter: fileFilter
});

module.exports = upload.single('orderAttachment');