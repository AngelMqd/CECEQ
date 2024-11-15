import React from 'react';
import { Box } from '@mui/material';

// Importar los íconos necesarios
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import PeopleIcon from '@mui/icons-material/People';

import SidebarSection from './SidebarSection';

const Sidebar = ({ isOpen, onViewChange, activeView }) => {
  const sections = [
    {
      title: "Panel de control",
      items: [
        {
          title: "Panel de control",
          icon: <DashboardIcon sx={{ color: '#9c88ff' }} />,
          onClick: () => onViewChange('panel', 'Panel de control', [{ label: 'Home', path: '/' }]),
          view: 'panel',
        }
      ]
    },
    {
      title: "Autenticación y autorización",
      items: [
        {
          title: "Grupos",
          icon: <GroupIcon sx={{ color: '#9c88ff' }} />,
          onClick: () => onViewChange('grupos', 'Grupos', [{ label: 'Home', path: '/' }, { label: 'Autenticación y autorización', path: '/auth' }]),
          view: 'grupos',
        },
        {
          title: "Usuarios",
          icon: <AccountCircleIcon sx={{ color: '#9c88ff' }} />,
          onClick: () => onViewChange('usuarios', 'Usuarios', [{ label: 'Home', path: '/' }, { label: 'Autenticación y autorización', path: '/auth' }, { label: 'Usuarios', path: '/usuarios' }]), // Añadimos el breadcrumb para "Usuarios"
          view: 'usuarios',
        }
      ]
    },
    {
      title: "Informática",
      items: [
        {
          title: "Asistencias",
          icon: <CheckCircleIcon sx={{ color: '#9c88ff' }} />,
          onClick: () => onViewChange('asistencias', 'Asistencias', [{ label: 'Home', path: '/' }, { label: 'Informática', path: '/informatica' }]),
          view: 'asistencias',
        }
      ]
    },
    {
      title: "Usuarios",
      items: [
        {
          title: "Disabilitys",
          icon: <AccessibilityIcon sx={{ color: '#9c88ff' }} />,
          onClick: () => onViewChange('disabilitys', 'Disabilitys', [{ label: 'Home', path: '/' }, { label: 'Usuarios', path: '/usuarios' }, { label: 'Disabilitys', path: '/disabilitys' }]), // Añadimos breadcrumb de "Disabilitys"
          view: 'disabilitys',
        },
        {
          title: "Personas",
          icon: <PeopleIcon sx={{ color: '#9c88ff' }} />,
          onClick: () => onViewChange('personas', 'Personas', [{ label: 'Home', path: '/' }, { label: 'Usuarios', path: '/usuarios' }, { label: 'Personas', path: '/personas' }]),
          view: 'personas',
        }
      ]
    }
  ];

  return (
    <Box
      sx={{
        width: isOpen ? { xs: 250, sm: 250 } : { xs: 80, sm: 80 },
        bgcolor: 'white',
        height: 'calc(100vh - 80px)',
        padding: isOpen ? '10px' : '6px',
        transition: 'width 0.3s ease, opacity 0.3s ease',
        overflowY: 'auto',
        position: 'fixed',
        top: 95,
        left: 0,
        zIndex: 5,
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#BDA6DE',
          borderRadius: '10px',
        },
      }}
    >
      {sections.map((section, index) => (
        <SidebarSection 
          key={index} 
          isOpen={isOpen} 
          title={section.title} 
          items={section.items} 
          activeView={activeView} // Verificamos la vista activa
        />
      ))}
    </Box>
  );
};

export default Sidebar;
