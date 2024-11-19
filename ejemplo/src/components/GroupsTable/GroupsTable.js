import React, { useState } from 'react';
import { Box, Text, Button, Input, Flex, Icon, VStack } from '@chakra-ui/react';
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

  const handleSaveClick = async (id) => {
    try {
      const updatedGroups = groups.map((group) =>
        group.id === id
          ? { ...group, area_name: editedGroupName, abbreviation: editedAbbreviation }
          : group
      );
      setGroups(updatedGroups);
      setEditingGroup(null);
      alert('Grupo actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar el grupo:', error);
      alert('Hubo un error al actualizar el grupo');
    }
  };

  const handleDeleteClick = (id) => {
    const updatedGroups = groups.filter((group) => group.id !== id);
    setGroups(updatedGroups);
    alert('Grupo eliminado con éxito');
  };

  return (
    <VStack spacing={4} align="stretch" p={4}>
      {groups.map((group) => (
        <Box
          key={group.id}
          bg="white"
          borderRadius="md"
          boxShadow="md"
          p={4}
          border="1px solid"
          borderColor="gray.200"
        >
          <Flex justify="space-between" align="center">
            <Box>
              <Text fontSize="lg" fontWeight="bold">
                Nombre del Grupo: {editingGroup === group.id ? (
                  <Input
                    value={editedGroupName}
                    onChange={(e) => setEditedGroupName(e.target.value)}
                    placeholder="Nuevo nombre del grupo"
                  />
                ) : (
                  group.area_name
                )}
              </Text>
              <Text fontSize="md" color="gray.500">
                Abreviación: {editingGroup === group.id ? (
                  <Input
                    value={editedAbbreviation}
                    onChange={(e) => setEditedAbbreviation(e.target.value)}
                    placeholder="Nueva abreviación"
                  />
                ) : (
                  group.abbreviation
                )}
              </Text>
            </Box>
            <Flex>
              {editingGroup === group.id ? (
                <Button
                  size="sm"
                  colorScheme="green"
                  mr={2}
                  onClick={() => handleSaveClick(group.id)}
                >
                  <Icon as={FaSave} color="white" mr={2} />
                  Guardar
                </Button>
              ) : (
                <Button
                  size="sm"
                  bg="transparent"
                  _hover={{ bg: 'purple.100' }}
                  mr={2}
                  onClick={() => handleEditClick(group)}
                >
                  <Icon as={FaEdit} color="purple.600" mr={2} />
                  Editar
                </Button>
              )}
              <Button
                size="sm"
                bg="transparent"
                _hover={{ bg: 'red.100' }}
                onClick={() => handleDeleteClick(group.id)}
              >
                <Icon as={FaTrash} color="red.600" mr={2} />
                Eliminar
              </Button>
            </Flex>
          </Flex>
        </Box>
      ))}
    </VStack>
  );
};

export default GroupsTable;
