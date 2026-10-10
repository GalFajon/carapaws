import { Box, Button, Container, Stack, Typography } from '@mui/material';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import { Brand } from '../components/Shared';
import type { Role } from '../data/types';

/** Demo role selection stands in for authentication until a backend exists. */
export function LoginView({ onSignIn }: { onSignIn: (role: Role) => void }) {
  return <Container maxWidth="sm" sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', py: 3, px: { xs: 3, sm: 4 } }}>
    <Brand />
    <Stack sx={{ flex: 1, justifyContent: 'center', py: 4 }}>
      <Box component="img" src="/images/bailey.jpg" alt="A happy dog enjoying their day" sx={{ width: 204, height: 204, mx: 'auto', mb: 4, objectFit: 'cover', borderRadius: 3 }} />
      <Typography component="h1" variant="h4" sx={{ fontSize: { xs: '2.4rem', sm: '2.8rem' } }}>Closer to their day.</Typography>
      <Typography color="text.secondary" sx={{ mt: 1.25, fontSize: '1.06rem' }}>Little photos and updates that make time apart feel easier.</Typography>
      <Stack spacing={1.5} sx={{ mt: 4 }}>
        <Button variant="contained" fullWidth size="large" onClick={() => onSignIn('owner')} endIcon={<ArrowForwardRounded />}>Continue as dog owner</Button>
        <Button variant="outlined" fullWidth size="large" onClick={() => onSignIn('sitter')} endIcon={<ArrowForwardRounded />}>Continue as dog sitter</Button>
      </Stack>
    </Stack>
  </Container>;
}
