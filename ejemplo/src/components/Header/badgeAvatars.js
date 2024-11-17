import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(0.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const BadgeAvatars = ({ userId }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        // Realizamos la solicitud para obtener el avatar
        const response = await fetch(`http://localhost:3001/api/user-avatar/${userId}`);
        if (!response.ok) {
          throw new Error('Error al obtener el avatar');
        }

        // Obtenemos y procesamos la respuesta
        const data = await response.json();
        if (data.photo) {
          // Convertimos la foto en base64 para usarla como fuente
          setAvatarUrl(`data:image/jpeg;base64,${data.photo}`);
        } else {
          console.warn('No se encontró foto en la respuesta.');
        }
      } catch (error) {
        console.error('Error al obtener la foto del avatar:', error);
      }
    };

    if (userId) {
      fetchAvatar();
    } else {
      console.warn('El ID del usuario no está definido.');
    }
  }, [userId]);

  return (
    <Stack direction="row" spacing={2}>
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
      >
        <Avatar
          alt="Avatar"
          src={avatarUrl || '/static/images/avatar/default.jpg'} // Usamos un avatar por defecto si no se obtiene uno
        />
      </StyledBadge>
    </Stack>
  );
};

export default BadgeAvatars;
