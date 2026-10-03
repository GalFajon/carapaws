import { Button, Container, Stack, Typography } from '@mui/material';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import { Brand } from '../components/Shared';
import type { Role } from '../data/types';

/** Demo role selection stands in for authentication until a backend exists. */
export function LoginView({ onSignIn }: { onSignIn: (role: Role) => void }) {
  return <Container maxWidth="sm" sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', py: 3 }}>
    <Brand />
    <Stack sx={{ flex: 1, justifyContent: 'center', py: 4 }}>
      <Typography component="h1" variant="h4" sx={{ mt: 1 }}>Closer to their day.</Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>Little photos and updates that make time apart feel easier.</Typography>
      <Stack spacing={1.5} sx={{ mt: 4 }}>
        <Button variant="contained" fullWidth size="large" onClick={() => onSignIn('owner')} endIcon={<ArrowForwardRounded />}>Continue as dog owner</Button>
        <Button variant="outlined" fullWidth size="large" onClick={() => onSignIn('sitter')} endIcon={<ArrowForwardRounded />}>Continue as dog sitter</Button>
      </Stack>
    </Stack>
  </Container>;
}
