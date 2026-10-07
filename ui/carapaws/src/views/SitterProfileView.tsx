import { useEffect, useState } from 'react';
import { Alert, Avatar, Box, Button, IconButton, Paper, Skeleton, Stack, TextField, Typography } from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import { careService } from '../data/careService';
import type { SitterProfile } from '../data/types';

/** Read-only profile form: ratings and references are supplied by the mock adapter. */
export function SitterProfileView({ userId, onBack }: { userId: string; onBack: () => void }) {
  const [profile, setProfile] = useState<SitterProfile | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    careService.getSitterProfile(userId).then((result) => {
      if (active) { setProfile(result); setStatus('ready'); }
    }).catch(() => { if (active) setStatus('error'); });
    return () => { active = false; };
  }, [userId, attempt]);

  const fields = profile ? [
    { label: 'Name', value: profile.name },
    { label: 'Location', value: profile.location },
    { label: 'Contact', value: profile.contact },
    { label: 'Qualifications', value: profile.qualifications },
    { label: 'Reference points', value: profile.referencePoints },
  ] : [];

  return <Stack spacing={2}>
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <IconButton aria-label="Back from sitter profile" onClick={onBack}><ArrowBackRounded /></IconButton>
      <Typography variant="h5" component="h1">Sitter profile</Typography>
    </Stack>
    {status === 'loading' && <Stack spacing={2} role="status" aria-label="Loading sitter profile"><Typography>Loading sitter profile…</Typography>{[1, 2, 3].map((id) => <Skeleton key={id} variant="rounded" height={56} />)}</Stack>}
    {status === 'error' && <Alert severity="error" action={<Button onClick={() => { setStatus('loading'); setAttempt((value) => value + 1); }}>Retry</Button>}>Unable to load this sitter profile.</Alert>}
    {status === 'ready' && !profile && <Alert severity="info">This sitter’s profile is not available yet.</Alert>}
    {status === 'ready' && profile && <>
      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack component="form" aria-label="Sitter details" spacing={2} onSubmit={(event) => event.preventDefault()}>
          <Avatar src={profile.image} alt={`${profile.name}’s profile picture`} sx={{ width: 72, height: 72, alignSelf: 'center', bgcolor: 'primary.light', color: 'primary.dark' }}>
            {profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('')}
          </Avatar>
          <Typography variant="h6" component="h2">About your sitter</Typography>
          {fields.map(({ label, value }) => <TextField key={label} label={label} value={value || 'Not provided yet'} fullWidth multiline slotProps={{ input: { readOnly: true } }} />)}
        </Stack>
      </Paper>
      <Paper variant="outlined" sx={{ p: 2 }}><Stack spacing={1.5}>
        <Typography variant="h6" component="h2">Past references</Typography>
        {!profile.references.length && <Typography color="text.secondary">No references provided yet.</Typography>}
        {profile.references.map((reference) => <Box key={reference.id}><Typography variant="subtitle2">{reference.name}</Typography><Typography variant="caption" color="text.secondary">{reference.relationship}</Typography><Typography variant="body2" sx={{ mt: 0.5 }}>{reference.text}</Typography></Box>)}
      </Stack></Paper>
    </>}
  </Stack>;
}
