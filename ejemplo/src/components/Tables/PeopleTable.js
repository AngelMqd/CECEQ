import React, { useEffect, useState } from 'react';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow, Button, Avatar } from '@mui/material';
import { PictureAsPdf, SaveAlt } from '@mui/icons-material';
import UserSearch from './UserSearch';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EnhancedTableHead from './EnhancedTableHead';
import CustomColumnSelect from './CustomColumnSelect';

const headCells = [
  { id: 'folio', numeric: false, disablePadding: false, label: 'Folio', defaultChecked: true },
  { id: 'photo', numeric: false, disablePadding: false, label: 'Foto', defaultChecked: true },
  { id: 'name', numeric: false, disablePadding: false, label: 'Nombre', defaultChecked: true },
  { id: 'surname', numeric: false, disablePadding: false, label: 'Apellido', defaultChecked: true },
  { id: 'gender', numeric: false, disablePadding: false, label: 'Género', defaultChecked: true },
  { id: 'phone', numeric: false, disablePadding: false, label: 'Teléfono', defaultChecked: true },
  { id: 'civil_status', numeric: false, disablePadding: false, label: 'Estado Civil', defaultChecked: false },
  { id: 'address', numeric: false, disablePadding: false, label: 'Dirección', defaultChecked: false },
  { id: 'estate', numeric: false, disablePadding: false, label: 'Estado', defaultChecked: false },
  { id: 'foreign', numeric: false, disablePadding: false, label: 'Extranjero', defaultChecked: false },
  { id: 'occupation', numeric: false, disablePadding: false, label: 'Ocupación', defaultChecked: false },
  { id: 'last_studies', numeric: false, disablePadding: false, label: 'Últimos Estudios', defaultChecked: false },
  { id: 'created_at', numeric: false, disablePadding: false, label: 'Creado', defaultChecked: false },
  { id: 'updated_at', numeric: false, disablePadding: false, label: 'Actualizado', defaultChecked: false },
];

function PeopleTable({ onSelectPerson }) {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [page, setPage] = useState(0);
  const [dense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedColumns, setSelectedColumns] = useState(
    headCells.map((column) => ({ ...column, checked: column.defaultChecked }))
  );

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/api/personas')
      .then(response => {
        const updatedRows = response.data.map(row => ({
          ...row,
          photo: row.photo ? `data:image/jpeg;base64,${row.photo}` : null, // Convertir Base64 a URL de imagen
        }));
        setRows(updatedRows);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleColumnChange = (column) => {
    const updatedColumns = selectedColumns.map((col) =>
      col.id === column.id ? { ...col, checked: !col.checked } : col
    );
    setSelectedColumns(updatedColumns);
  };

  const filterBySearch = (row) => {
    const lowercasedSearch = searchTerm.toLowerCase();
    return (
      (row.name?.toLowerCase().includes(lowercasedSearch) || '') ||
      (row.surname?.toLowerCase().includes(lowercasedSearch) || '') ||
      (row.folio?.toString().includes(lowercasedSearch) || '')
    );
  };

  const filteredRows = rows
    .filter(filterBySearch)
    .sort((a, b) => {
      if (orderBy) {
        if (order === 'asc') {
          return a[orderBy] > b[orderBy] ? 1 : -1;
        } else {
          return a[orderBy] < b[orderBy] ? 1 : -1;
        }
      }
      return 0;
    });

  const handleRowClick = (person) => {
    navigate(`/perfil/${person.id}`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Lista de Personas', 20, 10);
    doc.autoTable({
      theme: 'striped',
      head: [selectedColumns.filter(col => col.checked).map((col) => col.label)],
      body: filteredRows.map((row) =>
        selectedColumns.filter(col => col.checked).map((col) => row[col.id]?.toString() || '')
      ),
    });
    doc.save('personas.pdf');
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredRows.map(row =>
      selectedColumns.filter(col => col.checked).reduce((acc, col) => {
        acc[col.label] = row[col.id];
        return acc;
      }, {})
    ));
    XLSX.utils.book_append_sheet(wb, ws, 'Personas');
    XLSX.writeFile(wb, 'personas.xlsx');
  };

  const handleImageError = (event) => {
    event.target.src = ''; // Si no encuentra la imagen, remueve el src para que no intente cargar una imagen rota
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 1,
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          '@media (max-width: 768px)': {
            gap: 1,
            flexDirection: 'row',
            justifyContent: 'center',
          },
        }}
      >
        <UserSearch searchTerm={searchTerm} handleSearch={handleSearch} />
        <CustomColumnSelect selectedColumns={selectedColumns} handleColumnChange={handleColumnChange} />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={exportToPDF}
            variant="outlined"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.3,
              padding: '2px 6px',
              fontSize: '12px',
              color: '#d32f2f',
              borderColor: '#f8d7da',
              backgroundColor: 'rgba(248, 215, 218, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(248, 215, 218, 0.5)',
                borderColor: '#d32f2f',
              }
            }}
            startIcon={<PictureAsPdf fontSize="small" />}
          >
            PDF
          </Button>
          <Button
            onClick={exportToExcel}
            variant="outlined"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.3,
              padding: '5px 8px',
              fontSize: '12px',
              color: '#388e3c',
              borderColor: '#d4edda',
              backgroundColor: 'rgba(212, 237, 218, 0.3)',
              '&:hover': {
                backgroundColor: 'rgba(212, 237, 218, 0.5)',
                borderColor: '#388e3c',
              }
            }}
            startIcon={<SaveAlt fontSize="small" />}
          >
            Excel
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} size={dense ? 'small' : 'medium'}>
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              selectedColumns={selectedColumns.filter(col => col.checked)}
            />
            <TableBody>
              {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow hover tabIndex={-1} key={index} onClick={() => handleRowClick(row)} sx={{ cursor: 'pointer' }}>
                  {selectedColumns.filter(col => col.checked).map((col) => (
                    <TableCell key={col.id} align="center">
                      {col.id === 'photo' ? (
                        row[col.id] ? (
                          <Avatar       
                          sx={{ width: 56, height: 56 }}
                            src={row[col.id]}
                            alt="Avatar"
                            onError={handleImageError}
                          />
                        ) : (
                          <Avatar sx={{ width: 56, height: 56 }}>N/A</Avatar> // Avatar gris si no hay foto
                        )
                      ) : (
                        row[col.id]?.toString() || ''
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
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
