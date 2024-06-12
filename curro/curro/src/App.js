import React, { useState } from 'react';

function App() {
  const [dni, setDni] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al procesar la imagen');
    }

    const text = await response.text();

    const dniRegex = /DNI (\d+)/;
    const apellidosRegex = /APELLIDOS - ([^=]+)/;
    const nombreRegex = /NOMBRE — b: ([^ ]+)/;

    const dniMatch = text.match(dniRegex);
    const dni = dniMatch ? dniMatch[1] : 'No encontrado';

    const apellidosMatch = text.match(apellidosRegex);
    const apellidos = apellidosMatch ? apellidosMatch[1] : 'No encontrado';

    const nombreMatch = text.match(nombreRegex);
    const nombre = nombreMatch ? nombreMatch[1] : 'No encontrado';

    setDni(`DNI: ${dni}, Apellidos: ${apellidos}, Nombre: ${nombre}`);
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
