import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Heading } from '@chakra-ui/react';
import CRUDForm from '../components/CRUDForm';

const ControlPanel = () => {
  const navigate = useNavigate();

  const handleNavigateToGroups = () => {
    navigate('/grupos'); // Redirige a la vista de grupos
  };

  return (
    <Box p={4}>
      <Heading mb={4}>Panel de Control</Heading>
      <CRUDForm /> {/* CRUD para crear grupos */}
      <Button 
        colorScheme="purple" 
        mt={4} 
        onClick={handleNavigateToGroups}
      >
        Ver Grupos
      </Button>
    </Box>
  );
};

export default ControlPanel;
