// src/context/AppContext.js
import React, { createContext, useState } from 'react';

// Crear el contexto
export const AppContext = createContext();

export const AppProvider = ({ children, navigation }) => {
  const [currentSegment, setCurrentSegment] = useState('home');

  // Función para cambiar de segmento (página actual)
  const navigateTo = (segment) => {
    setCurrentSegment(segment);
  };

  // Obtener la ruta actual para el Breadcrumb
  const getBreadcrumbs = () => {
    let path = [];
    let found = false;

    // Función recursiva para buscar el segmento actual en la estructura de navegación
    const searchPath = (items, segment) => {
      for (let item of items) {
        if (item.segment === segment) {
          path.push(item);
          found = true;
          return;
        }
        if (item.children) {
          path.push(item);
          searchPath(item.children, segment);
          if (found) return;
          path.pop();
        }
      }
    };

    searchPath(navigation, currentSegment);
    return path;
  };

  return (
    <AppContext.Provider
      value={{
        currentSegment,
        navigateTo,
        getBreadcrumbs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
