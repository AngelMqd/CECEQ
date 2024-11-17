import React, { useState } from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, IconButton } from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';

const GroupsTable = () => {
  const [groups, setGroups] = useState([
    { id: 1, name: 'Grupo 1' },
    { id: 2, name: 'Grupo 2' },
  ]);

  const handleEdit = (id) => {
    console.log(`Editar grupo con ID: ${id}`);
  };

  const handleDelete = (id) => {
    setGroups(groups.filter((group) => group.id !== id));
  };

  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>Nombre</Th>
          <Th>Acciones</Th>
        </Tr>
      </Thead>
      <Tbody>
        {groups.map((group) => (
          <Tr key={group.id}>
            <Td>{group.id}</Td>
            <Td>{group.name}</Td>
            <Td>
              <IconButton 
                icon={<EditIcon />} 
                onClick={() => handleEdit(group.id)} 
                mr={2} 
                aria-label="Editar" 
              />
              <IconButton 
                icon={<DeleteIcon />} 
                onClick={() => handleDelete(group.id)} 
                aria-label="Eliminar" 
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default GroupsTable;
