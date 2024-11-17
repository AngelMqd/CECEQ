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
import ControlPanel from './components/Views/ControlPanel';
import Groups from './components/Views/Groups';
import CRUDForm from './components/Crud/CRUDForm';
import GroupsTable from './components/GroupsTable/GroupsTable';



const theme = createTheme();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('usuario')); // Estado de autenticación
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('');
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [pageTitle, setPageTitle] = useState('');
  const [personas, setPersonas] = useState([]);
  const [ setSelectedPerson] = useState(null); // Corregido: ahora se usa correctamente
  const navigate = useNavigate();

  const [groups, setGroups] = useState([]); // Estado para los grupos

  const addGroup = (groupName) => {
    setGroups((prevGroups) => [
      ...prevGroups,
      { id: prevGroups.length + 1, name: groupName },
    ]);
    navigate('/grupos'); // Redirige a la lista de grupos después de crear
  };

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
      case 'asistencias':
        navigate('/asistencias');
        break;
      case 'usuarios':
        navigate('/usuarios');
        break;
      case 'disabilitys':
        navigate('/disabilitys');
        break;
      case 'panelcontrol': // Manejo del panel de control
        navigate('/panelcontrol');
        break;
      case 'grupos': // Manejo de grupos
        navigate('/grupos');
        break;
      default:
        navigate('/panelcontrol'); // Por defecto, carga el panel de control
        break;
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
    const defaultRoute = '/'; // Ruta predeterminada
    const navigableRoutes = [
      '/panelcontrol',
      '/personas',
      '/asistencias',
      '/usuarios',
      '/disabilitys',
      '/grupos',
      '/crud',
      '/groups-table',
    ]; // Lista de rutas navegables
  
    if (navigableRoutes.includes(window.location.pathname) && activeView === '') {
      navigate(defaultRoute); // Redirige a la ruta predeterminada
    }
  }, [activeView, navigate]);
  
    

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
            <Header
              toggleSidebar={toggleSidebar}
              onLogout={handleLogout}
              userId={localStorage.getItem('usuario')} // Corregido: Paso del usuario autenticado
            />
            <div style={{ marginTop: '70px', display: 'flex' }}>
              <Sidebar
                isOpen={sidebarOpen}
                onViewChange={handleViewChange}
                activeView={activeView}
              />
              <div
                style={{
                  flex: 1,
                  padding: 20,
                  marginLeft: sidebarOpen ? '240px' : '80px',
                  transition: 'margin 0.3s ease',
                  maxHeight: '90vh',
                  overflowY: 'auto',
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
                    minHeight: '600px',
                  }}
                >
                  <Routes>
                    <Route
                      path="/personas"
                      element={
                        <PeopleTable
                          onSelectPerson={handleSelectPerson}
                          personas={personas}
                        />
                      }
                    />
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
                    <Route
                      path="/crud"
                      element={<CRUDForm addGroup={addGroup} />}
                    />
                    <Route
                    path="/panelcontrol"
                    element={<ControlPanel addGroup={addGroup} />}
                    />
                    <Route
                    path="/grupos"
                    element={<Groups groups={groups} />}
                    />
                    <Route
                    path="/groups-table"
                    element={<GroupsTable />}
                    />
                    <Route path="/" element={<h1>Contenido Principal</h1>} />
                    <Route path="/panelcontrol" element={<ControlPanel />} />
                    <Route path="/grupos" element={<Groups />} />
                    <Route path="/perfil/:id" element={<UserProfile />} />
                    <Route path="/registrar-persona" element={<RegisterPersonForm />} />
                    <Route path="/crud" element={<Crud />} />
                    <Route path="/editar-perfil/:id" element={<EditProfile />} />
                    <Route path="/historial-cambios/:id" element={<ChangeHistory />} />
                  </Routes>
                </div>
              </div>
            </div>
          </>
        ) : (
          <InicioYLogin onLogin={() => setIsAuthenticated(true)} />
        )}
      </MUIThemeProvider>
    </ChakraProvider>
  );
}

export default App;
