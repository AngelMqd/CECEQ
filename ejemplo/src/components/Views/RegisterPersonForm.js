import React, { useState, useEffect  } from 'react';
import { Box, Button, TextField, Typography, Snackbar, Alert, Checkbox, FormControlLabel,   FormControl, InputLabel,Select, MenuItem} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import InsertPhoto from '@mui/icons-material/InsertPhoto';
import FolderCopyIcon from '@mui/icons-material/FolderCopy';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import axios from 'axios';

function RegisterPersonForm() {

  const [areas, setAreas] = useState([]);
  const [selectedAbbreviation, setSelectedAbbreviation] = useState('');
  const [lastFolioNumber, setLastFolioNumber] = useState(0);
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
    area_id: '',
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
    const { name, value } = e.target; // Desestructura correctamente el evento

    if (name === 'phone') {
      const regex = /^[0-9]*$/; // Asegúrate de que solo números se permitan en el campo teléfono
      if (!regex.test(value)) {
        return;
      }
    }
  
    setFormData((prev) => ({ ...prev, [name]: value })); // Actualiza dinámicamente el estado

    if (name === 'birth_date') {
      const birthDate = new Date(value);
      const currentDate = new Date();
      const age = currentDate.getFullYear() - birthDate.getFullYear();
      const isMinor =
        currentDate < new Date(birthDate.setFullYear(birthDate.getFullYear() + age)) ? age < 18 : age <= 18;
  
      setFormData((prev) => ({ ...prev, isMinor }));
    }
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
  
      // Validar que el primer tutor sea obligatorio
  if (!formData.tutor1_name || !formData.tutor1_relationship || !formData.tutor1_phone) {
    setNotification({ open: true, message: 'El primer tutor es obligatorio.', type: 'error' });
    return;
  }

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
    formDataToSend.append('area_id', formData.area_id);
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
    
  
    
  // Datos del primer tutor (obligatorios)
  formDataToSend.append('tutor1_name', formData.tutor1_name);
  formDataToSend.append('tutor1_relationship', formData.tutor1_relationship);
  formDataToSend.append('tutor1_phone', formData.tutor1_phone);

  // Datos del segundo tutor (opcional)
  if (formData.tutor2_name && formData.tutor2_relationship && formData.tutor2_phone) {
    formDataToSend.append('tutor2_name', formData.tutor2_name);
    formDataToSend.append('tutor2_relationship', formData.tutor2_relationship);
    formDataToSend.append('tutor2_phone', formData.tutor2_phone);
  }
    // Resto del envío
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
      message: 'Error al guardar el perfil. Por favor, intenta nuevamente.',
      type: 'error',
    });
  
      // Verificar si el error es por un folio duplicado
      if (error.response && error.response.data && error.response.data.error === 'The folio already exists.') {
        setNotification({
          open: true,
          message: 'Error: El folio ya existe. Por favor, genera un folio único.',
          type: 'error',
        });
      } else {
        setNotification({
          open: true,
          message: 'Error al guardar el perfil, revisa la información e inténtalo nuevamente.',
          type: 'error',
        });
      }
    }
  };
  
  useEffect(() => {
    axios
      .get('http://localhost:3001/api/areas')
      .then((response) => {
        if (response.data.length > 0) {
          setAreas(response.data);
        } else {
          console.error('No se encontraron áreas');
        }
      })
      .catch((error) => {
        console.error('Error al obtener las áreas:', error.response || error.message);
        setNotification({
          open: true,
          message: 'Error al cargar las áreas',
          type: 'error',
        });
      });
  }, []);
  

  useEffect(() => {
    if (selectedAbbreviation) {
      const newFolio = `${selectedAbbreviation}${String(lastFolioNumber + 1).padStart(4, '0')}`;
      setFormData(prev => ({ ...prev, folio: newFolio }));
    }
  }, [selectedAbbreviation, lastFolioNumber]);

  const handleAreaChange = (event) => {
    const selectedArea = areas.find(area => area.id === event.target.value);
    if (selectedArea) {
      setFormData(prev => ({ ...prev, area_id: selectedArea.id }));
      setSelectedAbbreviation(selectedArea.abbreviation);

      // Obtener el último folio para esta área
      axios
      .get(`http://localhost:3001/api/last-folio/${selectedArea.abbreviation}`)
      .then((response) => {
        setLastFolioNumber(response.data.lastFolioNumber || 0);
      })
      .catch((error) => {
        console.error('Error al obtener el último folio:', error.response || error.message);
        setNotification({
          open: true,
          message: `Error al obtener el número de folio: ${error.response?.data?.error || error.message}`,
          type: 'error'
        });
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
        
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel id="area-select-label">Área</InputLabel>
          <Select
    labelId="area-select-label"
    value={formData.area_id}
    onChange={handleAreaChange}
    required
    sx={{
      mb: 2,
      backgroundColor: '#ffffff', // Fondo blanco
      borderRadius: '8px', // Bordes redondeados
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Sombra
      '&:hover': {
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)', // Sombra al pasar el mouse
      },
      '& .MuiSelect-select': {
        padding: '15px', // Espaciado interno
        fontSize: '16px', // Tamaño de fuente
        fontWeight: '500', // Peso de fuente
      },
    }}
  >
    {areas.map((area) => (
      <MenuItem key={area.id} value={area.id}>
        {area.area_name}
      </MenuItem>
    ))}
  </Select>
        </FormControl>

        {selectedAbbreviation && (
          <Typography variant="body1" color="primary" sx={{ mt: 2 }}>
            Abreviación seleccionada: <strong>{selectedAbbreviation}</strong>
          </Typography>
        )}

        {formData.folio && (
          <TextField
            label="Folio"
            name="folio"
            value={formData.folio}
            fullWidth
            InputProps={{ readOnly: true }}
            sx={{ mt: 2, mb: 2 }}
          />
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField label="Nombre (s)" name="name" value={formData.name} onChange={handleChange} fullWidth required />
          <TextField label="Apellidos" name="surname" value={formData.surname} onChange={handleChange} fullWidth required />
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
{formData.isMinor && (
  <Box sx={{ mt: 4 }}>
    <Typography variant="h6" color="primary">
      Información del Tutor
    </Typography>
    {/* Primer Tutor (obligatorio) */}
    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
      <TextField
        label="Nombre del Primer Tutor"
        name="tutor1_name"
        value={formData.tutor1_name || ''}
        onChange={handleChange}
        fullWidth
        required
      />
      <TextField
        label="Parentesco"
        name="tutor1_relationship"
        value={formData.tutor1_relationship || ''}
        onChange={handleChange}
        fullWidth
        required
      />
    </Box>
    <TextField
      label="Teléfono del Primer Tutor"
      name="tutor1_phone"
      value={formData.tutor1_phone || ''}
      onChange={(e) => {
        const regex = /^[0-9]*$/;
        if (regex.test(e.target.value)) {
          handleChange(e);
        }
      }}
      fullWidth
      required
      sx={{ mt: 2 }}
    />

    {/* Segundo Tutor (opcional) */}
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" color="secondary">
        Información del Segundo Tutor (Opcional)
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
        <TextField
          label="Nombre del Segundo Tutor"
          name="tutor2_name"
          value={formData.tutor2_name || ''}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Parentesco"
          name="tutor2_relationship"
          value={formData.tutor2_relationship || ''}
          onChange={handleChange}
          fullWidth
        />
      </Box>
      <TextField
        label="Teléfono del Segundo Tutor"
        name="tutor2_phone"
        value={formData.tutor2_phone || ''}
        onChange={(e) => {
          const regex = /^[0-9]*$/;
          if (regex.test(e.target.value)) {
            handleChange(e);
          }
        }}
        fullWidth
        sx={{ mt: 2 }}
      />
    </Box>
  </Box>
)}

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
        <Box
  sx={{
    display: 'flex', // Para colocar elementos en línea
    justifyContent: 'space-between', // Distribuye espacio entre los elementos
    gap: 2, // Espaciado entre los selectores
    mt: 2, // Margen superior
  }}
>

<FormControl
    fullWidth
    sx={{
      flex: 1, // Permite que cada selector ocupe el mismo ancho
      mr: 1, // Margen derecho opcional
    }}
  >
    <InputLabel id="gender-select-label">Género</InputLabel>
    <Select
      labelId="gender-select-label"
      value={formData.gender}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, gender: e.target.value }))
      }
      required
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
      }}
    >
      <MenuItem value="Femenino">Femenino</MenuItem>
      <MenuItem value="Masculino">Masculino</MenuItem>
    </Select>
  </FormControl>

  <FormControl
    fullWidth
    sx={{
      flex: 1, // Permite que cada selector ocupe el mismo ancho
      ml: 1, // Margen izquierdo opcional
    }}
  >
    <InputLabel id="civil-status-select-label">Estado Civil</InputLabel>
    <Select
      labelId="civil-status-select-label"
      value={formData.civil_status}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, civil_status: e.target.value }))
      }
      required
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
      }}
    >
      <MenuItem value="Soltero/a">Soltero/a</MenuItem>
      <MenuItem value="Casado/a">Casado/a</MenuItem>
      <MenuItem value="Divorciado/a">Divorciado/a</MenuItem>
      <MenuItem value="Viudo/a">Viudo/a</MenuItem>
    </Select>
  </FormControl>
</Box>
        <TextField label="Dirección" name="address" value={formData.address} onChange={handleChange} fullWidth required sx={{ mt: 2 }} />
        <FormControl
  fullWidth
  sx={{
    mt: 2,
    backgroundColor: '#ffffff', // Fondo blanco
    borderRadius: '8px', // Bordes redondeados
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Sombra
  }}
>
  <InputLabel id="estate-select-label">Estado/Provincia</InputLabel>
  <Select
    labelId="estate-select-label"
    value={formData.estate}
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, estate: e.target.value }))
    }
    required
  >
    <MenuItem value="Ninguno">Ninguno</MenuItem>
    <MenuItem value="Aguascalientes">Aguascalientes</MenuItem>
    <MenuItem value="Baja California">Baja California</MenuItem>
    <MenuItem value="Baja California Sur">Baja California Sur</MenuItem>
    <MenuItem value="Campeche">Campeche</MenuItem>
    <MenuItem value="Chiapas">Chiapas</MenuItem>
    <MenuItem value="Chihuahua">Chihuahua</MenuItem>
    <MenuItem value="Ciudad de México">Ciudad de México</MenuItem>
    <MenuItem value="Coahuila">Coahuila</MenuItem>
    <MenuItem value="Colima">Colima</MenuItem>
    <MenuItem value="Durango">Durango</MenuItem>
    <MenuItem value="Estado de México">Estado de México</MenuItem>
    <MenuItem value="Guanajuato">Guanajuato</MenuItem>
    <MenuItem value="Guerrero">Guerrero</MenuItem>
    <MenuItem value="Hidalgo">Hidalgo</MenuItem>
    <MenuItem value="Jalisco">Jalisco</MenuItem>
    <MenuItem value="Michoacán">Michoacán</MenuItem>
    <MenuItem value="Morelos">Morelos</MenuItem>
    <MenuItem value="Nayarit">Nayarit</MenuItem>
    <MenuItem value="Nuevo León">Nuevo León</MenuItem>
    <MenuItem value="Oaxaca">Oaxaca</MenuItem>
    <MenuItem value="Puebla">Puebla</MenuItem>
    <MenuItem value="Querétaro">Querétaro</MenuItem>
    <MenuItem value="Quintana Roo">Quintana Roo</MenuItem>
    <MenuItem value="San Luis Potosí">San Luis Potosí</MenuItem>
    <MenuItem value="Sinaloa">Sinaloa</MenuItem>
    <MenuItem value="Sonora">Sonora</MenuItem>
    <MenuItem value="Tabasco">Tabasco</MenuItem>
    <MenuItem value="Tamaulipas">Tamaulipas</MenuItem>
    <MenuItem value="Tlaxcala">Tlaxcala</MenuItem>
    <MenuItem value="Veracruz">Veracruz</MenuItem>
    <MenuItem value="Yucatán">Yucatán</MenuItem>
    <MenuItem value="Zacatecas">Zacatecas</MenuItem>
  </Select>
</FormControl>

        <FormControlLabel
          control={<Checkbox checked={formData.foreign} onChange={() => setFormData({ ...formData, foreign: !formData.foreign })} />}
          label="Foráneo"
        />

<Box
  sx={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 2,
    mt: 2,
  }}
>
  <TextField
    label="Teléfono"
    name="phone"
    value={formData.phone}
    onChange={handleChange}
    fullWidth
    required
  />

  <FormControl
    fullWidth
    sx={{
      backgroundColor: '#ffffff', // Fondo blanco
      borderRadius: '8px', // Bordes redondeados
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Sombra
    }}
  >
    <InputLabel id="occupation-select-label">Ocupación</InputLabel>
    <Select
      labelId="occupation-select-label"
      value={formData.occupation}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, occupation: e.target.value }))
      }
      required
    >
      <MenuItem value="Estudiante">Estudiante</MenuItem>
      <MenuItem value="Empleado">Empleado</MenuItem>
      <MenuItem value="Independiente">Independiente</MenuItem>
      <MenuItem value="Desempleado">Desempleado</MenuItem>
      <MenuItem value="Empresario">Empresario</MenuItem>
      <MenuItem value="Docente">Docente</MenuItem>
      <MenuItem value="Ingeniero">Ingeniero</MenuItem>
      <MenuItem value="Médico">Médico</MenuItem>
      <MenuItem value="Abogado">Abogado</MenuItem>
      <MenuItem value="Otro">Otro</MenuItem>
    </Select>
  </FormControl>
</Box>


<FormControl
  fullWidth
  sx={{
    mt: 2,
    backgroundColor: '#ffffff', // Fondo blanco
    borderRadius: '8px', // Bordes redondeados
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Sombra
  }}
>
  <InputLabel id="last-studies-select-label">Últimos Estudios</InputLabel>
  <Select
    labelId="last-studies-select-label"
    value={formData.last_studies}
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, last_studies: e.target.value }))
    }
    required
  > 
    <MenuItem value="Preescolar">Preescolar</MenuItem>
    <MenuItem value="Primaria">Primaria</MenuItem>
    <MenuItem value="Secundaria">Secundaria</MenuItem>
    <MenuItem value="Preparatoria">Preparatoria</MenuItem>
    <MenuItem value="Licenciatura">Licenciatura</MenuItem>
    <MenuItem value="Maestría">Maestría</MenuItem>
    <MenuItem value="Doctorado">Doctorado</MenuItem>
  </Select>
</FormControl>


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
