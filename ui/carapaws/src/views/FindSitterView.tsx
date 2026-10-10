import { useState } from 'react';
import { Alert, Avatar, Box, Button, Chip, FormControlLabel, IconButton, MenuItem, Paper, Stack, Switch, TextField, Typography } from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import type { CareAssignment, Dog, SitterProfile, SitterRequest } from '../data/types';

export function FindSitterView({ dog, profiles, assignment, requests, onBack, onViewProfile, onRequest }: {
  dog: Dog;
  profiles: SitterProfile[];
  assignment?: CareAssignment;
  requests: SitterRequest[];
  onBack: () => void;
  onViewProfile: (userId: string) => void;
  onRequest: (sitterId: string) => void;
}) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [service, setService] = useState('');
  const [availableOnly, setAvailableOnly] = useState(true);
  const pending = requests.find((request) => request.status === 'pending');
  const locations = [...new Set(profiles.map((profile) => profile.location))].sort();
  const services = [...new Set(profiles.flatMap((profile) => profile.services))].sort();
  const results = profiles.filter((profile) =>
    (!availableOnly || profile.available) &&
    (!location || profile.location === location) &&
    (!service || profile.services.includes(service)) &&
    (!query || `${profile.name} @${profile.username}`.toLowerCase().includes(query.trim().toLowerCase()))
  );

  return <Stack spacing={2.5}>
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}><IconButton aria-label="Back to dog profile" onClick={onBack}><ArrowBackRounded /></IconButton><Box><Typography component="h1" variant="h5">Find a sitter</Typography><Typography variant="body2" color="text.secondary">For {dog.name}</Typography></Box></Stack>
    <Typography variant="body2" color="text.secondary">Browse demo sitter profiles and add one to {dog.name}’s care circle. They can accept or decline your request.</Typography>
    {assignment && <Alert severity="info">{dog.name} already has a sitter. You can browse profiles, but this demo supports one active sitter at a time.</Alert>}
    {pending && <Alert severity="info">Request pending with @{profiles.find((profile) => profile.userId === pending.sitterId)?.username}. Switch to that sitter’s demo view to respond.</Alert>}
    <Paper variant="outlined" sx={{ p: 2 }}><Stack spacing={1.5}>
      <TextField label="Search name or @username" value={query} onChange={(event) => setQuery(event.target.value)} fullWidth />
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
        <TextField select label="Location" value={location} onChange={(event) => setLocation(event.target.value)} fullWidth><MenuItem value="">Any location</MenuItem>{locations.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField>
        <TextField select label="Care type" value={service} onChange={(event) => setService(event.target.value)} fullWidth><MenuItem value="">Any care type</MenuItem>{services.map((item) => <MenuItem key={item} value={item}>{item}</MenuItem>)}</TextField>
      </Stack>
      <FormControlLabel control={<Switch checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} />} label="Available sitters only" />
    </Stack></Paper>
    <Typography variant="body2" color="text.secondary">{results.length} {results.length === 1 ? 'sitter' : 'sitters'} shown</Typography>
    {results.length === 0 && <Alert severity="info">No sitters match these filters. Try another location or care type.</Alert>}
    {results.map((profile) => {
      const initials = profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('');
      const request = requests.find((item) => item.sitterId === profile.userId);
      const actionLabel = assignment?.sitterId === profile.userId ? 'Current sitter' : request?.status === 'declined' ? 'Declined' : request?.status === 'accepted' ? 'Added' : request?.status === 'pending' ? 'Pending' : 'Add sitter';
      return <Paper key={profile.userId} variant="outlined" sx={{ p: 2 }}><Stack spacing={1.5}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Avatar sx={{ width: 52, height: 52, bgcolor: 'background.paper', color: 'primary.dark', border: 1, borderColor: 'primary.main', fontWeight: 800 }}>{initials}</Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}><Typography variant="h6">{profile.name}</Typography><Typography variant="body2" color="primary.dark" sx={{ fontWeight: 800 }}>@{profile.username}</Typography></Box>
          <Chip label={profile.available ? 'Available' : 'Unavailable'} variant="outlined" size="small" color={profile.available ? 'success' : 'default'} />
        </Stack>
        <Typography variant="body2" color="text.secondary">{profile.location} - {profile.services.join(' - ')}</Typography>
        <Typography variant="body2">{profile.referencePoints}</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
          <Button variant="outlined" onClick={() => onViewProfile(profile.userId)}>View profile</Button>
          <Button variant="contained" onClick={() => onRequest(profile.userId)} disabled={!profile.available || Boolean(assignment) || Boolean(pending) || Boolean(request)}>{actionLabel}</Button>
        </Stack>
      </Stack></Paper>;
    })}
  </Stack>;
}
