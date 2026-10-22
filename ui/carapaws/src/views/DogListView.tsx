import type { OwnerContact } from '../data/types';
import { useRef, useState } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Avatar, Box, Button, Chip, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Paper, Stack, TextField, Typography } from '@mui/material';
import ExpandMoreRounded from '@mui/icons-material/ExpandMoreRounded';
import AddRounded from '@mui/icons-material/AddRounded';
import ChevronRightRounded from '@mui/icons-material/ChevronRightRounded';
import { DogEntryDialog } from '../components/DogEntryDialog';
import { QuickUpdateDialog } from '../components/QuickUpdateDialog';
import { getDogListPage } from '../data/dogList';
import { getLatestUpdatesByDog } from '../data/updates';
import type { CareUpdate, Dog, NewUpdate, Role, SitterRequest } from '../data/types';

export function DogListView({ owners, browse, onBrowse, onMakeCurrent, dogs, updates, currentDogId, role, ownerId, incoming, onSelect, onAdd, onRespond, onSend }: { owners: OwnerContact[]; browse: { query: string; page: number }; onBrowse: (browse: { query: string; page: number }) => void; onMakeCurrent: (dogId: string) => void; dogs: Dog[]; updates: CareUpdate[]; currentDogId?: string; role: Role; ownerId: string; incoming: { request: SitterRequest; dog: Dog }[]; onSelect: (dogId: string) => void; onAdd: (dog: Dog) => void; onRespond: (requestId: string, decision: 'accepted' | 'declined') => void; onSend: (update: NewUpdate) => Promise<void> }) {
  const resultsRef = useRef<HTMLHeadingElement>(null);
  const [adding, setAdding] = useState(false);
  const [addedName, setAddedName] = useState('');
  const [quickUpdateDog, setQuickUpdateDog] = useState<Dog | null>(null);
  const [updatedName, setUpdatedName] = useState('');

  function addDog(dog: Dog) {
    onAdd(dog);
    setAddedName(dog.name);
    setAdding(false);
  }

  const results = getDogListPage(dogs, owners, browse.query, browse.page, role === 'sitter');
  const groups = role === 'sitter' ? results.groups : [{ id: ownerId, name: '', dogs: results.dogs, continued: false }];
  const latestUpdates = getLatestUpdatesByDog(updates);

  function changePage(page: number) {
    onBrowse({ ...browse, page });
    resultsRef.current?.focus();
    resultsRef.current?.scrollIntoView({ block: 'start' });
  }


  return <Stack spacing={2}>
    <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <Box>
        <Typography ref={resultsRef} component="h1" variant="h5" tabIndex={-1} sx={{ scrollMarginTop: 80 }}>{role === 'owner' ? 'Your dogs' : 'Dogs in your care'}</Typography>
        <Typography variant="body2" color="text.secondary">Choose a dog to open their updates.</Typography>
      </Box>
      {role === 'owner' && <Button variant="outlined" startIcon={<AddRounded />} onClick={() => setAdding(true)} sx={{ flexShrink: 0 }}>Add dog</Button>}
    </Stack>
    <TextField label="Search by dog or owner name" type="search" value={browse.query} onChange={(event) => onBrowse({ query: event.target.value, page: 1 })} fullWidth />
    {browse.query && <Button onClick={() => onBrowse({ query: '', page: 1 })} sx={{ alignSelf: 'flex-start', minHeight: 48 }}>Clear search</Button>}
    {addedName && <Alert severity="success" onClose={() => setAddedName('')}>{addedName} has been added to your demo dogs.</Alert>}
    {role === 'sitter' && updatedName && <Alert severity="success" onClose={() => setUpdatedName('')}>Update for {updatedName} added to the demo chat.</Alert>}
    {role === 'sitter' && <Accordion defaultExpanded={false}>
      <AccordionSummary expandIcon={<ExpandMoreRounded />} aria-controls="sitter-requests-content" id="sitter-requests-heading">
        <Typography component="span" variant="h6">Dog sitting requests ({incoming.length})</Typography>
      </AccordionSummary>
      <AccordionDetails id="sitter-requests-content"><Stack spacing={2}>
        {incoming.length === 0 && <Typography color="text.secondary">No dog sitting requests yet. New requests will appear here.</Typography>}
        {incoming.map(({ request, dog }) => <Stack key={request.id} spacing={1.5} sx={{ borderTop: 1, borderColor: 'divider', pt: 1.5 }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}><Avatar src={dog.image} alt={dog.name} /><Box><Typography variant="body1" sx={{ fontWeight: 800 }}>{dog.name}</Typography><Typography variant="body2" color="text.secondary">{dog.breed} - {owners.find((person) => person.id === dog.ownerId)?.name ?? 'Owner'} wants to add you as their sitter</Typography></Box></Stack>
          <Stack direction="row" spacing={1}><Button variant="contained" onClick={() => onRespond(request.id, 'accepted')}>Accept</Button><Button variant="outlined" onClick={() => onRespond(request.id, 'declined')}>Decline</Button></Stack>
        </Stack>)}
      </Stack></AccordionDetails>
    </Accordion>}
    {role === 'sitter' && dogs.length === 0 && <Alert severity="info">No dogs in your care yet. Accepted sitter requests will appear here.</Alert>}
    {role === 'owner' && dogs.length === 0 && <Button variant="contained" onClick={() => setAdding(true)}>Add your first dog</Button>}
    {results.total === 0 && dogs.length > 0 && <Typography>No dogs match your search. Try another dog or owner name.</Typography>}
    {groups.filter((group) => group.dogs.length > 0).map((group) => {
      const dogRows = <List disablePadding>
        {group.dogs.map((dog) => {
          const latest = latestUpdates.get(dog.id);
          return <ListItem key={dog.id} disablePadding sx={{ gap: 0.5, flexWrap: 'nowrap', '& + &': { borderTop: 1, borderColor: 'divider' } }}><ListItemButton onClick={() => onSelect(dog.id)} sx={{ py: 1.5, minWidth: 0, flex: 1 }}>
            <ListItemAvatar sx={{ minWidth: 48 }}><Avatar src={dog.image} alt={dog.name} sx={{ width: 40, height: 40 }} /></ListItemAvatar>
            <ListItemText primary={dog.name} secondary={latest ? latest.text || `${latest.type} photo update` : 'No updates yet'} slotProps={{ secondary: { noWrap: true } }} sx={{ minWidth: 0 }} />
            <ChevronRightRounded color="action" />
          </ListItemButton>
          {role === 'sitter' && <Button
            variant="outlined"
            aria-label={`Quick update for ${dog.name}`}
            onClick={() => { setUpdatedName(''); setQuickUpdateDog(dog); }}
            sx={{ flexShrink: 0, minHeight: 48, mr: 0.5 }}
          >Update</Button>}
          {role === 'owner' && <Chip
            label={dog.id === currentDogId ? 'Current' : 'Make current'}
            color={dog.id === currentDogId ? 'primary' : 'default'}
            variant={dog.id === currentDogId ? 'filled' : 'outlined'}
            component="button"
            type="button"
            aria-label={dog.id === currentDogId ? `${dog.name} is your current dog` : `Make ${dog.name} current dog`}
            aria-pressed={dog.id === currentDogId}
            onClick={() => onMakeCurrent(dog.id)}
            sx={{ flexShrink: 0, width: 112, height: 48, mr: 0.5 }}
          />}
          </ListItem>;
        })}
      </List>;
      return role === 'sitter' ? <Accordion key={`${group.id}:${results.page}:${browse.query}`} defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreRounded />} id={`owner-${group.id}-heading`} aria-controls={`owner-${group.id}-content`}>
          <Typography component="span" variant="h6">{group.name}{group.continued ? ' (continued)' : ''}</Typography>
        </AccordionSummary>
        <AccordionDetails id={`owner-${group.id}-content`}>{dogRows}</AccordionDetails>
      </Accordion> : <Paper key={group.id} variant="outlined" sx={{ p: 1 }}>{dogRows}</Paper>;
    })}
    {role === 'sitter' && results.pageCount > 1 && <Stack component="nav" aria-label="Dog list pages" direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
      <Button variant="outlined" disabled={results.page === 1} onClick={() => changePage(results.page - 1)} sx={{ minHeight: 48 }}>Previous</Button>
      <Typography aria-live="polite">Page {results.page} of {results.pageCount}</Typography>
      <Button variant="outlined" disabled={results.page === results.pageCount} onClick={() => changePage(results.page + 1)} sx={{ minHeight: 48 }}>Next</Button>
    </Stack>}
    {role === 'owner' && adding && <DogEntryDialog ownerId={ownerId} onClose={() => setAdding(false)} onAdd={addDog} />}
    {role === 'sitter' && quickUpdateDog && <QuickUpdateDialog key={quickUpdateDog.id} dog={quickUpdateDog} onSend={onSend} onClose={() => setQuickUpdateDog(null)} onSent={() => { setUpdatedName(quickUpdateDog.name); setQuickUpdateDog(null); }} />}
  </Stack>;
}
