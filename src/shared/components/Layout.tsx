import { Outlet } from 'react-router-dom';
import { Container, Box } from '@mui/material';

export default function Layout() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 8 }}>
        <Outlet />
      </Box>
    </Container>
  );
}
