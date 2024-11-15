import React from 'react';
import { List, Typography } from '@mui/material';
import SidebarItem from './SidebarItem';

const SidebarSection = ({ isOpen, title, items, activeView }) => {
  return (
    <div>
      {isOpen && (
        <Typography 
          variant="subtitle2" 
          sx={{ 
            mb: 1, 
            color: '#7f8fa6', 
            textAlign: 'left', 
            paddingLeft: '16px' // Alinear el título con los ítems
          }}
        >
          {title}
        </Typography>
      )}
      <List>
        {items.map((item, index) => (
          <SidebarItem
            key={index}
            isOpen={isOpen}
            title={item.title}
            icon={item.icon}
            onClick={item.onClick}
            isSelected={activeView === item.view}
          />
        ))}
      </List>
    </div>
  );
};

export default SidebarSection;
