import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

const GroupsTable = ({ groups }) => {
  return (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>ID</Th>
          <Th>Nombre del Grupo</Th>
        </Tr>
      </Thead>
      <Tbody>
        {groups.map((group) => (
          <Tr key={group.id}>
            <Td>{group.id}</Td>
            <Td>{group.name}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default GroupsTable;
