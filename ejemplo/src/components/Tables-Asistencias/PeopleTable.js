import React, { useEffect, useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Button, Avatar, TableHead } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';

const headCells = [
  { id: 'folio', label: 'Folio' },
  { id: 'photo', label: 'Foto' },
  { id: 'name', label: 'Nombre' },
  { id: 'surname', label: 'Apellido' },
  { id: 'phone', label: 'Teléfono' },
  { id: 'status', label: 'Status' },
  { id: 'asistencia', label: 'Asistencia' }
];

function PeopleTable() {
  const [rows, setRows] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filterType, setFilterType] = useState(null);

  useEffect(() => {
    fetchData();
  }, [filterType]);

  const fetchData = async () => {
    try {
      let response;
      if (filterType === 'today') {
        const today = format(new Date(), 'yyyy-MM-dd');
        response = await axios.get(`http://localhost:3001/api/assistence/dia/${today}`);
      } else if (filterType === 'month') {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        response = await axios.get(`http://localhost:3001/api/assistence/mes/${currentYear}/${currentMonth}`);
      } else if (filterType === 'year') {
        const currentYear = new Date().getFullYear();
        response = await axios.get(`http://localhost:3001/api/assistence/ano/${currentYear}`);
      } else if (filterType === 'inasistencias') {
        response = await axios.get('http://localhost:3001/api/inasistencias');
      } else {
        response = await axios.get('http://localhost:3001/api/personas');
      }
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        <Button variant="contained" onClick={() => setFilterType('today')}>Asistencias de Hoy</Button>
        <Button variant="contained" onClick={() => setFilterType('month')}>Asistencias del Mes</Button>
        <Button variant="contained" onClick={() => setFilterType('year')}>Asistencias del Año</Button>
        <Button variant="contained" onClick={() => setFilterType('inasistencias')}>Inasistencias</Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} size="medium">
            <TableHead>
              <TableRow>
                {headCells.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    align="center"
                    sortDirection={orderBy === headCell.id ? order : false}
                    onClick={(event) => handleRequestSort(event, headCell.id)}
                  >
                    {headCell.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
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
                  <TableCell align="center">
                    <Button variant="contained" color="primary">
                      Entrada
                    </Button>
                    <Button variant="contained" color="secondary" style={{ marginLeft: '8px' }}>
                      Salida
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
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}

export default PeopleTable;
