import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack } from '@chakra-ui/react';

const CRUDForm = () => {
  const [groupName, setGroupName] = useState('');

  const handleCreateGroup = () => {
    // Aquí puedes hacer una petición para guardar el grupo en la base de datos
    console.log(`Grupo creado: ${groupName}`);
    setGroupName(''); // Limpia el formulario
  };

  return (
    <Box>
      <VStack spacing={4}>
        <FormControl>
          <FormLabel>Nombre del Grupo</FormLabel>
          <Input 
            placeholder="Ingrese el nombre del grupo"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </FormControl>
        <Button colorScheme="purple" onClick={handleCreateGroup}>
          Crear Grupo
        </Button>
      </VStack>
    </Box>
  );
};

export default CRUDForm;
