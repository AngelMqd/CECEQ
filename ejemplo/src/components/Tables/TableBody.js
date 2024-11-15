import React from 'react';
import { TableBody, TableRow, TableCell } from '@mui/material';

function EnhancedTableBody({ rows, emptyRows, dense }) {
  return (
    <TableBody>
      {rows.map((row, index) => (
        <TableRow
          hover
          tabIndex={-1}
          key={index}
          sx={{ cursor: 'pointer' }}
        >
          <TableCell align="center">
            <img
              src={`http://localhost:3001/uploads/${row.photo}`}
              alt={row.name}
              style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '50%' }}
            />
          </TableCell>
          <TableCell align="left">{row.name}</TableCell>
          <TableCell align="left">{row.surname}</TableCell>
          <TableCell align="left">{row.birth_date}</TableCell>
          <TableCell align="left">{row.gender}</TableCell>
        </TableRow>
      ))}
      {emptyRows > 0 && (
        <TableRow
          style={{
            height: (dense ? 33 : 53) * emptyRows,
          }}
        >
          <TableCell colSpan={11} />
        </TableRow>
      )}
    </TableBody>
  );
}

export default EnhancedTableBody;
