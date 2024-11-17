import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import GroupsTable from '../components/GroupsTable';

const Groups = () => {
  return (
    <Box p={4}>
      <Heading mb={4}>Grupos</Heading>
      <GroupsTable /> {/* Tabla para mostrar los grupos creados */}
    </Box>
  );
};

export default Groups;
