import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, Input, Flex, Icon, Text } from '@chakra-ui/react';
import { FaUserPlus, FaTag } from 'react-icons/fa';
import axios from 'axios';

const CRUDForm = ({ refreshGroups }) => {
  const [groupName, setGroupName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');

  const handleCreateGroup = async () => {
    if (!groupName.trim() || !abbreviation.trim()) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    const data = {
      area_name: groupName,
      abbreviation,
    };

    try {
      await axios.post('http://localhost:3001/api/areas', data);
      alert('Grupo creado con éxito');
      setGroupName('');
      setAbbreviation('');
      if (refreshGroups) refreshGroups();
    } catch (error) {
      console.error('Error al crear el grupo:', error.message);
      alert('Hubo un problema al crear el grupo.');
    }
  };

  return (
    <Flex justify="center" align="center" height="100%">
      <Box
        bg="white"
        p={6}
        boxShadow="xl"
        borderRadius="md"
        border="1px solid"
        borderColor="gray.200"
        maxWidth="400px"
        width="100%"
      >
        <Text fontSize="xl" fontWeight="bold" mb={4} color="purple.700" textAlign="center">
          Crear Grupo
        </Text>
        <FormControl>
          <FormLabel>
            <Flex align="center">
              <Icon as={FaUserPlus} color="purple.600" mr={2} />
              Nombre del Grupo
            </Flex>
          </FormLabel>
          <Input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Nombre del grupo"
            focusBorderColor="purple.500"
          />
        </FormControl>
        <FormControl mt={4}>
          <FormLabel>
            <Flex align="center">
              <Icon as={FaTag} color="purple.600" mr={2} />
              Abreviación
            </Flex>
          </FormLabel>
          <Input
            value={abbreviation}
            onChange={(e) => setAbbreviation(e.target.value)}
            placeholder="Abreviación del grupo"
            focusBorderColor="purple.500"
          />
        </FormControl>
        <Button
          mt={6}
          colorScheme="purple"
          width="100%"
          _hover={{ bg: 'purple.300' }}
          onClick={handleCreateGroup}
        >
          Crear Grupo
        </Button>
      </Box>
    </Flex>
  );
};

export default CRUDForm;
