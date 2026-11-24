import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import EditNoteIcon from '@mui/icons-material/EditNote';

import { useAuth } from '../../hooks/use-auth';
import BrandLogo from '../ui/brand-logo';
import UserAvatar from '../ui/user-avatar';

/**
 * Header 컴포넌트 - 상단 고정 내비게이션
 *
 * Props: 없음
 *
 * Example usage:
 * <Header />
 */
function Header() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navButtonSx = (isActive) => ({
    color: isActive ? 'primary.main' : 'text.secondary',
    bgcolor: isActive ? 'primary.light' : 'transparent',
    fontWeight: isActive ? 700 : 500,
    px: 2,
  });

  return (
    <AppBar
      position="sticky"
      elevation={ 0 }
      sx={ {
        bgcolor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: 1,
        borderColor: 'divider',
        color: 'text.primary',
      } }
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={ { gap: { xs: 1, md: 3 }, minHeight: 64 } }>
          <BrandLogo />
          <Box sx={ { display: 'flex', gap: 0.5 } }>
            <Button component={ RouterLink } to="/" sx={ navButtonSx(pathname === '/') }>
              피드
            </Button>
            { profile && (
              <Button
                component={ RouterLink }
                to="/write"
                sx={ { ...navButtonSx(pathname === '/write'), display: { xs: 'none', sm: 'inline-flex' } } }
              >
                새 기록
              </Button>
            ) }
          </Box>
          <Box sx={ { ml: 'auto', display: 'flex', alignItems: 'center', gap: 1.5 } }>
            { profile ? (
              <>
                <UserAvatar name={ profile.name } size={ 32 } />
                <Box sx={ { fontWeight: 600, fontSize: 14, display: { xs: 'none', sm: 'block' } } }>
                  { profile.name }
                </Box>
                <Button
                  component={ RouterLink }
                  to="/write"
                  variant="contained"
                  size="small"
                  aria-label="새 기록"
                  sx={ { minWidth: 0, px: 1, display: { xs: 'inline-flex', sm: 'none' } } }
                >
                  <EditNoteIcon fontSize="small" />
                </Button>
                <Button variant="outlined" size="small" color="inherit" onClick={ handleSignOut } sx={ { borderColor: 'divider', color: 'text.secondary' } }>
                  로그아웃
                </Button>
              </>
            ) : (
              <Button component={ RouterLink } to="/login" variant="contained" size="small">
                로그인
              </Button>
            ) }
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Header;
