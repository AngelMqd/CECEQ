import React from 'react';
import { ListItem, ListItemIcon, ListItemText, Tooltip } from '@mui/material';

const SidebarItem = ({ isOpen, title, icon, onClick, isSelected }) => {
  return (
    <Tooltip title={isOpen ? "" : title} placement="right">
      <ListItem 
        button 
        sx={{ 
          justifyContent: isOpen ? 'initial' : 'center',
          padding: isOpen ? '10px 16px' : '6px',
          backgroundColor: isSelected ? 'rgba(189, 166, 222, 0.3)' : 'transparent',
          borderRadius: '12px',
          margin: '4px 0',
          '&:hover': { 
            backgroundColor: 'rgba(189, 166, 222, 0.3)', 
            borderRadius: '12px' 
          } 
        }}
        onClick={onClick}
      >
        <ListItemIcon 
          sx={{ 
            minWidth: 0, 
            mr: isOpen ? 4 : 'auto',
            justifyContent: 'center', 
            borderRadius: '12px',
            padding: '1px',
            margin: isOpen ? '0' : '4px 0',
          }}
        >
          {icon}
        </ListItemIcon>
        {isOpen && <ListItemText primary={title} sx={{ ml: 1 }} />}
      </ListItem>
    </Tooltip>
  );
};

export default SidebarItem;
