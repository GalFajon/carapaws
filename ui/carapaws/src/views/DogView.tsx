import { Avatar, Box, Button, ButtonBase, Chip, IconButton, Paper, Stack, Typography } from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import ContactPhoneRounded from '@mui/icons-material/ContactPhoneRounded';
import HealthAndSafetyRounded from '@mui/icons-material/HealthAndSafetyRounded';
import RestaurantRounded from '@mui/icons-material/RestaurantRounded';
import { careService } from '../data/careService';
import { owner } from '../data/mockData';
import type { CareUpdate, Dog, Role } from '../data/types';

function DetailRow({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <Box sx={{ display: 'flex', gap: 1.5, py: 1.5, borderBottom: 1, borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
    <Box sx={{ color: 'primary.main' }}>{icon}</Box>
    <Box><Typography variant="body2" sx={{ fontWeight: 700 }}>{title}</Typography><Typography variant="body2" color="text.secondary">{children}</Typography></Box>
  </Box>;
}

export function DogView({ dog, role, updates, onBack, onUpdates, onSitter }: { dog: Dog; role: Role; updates: CareUpdate[]; onBack: () => void; onUpdates: () => void; onSitter: (id: string) => void }) {
  const latest = updates[0];
  const latestSitter = careService.latestSitter(dog.id);
  return <Stack spacing={2}>
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}><IconButton aria-label="Back to dogs" onClick={onBack}><ArrowBackRounded /></IconButton><Box><Typography variant="h5" component="h1">{dog.name}</Typography></Box></Stack>

    <Paper variant="outlined" sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
      <Avatar src={dog.image} alt={dog.name} sx={{ width: 88, height: 88, flexShrink: 0 }} />
      <Box sx={{ minWidth: 0 }}><Typography variant="h6">{dog.name}</Typography><Typography variant="body2" color="text.secondary">{dog.breed} - {dog.age} - {dog.gender}</Typography></Box>
    </Paper>

    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 1.5 }}>{role === 'owner' ? 'Latest sitter' : 'Updates'}</Typography>
      <Stack spacing={1.5}>
        {role === 'owner' && (latestSitter ? <Stack spacing={1}><Typography variant="subtitle1">{latestSitter.name}</Typography><Typography variant="body2" color="text.secondary">{latestSitter.location}</Typography><Button variant="outlined" onClick={() => onSitter(latestSitter.userId)} endIcon={<ArrowForwardRounded />}>View sitter profile</Button></Stack> : <Typography color="text.secondary">No sitter assigned yet.</Typography>)}
        <Button variant={role === 'owner' ? 'contained' : 'outlined'} fullWidth onClick={onUpdates} endIcon={<ArrowForwardRounded />}>{role === 'sitter' ? `Open ${dog.name}’s updates and share` : `Open ${dog.name}’s updates`}</Button>
        {latest && <ButtonBase onClick={onUpdates} sx={{ textAlign: 'left', width: '100%' }}><Paper variant="outlined" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, width: '100%' }}><Avatar src={latest.image} variant="rounded" sx={{ width: 44, height: 44 }} /><Box sx={{ minWidth: 0, flex: 1 }}><Typography variant="body2" sx={{ fontWeight: 700 }}>Latest: {latest.type.toLowerCase()} update</Typography><Typography variant="caption" color="text.secondary" noWrap component="p" sx={{ m: 0 }}>{latest.text || `A new photo from ${dog.name}’s day`}</Typography></Box><ArrowForwardRounded color="primary" /></Paper></ButtonBase>}
      </Stack>
    </Paper>

    {role === 'sitter' && <Paper variant="outlined" sx={{ p: 2 }}><Typography variant="h6" sx={{ mb: 1.5 }}>Owner</Typography><Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}><Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.light', color: 'primary.dark' }}>{owner.initials}</Avatar><Box><Typography variant="body2" sx={{ fontWeight: 700 }}>{owner.name}</Typography><Typography variant="body2" color="text.secondary">+99 999 999 999</Typography></Box></Stack></Paper>}

    <Paper variant="outlined" sx={{ p: 2 }}><Typography variant="h6">Care essentials</Typography>
      <DetailRow icon={<RestaurantRounded fontSize="small" />} title="Feeding">{dog.feeding}</DetailRow>
      <DetailRow icon={<HealthAndSafetyRounded fontSize="small" />} title="Medical">{dog.medical}</DetailRow>
      <DetailRow icon={<ContactPhoneRounded fontSize="small" />} title="Emergency contact">{dog.emergency.name} - {dog.emergency.contact}</DetailRow>
    </Paper>

    <Paper variant="outlined" sx={{ p: 2 }}><Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}><Typography variant="h6">Preferences</Typography></Stack><Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Loves</Typography><Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>{dog.loves.map((item) => <Chip key={item} label={item} size="small" color="success" variant="outlined" />)}</Stack><Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>Dislikes</Typography><Stack direction="row" sx={{ flexWrap: 'wrap', gap: 1 }}>{dog.dislikes.map((item) => <Chip key={item} label={item} size="small" variant="outlined" />)}</Stack></Paper>
  </Stack>;
}
