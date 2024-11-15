// src/components/Breadcrumbs.js
import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';

const Breadcrumbs = ({ title, breadcrumbs }) => {
  return (
    <div style={{ marginBottom: '16px' }}>
      <Typography variant="h4" gutterBottom>{title}</Typography>
      <MuiBreadcrumbs aria-label="breadcrumb">
        {breadcrumbs.map((breadcrumb, index) => (
          <Link 
            key={index} 
            underline="hover" 
            color="inherit" 
            href={breadcrumb.path}
            sx={{ cursor: 'pointer', color: '#6c63ff' }} // Ajusta el estilo del breadcrumb
          >
            {breadcrumb.label}
          </Link>
        ))}
        <Typography color="text.primary">{title}</Typography>
      </MuiBreadcrumbs>
    </div>
  );
};

export default Breadcrumbs;
