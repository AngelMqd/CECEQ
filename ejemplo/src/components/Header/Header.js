import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Box,
  Text,
  HStack,
  VStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import {
  ExitToApp,
  Tune,
  Search,
  Settings,
  Notifications,
  Menu,
  Add,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BadgeAvatars from './badgeAvatars';
import SearchBar from './searchBar';
import { useBreakpointValue } from '@chakra-ui/react';


const Header = ({ toggleSidebar, onLogout }) => {
  const { isOpen, onOpen, onClose } = useDisclosure(); // Manejo del modal de notificaciones
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null); // Foto del usuario
  const showSearchFull = useBreakpointValue({ base: false, lg: true });
  const navigate = useNavigate();

  // Obtener datos del usuario autenticado
  useEffect(() => {
    const fetchUserPhoto = async () => {
      try {
        const storedUser = localStorage.getItem('usuario'); // Obtenemos el usuario de localStorage
        if (!storedUser) {
          console.error('No hay usuario autenticado.');
          return;
        }

        const parsedUser = JSON.parse(storedUser); // Parseamos el JSON
        const userId = parsedUser?.id; // Obtenemos el ID del usuario de la tabla `auth_user`
        if (!userId) {
          console.error('El ID del usuario no está disponible.');
          return;
        }

        // Obtenemos la información del usuario y su foto
        const response = await axios.get(`http://localhost:3001/api/user-avatar/${userId}`);
        if (response.data && response.data.avatar) {
          setUserPhoto(response.data.avatar); // Convertimos el blob en base64 para mostrarlo como imagen
        } else {
          console.warn('No se encontró la foto del usuario.');
        }
      } catch (error) {
        console.error('Error al obtener la foto del usuario:', error);
      }
    };

    fetchUserPhoto();
  }, []);

  // Maneja la apertura del modal y carga las notificaciones
  const handleOpenNotifications = () => {
    setNotifications([]); // Limpia las notificaciones anteriores
    fetchNotifications(); // Carga las nuevas
    onOpen(); // Abre el modal
  };
  

  // Función para cargar las notificaciones desde la tabla `warnings`
  const fetchNotifications = async () => {
    try {
      console.log('Intentando obtener notificaciones...');
      const response = await axios.get('http://localhost:3001/api/notifications');
      console.log('Notificaciones recibidas:', response.data);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error al cargar las notificaciones:', error.message);
    }
  };
  

    useEffect(() => {
    console.log('Notificaciones en el estado:', notifications);
  }, [notifications]);
  
  
  
  
  
  // Función para marcar la notificación como revisada
  const handleMarkAsChecked = async (id) => {
    try {
        await axios.put(`http://localhost:3001/api/notifications/${id}/check`);
        setNotifications(notifications.filter((notif) => notif.id !== id)); // Elimina la notificación revisada
    } catch (error) {
        console.error('Error al marcar la notificación como revisada:', error);
    }
};

  
  

  const handleAddPerson = () => {
    navigate('/registrar-persona');
  };

  const toggleLogoutMenu = () => {
    setShowLogout(!showLogout);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    onLogout();
  };

  return (
    <>
      <Box
        bg="white"
        px={4}
        py={2}
        position="fixed"
        w="full"
        top="0"
        left="0"
        zIndex="1"
      >
        <HStack justifyContent="space-between" alignItems="center">
          <HStack spacing={5} alignItems="center">
            <Text fontSize="xl" fontWeight="bold" color="black" pr="70px">
              SAG
            </Text>
            <IconButton
              aria-label="Menu"
              icon={<Menu fontSize="small" />}
              onClick={toggleSidebar}
              variant="ghost"
              sx={{
                color: '#6E40C9',
                bg: 'rgba(106, 39, 196, 0.1)',
                _hover: { bg: 'rgba(106, 39, 196, 0.3)' },
                _active: { bg: 'rgba(106, 39, 196, 0.5)' },
                borderRadius: '10px',
                padding: '6px',
              }}
            />
            {showSearchFull ? (
              <SearchBar />
            ) : (
              <IconButton
                aria-label="Search"
                icon={<Search fontSize="small" />}
                variant="ghost"
                onClick={() => setSearchOpen(!searchOpen)}
                sx={{
                  color: '#6E40C9',
                  bg: 'rgba(106, 39, 196, 0.1)',
                  _hover: { bg: 'rgba(106, 39, 196, 0.3)' },
                  _active: { bg: 'rgba(106, 39, 196, 0.5)' },
                  borderRadius: '10px',
                  padding: '6px',
                }}
              />
            )}
          </HStack>

          <HStack spacing={4} alignItems="center">
            <IconButton
              aria-label="Notificaciones"
              icon={<Notifications fontSize="small" />}
              variant="ghost"
              onClick={handleOpenNotifications}
              sx={{
                color: '#6E40C9',
                bg: 'rgba(106, 39, 196, 0.1)',
                _hover: { bg: 'rgba(106, 39, 196, 0.3)' },
                _active: { bg: 'rgba(106, 39, 196, 0.5)' },
                borderRadius: '10px',
                padding: '6px',
              }}
            />

            <IconButton
              aria-label="Add Person"
              icon={<Add fontSize="small" />}
              variant="ghost"
              onClick={handleAddPerson}
              sx={{
                color: '#6E40C9',
                bg: 'rgba(106, 39, 196, 0.1)',
                _hover: { bg: 'rgba(106, 39, 196, 0.3)' },
                _active: { bg: 'rgba(106, 39, 196, 0.5)' },
                borderRadius: '10px',
                padding: '6px',
              }}
            />

            <IconButton
              aria-label="Settings"
              icon={<Settings fontSize="small" />}
              variant="ghost"
              sx={{
                color: '#6E40C9',
                bg: 'rgba(106, 39, 196, 0.1)',
                _hover: { bg: 'rgba(106, 39, 196, 0.3)' },
                _active: { bg: 'rgba(106, 39, 196, 0.5)' },
                borderRadius: '10px',
                padding: '6px',
              }}
            />

            {/* Icono de Usuario con Dropdown de Cerrar Sesión */}
            <Box position="relative">
              <IconButton
                aria-label="User menu"
                icon={
                  userPhoto ? (
                    <BadgeAvatars avatarUrl={userPhoto} />
                  ) : (
                    <Text color="gray.500">Sin foto</Text>
                  )
                }
                onClick={toggleLogoutMenu}
                variant="ghost"
              />
              {showLogout && (
                <Box
                  position="absolute"
                  top="100%"
                  right="0"
                  bg="white"
                  border="1px solid #ddd"
                  borderRadius="8px"
                  p="4px 8px"
                  mt="4px"
                  cursor="pointer"
                  boxShadow="md"
                  onClick={handleLogout}
                >
                  <HStack spacing={1} alignItems="center" whiteSpace="nowrap">
                    <ExitToApp style={{ color: '#6E40C9', fontSize: '18px' }} />
                    <Text color="#6E40C9" fontSize="sm">
                      Cerrar sesión
                    </Text>
                  </HStack>
                </Box>
              )}
            </Box>
          </HStack>
        </HStack>
      </Box>

      {/* Modal para mostrar notificaciones */}
  <Box
        bg="white"
        px={4}
        py={2}
        position="fixed"
        w="full"
        top="0"
        left="0"
        zIndex="1"
      >
        <HStack justifyContent="space-between" alignItems="center">
          <HStack spacing={5} alignItems="center">
            <Text fontSize="xl" fontWeight="bold" color="black" pr="70px">
              SAG
            </Text>
            <IconButton
              aria-label="Menu"
              icon={<Menu fontSize="small" />}
              onClick={toggleSidebar}
              variant="ghost"
              sx={{
                color: '#6E40C9',
                bg: 'rgba(106, 39, 196, 0.1)',
                _hover: { bg: 'rgba(106, 39, 196, 0.3)' },
                _active: { bg: 'rgba(106, 39, 196, 0.5)' },
                borderRadius: '10px',
                padding: '6px',
              }}
            />
            {showSearchFull && <SearchBar />}
          </HStack>

          <HStack spacing={4} alignItems="center">
            {/* Notificaciones */}
            <Popover>
              <PopoverTrigger>
              <IconButton
  aria-label="Notificaciones"
  icon={<Notifications fontSize="small" />}
  variant="ghost"
  onClick={handleOpenNotifications}
  sx={{
    color: notifications.length > 0 ? 'red' : '#6E40C9', // Cambia el color si hay notificaciones
    bg: 'rgba(106, 39, 196, 0.1)',
    _hover: { bg: 'rgba(106, 39, 196, 0.3)' },
    _active: { bg: 'rgba(106, 39, 196, 0.5)' },
    borderRadius: '10px',
    padding: '6px',
  }}
/>


              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>Notificaciones</PopoverHeader>
                <PopoverBody>
  {loading ? (
    <Text>Cargando notificaciones...</Text>
  ) : notifications.length > 0 ? (
    <VStack align="start" spacing={4}>
      {notifications.map((notif) => (
        <Box key={notif.id} borderWidth="1px" borderRadius="lg" p={4} w="100%" bg="gray.50">
          <Text><strong>Área:</strong> {notif.area_name}</Text>
          <Text><strong>Persona:</strong> {notif.main_persona_name}</Text>
          <Text><strong>Razón:</strong> {notif.reason}</Text>
          <Text><strong>Fecha de emisión:</strong> {new Date(notif.date_issued).toLocaleDateString()}</Text>
          <Button
            size="sm"
            mt={2}
            colorScheme="purple"
            onClick={() => handleMarkAsChecked(notif.id)}
          >
            Marcar como visto
          </Button>
        </Box>
      ))}
    </VStack>
  ) : (
    <Text>No hay notificaciones disponibles.</Text>
  )}
</PopoverBody>


              </PopoverContent>
            </Popover>

            <IconButton
              aria-label="Add Person"
              icon={<Add fontSize="small" />}
              variant="ghost"
              onClick={handleAddPerson}
              sx={{
                color: '#6E40C9',
                bg: 'rgba(106, 39, 196, 0.1)',
                _hover: { bg: 'rgba(106, 39, 196, 0.3)' },
                _active: { bg: 'rgba(106, 39, 196, 0.5)' },
                borderRadius: '10px',
                padding: '6px',
              }}
            />

            <IconButton
              aria-label="Settings"
              icon={<Settings fontSize="small" />}
              variant="ghost"
              sx={{
                color: '#6E40C9',
                bg: 'rgba(106, 39, 196, 0.1)',
                _hover: { bg: 'rgba(106, 39, 196, 0.3)' },
                _active: { bg: 'rgba(106, 39, 196, 0.5)' },
                borderRadius: '10px',
                padding: '6px',
              }}
            />

            <Box position="relative">
              <IconButton
                aria-label="User menu"
                icon={userPhoto ? <BadgeAvatars avatarUrl={userPhoto} /> : <Text color="gray.500">Sin foto</Text>}
                onClick={toggleLogoutMenu}
                variant="ghost"
              />
            </Box>
          </HStack>
        </HStack>
      </Box>


    </>
  );
};

export default Header;
