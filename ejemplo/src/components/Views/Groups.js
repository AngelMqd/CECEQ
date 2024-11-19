import React, { useState, useEffect } from 'react';
import { Box, Spinner, Text } from '@chakra-ui/react';
import GroupsTable from '../GroupsTable/GroupsTable'; // Asegúrate de importar correctamente
import axios from 'axios';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para cargar los datos
  const fetchGroups = async () => {
    try {
      console.log('Intentando cargar grupos...');
      const response = await axios.get('http://localhost:3001/api/areas');
      console.log('Grupos cargados:', response.data);
      setGroups(response.data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar los grupos:', err);
      setError('Error al cargar los grupos.');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchGroups(); // Carga los datos al montar el componente
  }, []);

  return (
    <Box p={4}>
      {loading ? (
        <Box textAlign="center">
          <Spinner size="xl" />
          <Text mt={4} color="gray.500">
            Cargando grupos...
          </Text>
        </Box>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <GroupsTable groups={groups} /> // Renderiza la tabla con los datos
      )}
    </Box>
  );
};

export default Groups;
