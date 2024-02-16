const multer = require("multer");
const upload = multer({ dest: "upload/" });
const fs = require("node:fs");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  uploadFile: async (req, res) => {
    const host = req.headers.host;

    upload.single("image")(req, res, (error) => {
      if (!req.file) {
        return res.status(400).json({ msg: "El campo image es requerido" });
      }

      let { success: result, url } = saveImage(req.file);

      if (!result) {
        res.status(400).json({
          msg: "Formato no aceptado, solo se apcepta jpg, jpeg, png",
        });
      } else {
        res.status(200).json({
          msg: "Imagen guardada exitosamente",
          results: { url },
        });
      }
    });
  },
};

const saveImage = (file) => {
  const extension = obtenerExtension(file.originalname);
  if (extension == "jpg" || extension == "jpeg" || extension == "png") {
    const id = uuidv4();
    const newPath = `upload/${id}.${extension}`;

    fs.renameSync(file.path, newPath);

    return { success: true, url: `${id}.${extension}` };
  } else {
    return { success: false };
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
