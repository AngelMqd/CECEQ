import React from 'react';
import HeaderAsistencias from '../Header/Header';
import PeopleTable from '../Tables-Asistencias/PeopleTable'; // Asegúrate de que la ruta es correcta

const Asistencias = ({ onLogout }) => {
  return (
    <div>
      <HeaderAsistencias onLogout={onLogout} /> {/* Pasa onLogout al encabezado */}    
      {/* Inserta la tabla aquí */}
      <PeopleTable /> 
    </div>
  );
};

export default Asistencias;
