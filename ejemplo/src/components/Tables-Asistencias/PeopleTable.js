import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Button,
  Avatar,
  TableHead,
  Tooltip,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';

const headCells = [
  { id: 'folio', label: 'Folio' },
  { id: 'photo', label: 'Foto' },
  { id: 'name', label: 'Nombre' },
  { id: 'surname', label: 'Apellido' },
  { id: 'phone', label: 'Teléfono' },
  { id: 'status', label: 'Status' },
  { id: 'hora_entrada', label: 'Hora Entrada' },
  { id: 'hora_salida', label: 'Hora Salida' },
  { id: 'accion', label: 'Acción' },
];

function PeopleTable() {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/assistence');
      // Asegurar que los datos estén formateados correctamente
      const formattedData = response.data.map((row) => ({
        ...row,
        hora_entrada: row.hora_entrada ? format(new Date(row.hora_entrada), 'yyyy-MM-dd HH:mm:ss') : null,
        hora_salida: row.hora_salida ? format(new Date(row.hora_salida), 'yyyy-MM-dd HH:mm:ss') : null,
      }));
      setRows(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleEntrada = async (folio) => {
    try {
      const response = await axios.post(`http://localhost:3001/api/assistence/entrada/${folio}`);
      alert(response.data.message);
      fetchData(); // Refrescar datos
    } catch (error) {
      alert(error.response?.data?.error || 'Error registrando entrada');
    }
  };

  const handleSalida = async (folio) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/assistence/salida/${folio}`);
      alert(response.data.message);
      fetchData(); // Refrescar datos
    } catch (error) {
      alert(error.response?.data?.error || 'Error registrando salida');
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderActionButton = (row) => {
    if (!row.hora_entrada) {
      // Mostrar botón de entrada si no tiene hora de entrada
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleEntrada(row.folio)}
        >
          Registrar Entrada
        </Button>
      );
    } else if (row.hora_entrada && !row.hora_salida) {
      // Mostrar botón de salida si tiene entrada pero no salida
      return (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleSalida(row.folio)}
        >
          Registrar Salida
        </Button>
      );
    } else {
      // Mostrar botón completado si ya tiene entrada y salida
      return (
        <Tooltip title="Registro completado">
          <Button variant="outlined" disabled>
            Completado
          </Button>
        </Tooltip>
      );
    }
  };

  const renderRows = () => {
    return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
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
        <TableCell align="center">{row.hora_entrada || 'Pendiente'}</TableCell>
        <TableCell align="center">{row.hora_salida || 'Pendiente'}</TableCell>
        <TableCell align="center">{renderActionButton(row)}</TableCell>
      </TableRow>
    ));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <h2>Registro de Asistencias</h2>
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
            <TableBody>{renderRows()}</TableBody>
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
