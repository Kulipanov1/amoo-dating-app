import React from 'react';
import { Box, CircularProgress, Typography, Backdrop } from '@mui/material';

interface LoadingOverlayProps {
  open: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ open, message = 'Загрузка...' }) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
      <Typography variant="h6" component="div">
        {message}
      </Typography>
    </Backdrop>
  );
};

export default LoadingOverlay; 