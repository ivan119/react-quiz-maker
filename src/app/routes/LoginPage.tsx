import { useEffect, type FC } from 'react';
import { Box, Container, Grid, Paper } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import { Button, PreviewText } from '../components/ui';

const ROLES = [
  {
    role: 'admin' as const,
    title: 'REJD',
    roleLabel: 'ROLE: ADMIN',
    description:
      'Full administrator access. Create, edit, and manage all quizzes and questions.',
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 40, color: 'white' }} />,
    color: '#1976d2',
    gradient: 'linear-gradient(45deg, #1976d2, #42a5f5)',
    shadow: '0 8px 16px rgba(25, 118, 210, 0.2)',
    hoverShadow: '0 12px 24px rgba(0,0,0,0.1)',
  },
  {
    role: 'user' as const,
    title: 'FRIEND',
    roleLabel: 'ROLE: USER',
    description:
      'Solver access. Browse and solve quizzes to test your knowledge.',
    icon: <PersonIcon sx={{ fontSize: 40, color: 'white' }} />,
    color: '#2e7d32',
    gradient: 'linear-gradient(45deg, #2e7d32, #66bb6a)',
    shadow: '0 8px 16px rgba(46, 125, 50, 0.2)',
    hoverShadow: '0 12px 24px rgba(0,0,0,0.1)',
  },
];

const LoginPage: FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = (role: 'admin' | 'user') => {
    login(role);
    navigate('/');
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
      <Container maxWidth="md">
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
            text="Choose your role to continue"
            variant="h6"
            sx={{
              color: 'text.secondary',
              fontWeight: 400,
              fontSize: { xs: '0.9rem', sm: '1.1rem', md: '1.25rem' },
            }}
          />
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {ROLES.map((item) => (
            <Grid key={item.role} size={{ xs: 12, sm: 6 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 4,
                  background: 'white',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    borderColor: item.color,
                    boxShadow: item.hoverShadow,
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
                    background: item.gradient,
                    mb: 3,
                    boxShadow: item.shadow,
                  }}
                >
                  {item.icon}
                </Box>
                <PreviewText
                  text={item.title}
                  variant="h4"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 700,
                    mb: 0.5,
                    fontSize: { xs: '1.5rem', md: '2.125rem' },
                  }}
                />
                <PreviewText
                  text={item.roleLabel}
                  variant="caption"
                  sx={{
                    color: item.color,
                    fontWeight: 700,
                    letterSpacing: '1px',
                    mb: 2,
                  }}
                />
                <PreviewText
                  text={item.description}
                  sx={{
                    color: 'text.secondary',
                    mb: 4,
                    flexGrow: 1,
                    fontSize: { xs: '0.85rem', md: '1rem' },
                    lineHeight: 1.6,
                  }}
                />
                <Button
                  title={`Enter as ${item.title.charAt(0) + item.title.slice(1).toLowerCase()}`}
                  fullWidth
                  size="large"
                  onClick={() => handleLogin(item.role)}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    background: item.gradient,
                    fontWeight: 600,
                    boxShadow: item.shadow,
                    '&:hover': {
                      background: item.color,
                      transform: 'scale(1.02)',
                    },
                    transition: 'all 0.2s',
                  }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;
