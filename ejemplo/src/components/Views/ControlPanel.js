import React, { useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import CRUDForm from '../Crud/CRUDForm';

const ControlPanel = () => {
  const [error, setError] = useState(null); // Estado para manejar errores

  return (
    <Box p={4}>
      {error && (
        <Text color="red.500" mb={4}>
          {error}
        </Text>
      )}
      <CRUDForm />
    </Box>
  );
};

export default ControlPanel;
