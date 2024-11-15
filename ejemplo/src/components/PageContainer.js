// src/components/PageContainer.js
import React from 'react';
import { Box, Heading, Divider } from '@chakra-ui/react';
import Breadcrumbs from './Breadcrumbs';

const PageContainer = ({ title, children }) => {
  return (
    <Box padding="4" maxWidth="1200px" margin="0 auto">
      <Breadcrumbs />
      <Heading as="h1" size="lg" marginY="4" >
        {title}
      </Heading>
      <Divider marginBottom="4" />
      {children}
    </Box>
  );
};

export default PageContainer;
