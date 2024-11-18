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
  const [rowsPerPage, setRowsPerPage] = useState(25);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/assistence');
      const formattedData = response.data.map((row) => ({
        ...row,
        photo: row.photo ? `data:image/jpeg;base64,${row.photo}` : null, // Procesar fotos en Base64
        hora_entrada: row.hora_entrada
          ? format(new Date(row.hora_entrada), 'yyyy-MM-dd HH:mm:ss') // Formatear hora de entrada
          : null,
        hora_salida: row.hora_salida
          ? format(new Date(row.hora_salida), 'yyyy-MM-dd HH:mm:ss') // Formatear hora de salida
          : null,
      }));
      setRows(formattedData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };
  

  const handleEntrada = async (main_persona_id) => {
    if (!main_persona_id) {
      alert('ID de usuario inválido.');
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/api/assistence/entrada/${main_persona_id}`
      );
      alert(response.data.message);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al registrar entrada.');
    }
  };

  const handleSalida = async (main_persona_id) => {
    if (!main_persona_id) {
      alert('ID de usuario inválido.');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3001/api/assistence/salida/${main_persona_id}`
      );
      alert(response.data.message);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Error al registrar salida.');
    }
  };

  const renderActionButton = (row) => {
    if (!row.hora_entrada || (row.hora_entrada && row.hora_salida)) {
      // Si no hay hora de entrada o si ambas están completadas, muestra el botón de entrada
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleEntrada(row.main_persona_id)}
        >
          Registrar Entrada
        </Button>
      );
    } else if (row.hora_entrada && !row.hora_salida) {
      // Si hay entrada pero no salida, muestra el botón de salida
      return (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleSalida(row.main_persona_id)}
        >
          Registrar Salida
        </Button>
      );
    } else {
      // Si ambas están completadas y no se permite nueva entrada, muestra "Completado"
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
                        <Avatar src={row.photo} alt="Foto" sx={{ width: 56, height: 56 }} />
                      ) : (
                        <Avatar sx={{ width: 56, height: 56 }}>N/A</Avatar>
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 25));
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
     
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
          rowsPerPageOptions={[25, 50, 100]}
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
