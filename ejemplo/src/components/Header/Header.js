import React, { useState } from 'react';
import BadgeAvatars from './badgeAvatars';
import SearchBar from './searchBar';
import { IconButton, Box, Text, HStack, Input, InputGroup, InputLeftElement, useColorModeValue, useBreakpointValue, Collapse } from '@chakra-ui/react';
import { ExitToApp, Tune, Search, Settings, Notifications, Menu, Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Header = ({ toggleSidebar, onLogout }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const showSearchFull = useBreakpointValue({ base: false, lg: true });
  const navigate = useNavigate();

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
        bg={useColorModeValue('white', 'gray.900')}
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
            <Text fontSize="xl" fontWeight="bold" color="black" pr="70px">SAG</Text>
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
              aria-label="Notifications"
              icon={<Notifications fontSize="small" />}
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
                icon={<BadgeAvatars />}
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
                    <Text color="#6E40C9" fontSize="sm">Cerrar sesión</Text>
                  </HStack>
                </Box>
              )}
            </Box>
          </HStack>
        </HStack>

        {!showSearchFull && (
          <Collapse in={searchOpen} animateOpacity>
            <InputGroup mt={5} w="full">
              <InputLeftElement
                pointerEvents="none"
                children={<Search style={{ fontSize: 28, color: "#9e9e9e" }} />}
              />
              <Input
                type="text"
                placeholder="Search users..."
                border="none"
                _focus={{ outline: "none", boxShadow: 'none' }}
                _placeholder={{ color: 'gray.500' }}
                h="30px"
                pl="50px"
                pr="270px"
                bg="transparent"
              />
              <IconButton
                aria-label="Filter"
                icon={<Tune style={{ fontSize: 22 }} />}
                borderRadius="lg"
                position="absolute"
                right="0"
                mt="-10px"
                mr="10px"
                h="40px"
                w="40px"
                bg="rgba(139, 92, 246, 0.1)"
                _hover={{ color: 'rgba(255, 255, 255)', bg: 'rgba(139, 92, 246, 0.3)' }}
                _active={{ bg: 'rgba(139, 92, 246, 0.5)' }}
              />
            </InputGroup>
          </Collapse>
        )}
      </Box>
    </>
  );
};

export default Header;
