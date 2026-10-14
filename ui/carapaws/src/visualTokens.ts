/** Shared dimensions keep image frames and interactive controls consistent. */
export const visualTokens = {
  imageRadius: 12,
  controlRadius: 12,
  imageBorderWidth: 1,
  controlBorderWidth: 1,
  touchTarget: 48,
} as const;

export const outlinedControlSx = {
  border: `${visualTokens.controlBorderWidth}px solid`,
  borderColor: 'divider',
  borderRadius: `${visualTokens.controlRadius}px`,
  bgcolor: 'background.paper',
  color: 'primary.dark',
  '&:hover': { bgcolor: 'action.hover' },
  '&.Mui-disabled': { color: 'action.disabled', borderColor: 'action.disabledBackground' },
} as const;
