import React, { useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Button, Input, Flex, Icon } from '@chakra-ui/react';
import { FaEdit, FaSave, FaTrash } from 'react-icons/fa';

const GroupsTable = ({ groups, setGroups }) => {
  const [editingGroup, setEditingGroup] = useState(null);
  const [editedGroupName, setEditedGroupName] = useState('');
  const [editedAbbreviation, setEditedAbbreviation] = useState('');

  const handleEditClick = (group) => {
    setEditingGroup(group.id);
    setEditedGroupName(group.area_name);
    setEditedAbbreviation(group.abbreviation);
  };

  const handleSaveClick = (id) => {
    // Actualiza los datos en la API o en el estado local
    const updatedGroups = groups.map((group) =>
      group.id === id
        ? { ...group, area_name: editedGroupName, abbreviation: editedAbbreviation }
        : group
    );
    setGroups(updatedGroups);
    setEditingGroup(null);
  };

  const handleDeleteClick = (id) => {
    // Elimina el grupo de la lista
    const updatedGroups = groups.filter((group) => group.id !== id);
    setGroups(updatedGroups);
    alert('Grupo eliminado con éxito');
  };

  return (
    <Box>
      <Table variant="striped" colorScheme="purple" mt={4}>
        <Thead>
          <Tr>
            <Th>Nombre del Grupo</Th>
            <Th>Abreviación</Th>
            <Th>Acciones</Th>
          </Tr>
        </Thead>
        <Tbody>
          {groups.map((group) => (
            <Tr key={group.id}>
              <Td>
                {editingGroup === group.id ? (
                  <Input
                    value={editedGroupName}
                    onChange={(e) => setEditedGroupName(e.target.value)}
                    placeholder="Nuevo nombre del grupo"
                  />
                ) : (
                  group.area_name
                )}
              </Td>
              <Td>
                {editingGroup === group.id ? (
                  <Input
                    value={editedAbbreviation}
                    onChange={(e) => setEditedAbbreviation(e.target.value)}
                    placeholder="Nueva abreviación"
                  />
                ) : (
                  group.abbreviation
                )}
              </Td>
              <Td>
                {editingGroup === group.id ? (
                  <Button
                    size="sm"
                    colorScheme="green"
                    mr={2}
                    onClick={() => handleSaveClick(group.id)}
                  >
                    <Icon as={FaSave} mr={2} />
                    Guardar
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    colorScheme="blue"
                    mr={2}
                    onClick={() => handleEditClick(group)}
                  >
                    <Icon as={FaEdit} mr={2} />
                    Editar
                  </Button>
                )}
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDeleteClick(group.id)}
                >
                  <Icon as={FaTrash} mr={2} />
                  Eliminar
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default GroupsTable;
