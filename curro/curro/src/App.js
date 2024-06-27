import React, { useState } from 'react';
import { saveAs } from 'file-saver';

function App() {
  const [dni, setDni] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const createFile = () => {
    if (dni === null) {
      setError('No puedes descargar el archivo si no has subido una imagen');
    } else {
      const blob = new Blob([dni], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, 'dni.txt');
      setError(null);
    }
  }

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
    const text = await response.text(); // Tu texto aquí

    // Convertir el texto a mayúsculas y eliminar caracteres no alfanuméricos
    const cleanedText = text.toUpperCase().replace(/[^A-Z0-9 ]/g, '');

    const words = cleanedText.split(' ');

    const dniIndex = words.indexOf('DNI');
    const dni = dniIndex !== -1 ? words[dniIndex + 1] : 'No encontrado';

    const apellidosIndex = words.indexOf('APELLIDOS');
    const apellidos = apellidosIndex !== -1 ? words[apellidosIndex + 1] + ' ' + words[apellidosIndex + 2] : 'No encontrado';

    const nombreIndex = words.indexOf('NOMBRE');
    const nombre = nombreIndex !== -1 ? words[nombreIndex + 2] : 'No encontrado';

    const validezIndex = words.indexOf('VALIDEZY');
    const validez = validezIndex !== -1 ? words[validezIndex + 5] + ' ' + words[validezIndex + 6] + ' ' + words[validezIndex + 7] : 'No encontrado';

    setDni(`DNI: ${dni}\nApellidos: ${apellidos}\nNombre: ${nombre}\nValidez: ${validez}`);
    console.log('Texto limpio:', cleanedText);
    console.log('Índice de DNI:', dniIndex);
    console.log('Índice de APELLIDOS:', apellidosIndex);
    console.log('Índice de NOMBRE:', nombreIndex);
    console.log('Índice de VALIDEZ:', validezIndex);
  }

  return (
    <div>
      {/* {console.log(dni)} */}
      <input type="file" onChange={handleImageUpload} />
      {preview && <img src={preview} alt="Preview" style={{ width: '400px', height: '400px' }} />}
      {dni && <pre>{dni}</pre>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={createFile}>Descargar archivo</button>
    </div>
  );
}

export default App;
