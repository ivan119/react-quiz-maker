import { AppBar, Container, Toolbar } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PreviewText } from '../ui';

const Header = () => {
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
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
