import { createTheme } from '@mui/material/styles';

/** CaraPaws uses MUI defaults with a green color palette. */
export const theme = createTheme({
  palette: {
    primary: { main: '#0E9F5B', dark: '#087A43', light: '#E7F5ED' },
    secondary: { main: '#CBE8D6' },
    background: { default: '#F7FAF8', paper: '#FFFFFF' },
  },
});
