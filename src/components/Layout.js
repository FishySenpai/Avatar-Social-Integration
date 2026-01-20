import React from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import GlobalFooter from './GlobalFooter';

const Layout = ({ children, showFooter = true }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100%',
        overflowX: 'hidden',
      }}
    >
      <Header />
      <Box component="main" sx={{ flexGrow: 1, width: '100%', overflowX: 'hidden' }}>
        {children}
      </Box>
      {showFooter && <GlobalFooter />}
    </Box>
  );
};

export default Layout;

