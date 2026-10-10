import { useState } from 'react';
import { Alert, Avatar, Box, Button, List, ListItemAvatar, ListItemButton, ListItemText, Paper, Stack, Typography } from '@mui/material';
import AddRounded from '@mui/icons-material/AddRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import { DogEntryDialog } from '../components/DogEntryDialog';
import type { Dog, Role, SitterRequest } from '../data/types';

export function DogListView({ dogs, role, ownerId, incoming, onSelect, onAdd, onRespond }: { dogs: Dog[]; role: Role; ownerId: string; incoming: { request: SitterRequest; dog: Dog }[]; onSelect: (dogId: string) => void; onAdd: (dog: Dog) => void; onRespond: (requestId: string, decision: 'accepted' | 'declined') => void }) {
  const [adding, setAdding] = useState(false);
  const [addedName, setAddedName] = useState('');

  function addDog(dog: Dog) {
    onAdd(dog);
    setAddedName(dog.name);
    setAdding(false);
  }

  return <Stack spacing={2}>
    <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <Box>
        <Typography component="h1" variant="h5">{role === 'owner' ? 'Your dogs' : 'Dogs in your care'}</Typography>
        <Typography variant="body2" color="text.secondary">Choose a dog to see their profile{role === 'sitter' ? ' and share a care update' : ' and updates'}.</Typography>
      </Box>
      {role === 'owner' && <Button variant="outlined" startIcon={<AddRounded />} onClick={() => setAdding(true)} sx={{ flexShrink: 0 }}>Add dog</Button>}
    </Stack>
    {addedName && <Alert severity="success" onClose={() => setAddedName('')}>{addedName} has been added to your demo dogs.</Alert>}
    {role === 'sitter' && incoming.length > 0 && <Paper variant="outlined" sx={{ p: 2 }}><Stack spacing={2}>
      <Typography variant="h6">Sitter requests</Typography>
      {incoming.map(({ request, dog }) => <Stack key={request.id} spacing={1.5} sx={{ borderTop: 1, borderColor: 'divider', pt: 1.5 }}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}><Avatar src={dog.image} alt={dog.name} /><Box><Typography variant="body1" sx={{ fontWeight: 800 }}>{dog.name}</Typography><Typography variant="body2" color="text.secondary">{dog.breed} - Owner wants to add you as their sitter</Typography></Box></Stack>
        <Stack direction="row" spacing={1}><Button variant="contained" onClick={() => onRespond(request.id, 'accepted')}>Accept</Button><Button variant="outlined" onClick={() => onRespond(request.id, 'declined')}>Decline</Button></Stack>
      </Stack>)}
    </Stack></Paper>}
    {role === 'sitter' && dogs.length === 0 && <Alert severity="info">No dogs in your care yet. Accepted sitter requests will appear here.</Alert>}
    {dogs.length > 0 &&
    <Paper variant="outlined" sx={{ p: 1 }}>
      <List disablePadding sx={{ display: 'grid', gap: 0.5 }}>
        {dogs.map((dog) => <ListItemButton key={dog.id} onClick={() => onSelect(dog.id)} sx={{ py: 1.5 }}>
          <ListItemAvatar><Avatar src={dog.image} alt={dog.name} sx={{ width: 48, height: 48, mr: 1 }} /></ListItemAvatar>
          <ListItemText primary={dog.name} secondary={`${dog.breed} - ${dog.age}`} />
          <ChevronRightRounded color="action" />
        </ListItemButton>)}
      </List>
    </Paper>}
    {role === 'owner' && adding && <DogEntryDialog ownerId={ownerId} onClose={() => setAdding(false)} onAdd={addDog} />}
  </Stack>;
}
