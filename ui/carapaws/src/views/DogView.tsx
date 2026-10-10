import { useState } from 'react';
import { Alert, Avatar, Box, Button, ButtonBase, Chip, IconButton, Paper, Stack, Typography } from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import EditRounded from '@mui/icons-material/EditRounded';
import ContactPhoneRounded from '@mui/icons-material/ContactPhoneRounded';
import HealthAndSafetyRounded from '@mui/icons-material/HealthAndSafetyRounded';
import RestaurantRounded from '@mui/icons-material/RestaurantRounded';
import { owner } from '../data/mockData';
import type { CareUpdate, Dog, Role, SitterProfile } from '../data/types';

function DetailRow({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <Box sx={{ display: 'flex', gap: 1.5, py: 1.5, borderBottom: 1, borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
    <Box sx={{ color: 'primary.main' }}>{icon}</Box>
    <Box><Typography variant="body2" sx={{ fontWeight: 700 }}>{title}</Typography><Typography variant="body2" color="text.secondary">{children}</Typography></Box>
  </Box>;
}

export function DogView({ dog, role, updates, assignedSitter, pendingSitter, onBack, onUpdates, onFindSitter, onSitter }: { dog: Dog; role: Role; updates: CareUpdate[]; assignedSitter?: SitterProfile; pendingSitter?: SitterProfile; onBack: () => void; onUpdates: () => void; onFindSitter: () => void; onSitter: (id: string) => void }) {
  const [showEditNotice, setShowEditNotice] = useState(false);
  const latest = updates[0];
  return <Stack spacing={2}>
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}><IconButton aria-label="Back to dogs" onClick={onBack}><ArrowBackRounded /></IconButton><Box sx={{ flex: 1 }}><Typography variant="h5" component="h1">{dog.name}</Typography></Box>{role === 'owner' && <Button variant="outlined" size="small" startIcon={<EditRounded />} onClick={() => setShowEditNotice(true)}>Edit</Button>}</Stack>
    {showEditNotice && <Alert severity="info" onClose={() => setShowEditNotice(false)}>Editing dog profiles is coming later. This demo keeps the details you entered as they are.</Alert>}

    <Paper variant="outlined" sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
      <Avatar src={dog.image} alt={dog.name} sx={{ width: 88, height: 88, flexShrink: 0 }} />
      <Box sx={{ minWidth: 0 }}><Typography variant="h6">{dog.name}</Typography><Typography variant="body2" color="text.secondary">{dog.breed} - {dog.age} - {dog.gender}</Typography></Box>
    </Paper>

    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1.5 }}>{role === 'owner' ? 'Your sitter' : 'Updates'}</Typography>
      <Stack spacing={1.5}>
        {role === 'owner' && (assignedSitter ? <Stack spacing={1}><Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{assignedSitter.name} - @{assignedSitter.username}</Typography><Typography variant="body2" color="text.secondary">{assignedSitter.location}</Typography><Button variant="outlined" onClick={() => onSitter(assignedSitter.userId)} endIcon={<ArrowForwardRounded />}>View sitter profile</Button></Stack> : <Typography color="text.secondary">{pendingSitter ? `Pending response from @${pendingSitter.username}.` : 'No sitter added yet.'}</Typography>)}
        {role === 'owner' && <Button variant="outlined" fullWidth onClick={onFindSitter} endIcon={<ArrowForwardRounded />}>{pendingSitter ? 'View sitter request' : 'Find sitter'}</Button>}
        <Button variant={role === 'owner' ? 'contained' : 'outlined'} fullWidth onClick={onUpdates} endIcon={<ArrowForwardRounded />}>{role === 'sitter' ? `Open ${dog.name}’s updates and share` : `Open ${dog.name}’s updates`}</Button>
        {latest && <ButtonBase onClick={onUpdates} sx={{ textAlign: 'left', width: '100%' }}><Paper variant="outlined" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, width: '100%' }}><Avatar src={latest.image} variant="rounded" sx={{ width: 44, height: 44 }} /><Box sx={{ minWidth: 0, flex: 1 }}><Typography variant="body2" sx={{ fontWeight: 700 }}>Latest: {latest.type.toLowerCase()} update</Typography><Typography variant="caption" color="text.secondary" noWrap component="p" sx={{ m: 0 }}>{latest.text || `A new photo from ${dog.name}’s day`}</Typography></Box><ArrowForwardRounded color="primary" /></Paper></ButtonBase>}
      </Stack>
    </Paper>

    {role === 'sitter' && <Paper variant="outlined" sx={{ p: 2 }}><Typography variant="h6" sx={{ mb: 1.5 }}>Owner</Typography><Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}><Avatar sx={{ width: 56, height: 56, bgcolor: 'background.paper', color: 'primary.dark', border: 1, borderColor: 'divider' }}>{owner.initials}</Avatar><Box><Typography variant="body2" sx={{ fontWeight: 700 }}>{owner.name}</Typography><Typography variant="body2" color="text.secondary">+99 999 999 999</Typography></Box></Stack></Paper>}

    <Paper variant="outlined" sx={{ p: 2 }}><Typography variant="h6">Care essentials</Typography>
      <DetailRow icon={<RestaurantRounded fontSize="small" />} title="Feeding">{dog.feeding}</DetailRow>
      <DetailRow icon={<HealthAndSafetyRounded fontSize="small" />} title="Medical">{dog.medical}</DetailRow>
      <DetailRow icon={<ContactPhoneRounded fontSize="small" />} title="Emergency contact">{dog.emergency.name} - {dog.emergency.contact}</DetailRow>
    </Paper>

    <Paper variant="outlined" sx={{ p: 2 }}><Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}><Typography variant="h6">Preferences</Typography></Stack><Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Loves</Typography><Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>{dog.loves.map((item) => <Chip key={item} label={item} size="small" color="success" variant="outlined" />)}</Stack><Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Dislikes</Typography><Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>{dog.dislikes.map((item) => <Chip key={item} label={item} size="small" variant="outlined" />)}</Stack></Paper>
  </Stack>;
}
