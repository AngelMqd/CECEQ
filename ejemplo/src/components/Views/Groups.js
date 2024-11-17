import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import GroupsTable from '../GroupsTable/GroupsTable'; // Ajusta la ruta si es necesario

const Groups = ({ groups }) => {
  return (
    <Box p={4}>
      <Heading mb={4}>Grupos</Heading>
      <GroupsTable groups={groups} /> {/* Pasa los grupos como prop */}
    </Box>
  );
};

export default Groups;
