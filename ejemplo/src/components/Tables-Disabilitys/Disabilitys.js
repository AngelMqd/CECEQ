import React from 'react';
import PeopleTable from '../Tables/PeopleTable'; // Usa la tabla que necesites

const Disabilitys = ({ onLogout }) => {
  return (
    <div>
      <PeopleTable /> {/* Inserta la tabla correspondiente aquí */}
    </div>
  );
};

export default Disabilitys;
