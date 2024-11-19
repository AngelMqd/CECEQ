import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Divider, Avatar, Grid, Link } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import HistoryIcon from '@mui/icons-material/History';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

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

  const handleEdit = () => {
    navigate(`/editar-perfil/${id}`);
  };

  const handleHistory = () => {
    navigate(`/historial-cambios/${id}`);
  };

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  if (!person) {
    return <h1>Perfil no encontrado</h1>;
  }

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: '#FFF',
        borderRadius: '6px',
        boxShadow: 3,
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      <Grid container spacing={3}>
        {/* Foto de Usuario */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: 2,
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
              boxShadow: 1,
            }}
          >
            <Avatar
              src={person.photo ? `data:image/jpeg;base64,${person.photo}` : null}
              alt="Foto de Usuario"
              sx={{ width: 120, height: 120, marginBottom: 2 }}
            />
            <Typography variant="h6">{person.name} {person.surname}</Typography>
            {getStatusBadge(person.status)}
          </Box>
        </Grid>

        {/* Información Básica */}
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              backgroundColor: '#f5f5f5',
              padding: 2,
              borderRadius: '8px',
              boxShadow: 1,
            }}
          >
            <Typography variant="h6" gutterBottom>Información Básica</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1"><strong>Folio:</strong> {person.folio}</Typography>
            <Typography variant="body1"><strong>Fecha de Nacimiento:</strong> {new Date(person.birth_date).toLocaleDateString()}</Typography>
            <Typography variant="body1"><strong>Género:</strong> {person.gender}</Typography>
            <Typography variant="body1"><strong>Estado Civil:</strong> {person.civil_status}</Typography>
          </Box>
        </Grid>

        {/* Información de Contacto */}
        <Grid item xs={12}>
          <Box
            sx={{
              backgroundColor: '#f5f5f5',
              padding: 2,
              borderRadius: '8px',
              boxShadow: 1,
            }}
          >
            <Typography variant="h6" gutterBottom>Información de Contacto</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1"><strong>Teléfono:</strong> {person.phone}</Typography>
            <Typography variant="body1"><strong>Dirección:</strong> {person.address}, {person.estate}</Typography>
            <Typography variant="body1"><strong>Foráneo:</strong> {person.foreign ? 'Sí' : 'No'}</Typography>
          </Box>
        </Grid>

        {/* Información Académica */}
        <Grid item xs={12}>
          <Box
            sx={{
              backgroundColor: '#f5f5f5',
              padding: 2,
              borderRadius: '8px',
              boxShadow: 1,
            }}
          >
            <Typography variant="h6" gutterBottom>Información Académica</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1"><strong>Últimos Estudios:</strong> {person.last_studies}</Typography>
            <Typography variant="body1"><strong>Ocupación:</strong> {person.occupation}</Typography>
          </Box>
        </Grid>

{/* Archivos PDF Subidos */}
<Grid item xs={12}>
  <Box
    sx={{
      backgroundColor: '#f5f5f5',
      padding: 2,
      borderRadius: '8px',
      boxShadow: 1,
    }}
  >
    <Typography variant="h6" gutterBottom>Documentos</Typography>
    <Divider sx={{ mb: 2 }} />
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', p: 2 }}>
      {person.address_proof ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AttachFileIcon sx={{ color: '#767676' }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Comprobante de Domicilio.pdf
            </Typography>
            <Typography variant="body2" sx={{ marginLeft: '8px', color: '#767676' }}>
              {`${(person.address_proof_size / (1024 * 1024)).toFixed(1)} MB`}
            </Typography>
          </Box>
          <Link
            href={`data:application/pdf;base64,${person.address_proof}`}
            target="_blank"
            download="Comprobante_Domicilio.pdf"
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
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AttachFileIcon sx={{ color: '#767676' }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Identificación.pdf
            </Typography>
            <Typography variant="body2" sx={{ marginLeft: '8px', color: '#767676' }}>
              {`${(person.id_card_size / (1024 * 1024)).toFixed(1)} MB`}
            </Typography>
          </Box>
          <Link
            href={`data:application/pdf;base64,${person.id_card}`}
            target="_blank"
            download="Identificacion.pdf"
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
            <Button variant="outlined" color="error" sx={{ textTransform: 'none' }} startIcon={<LockIcon />}>
              Bloquear
            </Button>
            <Button variant="outlined" sx={{ textTransform: 'none', ml: 2 }} startIcon={<EditIcon />} onClick={handleEdit}>
              Editar Perfil
            </Button>
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
