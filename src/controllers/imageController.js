const multer = require("multer");
const upload = multer({ dest: "upload/" });
const fs = require("node:fs");

module.exports = {
  uploadFile: async (req, res) => {
    upload.single("Photo")(req, res, (error) => {
      saveImage(req.file);
      res.send({ data: "photo saved" });
    });
  },
};

const saveImage = (file) => {
  const newPath = `upload/${file.originalname}`;
  fs.renameSync(file.path, newPath);
  return newPath;
};
