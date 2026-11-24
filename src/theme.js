import { createTheme } from '@mui/material/styles';

/**
 * MO:ON 테마 - 깔끔하고 정돈된 블루 + 화이트
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#2F6BFF',
      light: '#E3EBFF',
      dark: '#1F55E0',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#12285E',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#F6F8FC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#16203A',
      secondary: '#5A6582',
    },
    divider: '#E6EAF3',
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.3 },
    h2: { fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.3 },
    h3: { fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.35 },
    h4: { fontWeight: 700, lineHeight: 1.4 },
    h5: { fontWeight: 700, lineHeight: 1.4 },
    h6: { fontWeight: 700, lineHeight: 1.4 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  spacing: 8,
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 10 } },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          borderColor: '#E6EAF3',
          boxShadow: '0 1px 2px rgba(22, 32, 58, 0.04), 0 4px 16px rgba(22, 32, 58, 0.05)',
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
  },
});

export default theme;
