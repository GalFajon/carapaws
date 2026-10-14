import { IconButton, type IconButtonProps } from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';

type BackButtonProps = Pick<IconButtonProps, 'onClick' | 'sx'> & { label: string };

export function BackButton({ label, onClick, sx }: BackButtonProps) {
  return <IconButton aria-label={label} onClick={onClick} sx={sx}><ArrowBackRounded /></IconButton>;
}
