import { useState } from 'react';
import { Box, Button, Container, Stack, Step, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import { Brand } from '../components/Shared';
import { BackButton } from '../components/BackButton';
import { DogEntryDialog } from '../components/DogEntryDialog';
import type { Dog, Role, SitterProfile, User } from '../data/types';

export type SignupResult = { user: User; contact: string; location: string; dog?: Dog; profile?: SitterProfile };

export function SignupView({ role, usernames, onBack, onComplete }: { role: Role; usernames: string[]; onBack: () => void; onComplete: (result: SignupResult) => void }) {
  const [id] = useState(() => crypto.randomUUID());
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [location, setLocation] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [years, setYears] = useState('');
  const [qualifications, setQualifications] = useState('');
  const handle = username.trim().toLowerCase();
  const usernameError = !handle ? '' : !/^[a-z][a-z0-9_]{2,23}$/.test(handle) ? 'Use 3–24 letters, numbers or underscores. Start with a letter.' : usernames.some((value) => value.toLowerCase() === handle) ? 'This username is taken. Choose another.' : '';
  const user: User = { id, name: name.trim(), role, initials: name.trim().split(/\s+/).map((part) => part[0]).slice(0, 2).join('').toUpperCase() };
  function complete(dog?: Dog) {
    onComplete({ user, contact: contact.trim(), location: location.trim(), dog,
      profile: role === 'sitter' ? { userId: id, name: user.name, username: handle, location: location.trim(), contact: contact.trim(), available: true, services: ['Dog care'], qualifications: qualifications.trim(), experienceSummary: `${years} years of experience. ${bio.trim()}`, references: [] } : undefined });
  }
  return <Container maxWidth="sm" sx={{ py: 3 }}><Stack spacing={3}>
    <Brand />
    <BackButton label={step ? 'Back to your profile' : 'Back to login'} onClick={step ? () => setStep(0) : onBack} sx={{ alignSelf: 'flex-start' }} />
    <Typography component="h1" variant="h5">{role === 'owner' ? 'Join as a dog owner' : 'Join as a dog sitter'}</Typography>
    <Stepper activeStep={Math.min(step, 1)} alternativeLabel>{['Your profile', role === 'owner' ? 'Your first dog' : 'Sitter details'].map((label) => <Step key={label}><StepLabel>{label}</StepLabel></Step>)}</Stepper>
    {step === 0 && <Stack component="form" spacing={2} onSubmit={(event) => { event.preventDefault(); if (name.trim() && location.trim()) setStep(1); }}>
      <TextField label="Full name" autoComplete="name" required value={name} onChange={(event) => setName(event.target.value)} />
      <TextField label="Email address" type="email" autoComplete="email" required value={contact} onChange={(event) => setContact(event.target.value)} />
      <TextField label="Town or city" autoComplete="address-level2" required value={location} onChange={(event) => setLocation(event.target.value)} />
      <Button type="submit" variant="contained" size="large" disabled={!name.trim() || !location.trim() || !contact.trim()}>Continue</Button>
    </Stack>}
    {step === 1 && role === 'owner' && <DogEntryDialog ownerId={id} onClose={() => setStep(0)} onAdd={complete} />}
    {step === 1 && role === 'sitter' && <Box component="form" onSubmit={(event) => { event.preventDefault(); if (handle && !usernameError && bio.trim()) complete(); }}><Stack spacing={2}>
      <TextField label="Unique username" required value={username} onChange={(event) => setUsername(event.target.value)} error={Boolean(usernameError)} helperText={usernameError || (handle ? `@${handle} is available in this demo.` : 'Owners can find you by this name. Use 3–24 letters, numbers or underscores.')} slotProps={{ htmlInput: { maxLength: 24, autoCapitalize: 'none', spellCheck: false } }} />
      <TextField label="About me" required multiline minRows={3} value={bio} onChange={(event) => setBio(event.target.value)} />
      <TextField label="Years of dog-care experience" required type="number" value={years} onChange={(event) => setYears(event.target.value)} slotProps={{ htmlInput: { min: 0, max: 80, step: 1 } }} />
      <TextField label="Qualifications (optional)" multiline value={qualifications} onChange={(event) => setQualifications(event.target.value)} />
      <Button type="submit" variant="contained" size="large" disabled={!handle || Boolean(usernameError) || !bio.trim() || !years}>Finish setup</Button>
    </Stack></Box>}
  </Stack></Container>;
}
