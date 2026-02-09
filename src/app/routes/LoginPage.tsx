import { useEffect, type FC } from 'react';
import { Box, Container, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Button, PreviewText } from '../components/ui';

const LoginPage: FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = () => {
    login();
    navigate('/');
  };

  const adminRole = {
    title: 'REJD',
    roleLabel: 'ROLE: ADMIN',
    description:
      'Full administrator access. Create, edit, and manage all quizzes and questions.',
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 40, color: 'white' }} />,
    color: '#1976d2',
    gradient: 'linear-gradient(45deg, #1976d2, #42a5f5)',
    shadow: '0 8px 16px rgba(25, 118, 210, 0.2)',
    hoverShadow: '0 12px 24px rgba(0,0,0,0.1)',
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        padding: 3,
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <PreviewText
            text="REJD QUIZ"
            variant="h2"
            sx={{
              fontWeight: 800,
              color: 'text.primary',
              letterSpacing: '-1.5px',
              mb: 1,
              fontSize: { xs: '2.5rem', sm: '3rem', md: '3.75rem' },
            }}
          />
          <PreviewText
            text="Administrator Entrance"
            variant="h6"
            sx={{
              color: 'text.secondary',
              fontWeight: 400,
              fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' },
            }}
          />
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            borderRadius: 4,
            background: 'white',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              borderColor: adminRole.color,
              boxShadow: adminRole.hoverShadow,
            },
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: adminRole.gradient,
              mb: 3,
              boxShadow: adminRole.shadow,
            }}
          >
            {adminRole.icon}
          </Box>
          <PreviewText
            text={adminRole.title}
            variant="h4"
            sx={{
              color: 'text.primary',
              fontWeight: 700,
              mb: 0.5,
              fontSize: { xs: '1.5rem', md: '2.125rem' },
            }}
          />
          <PreviewText
            text={adminRole.roleLabel}
            variant="caption"
            sx={{
              color: adminRole.color,
              fontWeight: 700,
              letterSpacing: '1px',
              mb: 2,
            }}
          />
          <PreviewText
            text={adminRole.description}
            sx={{
              color: 'text.secondary',
              mb: 4,
              fontSize: { xs: '0.85rem', md: '1rem' },
              lineHeight: 1.6,
            }}
          />
          <Button
            title="Enter as Admin"
            fullWidth
            size="large"
            onClick={handleLogin}
            sx={{
              py: 1.5,
              borderRadius: 2,
              background: adminRole.gradient,
              fontWeight: 600,
              mb: 2,
            }}
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              my: 2,
              '&::before, &::after': {
                content: '""',
                flex: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
              },
            }}
          >
            <PreviewText
              variant="caption"
              sx={{ px: 2, color: 'text.disabled', fontWeight: 600 }}
              text="OR"
            />
          </Box>

          <Box sx={{ mt: 1, mb: 1 }}>
            <PreviewText
              text="Want to solve quizzes?"
              variant="subtitle2"
              sx={{ fontWeight: 700, mb: 0.25 }}
            />
            <PreviewText
              text="Enter as a guest to browse and solve available quizzes."
              variant="body2"
              color="text.secondary"
              sx={{ mb: 2 }}
            />
            <Button
              title="Proceed as Guest"
              fullWidth
              variant="outlined"
              size="large"
              onClick={() => navigate('/')}
              sx={{
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                color: 'text.secondary',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'text.secondary',
                  background: 'rgba(0,0,0,0.02)',
                },
              }}
            />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
