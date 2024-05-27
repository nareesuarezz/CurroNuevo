import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

function App() {
  const [dni, setDni] = useState(null);
  const [preview, setPreview] = useState(null);


  
  const scanDni = async (image) => {
    const result = await Tesseract.recognize(
      image,
      'spa',
      { logger: m => console.log(m) }
    );
    setDni(result.data.text);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    scanDni(file);
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      {preview && <img src={preview} alt="Preview" style={{width: '400px', height: '400px'}} />}
      {dni && <p>{dni}</p>}
    </div>
  );
}

export default App;