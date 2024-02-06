const multer = require("multer");
const upload = multer({ dest: "upload/" });
const fs = require("node:fs");

module.exports = {
  uploadFile: async (req, res) => {
    upload.single("Photo")(req, res, (error) => {
      let result = saveImage(req.file);
      if (!result) {
        res.status(400).send({
          data: "Formato no aceptado, solo se apcepta jpg, jpeg, png",
        });
      } else {
        res
          .status(200)
          .send({ data: "photo saved", nombre: req.file.originalname });
      }
    });
  },
};

const saveImage = (file) => {
  const extension = obtenerExtension(file.originalname);
  if (extension == "jpg" || extension == "jpeg" || extension == "png") {
    const newPath = `upload/${file.originalname}`;
    console.log(file.originalname);
    fs.renameSync(file.path, newPath);
    return true;
  } else {
    return false;
  }
};

function obtenerExtension(nombreArchivo) {
  // Obtener la última posición del punto en el nombre del archivo
  const ultimoPuntoIndex = nombreArchivo.lastIndexOf(".");

  // Verificar si se encontró un punto y si no es el último carácter en la cadena
  if (ultimoPuntoIndex !== -1 && ultimoPuntoIndex < nombreArchivo.length - 1) {
    // Obtener la subcadena que sigue al último punto
    const extension = nombreArchivo.substring(ultimoPuntoIndex + 1);
    return extension;
  }

  // Si no se encontró un punto o es el último carácter, retornar null o un valor predeterminado
  return null; // O puedes retornar un valor predeterminado como "desconocido" o similar
}
