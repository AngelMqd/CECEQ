import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input } from '@chakra-ui/react';

const CRUDForm = ({ addGroup }) => {
  const [groupName, setGroupName] = useState('');

  const handleCreateGroup = () => {
    if (groupName.trim()) {
      addGroup(groupName);
      setGroupName(''); // Limpia el campo del formulario
    }
  };

  return (
    <Box
      bg="gray.50"
      p={6}
      borderRadius="md"
      boxShadow="lg"
      width="100%"
      maxW="400px"
      mx="auto"
      mt="8"
    >
      <FormControl id="groupName" isRequired>
        <FormLabel>Nombre del Grupo</FormLabel>
        <Input
          placeholder="Ingrese el nombre del grupo"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </FormControl>
      <Button mt={4} colorScheme="purple" onClick={handleCreateGroup}>
        Crear Grupo
      </Button>
    </Box>
  );
};

export default CRUDForm;
