import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Link, Divider } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import { Heading } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3001/api/personas/${id}`)
      .then(response => {
        setPerson(response.data);
        setLoading(false);
      })
      .catch(error => {
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
    <Box sx={{ p: 4, backgroundColor: '#FFF', borderRadius: '6px', boxShadow: 3, maxWidth: '800px', margin: '0 auto' }}>
      <Heading size="lg" mb={5}>Perfil de Usuario</Heading>

      {/* Información básica */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Información Básica</Typography>
        <Divider />
        <Typography variant="body1"><strong>Folio:</strong> {person.folio}</Typography>
        <Typography variant="body1"><strong>Nombre:</strong> {person.name} {person.surname}</Typography>
        <Typography variant="body1"><strong>Fecha de Nacimiento:</strong> {new Date(person.birth_date).toLocaleDateString()}</Typography>
        <Typography variant="body1"><strong>Género:</strong> {person.gender}</Typography>
        <Typography variant="body1"><strong>Estado Civil:</strong> {person.civil_status}</Typography>
      </Box>

      {/* Información de contacto */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Información de Contacto</Typography>
        <Divider />
        <Typography variant="body1"><strong>Teléfono:</strong> {person.phone}</Typography>
        <Typography variant="body1"><strong>Dirección:</strong> {person.address}, {person.estate}</Typography>
        <Typography variant="body1"><strong>Foráneo:</strong> {person.foreign ? 'Sí' : 'No'}</Typography>
      </Box>

      {/* Información académica */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Información Académica</Typography>
        <Divider />
        <Typography variant="body1"><strong>Últimos Estudios:</strong> {person.last_studies}</Typography>
        <Typography variant="body1"><strong>Ocupación:</strong> {person.occupation}</Typography>
      </Box>

      {/* Estado */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>Estado</Typography>
        <Divider />
        {getStatusBadge(person.status)}
      </Box>

      {/* Archivos PDF subidos */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>Documentos</Typography>
        <Divider />

        {/* Comprobante de domicilio */}
        {person.address_proof ? (
          <Box mt={2}>
            <Typography variant="body1">Comprobante de Domicilio:</Typography>
            <Link 
              href={`data:application/pdf;base64,${person.address_proof}`} 
              target="_blank" 
              download="Comprobante_Domicilio.pdf"
              sx={{ 
                textDecoration: 'none',
                color: '#1976d2',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Descargar Comprobante
            </Link>
          </Box>
        ) : (
          <Typography variant="body2" color="textSecondary">No hay comprobante de domicilio disponible</Typography>
        )}

        {/* Identificación */}
        {person.id_card ? (
          <Box mt={2}>
            <Typography variant="body1">Identificación:</Typography>
            <Link 
              href={`data:application/pdf;base64,${person.id_card}`} 
              target="_blank" 
              download="Identificacion.pdf"
              sx={{ 
                textDecoration: 'none',
                color: '#1976d2',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Descargar Identificación
            </Link>
          </Box>
        ) : (
          <Typography variant="body2" color="textSecondary">No hay identificación disponible</Typography>
        )}
      </Box>

      {/* Botones de acción */}
      <Box mt={5} textAlign="right">
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
    </Box>
  );
}

export default UserProfile;
