import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Snackbar, Alert, Checkbox, FormControlLabel } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import InsertPhoto from '@mui/icons-material/InsertPhoto';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import axios from 'axios';

function RegisterPersonForm() {
  const [formData, setFormData] = useState({
    folio: '',
    name: '',
    surname: '',
    birth_date: '',
    gender: '',
    civil_status: '',
    address: '',
    estate: '',
    foreign: 0,
    phone: '',
    occupation: '',
    last_studies: '',
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(''); // Para previsualización de la imagen
  const [addressProof, setAddressProof] = useState(null);
  const [idCard, setIdCard] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', type: 'success' });

  // Mensajes para los nombres de archivos subidos
  const [addressProofName, setAddressProofName] = useState('');
  const [idCardName, setIdCardName] = useState('');

  const handleChange = (e) => {
    if (e.target.name === 'phone') {
      const regex = /^[0-9]*$/;
      if (!regex.test(e.target.value)) {
        return;
      }
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onDropPhoto = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/gif') {
      setNotification({ open: true, message: 'Error: La foto debe ser PNG, JPG o GIF.', type: 'error' });
      return;
    }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file)); // Previsualizar la imagen
  };

  const { getRootProps: getRootPhotoProps, getInputProps: getInputPhotoProps } = useDropzone({
    onDrop: onDropPhoto,
    accept: { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'], 'image/gif': ['.gif'] },
    maxSize: 10485760,
    onDropRejected: () => {
      setNotification({ open: true, message: 'Error: La foto debe ser PNG, JPG o GIF y no debe exceder los 10 MB.', type: 'error' });
    },
  });

  const onDropAddressProof = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type !== 'application/pdf') {
      setNotification({ open: true, message: 'Error: El comprobante de domicilio debe ser un PDF.', type: 'error' });
      return;
    }
    setAddressProof(file);
    setAddressProofName(file.name); // Mostrar el nombre del archivo subido
  };

  const { getRootProps: getRootAddressProofProps, getInputProps: getInputAddressProofProps } = useDropzone({
    onDrop: onDropAddressProof,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10485760,
    onDropRejected: () => {
      setNotification({ open: true, message: 'Error: El archivo debe ser un PDF y no debe exceder los 10 MB.', type: 'error' });
    },
  });

  const onDropIdCard = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type !== 'application/pdf') {
      setNotification({ open: true, message: 'Error: La identificación debe ser un PDF.', type: 'error' });
      return;
    }
    setIdCard(file);
    setIdCardName(file.name); // Mostrar el nombre del archivo subido
  };

  const { getRootProps: getRootIdCardProps, getInputProps: getInputIdCardProps } = useDropzone({
    onDrop: onDropIdCard,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10485760,
    onDropRejected: () => {
      setNotification({ open: true, message: 'Error: El archivo debe ser un PDF y no debe exceder los 10 MB.', type: 'error' });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.surname || !formData.folio) {
      setNotification({ open: true, message: 'Folio, nombre y apellido son obligatorios.', type: 'error' });
      return;
    }

    if (!photo) {
      setNotification({ open: true, message: 'La foto es obligatoria.', type: 'error' });
      return;
    }

    if (!addressProof) {
      setNotification({ open: true, message: 'El comprobante de domicilio es obligatorio.', type: 'error' });
      return;
    }

    if (!idCard) {
      setNotification({ open: true, message: 'La identificación es obligatoria.', type: 'error' });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('folio', formData.folio);
    formDataToSend.append('name', formData.name);
    formDataToSend.append('surname', formData.surname);
    formDataToSend.append('birth_date', formData.birth_date);
    formDataToSend.append('gender', formData.gender);
    formDataToSend.append('civil_status', formData.civil_status);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('estate', formData.estate);
    formDataToSend.append('foreign', formData.foreign ? 1 : 0);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('occupation', formData.occupation);
    formDataToSend.append('last_studies', formData.last_studies);

    if (photo) {
      const photoName = `${formData.name}_${formData.surname}.jpg`;
      formDataToSend.append('photo', photo, photoName);
    }

    if (addressProof) {
      const addressProofName = `${formData.name}_${formData.surname}_comprobante_domicilio.pdf`;
      formDataToSend.append('address_proof', addressProof, addressProofName);
    }

    if (idCard) {
      const idCardName = `${formData.name}_${formData.surname}_identificacion.pdf`;
      formDataToSend.append('id_card', idCard, idCardName);
    }

    try {
      await axios.post('http://localhost:3001/api/crud', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setNotification({
        open: true,
        message: '¡Perfil guardado con éxito!',
        type: 'success',
      });
    } catch (error) {
      console.error('Error al registrar persona:', error);
      setNotification({
        open: true,
        message: 'Error al guardar el perfil, revisa la información e inténtalo nuevamente.',
        type: 'error',
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ maxWidth: '800px', margin: '0 auto', p: 4, backgroundColor: '#ffffff', borderRadius: '8px' }}>
        <Typography variant="h5" mb={3}>Registrar Persona</Typography>

        <TextField label="Folio" name="folio" value={formData.folio} onChange={handleChange} fullWidth required sx={{ mt: 2 }} />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField label="Nombre" name="name" value={formData.name} onChange={handleChange} fullWidth required />
          <TextField label="Apellido" name="surname" value={formData.surname} onChange={handleChange} fullWidth required />
        </Box>

        <TextField
          type="date"
          label="Fecha de Nacimiento"
          name="birth_date"
          value={formData.birth_date}
          onChange={handleChange}
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          sx={{ mt: 2 }}
        />

        <Box {...getRootPhotoProps()} sx={{ border: '1.9px dashed #ccc', padding: '20px', textAlign: 'center', marginTop: '20px', borderRadius: '16px' }}>
          <input {...getInputPhotoProps()} />
          {photoPreview ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={photoPreview} alt="Vista previa" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
              <Typography variant="body1" color="primary" sx={{ mt: 2 }}>Haz clic o arrastra para cambiar la foto</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <InsertPhoto sx={{ fontSize: 80, color: '#ccc' }} />
              <Typography variant="body1" color="primary">Sube una imagen o arrástrala aquí</Typography>
              <Typography variant="caption" color="textSecondary">PNG, JPG, GIF hasta 10MB</Typography>
            </Box>
          )}
        </Box>

        <TextField label="Estado Civil" name="civil_status" value={formData.civil_status} onChange={handleChange} fullWidth required sx={{ mt: 2 }} />
        <TextField label="Dirección" name="address" value={formData.address} onChange={handleChange} fullWidth required sx={{ mt: 2 }} />
        <TextField label="Estado/Provincia" name="estate" value={formData.estate} onChange={handleChange} fullWidth required sx={{ mt: 2 }} />

        <FormControlLabel
          control={<Checkbox checked={formData.foreign} onChange={() => setFormData({ ...formData, foreign: !formData.foreign })} />}
          label="Foráneo"
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
          <TextField label="Teléfono" name="phone" value={formData.phone} onChange={handleChange} fullWidth required />
          <TextField label="Ocupación" name="occupation" value={formData.occupation} onChange={handleChange} fullWidth required />
        </Box>

        <TextField label="Últimos Estudios" name="last_studies" value={formData.last_studies} onChange={handleChange} fullWidth required sx={{ mt: 2 }} />

        <Box {...getRootAddressProofProps()} sx={{ border: '1.9px dashed #ccc', padding: '20px', textAlign: 'center', marginTop: '20px', borderRadius: '16px' }}>
          <input {...getInputAddressProofProps()} />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <FolderCopyIcon sx={{ fontSize: 80, color: '#ccc' }} />
            <Typography variant="body1" color="primary">Sube un PDF o arrástralo aquí (Comprobante de Domicilio)</Typography>
            <Typography variant="caption" color="textSecondary">PDF hasta 10MB</Typography>
            {addressProofName && <Typography variant="body2" color="textPrimary">Archivo subido: {addressProofName}</Typography>}
          </Box>
        </Box>

        <Box {...getRootIdCardProps()} sx={{ border: '1.9px dashed #ccc', padding: '20px', textAlign: 'center', marginTop: '20px', borderRadius: '16px' }}>
          <input {...getInputIdCardProps()} />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <RecentActorsIcon sx={{ fontSize: 80, color: '#ccc' }} />
            <Typography variant="body1" color="primary">Sube un PDF o arrástralo aquí (Identificación)</Typography>
            <Typography variant="caption" color="textSecondary">PDF hasta 10MB</Typography>
            {idCardName && <Typography variant="body2" color="textPrimary">Archivo subido: {idCardName}</Typography>}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button variant="outlined">Cancelar</Button>
          <Button type="submit" variant="contained" color="primary">Guardar</Button>
        </Box>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={notification.type}
          sx={{
            width: '100%',
            backgroundColor: '#ffffff',
            color: '#333',
            borderRadius: '16px',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)',
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </form>
  );
}

export default RegisterPersonForm;
