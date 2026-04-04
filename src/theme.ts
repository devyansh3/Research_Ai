import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#5B5BD6',
      dark: '#4a4ab8',
      contrastText: '#ffffff',
    },
    background: {
      default: '#FAFAFA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#737373',
    },
    divider: '#E5E5E5',
    error: { main: '#DC2626' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
    button: { textTransform: 'none' as const, fontWeight: 500 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#FAFAFA',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#C0C0C0',
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small' as const,
        fullWidth: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E5E5E5',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
        contained: {
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          margin: '0 4px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(91,91,214,0.08)',
            '&:hover': { backgroundColor: 'rgba(91,91,214,0.12)' },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          marginBottom: 2,
          '&.Mui-selected': {
            backgroundColor: '#2e2e2e',
            color: '#5B5BD6',
            '& .MuiListItemIcon-root': { color: '#5B5BD6' },
            '&:hover': { backgroundColor: '#333333' },
          },
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.06)',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
})

export default theme
