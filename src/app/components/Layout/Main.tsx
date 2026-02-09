import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import Header from '../Navigation/Header';

const Layout = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;
