import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListPersons() {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    async function fetchPersons() {
      try {
        const response = await axios.get('http://localhost:3001/api/persona');
        setPersons(response.data);
      } catch (error) {
        console.error('Error al obtener los registros:', error);
      }
    }

    fetchPersons();
  }, []);

  return (
    <div>
      <h2>Lista de Personas Registradas</h2>
      <ul>
        {persons.map((person) => (
          <li key={person.id}>
            {person.name} {person.surname} - {person.phone}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListPersons;
