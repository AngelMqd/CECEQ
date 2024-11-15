// src/components/LogoutButton.js
import React from 'react';
import { Box, Text, IconButton } from '@chakra-ui/react';
import { ExitToApp } from '@mui/icons-material';

const LogoutButton = ({ onLogout }) => {
  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      onClick={onLogout}
      bg="white"
      border="1px solid #ddd"
      borderRadius="8px"
      p="8px 12px"
      cursor="pointer"
      boxShadow="md"
      _hover={{ bg: 'rgba(106, 39, 196, 0.1)' }}
    >
      <ExitToApp style={{ color: '#6E40C9', marginRight: '8px' }} />
      <Text color="#6E40C9" fontSize="sm">Cerrar sesión</Text>
    </Box>
  );
};

export default LogoutButton;
