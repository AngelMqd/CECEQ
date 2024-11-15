import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Link } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import { Heading } from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import BasicInfo from './BasicInfo';
import ContactInfo from './ContactInfo';
import AddressInfo from './AddressInfo';
import StudiesInfo from './StudiesInfo';
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

  // Construir las URLs correctas usando la ruta /uploads como se guarda en la base de datos
  const addressProofUrl = person.address_proof ? `http://localhost:3001${person.address_proof}` : null;
  const idCardUrl = person.id_card ? `http://localhost:3001${person.id_card}` : null;

  return (
    <Box sx={{ p: 4, backgroundColor: '#FFF', borderRadius: '6px', boxShadow: 3, maxWidth: '1000px', margin: '0 auto' }}>
      <Heading size="lg" mb={5}>Perfil de Usuario</Heading>

      {/* Renderizar los componentes de información */}
      <BasicInfo person={person} />
      <ContactInfo person={person} getStatusBadge={getStatusBadge} />
      <AddressInfo person={person} />
      <StudiesInfo person={person} />

      {/* Archivos PDF subidos */}
      <Box mt={4}>
        <Typography variant="h6">Documentos</Typography>

        {/* Comprobante de domicilio */}
        {addressProofUrl ? (
          <Box mt={2}>
            <Typography variant="body1">Comprobante de Domicilio:</Typography>
            <Link 
              href={addressProofUrl} 
              target="_blank" 
              download
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
        {idCardUrl ? (
          <Box mt={2}>
            <Typography variant="body1">Identificación:</Typography>
            <Link 
              href={idCardUrl} 
              target="_blank" 
              download
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
          sx={{ textTransform: 'none', ml: 2, color: '#006400', borderColor: '#006400', '&:hover': { backgroundColor: '#00640010', borderColor: '#006400' }}}
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