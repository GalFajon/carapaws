import { visualTokens } from './visualTokens';

/** Rounded square photo frames share their corner radius with post cards. */
export const imageFrameSx = {
  border: `${visualTokens.imageBorderWidth}px solid`,
  borderColor: 'divider',
  borderRadius: `${visualTokens.imageRadius}px`,
  boxSizing: 'border-box',
} as const;
