import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  FormControlLabel, 
  Checkbox,         
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import InsertPhoto from "@mui/icons-material/InsertPhoto";
import FolderCopyIcon from "@mui/icons-material/FolderCopy";
import RecentActorsIcon from "@mui/icons-material/RecentActors";

import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CrudEditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    
    folio: "",
    name: "",
    surname: "",
    birth_date: "",
    gender: "",
    civil_status: "",
    address: "",
    estate: "",
    foreign: false,
    phone: "",
    occupation: "",
    last_studies: "",
    area_id: "",
    disability_type: "",
    disability_description: "",
    isDisabled: false,

    tutor1_name: "",
    tutor1_relationship: "",
    tutor1_phone: "",
    tutor2_name: "",
    tutor2_relationship: "",
    tutor2_phone: "",
    isMinor: false,
  });
  const [showTutors, setShowTutors] = useState(false);
  const [photo, setPhoto] = useState(null); // Agregado
  const [addressProof, setAddressProof] = useState(null); // Agregado
  const [idCard, setIdCard] = useState(null); // Agregado
  const [photoPreview, setPhotoPreview] = useState(null);
  const [addressProofName, setAddressProofName] = useState(null);
  const [idCardName, setIdCardName] = useState(null);
  const [areas, setAreas] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: "", type: "success" });

  useEffect(() => {
    // Fetch persona data by ID
    
    axios
      .get(`http://localhost:3001/api/personas/${id}`)
      .then((response) => {
        const person = response.data;
        const formattedDate = person.birth_date
        ? new Date(person.birth_date).toISOString().split("T")[0]
        : "";
        setFormData({
          ...formData,
          folio: person.folio,
          name: person.name,
          surname: person.surname,
          birth_date: formattedDate,
          gender: person.gender,
          civil_status: person.civil_status,
          address: person.address,
          estate: person.estate,
          tutor1_name: person.tutors?.[0]?.name || '',
          tutor1_relationship: person.tutors?.[0]?.relationship || '',
          tutor1_phone: person.tutors?.[0]?.phone || '',
          tutor2_name: person.tutors?.[1]?.name || '',
          tutor2_relationship: person.tutors?.[1]?.relationship || '',
          tutor2_phone: person.tutors?.[1]?.phone || '',
          phone: person.phone,
          occupation: person.occupation,
          last_studies: person.last_studies,
          area_id: person.area_id,
          disability_type: person.disability?.disability_type || '',
          disability_description: person.disability?.description || '',
          isDisabled: !!person.disability, 
          isMinor: person.is_minor === 1, // Convierte a booleano
          foreign: person.foreign === 1, // Convierte a booleano
        });
        setPhotoPreview(person.photo ? `data:image/jpeg;base64,${person.photo}` : null);
        setAddressProofName(person.address_proof ? 'Comprobante subido' : null);
        setIdCardName(person.id_card ? 'Identificación subida' : null);
        
      })

      .catch((error) => console.error("Error fetching person data:", error));

  // Fetch tutors by main_persona_id
  axios.get(`http://localhost:3001/api/tutors/${id}`)
    .then((response) => {
      const tutors = response.data;
      setFormData((prev) => ({
        ...prev,
        tutor1_name: tutors[0]?.name || "",
        tutor1_relationship: tutors[0]?.relationship || "",
        tutor1_phone: tutors[0]?.phone || "",
        tutor2_name: tutors[1]?.name || "",
        tutor2_relationship: tutors[1]?.relationship || "",
        tutor2_phone: tutors[1]?.phone || "",
      }));
    })
    .catch((error) => console.error("Error fetching tutors data:", error));
    // Fetch areas for dropdown
    axios
      .get("http://localhost:3001/api/areas")
      .then((response) => setAreas(response.data))
      .catch((error) => console.error("Error fetching areas:", error));
  }, [id]);








  const onDropPhoto = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/gif') {
      setNotification({ open: true, message: 'Error: La foto debe ser PNG, JPG o GIF.', type: 'error' });
      return;
    }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };
  
  const onDropAddressProof = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type !== 'application/pdf') {
      setNotification({ open: true, message: 'Error: El comprobante de domicilio debe ser un PDF.', type: 'error' });
      return;
    }
    setAddressProof(file);
    setAddressProofName(file.name);
  };
  
  const onDropIdCard = (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file && file.type !== 'application/pdf') {
      setNotification({ open: true, message: 'Error: La identificación debe ser un PDF.', type: 'error' });
      return;
    }
    setIdCard(file);
    setIdCardName(file.name);
  };
  


  const { getRootProps: getRootPhotoProps, getInputProps: getInputPhotoProps } = useDropzone({
    onDrop: onDropPhoto,
    accept: { 'image/jpeg': ['.jpeg', '.jpg'], 'image/png': ['.png'], 'image/gif': ['.gif'] },
    maxSize: 10485760,
    onDropRejected: () => {
      setNotification({ open: true, message: 'Error: La foto debe ser PNG, JPG o GIF y no debe exceder los 10 MB.', type: 'error' });
    },
  });
  
  const { getRootProps: getRootAddressProofProps, getInputProps: getInputAddressProofProps } = useDropzone({
    onDrop: onDropAddressProof,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10485760,
    onDropRejected: () => {
      setNotification({ open: true, message: 'Error: El archivo debe ser un PDF y no debe exceder los 10 MB.', type: 'error' });
    },
  });
  
  const { getRootProps: getRootIdCardProps, getInputProps: getInputIdCardProps } = useDropzone({
    onDrop: onDropIdCard,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: 10485760,
    onDropRejected: () => {
      setNotification({ open: true, message: 'Error: El archivo debe ser un PDF y no debe exceder los 10 MB.', type: 'error' });
    },
  });
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
  
      if (name === "birth_date") {
        const birthDate = new Date(value);
        const currentDate = new Date();
        const age = currentDate.getFullYear() - birthDate.getFullYear();
        const isMinor =
          currentDate < new Date(birthDate.setFullYear(birthDate.getFullYear() + age)) ? age < 18 : age <= 18;
          setShowTutors(isMinor);
        return { ...updatedData, isMinor };
      }
  
      return updatedData;
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = {
      ...formData,
      is_disabled: formData.isDisabled ? 1 : 0, // Convierte a 0 o 1
      is_minor: formData.isMinor ? 1 : 0, // Convierte a 0 o 1
      foreign: formData.foreign ? 1 : 0, // Convierte a 0 o 1
    };
  
    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => formDataObj.append(key, formDataToSend[key]));
    if (photo) formDataObj.append("photo", photo);
    if (addressProof) formDataObj.append("address_proof", addressProof);
    if (idCard) formDataObj.append("id_card", idCard);
  
    try {
      // Actualizar los datos de la persona
      const response = await axios.put(`http://localhost:3001/api/personas/${id}`, formDataObj, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
    // Actualizar o crear discapacidad
    if (formData.isDisabled) {
      await axios.post(`http://localhost:3001/api/disabilities/update`, {
        main_persona_id: id,
        disability_type: formData.disability_type,
        description: formData.disability_description,
      });
    } else {
      await axios.delete(`http://localhost:3001/api/disabilities/${id}`);
    }
      // Actualizar o crear los tutores
      const tutors = [
        {
          name: formData.tutor1_name,
          relationship: formData.tutor1_relationship,
          phone: formData.tutor1_phone,
          main_persona_id: id,
        },
      ];
      if (formData.tutor2_name || formData.tutor2_relationship || formData.tutor2_phone) {
        tutors.push({
          name: formData.tutor2_name,
          relationship: formData.tutor2_relationship,
          phone: formData.tutor2_phone,
          main_persona_id: id,
        });
      }
  
      await axios.post(`http://localhost:3001/api/tutors/update`, tutors);
  
      setNotification({
        open: true,
        message: "Perfil actualizado correctamente.",
        type: "success",
      });
      navigate(`/perfil/${id}`); // Redirigir al perfil
    } catch (error) {
      console.error("Error updating person:", error);
      setNotification({
        open: true,
        message: "Ocurrió un error al actualizar el perfil.",
        type: "error",
      });
    }
  };
  
  const handleCloseNotification = () => setNotification({ ...notification, open: false });
  
  return (
    <form onSubmit={handleSubmit}>
      <Box
        sx={{
          maxWidth: "800px",
          margin: "0 auto",
          p: 4,
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h5" mb={3}>
          Editar Persona
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="folio"
              label="Folio"
              value={formData.folio}
              onChange={handleInputChange}
              fullWidth
              InputProps={{ readOnly: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="name"
              label="Nombre"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="surname"
              label="Apellido"
              value={formData.surname}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="birth_date"
              label="Fecha de Nacimiento"
              type="date"
              value={formData.birth_date}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Género</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <MenuItem value="Masculino">Masculino</MenuItem>
                <MenuItem value="Femenino">Femenino</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
  <FormControl
    fullWidth
    sx={{
      flex: 1, // Permite que cada selector ocupe el mismo ancho
      ml: 0, // Margen izquierdo opcional
      mb: 1,
    }}
  >
    <InputLabel id="civil-status-select-label">Estado Civil</InputLabel>
    <Select
      labelId="civil-status-select-label"
      name="civil_status"
      value={formData.civil_status}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, civil_status: e.target.value }))
      }
      required
      sx={{
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
      }}
    >
      <MenuItem value="Soltero/a">Soltero/a</MenuItem>
      <MenuItem value="Casado/a">Casado/a</MenuItem>
      <MenuItem value="Divorciado/a">Divorciado/a</MenuItem>
      <MenuItem value="Viudo/a">Viudo/a</MenuItem>
    </Select>
  </FormControl>
</Grid> 


<Grid item xs={8}>
<FormControlLabel
 sx={{ mb: 2 }}
  control={
    <Checkbox
      checked={formData.isDisabled || false} // Muestra el valor booleano
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          isDisabled: e.target.checked, // Almacena como booleano
        }))
      }
    />
  }
  label="¿Tiene alguna discapacidad?"
/>
</Grid>



{formData.isDisabled && (
  <Box sx={{ mt: 4 }}>
    <Typography variant="h6" color="primary">
      Información de la Discapacidad
    </Typography>
    <FormControl
      fullWidth
      sx={{
        mt: 2,
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
      }}
    >
      <InputLabel id="disability-type-label">Tipo de Discapacidad</InputLabel>
      <Select
        labelId="disability-type-label"
        name="disability_type"
        value={formData.disability_type || ''}
        onChange={handleInputChange}
        required
      >
        <MenuItem value="Visual">Visual</MenuItem>
        <MenuItem value="Auditiva">Auditiva</MenuItem>
        <MenuItem value="Motriz">Motriz</MenuItem>
        <MenuItem value="Intelectual">Intelectual</MenuItem>
        <MenuItem value="Otra">Otra</MenuItem>
      </Select>
    </FormControl>
    <TextField
      label="Descripción de la Discapacidad"
      name="disability_description"
      value={formData.disability_description || ''}
      onChange={handleInputChange}
      fullWidth
      multiline
      rows={3}
      sx={{ mt: 2 }}
    />
  </Box>
)}




          <Grid item xs={12}>
            <TextField
              name="address"
              label="Dirección"
              value={formData.address}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <FormControl
  fullWidth
  sx={{
    flex: 1,
    ml: 2, // Margen izquierdo eliminado para alineación
    mb: 1, // Espaciado inferior
    mt: 2, // Espaciado superior para separar de otros elementos
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    '.MuiOutlinedInput-notchedOutline': {
      borderWidth: '1.5px', // Grosor del borde para mayor uniformidad
    },
    '.MuiInputLabel-root': {
      fontSize: '0.95rem', // Tamaño de texto más pequeño para ajustarse mejor
    },
  }}
>
  <InputLabel id="estate-select-label">Estado/Provincia</InputLabel>
  <Select
    labelId="estate-select-label"
    name="estate"
    value={formData.estate}
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, estate: e.target.value }))
    }
    required
    sx={{
      borderRadius: '8px',
      height: '56px', // Altura uniforme para todos los elementos
      display: 'flex',
      alignItems: 'center',
    }}
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


          <Grid item xs={6}>
            <TextField
              name="phone"
              label="Teléfono"
              value={formData.phone}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
            <InputLabel id="occupation-select-label">Ocupación</InputLabel>
  <Select
    labelId="occupation-select-label"
    name="occupation"
    value={formData.occupation}
    onChange={(e) =>
      setFormData((prev) => ({ ...prev, occupation: e.target.value }))
    }
    required
    
  > <MenuItem value="Estudiante">Estudiante</MenuItem>
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
          </Grid>
          <Grid item xs={6}>
  <FormControl
    fullWidth
    sx={{
      mt: 0,
 
      backgroundColor: '#ffffff', // Fondo blanco
      borderRadius: '8px', // Bordes redondeados
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // Sombra
    }}
  >
    <InputLabel id="last-studies-select-label">Últimos Estudios</InputLabel>
    <Select
      labelId="last-studies-select-label"
      name="last_studies"
      value={formData.last_studies || ""} // Asegura que no sea null o undefined
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, last_studies: e.target.value }))
      }
      required
      sx={{
        borderRadius: '8px',
        height: '56px', // Altura uniforme para todos los elementos
        display: 'flex',
        alignItems: 'center',
      }}
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
</Grid>











<Grid item xs={8}>
  <FormControlLabel
   sx={{ mb: 2 }}
    control={
      <Checkbox
        checked={formData.foreign}
        onChange={() =>
          setFormData((prev) => ({ ...prev, foreign: !prev.foreign }))
        }
      />
    }
    label="¿Es extranjero?"
  />
</Grid>











          <Grid item xs={12}>
          {/* Subir archivos */}
          <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
  Documentos
</Typography>

{/* Foto */}
<Box {...getRootPhotoProps()} sx={{ border: '1.9px dashed #ccc', padding: '20px', textAlign: 'center', marginTop: '20px', borderRadius: '16px' }}>
  <input {...getInputPhotoProps()} />
  {photoPreview ? (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img src={photoPreview} alt="Vista previa" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
      <Typography variant="body1" color="primary" sx={{ mt: 2 }}>
        Haz clic o arrastra para cambiar la foto
      </Typography>
    </Box>
  ) : (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <InsertPhoto sx={{ fontSize: 80, color: '#ccc' }} />
      <Typography variant="body1" color="primary">Sube una imagen o arrástrala aquí</Typography>
      <Typography variant="caption" color="textSecondary">PNG, JPG, GIF hasta 10MB</Typography>
    </Box>
  )}
</Box>

{/* Comprobante de domicilio */}
<Box {...getRootAddressProofProps()} sx={{ border: '1.9px dashed #ccc', padding: '20px', textAlign: 'center', marginTop: '20px', borderRadius: '16px' }}>
  <input {...getInputAddressProofProps()} />
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <FolderCopyIcon sx={{ fontSize: 80, color: '#ccc' }} />
    <Typography variant="body1" color="primary">Sube un PDF o arrástralo aquí (Comprobante de Domicilio)</Typography>
    <Typography variant="caption" color="textSecondary">PDF hasta 10MB</Typography>
    {addressProofName && <Typography variant="body2" color="textPrimary">Archivo subido: {addressProofName}</Typography>}
  </Box>
</Box>

{/* Identificación */}
<Box {...getRootIdCardProps()} sx={{ border: '1.9px dashed #ccc', padding: '40px', textAlign: 'center', marginTop: '20px', borderRadius: '16px', mb: 6 }}>
  <input {...getInputIdCardProps()} />
  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <RecentActorsIcon sx={{ fontSize: 80, color: '#ccc' }} />
    <Typography variant="body1" color="primary">Sube un PDF o arrástralo aquí (Identificación)</Typography>
    <Typography variant="caption" color="textSecondary">PDF hasta 10MB</Typography>
    {idCardName && <Typography variant="body2" color="textPrimary">Archivo subido: {idCardName}</Typography>}
  </Box>
</Box>
</Grid>




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
        onChange={handleInputChange}
        fullWidth
        required
      />
      <TextField
        label="Parentesco"
        name="tutor1_relationship"
        value={formData.tutor1_relationship || ''}
        onChange={handleInputChange}
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
          handleInputChange(e);
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
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Parentesco"
          name="tutor2_relationship"
          value={formData.tutor2_relationship || ''}
          onChange={handleInputChange}
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
            handleInputChange(e);
          }
        }}
        fullWidth
        sx={{ mt: 2 }}
      />
    </Box>
  </Box>
)}



          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Actualizar
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
      >
        <Alert severity={notification.type}>{notification.message}</Alert>
      </Snackbar>
    </form>
  );
};

export default CrudEditForm;
