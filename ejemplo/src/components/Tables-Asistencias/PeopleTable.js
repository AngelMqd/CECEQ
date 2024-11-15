import React, { useEffect, useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Button, Avatar, TableHead } from '@mui/material';
import axios from 'axios';

const headCells = [
  { id: 'folio', label: 'Folio' },
  { id: 'photo', label: 'Foto' },
  { id: 'name', label: 'Nombre' },
  { id: 'surname', label: 'Apellido' },
  { id: 'phone', label: 'Teléfono' },
  { id: 'status', label: 'Status' },
  { id: 'fecha_entrada', label: 'Fecha Entrada' },
  { id: 'accion', label: 'Acción' }
];

function PeopleTable() {
  const [rows, setRows] = useState([]); // Personas sin entrada registrada
  const [enteredRows, setEnteredRows] = useState([]); // Personas con entrada registrada
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch personas sin entrada registrada
      const responsePersonas = await axios.get('http://localhost:3001/api/personas');
      setRows(responsePersonas.data);

      // Fetch personas con entrada registrada sin salida
      const responseEntradas = await axios.get('http://localhost:3001/api/assistence/entradasSinSalida');
      setEnteredRows(responseEntradas.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEntrada = async (person) => {
    console.log("ID de la persona:", person.id); // Verificar el ID
    try {
      const response = await axios.post(`http://localhost:3001/api/assistence/entrada/${person.id}`);
      const { created_at } = response.data;
  
      alert(`Entrada registrada para el usuario con ID: ${person.id}`);
  
      setEnteredRows([...enteredRows, { ...person, created_at }]);
      setRows(rows.filter(row => row.id !== person.id));
    } catch (error) {
      console.error('Error registrando entrada:', error);
      alert('Hubo un error al registrar la entrada');
    }
  };
  
  const handleSalida = async (person) => {
    try {
      await axios.put(`http://localhost:3001/api/assistence/salida/${person.id}`);
      alert(`Salida registrada para el usuario con ID: ${person.id}`);

      // Remover de la tabla de salida y actualizar
      setEnteredRows(enteredRows.filter(row => row.id !== person.id));
      fetchData(); // Refrescar ambas tablas
    } catch (error) {
      console.error('Error registrando salida:', error);
      alert(
        error.response?.data?.error ||
        'Hubo un error al registrar la salida. Por favor, intente nuevamente.'
      );
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderTable = (data, handleAction, actionLabel, showEntrada = false) => (
    <Paper sx={{ width: '100%', mb: 2 }}>
      <TableContainer>
        <Table sx={{ minWidth: 750 }} size="medium">
          <TableHead>
            <TableRow>
              {headCells.map((headCell) => (
                <TableCell key={headCell.id} align="center">
                  {headCell.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
              <TableRow hover key={index}>
                <TableCell align="center">{row.folio || 'N/A'}</TableCell>
                <TableCell align="center">
                  {row.photo ? (
                    <Avatar src={`http://localhost:3001${row.photo}`} alt="Avatar" />
                  ) : (
                    <Avatar sx={{ bgcolor: 'grey' }}>N/A</Avatar>
                  )}
                </TableCell>
                <TableCell align="center">{row.name || 'N/A'}</TableCell>
                <TableCell align="center">{row.surname || 'N/A'}</TableCell>
                <TableCell align="center">{row.phone || 'N/A'}</TableCell>
                <TableCell align="center">{row.status === 0 ? 'Activo' : 'Inactivo'}</TableCell>
                {showEntrada && <TableCell align="center">{row.created_at || 'N/A'}</TableCell>}
                <TableCell align="center">
                  <Button variant="contained" color={actionLabel === 'Registrar Entrada' ? "primary" : "secondary"} onClick={() => handleAction(row)}>
                    {actionLabel}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <h2>Registro de Entrada</h2>
      {renderTable(rows, handleEntrada, 'Registrar Entrada')}
      
      <h2>Registro de Salida</h2>
      {renderTable(enteredRows, handleSalida, 'Registrar Salida', true)}
    </Box>
  );
}

export default PeopleTable;
