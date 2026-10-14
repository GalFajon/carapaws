import { createTheme } from '@mui/material/styles';
import { visualTokens as tokens } from './visualTokens';

const green = '#176B50';
const radius = tokens.controlRadius;
const border = '1px solid #E2E8E4';
const focus = { outline: `3px solid ${green}`, outlineOffset: 2 };

/** All screens share the same frames, controls, typography and interaction states. */
export const theme = createTheme({
  palette: {
    primary: { main: green, dark: '#104D3B', light: '#E4F5E9', contrastText: '#FFFFFF' },
    secondary: { main: green, dark: '#104D3B', light: '#E4F5E9' },
    success: { main: green },
    text: { primary: '#20352D', secondary: '#52665D' },
    background: { default: '#FFFFFF', paper: '#FFFFFF' },
    divider: '#E2E8E4',
  },
  shape: { borderRadius: radius },
  typography: {
    fontFamily: 'Nunito, "Trebuchet MS", sans-serif',
    h4: { fontFamily: '"Baloo 2", Nunito, sans-serif', fontWeight: 700, lineHeight: 1.2 },
    h5: { fontFamily: '"Baloo 2", Nunito, sans-serif', fontWeight: 700, lineHeight: 1.25 },
    h6: { fontFamily: '"Baloo 2", Nunito, sans-serif', fontWeight: 700, lineHeight: 1.3 },
    button: { fontWeight: 800, textTransform: 'none', letterSpacing: 0, fontSize: '0.875rem' },
    body1: { lineHeight: 1.55 },
    body2: { lineHeight: 1.5 },
    caption: { fontSize: '0.8125rem', lineHeight: 1.4 },
  },
  components: {
    MuiCssBaseline: { styleOverrides: { body: { WebkitFontSmoothing: 'antialiased' }, '*, *::before, *::after': { boxSizing: 'border-box' }, 'a:focus-visible, button:focus-visible': focus } },
    MuiContainer: { styleOverrides: { root: { paddingInline: 16, '@media (min-width:600px)': { paddingInline: 24 } } } },
    MuiTypography: { styleOverrides: { root: { overflowWrap: 'break-word' } } },
    MuiButtonBase: { styleOverrides: { root: { borderRadius: radius, '&.Mui-focusVisible': focus } } },
    MuiButton: {
      defaultProps: { disableElevation: true, variant: 'outlined' },
      styleOverrides: {
        root: { minHeight: tokens.touchTarget, borderRadius: radius, padding: '10px 16px', lineHeight: 1.4 },
        outlined: ({ theme }) => ({ borderColor: theme.palette.divider, '&:hover': { borderColor: theme.palette.text.secondary } }),
        sizeSmall: { minHeight: tokens.touchTarget, paddingInline: 12 },
      },
    },
    MuiIconButton: { styleOverrides: { root: { width: tokens.touchTarget, height: tokens.touchTarget, flexShrink: 0, borderRadius: radius } } },
    MuiAvatar: { defaultProps: { variant: 'rounded' }, styleOverrides: { root: ({ theme }) => ({ borderRadius: tokens.imageRadius, border, boxSizing: 'border-box', backgroundColor: theme.palette.background.paper, color: theme.palette.primary.dark, flexShrink: 0 }) } },
    MuiPaper: { styleOverrides: { root: { backgroundImage: 'none', borderRadius: radius }, outlined: { border, boxShadow: 'none' } } },
    MuiAlert: { styleOverrides: { root: { borderRadius: radius }, message: { minWidth: 0 } } },
    MuiChip: { defaultProps: { variant: 'outlined' }, styleOverrides: {
      root: { borderRadius: radius, fontWeight: 700 },
      outlined: ({ theme }) => ({ borderColor: theme.palette.divider }),
      clickable: ({ theme }) => ({ '&[aria-pressed="true"]': { color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main } }),
    } },
    MuiAccordion: { defaultProps: { disableGutters: true, variant: 'outlined', elevation: 0 }, styleOverrides: { root: { border, borderRadius: radius, boxShadow: 'none', '&:before': { display: 'none' }, '&:first-of-type, &:last-of-type': { borderRadius: radius } } } },
    MuiAccordionSummary: { styleOverrides: { root: ({ theme }) => ({ minHeight: 56, paddingInline: 16, borderRadius: radius, '&:hover': { backgroundColor: theme.palette.action.hover } }), content: { marginBlock: 12, minWidth: 0 } } },
    MuiAccordionDetails: { styleOverrides: { root: ({ theme }) => ({ padding: 12, borderTop: `${tokens.controlBorderWidth}px solid ${theme.palette.divider}` }) } },
    MuiListItemButton: { styleOverrides: { root: ({ theme }) => ({ borderRadius: radius, minHeight: tokens.touchTarget, paddingInline: 12, '&:hover': { backgroundColor: theme.palette.action.hover } }) } },
    MuiListItemText: { styleOverrides: { primary: { fontWeight: 700 }, secondary: ({ theme }) => ({ color: theme.palette.text.secondary }) } },
    MuiTextField: { defaultProps: { variant: 'outlined', size: 'small', fullWidth: true } },
    MuiSelect: { defaultProps: { variant: 'outlined', size: 'small' } },
    MuiOutlinedInput: { styleOverrides: {
      root: ({ theme }) => ({ borderRadius: radius, minHeight: tokens.touchTarget, fontSize: '1rem', color: theme.palette.text.primary, backgroundColor: theme.palette.background.paper,
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.text.secondary },

        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: tokens.controlBorderWidth },
        '&.Mui-error .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.error.main },
        '&.Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: theme.palette.action.disabledBackground },
      }),
      notchedOutline: { borderColor: '#C5CEC8', borderWidth: 1 },
      input: ({ ownerState }) => ({ padding: ownerState.multiline ? 0 : '12px 14px' }),
      multiline: { padding: '12px 14px' },
    } },
    MuiInputLabel: { styleOverrides: { root: ({ theme }) => ({ color: theme.palette.text.secondary, '&.Mui-focused': { color: theme.palette.primary.dark } }) } },
    MuiFormHelperText: { styleOverrides: { root: { marginInline: 0, fontSize: '0.8125rem' } } },
    MuiMenu: { styleOverrides: { paper: { border, borderRadius: radius, boxShadow: '0 4px 16px rgba(32,53,45,0.12)' } } },
    MuiMenuItem: { styleOverrides: { root: { minHeight: tokens.touchTarget, whiteSpace: 'normal' } } },
    MuiDialog: { styleOverrides: { paper: { borderRadius: radius, margin: 16, width: 'calc(100% - 32px)', maxHeight: 'calc(100% - 32px)' } } },
    MuiDialogTitle: { styleOverrides: { root: { padding: '20px 20px 12px' } } },
    MuiDialogContent: { styleOverrides: { root: { paddingInline: 20 } } },
    MuiDialogActions: { styleOverrides: { root: { padding: 20, gap: 8, flexWrap: 'wrap', '& > :not(style) ~ :not(style)': { marginLeft: 0 } } } },
  },
});
