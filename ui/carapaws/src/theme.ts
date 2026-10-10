import { createTheme } from '@mui/material/styles';

/** Shared visual tokens for the owner and sitter prototype. */
export const theme = createTheme({
  palette: {
    primary: { main: '#176B50', dark: '#104D3B', light: '#E4F5E9', contrastText: '#FFFFFF' },
    secondary: { main: '#176B50', dark: '#104D3B', light: '#E4F5E9' },
    success: { main: '#176B50' },
    text: { primary: '#20352D', secondary: '#52665D' },
    background: { default: '#FFFFFF', paper: '#FFFFFF' },
    divider: '#E2EAE3',
  },
  shape: { borderRadius: 18 },
  typography: {
    fontFamily: 'Nunito, "Trebuchet MS", sans-serif',
    h4: { fontFamily: '"Baloo 2", Nunito, sans-serif', fontWeight: 700, lineHeight: 1.12 },
    h5: { fontFamily: '"Baloo 2", Nunito, sans-serif', fontWeight: 700, lineHeight: 1.2 },
    h6: { fontFamily: '"Baloo 2", Nunito, sans-serif', fontWeight: 700, lineHeight: 1.25 },
    button: { fontWeight: 800, textTransform: 'none', letterSpacing: 0 },
    body1: { lineHeight: 1.55 },
    body2: { lineHeight: 1.5 },
  },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { WebkitFontSmoothing: 'antialiased' }, 'button:focus-visible, a:focus-visible, [role="button"]:focus-visible, input:focus-visible': { outline: '3px solid #176B50', outlineOffset: 3 } } },
    MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { borderRadius: 999, minHeight: 48, paddingInline: 20 }, sizeSmall: { minHeight: 42 }, contained: { backgroundColor: '#FFFFFF', color: '#104D3B', border: '1.5px solid #176B50', '&:hover': { backgroundColor: '#FFFFFF', borderColor: '#104D3B' } }, outlined: { borderWidth: 1.5, backgroundColor: '#FFFFFF', '&:hover': { borderWidth: 1.5, backgroundColor: '#FFFFFF' } } } },
    MuiIconButton: { styleOverrides: { root: { minWidth: 44, minHeight: 44, borderRadius: 14 } } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' }, outlined: { borderColor: '#E2EAE3', boxShadow: '0 8px 28px rgba(29, 74, 52, 0.045)' } } },
    MuiAlert: { styleOverrides: { root: { backgroundColor: '#FFFFFF', border: '1px solid #E2EAE3' } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 999, fontWeight: 700 } } },
    MuiListItemButton: { styleOverrides: { root: { borderRadius: 16 } } },
    MuiBottomNavigation: { styleOverrides: { root: { height: 68, backgroundColor: '#FFFFFF' } } },
    MuiBottomNavigationAction: { styleOverrides: { root: { minWidth: 64, '&.Mui-selected': { color: '#176B50' } }, label: { fontWeight: 800, fontSize: 12 } } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 14 } } },
  },
});
