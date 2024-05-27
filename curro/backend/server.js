const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const Tesseract = require('tesseract.js');
const cors = require('cors'); // Importa cors
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(cors()); // Habilita CORS

app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    // Preprocesar la imagen
    const processedImage = await sharp(req.file.path)
      .grayscale()
      .linear(2, -128)
      .threshold()
      .toBuffer();

    // Realizar OCR en la imagen procesada
    const result = await Tesseract.recognize(
      processedImage,
      'spa',
      { logger: m => console.log(m) }
    );

    // Enviar el texto reconocido como respuesta
    res.status(200).send(result.data.text);
  } catch (error) {
    console.error(error);
    res.status(500).send('Hubo un error al procesar la imagen');
  }
});

app.listen(3001, () => {
  console.log('Servidor corriendo en http://localhost:3001');
});
