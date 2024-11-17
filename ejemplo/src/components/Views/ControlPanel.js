import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import CRUDForm from '../Crud/CRUDForm'; // Ajusta la ruta si es necesario
import { useNavigate } from 'react-router-dom';

const ControlPanel = ({ addGroup }) => {
  const navigate = useNavigate();

  const handleCreateGroup = (groupName) => {
    addGroup(groupName); // Agrega el grupo al estado global
    navigate('/grupos'); // Redirige a la vista de grupos
  };

  return (
    <Box p={4}>
      <CRUDForm addGroup={handleCreateGroup} /> {/* Pasa la función */}
    </Box>
  );
};

export default ControlPanel;
