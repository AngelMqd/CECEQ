import React, { useState, useEffect } from "react";
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
} from "@chakra-ui/react";
import {
  ExitToApp,
  Search,
  Settings,
  Notifications,
  Menu,
  Add,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BadgeAvatars from "./badgeAvatars";
import SearchBar from "./searchBar";
import { useBreakpointValue } from "@chakra-ui/react";

const Header = ({ toggleSidebar, onLogout }) => {
  const { onOpen } = useDisclosure(); // Manejo del modal de notificaciones
  const [notifications, setNotifications] = useState([]); // Inicialización como array vacío
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
        const storedUser = localStorage.getItem("usuario");
        if (!storedUser) {
          console.error("No hay usuario autenticado.");
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser?.id;
        if (!userId) {
          console.error("El ID del usuario no está disponible.");
          return;
        }

        const response = await axios.get(
          `http://localhost:3001/api/user-avatar/${userId}`
        );
        if (response.data && response.data.avatar) {
          setUserPhoto(response.data.avatar);
        } else {
          console.warn("No se encontró la foto del usuario.");
        }
      } catch (error) {
        console.error("Error al obtener la foto del usuario:", error);
      }
    };

    fetchUserPhoto();
  }, []);

  // Cargar notificaciones
  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/notifications");
      console.log("Datos obtenidos desde el backend:", response.data);
      setNotifications(response.data || []); // Asegura que sea un array, incluso si no hay datos
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);
    }
  };
  
  useEffect(() => {
    console.log("Notificaciones actualizadas en el estado:", notifications);
  }, [notifications]);
  

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Maneja la apertura del cuadro de notificaciones
  const handleOpenNotifications = () => {
    fetchNotifications();
    onOpen(); // Abre el popover
  };

  // Marcar una notificación como vista
  const handleMarkAsChecked = async (id) => {
    try {
      // Realizar la solicitud para marcar como vista
      const response = await axios.put(`http://localhost:3001/api/notifications/${id}/check`);
      console.log("Respuesta después de marcar como visto:", response.data);
  
      // Actualizar el estado de notificaciones eliminando la marcada
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notif) => notif.id !== id)
      );
    } catch (error) {
      console.error("Error al marcar notificación como vista:", error);
    }
  };
  
  
  
  
  

  const handleAddPerson = () => {
    navigate("/registrar-persona");
  };

  const toggleLogoutMenu = () => {
    setShowLogout(!showLogout);
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
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
                color: "#6E40C9",
                bg: "rgba(106, 39, 196, 0.1)",
                _hover: { bg: "rgba(106, 39, 196, 0.3)" },
                _active: { bg: "rgba(106, 39, 196, 0.5)" },
                borderRadius: "10px",
                padding: "6px",
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
                  color: "#6E40C9",
                  bg: "rgba(106, 39, 196, 0.1)",
                  _hover: { bg: "rgba(106, 39, 196, 0.3)" },
                  _active: { bg: "rgba(106, 39, 196, 0.5)" },
                  borderRadius: "10px",
                  padding: "6px",
                }}
              />
            )}
          </HStack>

          <HStack spacing={4} alignItems="center">
            <Popover>
              <PopoverTrigger>
                <IconButton
                  aria-label="Notificaciones"
                  icon={<Notifications fontSize="small" />}
                  variant="ghost"
                  onClick={handleOpenNotifications}
                  sx={{
                    color: notifications.length > 0 ? "red" : "#6E40C9",
                    bg: "rgba(106, 39, 196, 0.1)",
                    _hover: { bg: "rgba(106, 39, 196, 0.3)" },
                    _active: { bg: "rgba(106, 39, 196, 0.5)" },
                    borderRadius: "10px",
                    padding: "6px",
                  }}
                />
              </PopoverTrigger>
              <PopoverContent
                borderRadius="lg"
                boxShadow="md"
                bg="white"
                p={4}
                w="350px"
                overflowY="auto"
                maxHeight="400px"
              >
                <VStack align="start" spacing={4} p={2}>
                  {loading ? (
                    <Text>Cargando notificaciones...</Text>
                  ) : notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <Box
                        key={notif.id}
                        borderWidth="1px"
                        borderRadius="lg"
                        p={4}
                        w="100%"
                        bg="gray.50"
                        display="flex"
                        flexDirection="column"
                        _hover={{ bg: "gray.100" }}
                        boxShadow="sm"
                        mb={2}
                      >
                        <HStack justifyContent="space-between">
                          <Text fontWeight="bold" color="#6E40C9">
                            Área: {notif.area_name}
                          </Text>
                          <Text fontSize="xs" color="gray.500">
                            {new Date(notif.date_issued).toLocaleDateString()}
                          </Text>
                        </HStack>
                        <Text mt={1} fontSize="sm" color="gray.700">
                          Persona: {notif.main_persona_name}
                        </Text>
                        <Text mt={1} fontSize="sm" color="gray.700">
                          Razón: {notif.reason}
                        </Text>
                        <Button
                          size="sm"
                          mt={3}
                          bg="#6E40C9"
                          color="white"
                          _hover={{ bg: "#53299C" }}
                          _active={{ bg: "#6E40C9" }}
                          onClick={() => handleMarkAsChecked(notif.id)}
                        >
                          Marcar como visto
                        </Button>
                      </Box>
                    ))
                  ) : (
                    <Text fontSize="sm" color="gray.600">
                      No hay notificaciones disponibles.
                    </Text>
                  )}
                </VStack>
              </PopoverContent>
            </Popover>

            <IconButton
              aria-label="Add Person"
              icon={<Add fontSize="small" />}
              variant="ghost"
              onClick={handleAddPerson}
              sx={{
                color: "#6E40C9",
                bg: "rgba(106, 39, 196, 0.1)",
                _hover: { bg: "rgba(106, 39, 196, 0.3)" },
                _active: { bg: "rgba(106, 39, 196, 0.5)" },
                borderRadius: "10px",
                padding: "6px",
              }}
            />

            <IconButton
              aria-label="Settings"
              icon={<Settings fontSize="small" />}
              variant="ghost"
              sx={{
                color: "#6E40C9",
                bg: "rgba(106, 39, 196, 0.1)",
                _hover: { bg: "rgba(106, 39, 196, 0.3)" },
                _active: { bg: "rgba(106, 39, 196, 0.5)" },
                borderRadius: "10px",
                padding: "6px",
              }}
            />

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
                    <ExitToApp style={{ color: "#6E40C9", fontSize: "18px" }} />
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
    </>
  );
};

export default Header;
