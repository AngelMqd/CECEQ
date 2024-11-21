import React, { useEffect, useState } from 'react';
import { Box, Button, Typography,TextField,Divider, Avatar, Grid, Link } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ConfirmDeactivateModal from "./ConfirmDeactivateModal";

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
 
  const [isModalOpen, setModalOpen] = useState(false);
  useEffect(() => {
    axios
      .get(`http://localhost:3001/api/personas/${id}`)
      .then((response) => {
        setPerson(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al obtener el perfil:', error);
        setLoading(false);
      });
  }, [id]);

  const getStatusBadge = (status) => {
    const isActive = status === 0;
    return (
      <Box
        sx={{
          backgroundColor: isActive ? '#c6ffcd' : '#ffcccc',
          color: isActive ? '#2c8420' : '#842020',
          borderRadius: '20px',
          padding: '5px 10px',
          fontSize: '12px',
          display: 'inline-flex',
          alignItems: 'center',
        }}
      >
        <Box
          component="span"
          sx={{
            width: '9px',
            height: '9px',
            backgroundColor: isActive ? '#51cb61' : '#f44336',
            borderRadius: '50%',
            marginRight: '4px',
          }}
        />
        {isActive ? 'Activo' : 'Inactivo'}
      </Box>
    );
  };

  const handleBlockUser = async () => {
    try {
      await axios.post(`http://localhost:3001/api/personas/${person.id}/block`, { status: 1 });
      alert("User successfully deactivated.");
      setModalOpen(false); // Cierra el modal después de la confirmación
    } catch (error) {
      console.error("Error blocking user:", error);
      alert("An error occurred while deactivating the user.");
    }
  };
  
  const handleEdit = () => {
    navigate(`/editar-perfil/${person.id}`);
  };
  
  const handleHistory = () => {
    navigate(`/historial-cambios/${person.id}`);
  };
  
  if (loading) {
    return <h1>Cargando...</h1>;
  }

  if (!person) {
    return <h1>Perfil no encontrado</h1>;
  }

  return (
    <Box sx={{ p: 4, backgroundColor: '#f9fafc', borderRadius: '12px', maxWidth: '1200px', margin: '0 auto' }}>
    <Grid container spacing={4}>
     {/* Foto de perfil y detalles relevantes */}
<Grid item xs={12} md={4}>
<Box
  sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    p: 3,
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: 3,
  }}
>
  {/* Foto de perfil */}
  <Avatar
    src={person.photo ? `data:image/jpeg;base64,${person.photo}` : null}
    alt="Foto de Usuario"
    sx={{ width: 150, height: 150, mb: 2 }}
  />
  <Typography variant="h6" fontWeight="bold">
    {person.name} {person.surname}
  </Typography>
  <Typography variant="body1" sx={{ mt: 1 }}>
    <strong>Folio:</strong> {person.folio}
  </Typography>

  {/* Estado */}
  <Box sx={{ mt: 2 }}>{getStatusBadge(person.status)}</Box>
</Box>



{person.is_minor && (
  <Box
    sx={{
      mt: 4,
      p: 3,
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: 3,
      textAlign: 'center',
    }}
  >
    <Typography variant="h6" fontWeight="bold" gutterBottom>
      Información de Tutores
    </Typography>
    {person.tutors && person.tutors.length > 0 ? (
      person.tutors.map((tutor, index) => (
        <Box
          key={index}
          sx={{
            mt: 2,
            p: 2,
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <Typography variant="body1">
            <strong>Nombre:</strong> {tutor.name}
          </Typography>
          <Typography variant="body1">
            <strong>Relación:</strong> {tutor.relationship}
          </Typography>
          <Typography variant="body1">
            <strong>Teléfono:</strong> {tutor.phone}
          </Typography>
        </Box>
      ))
    ) : (
      <Typography variant="body2" color="textSecondary">
        No hay tutores registrados
      </Typography>
    )}
  </Box>
)}



</Grid>


      {/* Información General */}
      <Grid item xs={12} md={8}>
        <Box
          sx={{
            p: 3,
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: 3,
          }}
        >
          <Typography variant="h6" fontWeight="bold" gutterBottom>Información General</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre"
                defaultValue={person.name}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Apellido"
                defaultValue={person.surname}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Fecha de Nacimiento"
                defaultValue={new Date(person.birth_date).toLocaleDateString()}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Género"
                defaultValue={person.gender}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                defaultValue={person.email || 'No disponible'}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Teléfono"
                defaultValue={person.phone || 'No disponible'}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </Box>

    {/* Dirección */}
<Box
  sx={{
    mt: 4,
    p: 3,
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: 3,
  }}
>
  <Typography variant="h6" fontWeight="bold" gutterBottom>Dirección</Typography>
  <Grid container spacing={2}>
    {/* Dirección completa */}
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Dirección"
        defaultValue={person.address || 'No disponible'}
        InputProps={{ readOnly: true }}
      />
    </Grid>

    {/* Estado */}
    <Grid item xs={12} md={6}>
      <TextField
        fullWidth
        label="Estado"
        defaultValue={person.estate || 'No disponible'}
        InputProps={{ readOnly: true }}
      />
    </Grid>

    {/* Extranjero */}
    <Grid item xs={12} md={6}>
      <TextField
        fullWidth
        label="Extranjero"
        defaultValue={person.foreign ? 'Sí' : 'No'}
        InputProps={{ readOnly: true }}
      />
    </Grid>
  </Grid>
</Box>

      </Grid>

{/* Archivos PDF Subidos */}
<Grid item xs={12}>
  <Box
    sx={{
      backgroundColor: '#ffffff', // Fondo blanco
      borderRadius: '10px', // Bordes redondeados
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Sombra ligera
      padding: '20px', // Espaciado interno
      border: '1px solid #e0e0e0', // Borde gris claro
    }}
  >
    <Typography
      variant="h6"
      gutterBottom
      sx={{ fontWeight: 'bold', color: '#333333' }} // Título con texto oscuro y negrita
    >
      Documentos
    </Typography>
    <Divider sx={{ mb: 2 }} />
    <Box>
      {person.address_proof ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            padding: '10px',
            backgroundColor: '#f9f9f9', // Fondo ligeramente más claro
            borderRadius: '6px', // Bordes redondeados para cada elemento
            border: '1px solid #ddd', // Borde delgado alrededor de cada elemento
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AttachFileIcon sx={{ color: '#767676' }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {`Comprobante de Domicilio - ${person.name} ${person.surname}.pdf`}
            </Typography>
          </Box>
          <Link
            href={`data:application/pdf;base64,${person.address_proof}`}
            target="_blank"
            download={`Comprobante_Domicilio_${person.name}_${person.surname}.pdf`}
            sx={{
              color: '#4a90e2',
              fontWeight: 'bold',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Descargar
          </Link>
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary">
          Comprobante de Domicilio no disponible
        </Typography>
      )}

      {person.id_card ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
            padding: '10px',
            backgroundColor: '#f9f9f9',
            borderRadius: '6px',
            border: '1px solid #ddd',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AttachFileIcon sx={{ color: '#767676' }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              {`Identificación - ${person.name} ${person.surname}.pdf`}
            </Typography>
          </Box>
          <Link
            href={`data:application/pdf;base64,${person.id_card}`}
            target="_blank"
            download={`Identificacion_${person.name}_${person.surname}.pdf`}
            sx={{
              color: '#4a90e2',
              fontWeight: 'bold',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Descargar
          </Link>
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary">
          Identificación no disponible
        </Typography>
      )}
    </Box>
  </Box>
</Grid>



    
     {/* Botones de Acción */}
<Grid item xs={12}>
  <Box sx={{ textAlign: 'right' }}>
    {/* Botón para cambiar el estado a "Inactivo" */}
    <Button
        variant="outlined"
        color="error"
        sx={{ textTransform: "none" }}
        onClick={() => setModalOpen(true)}
      >
        Bloquear
      </Button>

      {/* Modal de confirmación */}
      <ConfirmDeactivateModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleBlockUser}
      />

    {/* Botón para abrir la vista de edición */}
    <Button
      variant="outlined"
      sx={{ textTransform: 'none', ml: 2 }}
      startIcon={<EditIcon />}
      onClick={handleEdit}
    >
      Editar Perfil
    </Button>

    {/* Botón para ver historial */}
    <Button
      variant="outlined"
      sx={{
        textTransform: 'none',
        ml: 2,
        color: '#006400',
        borderColor: '#006400',
        '&:hover': { backgroundColor: '#00640010', borderColor: '#006400' },
      }}
      startIcon={<HistoryIcon />}
      onClick={handleHistory}
    >
      Historial de Cambios
    </Button>
  </Box>
</Grid>

      </Grid>
    </Box>
  );
}

export default UserProfile;
