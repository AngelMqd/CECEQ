import React, { useState, useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header/Header';
import Usuarios from './components/Tables-Usuarios/Usuarios';
import Disabilitys from './components/Tables-Disabilitys/Disabilitys';
import Sidebar from './components/Siderbar/Sidebar';
import PeopleTable from './components/Tables/PeopleTable';
import Breadcrumbs from './components/Breadcrumbs';
import UserProfile from './components/Profiles/UserProfile';
import Crud from './components/Views/crud';
import EditProfile from './components/Profiles/EditProfile';
import ChangeHistory from './components/Profiles/ChangeHistory';
import './App.css';
import RegisterPersonForm from './components/Views/RegisterPersonForm';
import InicioYLogin from './components/InicioYLogin';
import Asistencias from './components/Tables-Asistencias/Asistencias';


const theme = createTheme();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('usuario')); // Estado de autenticación
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [pageTitle, setPageTitle] = useState('');
  const [personas, setPersonas] = useState([]);
  const [setSelectedPerson] = useState(null);
  const navigate = useNavigate();

  // Función de logout
  const handleLogout = () => {
    console.log("Logout clicked");
    localStorage.removeItem('usuario'); // Elimina el usuario del almacenamiento local
    setIsAuthenticated(false); // Cambia el estado de autenticación a falso
    navigate('/'); // Redirige a la página principal o de inicio de sesión
  };

  // Alternar el sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Función para cambiar de vista y actualizar breadcrumbs
  const handleViewChange = (view, title, breadcrumbs) => {
    setActiveView(view);
    setPageTitle(title);
    setBreadcrumbs(breadcrumbs);
  
    // Navegar a la ruta correspondiente
    switch (view) {
      case 'personas':
        navigate('/personas');
        break;
      case 'perfil':
        navigate('/perfil');
        break;
      case 'asistencias': // Nueva vista para Asistencias
        navigate('/asistencias');
        break;
        case 'disabilitys': // Nueva vista para Asistencias
        navigate('/disabilitys');
        break;
        case 'usuarios': // Nueva vista para Asistencias
        navigate('/usuarios');
        break;
      default:
        navigate('/');
    }
  };
  

  // Función para seleccionar una persona y cambiar la vista
  const handleSelectPerson = (person) => {
    setSelectedPerson(person);
    setActiveView('perfil');
    setPageTitle(`${person.name} ${person.surname}`);
    setBreadcrumbs(['Home', 'Personas', `${person.name} ${person.surname}`]);

    // Navega a la ruta del perfil usando el ID de la persona
    navigate(`/perfil/${person.id}`);
  };

  useEffect(() => {
    if (activeView === 'personas' && personas.length === 0) {
      fetchPersonas();
    }
  }, [activeView, personas.length]);

  // Función para obtener personas de la API
  const fetchPersonas = () => {
    fetch('http://localhost:3001/api/personas')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la respuesta del servidor');
        }
        return response.json();
      })
      .then((data) => {
        setPersonas(data);
      })
      .catch((error) => {
        console.error('Error al obtener las personas:', error);
      });
  };

  return (
    <ChakraProvider>
      <MUIThemeProvider theme={theme}>
        {isAuthenticated ? (
          <>
            <Header toggleSidebar={toggleSidebar} onLogout={handleLogout} />
            <div style={{ marginTop: '70px', display: 'flex' }}>
              <Sidebar isOpen={sidebarOpen} onViewChange={handleViewChange} activeView={activeView} />
              <div
                style={{
                  flex: 1,
                  padding: 20,
                  marginLeft: sidebarOpen ? '240px' : '80px',
                  transition: 'margin 0.3s ease',
                  maxHeight: '90vh',
                  overflowY: 'auto' 
                }}
              >
                <Breadcrumbs title={pageTitle} breadcrumbs={breadcrumbs} />
                <div
                  className="contenedor-principal"
                  style={{
                    backgroundColor: '#EEF2F6',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '20px',
                    minHeight: '600px'
                  
                  }}
                >
                  <Routes>
                    {/* Tabla de personas */}
                    <Route
                      path="/personas"
                      element={<PeopleTable onSelectPerson={handleSelectPerson} personas={personas} />}
                    />
                    {/* Tabla de asistencias */}
                    <Route
                      path="/asistencias"
                      element={<Asistencias onLogout={handleLogout} />}
                    />
                    <Route 
                    path="/usuarios" 
                    element={<Usuarios onLogout={handleLogout} />} 
                    />
                    <Route 
                    path="/disabilitys" 
                    element={<Disabilitys onLogout={handleLogout} />} 
                    />
                    {/* Perfil de usuario */}
                    <Route
                      path="/perfil/:id"
                      element={<UserProfile />}
                    />
                    {/* Registro de una nueva persona */}
                    <Route path="/registrar-persona" element={<RegisterPersonForm />} />
                    <Route path="/crud" element={<Crud />} />
                    {/* Edición del perfil */}
                    <Route path="/editar-perfil/:id" element={<EditProfile />} />
                    {/* Historial de cambios */}
                    <Route path="/historial-cambios/:id" element={<ChangeHistory />} />
                    {/* Vista principal */}
                    <Route path="/" element={<h1>Contenido Principal</h1>} />
                  </Routes>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Muestra la página de inicio de sesión si no está autenticado
          <InicioYLogin onLogin={() => setIsAuthenticated(true)} />
        )}
      </MUIThemeProvider>
    </ChakraProvider>
  );
}

export default App;


kanjbahvhvhvgv