import React, { useState, useEffect } from 'react';
import { Box, Text, Badge, Input, Button, Select, HStack, VStack, Tag, TagLabel, TagCloseButton } from '@chakra-ui/react';
const UserTable = ({ usuarios }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filter, setFilter] = useState({ status: '', area: '' });
  const [selectedFilters, setSelectedFilters] = useState([]);
  useEffect(() => {
    const filterUsers = usuarios.filter(usuario => 
      usuario.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter.status ? usuario.status === filter.status : true) &&
      (filter.area ? usuario.area === filter.area : true)
    );
    setFilteredUsers(filterUsers);
  }, [searchTerm, filter, usuarios]);
  const hasMissingInfo = (usuario) => {
    return !usuario.user_name|| usuario.user_last_name || !usuario.email || !usuario.status || !usuario.role || !usuario.area;
  };
  const addFilter = (key, value) => {
    if (!selectedFilters.find(filter => filter.key === key && filter.value === value)) {
      setSelectedFilters([...selectedFilters, { key, value }]);
      setFilter({ ...filter, [key]: value });
    }
  };
  const removeFilter = (key) => {
    const updatedFilters = selectedFilters.filter(filter => filter.key !== key);
    setSelectedFilters(updatedFilters);
    setFilter({ ...filter, [key]: '' });
  };
  return (
    <Box>
      {/* Filtros y Búsqueda */}
      <HStack spacing={4} mb={4} alignItems="center">
        <Input
          placeholder="Buscar por nombre o apellido"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="lg"
        />
        {/* Menú desplegable para seleccionar filtros */}
        <Select
          placeholder="Filtrar por estado"
          onChange={(e) => addFilter('status', e.target.value)}
          width="250px" 
          size="lg" 
          borderRadius="full" 
          padding="20px" 
        >
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </Select>
        <Select
          placeholder="Filtrar por área"
          onChange={(e) => addFilter('area', e.target.value)}
          width="250px" 
          size="lg"
          borderRadius="full" 
          padding="20px"
        >
          <option value="admin">Admin</option>
          <option value="user">Usuario</option>
        </Select>
        <Button
          size="lg"
          borderRadius="full"
          colorScheme="blue"
          onClick={() => {
            setSelectedFilters([]);
            setFilter({ status: '', area: '' });
            setSearchTerm('');
          }}
        >
          Limpiar Filtros
        </Button>
      </HStack>

      {/* Mostrar los filtros seleccionados */}
      <HStack spacing={2} mb={4}>
        {selectedFilters.map((filter, index) => (
          <Tag
            size="lg" 
            key={index}
            borderRadius="full"
            variant="solid"
            bg="#E0F7FF"
            color="#007ACC" 
            px={4} 
            py={2}
          >
            <TagLabel>{filter.key.charAt(0).toUpperCase() + filter.key.slice(1)}: {filter.value}</TagLabel>
            <TagCloseButton onClick={() => removeFilter(filter.key)} />
          </Tag>
        ))}
      </HStack>

      {/* Tabla de Usuarios */}
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f4f4f4' }}>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Nombre</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>FechaR</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Estado</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Rol</th>
              <th style={{ border: '1px solid #ddd', padding: '12px' }}>Editar</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((usuario) => (
                <tr key={usuario.id_user}>
                  <td style={{ border: '1px solid #ddd', padding: '12px', display: 'flex', alignItems: 'center' }}>
                    <img src={usuario.avatar || 'ruta/default-avatar.png'} alt={usuario.user_name || 'Usuario'} style={{ borderRadius: '50%', width: '40px', marginRight: '10px' }} />
                    <VStack align="start">
                      <Text fontWeight="bold">{(usuario.user_name +" " +usuario.user_last_name)  || 'Información faltante'}</Text>
                      <Text fontSize="sm">{usuario.email || 'Información faltante'}</Text>
                    </VStack>
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                    <Text>{usuario.title || 'Información faltante'}</Text>
                    <Text fontSize="sm" color="gray.500">{usuario.area || 'Información faltante'}</Text>
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '12px' }}>
                    {usuario.status ? (
                      <Badge colorScheme={usuario.status === 'active' ? 'green' : 'red'}>
                        {usuario.status.charAt(0).toUpperCase() + usuario.status.slice(1)}
                      </Badge>
                    ) : (
                      <Badge colorScheme="red">Información faltante</Badge>
                    )}
                  </td>
                  <td style={{ border: '1px solid #ddd', padding: '12px' }}>{usuario.role || 'Información faltante'}</td>
                  <td style={{ border: '1px solid #ddd', padding: '12px', color: 'blue', cursor: 'pointer' }}>
                    {hasMissingInfo(usuario) ? 'Completar' : 'Editar'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>No hay datos disponibles</td>
              </tr>
            )}
          </tbody>
        </table>
      </Box>
    </Box>
  );
};

export default UserTable;
