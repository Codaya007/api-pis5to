const multer = require("multer");
const upload = multer({ dest: "upload/" });
const fs = require("node:fs");

exports.upload = upload.single("Photo");
exports.uploadFile = (req, res) => {
  saveImage(req.file);
  res.send({ data: "photo saved" });
};

const saveImage = (file) => {
  const newPath = `upload/${file.originalname}`;
  fs.renameSync(file.path, newPath);
  return newPath;
};
