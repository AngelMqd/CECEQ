// src/components/SearchBar.js
import React from 'react';
import { Input, InputGroup, InputLeftElement, IconButton, useColorModeValue } from '@chakra-ui/react';
import { Search, Tune } from '@mui/icons-material';

const SearchBar = () => {
  return (
    <InputGroup
      w="500px" // Ajusta el ancho según la imagen
      bg={useColorModeValue('gray.50', 'gray.700')} // Fondo claro
      borderRadius="lg" // Bordes más redondeados para un look similar a la imagen
      boxShadow="sm" // Sombra suave alrededor
      pl={4} // Espaciado interno a la izquierda
      py={1} // Espaciado interno vertical
      alignItems="center" // Centrar verticalmente
    >
      <InputLeftElement
        pointerEvents="none"
        children={<Search style={{ fontSize: 30, color: "#9e9e9e" }} />} // Icono de búsqueda ajustado en tamaño y color
        mt="4px" // Margen superior para centrar verticalmente
        mr="20px" // Margen derecho
        h="50px"// Altura del botón de filtro
        w="70px" 
        border="none"
      />
      <Input
        type="text"
        placeholder="Search users..."
        border="none" // Sin borde para un diseño limpio
        _focus={{
            outline: "none", // Sin borde de selección
          boxShadow: 'none', // Sin sombra al hacer foco
        }}
        _placeholder={{
          color: 'gray.500', // Color del placeholder
        }}
        h="50px" // Altura del input
        pl="50px" // Espaciado a la izquierda del texto
        pr="70px" // Espaciado a la derecha para evitar el solapamiento con el icono
        bg="transparent" // Fondo transparente
      />
      <IconButton
        aria-label="Filter"
        icon={<Tune style={{ fontSize: 22 }} />} // Tamaño del icono de filtro ajustado
        borderRadius="lg" // Bordes redondeados
        position="absolute" // Posicionamiento absoluto para alinear a la derecha
        right="0" // Alinear a la derecha
        mt="4px" // Margen superior para centrar verticalmente
        mr="20px" // Margen derecho
        h="40px"// Altura del botón de filtro
        w="40px" 
        bg="rgba(139, 92, 246, 0.1)" // Color de fondo claro
        _hover={{
          color: 'rgba(255, 255, 255)',
          bg: 'rgba(139, 92, 246, 0.3)', // Fondo más oscuro al pasar el cursor
        }}
        _active={{
          bg: 'rgba(139, 92, 246, 0.5)', // Fondo más oscuro al hacer clic
        }}
      />
    </InputGroup>
  );
};

export default SearchBar;
