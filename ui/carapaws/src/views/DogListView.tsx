import { Avatar, Box, List, ListItemAvatar, ListItemButton, ListItemText, Paper, Stack, Typography } from '@mui/material';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import type { Dog, Role } from '../data/types';

export function DogListView({ dogs, role, onSelect }: { dogs: Dog[]; role: Role; onSelect: (dogId: string) => void }) {
  return <Stack spacing={2}>
    <Box>
      <Typography component="h1" variant="h5">Dogs</Typography>
      <Typography variant="body2" color="text.secondary">Choose a dog to see their profile{role === 'sitter' ? ' and share a care update' : ' and updates'}.</Typography>
    </Box>
    <Paper variant="outlined">
      <List disablePadding>
        {dogs.map((dog, index) => <ListItemButton key={dog.id} divider={index < dogs.length - 1} onClick={() => onSelect(dog.id)} sx={{ py: 1.5 }}>
          <ListItemAvatar><Avatar src={dog.image} alt={dog.name} sx={{ width: 48, height: 48, mr: 1 }} /></ListItemAvatar>
          <ListItemText primary={dog.name} secondary={`${dog.breed} - ${dog.age}`} />
          <ChevronRightRounded color="action" />
        </ListItemButton>)}
      </List>
    </Paper>
  </Stack>;
}
