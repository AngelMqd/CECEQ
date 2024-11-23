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
import { CalendarToday as CalendarIcon } from '@mui/icons-material';
import { Modal, DialogContent, Typography } from '@mui/material';
import Calendar from 'react-calendar';
import './PeopleTable.css';
import 'react-calendar/dist/Calendar.css';



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
  const [openModal, setOpenModal] = useState(false);
 
  const [attendanceDetails, setAttendanceDetails] = useState([]); // Detalles de asistencias
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/assistence');
      const formattedData = response.data.map((row) => ({
        ...row,
        hora_entrada: row.hora_entrada
        ? format(new Date(row.hora_entrada), 'yyyy-MM-dd HH:mm:ss') // Formatear hora de entrada
        : null,
      hora_salida: row.hora_salida
        ? format(new Date(row.hora_salida), 'yyyy-MM-dd HH:mm:ss') // Formatear hora de salida
        : null,
        photo: row.photo
          ? `data:image/jpeg;base64,${row.photo}` // Para Base64
          : `http://localhost:3001/uploads/${row.photo}`, // Para rutas
      
      }));
      setRows(formattedData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };
  
  
  const handleDateClick = async (date) => {
    const formattedDate = format(date, 'yyyy-MM-dd'); // Formatear la fecha como en el backend
    try {
      const response = await axios.get(`http://localhost:3001/api/assistence/date/${formattedDate}`);
      setAttendanceDetails(response.data || []); // Guardar los detalles en el estado
    } catch (error) {
      console.error('Error al cargar las asistencias:', error);
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
    <>
    
      <Box sx={{ width: '100%' }}>
        {/* Botón para abrir el calendario */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CalendarIcon />}
            onClick={() => setOpenModal(true)} // Abre el modal
            sx={{
              backgroundColor: '#6200ea', // Color morado
              '&:hover': { backgroundColor: '#4500b5' }, // Hover
              fontWeight: 'bold',
              textTransform: 'none',
              borderRadius: '8px',
            }}
          >
            Ver Calendario Del Historial
          </Button>
        </Box>
  
        {/* Tabla principal con asistencias */}
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
  
      {/* Modal para mostrar el calendario y los detalles */}
      <Modal
  open={openModal}
  onClose={() => setOpenModal(false)}
  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
>
  <DialogContent
    sx={{
      width: '80%',
      height: '80%',
      display: 'flex',
      flexDirection: 'row',
      gap: 2,
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: 3,
    }}
  >
    {/* Calendario en el lado izquierdo */}
    <Box sx={{ flex: 1 }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Selecciona una fecha:
      </Typography>
      <Calendar
        onClickDay={(date) => handleDateClick(date)}
        tileClassName={({ date }) => {
          const formattedDate = format(date, 'yyyy-MM-dd');
          return rows.some((row) => row.hora_entrada && row.hora_entrada.startsWith(formattedDate))
            ? 'highlight' // Clase personalizada para fechas con asistencias
            : null;
        }}
      />
    </Box>

    {/* Detalles de asistencia en el lado derecho */}
    <Box sx={{ flex: 2, overflowY: 'auto', maxHeight: '400px' }}>
      {attendanceDetails.length > 0 ? (
        attendanceDetails.map((detail, index) => (
          <Box
            key={index}
            sx={{
              padding: 3,
              marginBottom: 2,
              border: '1px solid #e0e0e0',
              borderRadius: '12px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#f5f5fa',
              maxWidth: '400px',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <Typography sx={{ color: '#333', fontWeight: 'bold', fontSize: '16px' }}>
              Persona: {detail.name} {detail.surname}
            </Typography>

            <Typography
              sx={{
                color: '#4caf50',
                fontSize: '14px',
              }}
            >
              Entrada: 
              {detail.hora_entrada
                ? ` ${format(new Date(detail.hora_entrada), 'dd/MM/yyyy')}  ${format(
                    new Date(detail.hora_entrada),
                    'hh:mm a'
                  )}`
                : 'No registrada'}
            </Typography>

            <Typography
              sx={{
                color: '#f44336',
                fontSize: '14px',
              }}
            >
              Salida: 
              {detail.hora_salida
                ? ` ${format(new Date(detail.hora_salida), 'dd/MM/yyyy')}  ${format(
                    new Date(detail.hora_salida),
                    'hh:mm a'
                  )}`
                : 'No registrada'}
            </Typography>

            <Typography sx={{ color: '#757575', fontSize: '14px' }}>
              Evento: {detail.section_event || 'No especificado'}
            </Typography>
          </Box>
        ))
      ) : (
        <Typography>No hay registros de asistencia para esta fecha.</Typography>
      )}
    </Box>
  </DialogContent>
</Modal>


    </>
  );
  
}

export default PeopleTable;
