import React from 'react';
import ReactDOM from 'react-dom/client'; 
import { BrowserRouter as Router } from 'react-router-dom'; // Router para la navegación
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'; // ChakraProvider aquí

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router> {/* Aquí está tu único Router */}
      <ChakraProvider> {/* ChakraProvider aquí para envolver toda la app */}
        <App />
      </ChakraProvider>
    </Router>
  </React.StrictMode>
);
