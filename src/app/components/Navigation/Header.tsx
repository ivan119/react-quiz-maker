import {
  AppBar,
  Container,
  Toolbar,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { PreviewText } from '../ui';
import { useAuth } from '../../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = () => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <PreviewText
            text="Rejd Quiz Maker"
            component={RouterLink}
            variant="h6"
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 'bold',
            }}
          />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              label={role?.toUpperCase()}
              size="small"
              color={role === 'admin' ? 'primary' : 'success'}
              sx={{ fontWeight: 'bold', color: 'white' }}
            />
            <Tooltip title="Logout">
              <IconButton color="inherit" onClick={handleLogout} size="small">
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
