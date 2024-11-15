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
      top: '-1px',
      left: '-1px',
      right: '0px',
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
      transform: 'scale(.12)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2)',
      opacity: 0,
    },
  },
}));

export default function BadgeAvatars({ userId }) {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/user-avatar/${userId}`);
        if (!response.ok) {
          throw new Error('Error al obtener el avatar');
        }
        const data = await response.json();
        setAvatarUrl(`http://localhost:3001${data.avatarUrl}`);
      } catch (error) {
        console.error('Error al obtener la URL del avatar:', error);
      }
    };

    fetchAvatar();
  }, [userId]);

  return (
    <Stack direction="row" spacing={3}>
      <StyledBadge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        variant="dot"
      >
        <Avatar alt="User Avatar" src={avatarUrl || '/static/images/avatar/default.jpg'} />
      </StyledBadge>
    </Stack>
  );
}
