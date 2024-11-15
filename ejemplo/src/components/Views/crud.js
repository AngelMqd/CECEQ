import React, { useState } from 'react';
import axios from 'axios';

function Crud() {
  // Estado para los datos del formulario y archivos
  const [formData, setFormData] = useState({
    folio: '',
    name: '',
    surname: '',
    birth_date: '',
    gender: '',
    civil_status: '',
    address: '',
    estate: '',
    foreign: 0, // Inicia como 0 (no es foráneo)
    phone: '',
    occupation: '',
    last_studies: '',
  });

  const [photo, setPhoto] = useState(null);
  const [addressProof, setAddressProof] = useState(null);
  const [idCard, setIdCard] = useState(null);
  const [message, setMessage] = useState('');

  // Manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Manejar cambios en el checkbox
  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      foreign: e.target.checked ? 1 : 0, // Si está marcado, 1 (foráneo), si no, 0 (no foráneo)
    });
  };

  // Manejar cambios en la subida de archivos
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === 'photo') {
      setPhoto(files[0]);
    } else if (name === 'address_proof') {
      setAddressProof(files[0]);
    } else if (name === 'id_card') {
      setIdCard(files[0]);
    }
  };

  // Manejar la solicitud para registrar a la persona
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Establecer la fecha y hora actual para created_at y updated_at
    const currentDateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }
    
    formDataToSend.append('created_at', currentDateTime); // Fecha y hora actuales
    formDataToSend.append('updated_at', currentDateTime); // Fecha y hora actuales
    formDataToSend.append('status', 0); // Por defecto el estado es 0 (activo)

    if (photo) formDataToSend.append('photo', photo);
    if (addressProof) formDataToSend.append('address_proof', addressProof);
    if (idCard) formDataToSend.append('id_card', idCard);

    try {
      const response = await axios.post('http://localhost:3001/api/crud', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('¡Persona registrada exitosamente!');
      console.log(response.data);
    } catch (error) {
      setMessage('Hubo un error al registrar la persona.');
      console.error('Error:', error.response ? error.response.data : error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registrar Persona</h2>

      <input type="text" name="folio" placeholder="Folio" value={formData.folio} onChange={handleChange} required />
      <input type="text" name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required />
      <input type="text" name="surname" placeholder="Apellido" value={formData.surname} onChange={handleChange} required />
      <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} required />
      <input type="text" name="gender" placeholder="Género" value={formData.gender} onChange={handleChange} required />
      <input type="text" name="civil_status" placeholder="Estado Civil" value={formData.civil_status} onChange={handleChange} required />
      <input type="text" name="address" placeholder="Dirección" value={formData.address} onChange={handleChange} required />
      <input type="text" name="estate" placeholder="Estado" value={formData.estate} onChange={handleChange} required />
      
      <input
        type="checkbox"
        name="foreign"
        checked={formData.foreign === 1} // Controla si el checkbox está marcado o no
        onChange={handleCheckboxChange}
      />
      <label>Foráneo</label>
      
      <input type="text" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} required />
      <input type="text" name="occupation" placeholder="Ocupación" value={formData.occupation} onChange={handleChange} required />
      <input type="text" name="last_studies" placeholder="Últimos Estudios" value={formData.last_studies} onChange={handleChange} required />

      {/* Subida de archivos */}
      <h4>Foto</h4>
      <input type="file" name="photo" onChange={handleFileChange} />
      <h4>Comprobante de Domicilio</h4>
      <input type="file" name="address_proof" onChange={handleFileChange} />
      <h4>Identificación</h4>
      <input type="file" name="id_card" onChange={handleFileChange} />

      <button type="submit">Registrar</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default Crud;
