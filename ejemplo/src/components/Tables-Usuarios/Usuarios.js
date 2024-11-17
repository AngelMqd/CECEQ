import React from 'react';
import HeaderUsuarios from '../Header/Header'; // Encabezado para Usuarios
import PeopleTable from '../Tables/PeopleTable'; // Asegúrate de que la ruta es correcta


const Usuarios = ({ onLogout }) => {
  return (
    <div>
       <HeaderUsuarios onLogout={onLogout} /> {/* Pasar onLogout al Header */}
      {/* Inserta la tabla aquí */}
      <PeopleTable /> 
    </div>
  );
};

export default Usuarios;
