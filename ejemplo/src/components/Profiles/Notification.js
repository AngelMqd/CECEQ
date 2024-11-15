import React from 'react';
import { Snackbar, Alert } from '@mui/material';

function Notification({ notification, handleCloseNotification }) {
  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={6000}
      onClose={handleCloseNotification}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert
        severity={notification.type}
        sx={{
          width: '100%',
          backgroundColor: '#ffffff',
          color: '#333',
          borderRadius: '16px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)',
        }}
      >
        {notification.message}
      </Alert>
    </Snackbar>
  );
}

export default Notification;
