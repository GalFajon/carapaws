import { Button, Container, Stack, TextField, Typography } from '@mui/material';
import { BackButton } from '../components/BackButton';
import { Brand } from '../components/Shared';
import type { Role } from '../data/types';

/** Visual login prototype; credentials are not sent, stored or authenticated. */
export function LoginView({ role, onSignIn, onSignUp, onBack }: { role: Role; onSignIn: () => void; onSignUp: () => void; onBack: () => void }) {
  return <Container maxWidth="sm" sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column', py: 3, px: { xs: 2, sm: 3 } }}>
    <Brand />
    <BackButton label="Back to owner or sitter selection" onClick={onBack} sx={{ alignSelf: 'flex-start', mt: 2 }} />
    <Stack sx={{ flex: 1, justifyContent: 'center', py: 4 }} spacing={3}>
      <Typography component="h1" variant="h4">{role === 'owner' ? 'Dog owner login' : 'Dog sitter login'}</Typography>
      <Typography color="text.secondary">Welcome back to CaraPaws.</Typography>
      <Stack component="form" spacing={2} onSubmit={(event) => { event.preventDefault(); onSignIn(); }}>
        <TextField label="Email address" type="email" name="email" autoComplete="off" required fullWidth defaultValue={role === 'owner' ? 'john.owner@example.com' : 'jane.sitter@example.com'} />
        <TextField label="Password" type="password" name="password" autoComplete="off" required fullWidth defaultValue="demo-only" />
        <Button type="submit" variant="contained" size="large" fullWidth>Log in</Button>
      </Stack>
      <Stack sx={{ alignItems: 'center' }}>
        <Typography>New to CaraPaws?</Typography>
        <Button fullWidth onClick={onSignUp} size="large" sx={{ minHeight: 48 }}>Sign up</Button>
      </Stack>
    </Stack>
  </Container>;
}
