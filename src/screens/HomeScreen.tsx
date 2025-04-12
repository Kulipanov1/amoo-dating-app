import React from 'react';
import { Box, Typography } from '@mui/material';

const HomeScreen: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to Amoo
      </Typography>
    </Box>
  );
};

export default HomeScreen; 