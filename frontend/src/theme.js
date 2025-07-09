import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#232323',
      paper: '#282828',
    },
    primary: {
      main: '#3b6cb7',
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
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: '#181818',
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