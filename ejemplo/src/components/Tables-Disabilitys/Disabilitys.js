import React from 'react';
import HeaderDisabilitys from '../Header-Disabilitys/Header-disabilitys'; // Verifica esta ruta
import PeopleTable from '../Tables/PeopleTable'; // Usa la tabla que necesites

const Disabilitys = ({ onLogout }) => {
  return (
    <div>
      <HeaderDisabilitys onLogout={onLogout} /> {/* Encabezado específico para Disabilities */}
      <PeopleTable /> {/* Inserta la tabla correspondiente aquí */}
    </div>
  );
};

export default Disabilitys;
