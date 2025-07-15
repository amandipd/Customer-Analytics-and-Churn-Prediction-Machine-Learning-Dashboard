import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#232323',
      paper: '#282828',
    },
    primary: {
      main: '#232323',
    },
    secondary: {
      main: '#8ab4f8',
    },
    text: {
      primary: '#f3f3f3',
      secondary: '#b0b0b0',
    },
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
    fontWeightBold: 700,
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#232323',
          borderBottom: '1px solid #333',
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#282828',
        },
      },
    },
  },
});

export default theme; 