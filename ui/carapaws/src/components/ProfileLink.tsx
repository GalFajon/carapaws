import { Avatar, Box, ButtonBase, Typography } from '@mui/material';
import { outlinedControlSx, visualTokens } from '../visualTokens';

interface ProfileLinkProps {
  name: string;
  label: string;
  image?: string;
  initials?: string;
  heading?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

/** Shared chat profile control; both text lines fit within the 48px touch target. */
export function ProfileLink({ name, label, image, initials, heading = false, disabled = false, onClick }: ProfileLinkProps) {
  return <ButtonBase
    disabled={disabled}
    onClick={onClick}
    aria-label={label}
    title={name}
    sx={{
      ...outlinedControlSx,
      width: '100%', minWidth: 0, height: visualTokens.touchTarget,
      p: 0.75, gap: 0.75, flexDirection: 'row', justifyContent: 'flex-start', textAlign: 'left',
    }}
  >
    <Avatar src={image} alt={name} sx={{ width: 28, height: 28, fontSize: 12 }}>{initials}</Avatar>
    <Box sx={{ minWidth: 0, width: 'auto', px: 0.25 }}>
      <Typography component={heading ? 'h1' : 'span'} variant="body2" noWrap sx={{ display: 'block', fontWeight: 800, lineHeight: 1.3 }}>{name}</Typography>
      <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', fontSize: '0.6875rem', lineHeight: 1.2 }}>{disabled ? 'Not assigned' : 'View profile'}</Typography>
    </Box>
  </ButtonBase>;
}
