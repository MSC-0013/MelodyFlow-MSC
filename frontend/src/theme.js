import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1DB954', // Spotify green
      light: '#1ed760',
      dark: '#1aa34a',
    },
    secondary: {
      main: '#191414', // Spotify black
      light: '#282828',
      dark: '#121212',
    },
    background: {
      default: '#121212',
      paper: '#282828',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
    },
  },
  typography: {
    fontFamily: '"Circular", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 24,
          padding: '8px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#282828',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#282828',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: 'rgba(29, 185, 84, 0.1)',
            '&:hover': {
              backgroundColor: 'rgba(29, 185, 84, 0.2)',
            },
          },
        },
      },
    },
    MuiSlider: {
      styleOverrides: {
        root: {
          height: 4,
          '& .MuiSlider-thumb': {
            width: 12,
            height: 12,
            backgroundColor: '#fff',
            '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
              boxShadow: 'inherit',
            },
            '&:before': {
              display: 'none',
            },
          },
          '& .MuiSlider-track': {
            height: 4,
          },
          '& .MuiSlider-rail': {
            height: 4,
            opacity: 0.5,
          },
        },
      },
    },
  },
});

export default theme; 