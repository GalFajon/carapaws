import type { OwnerContact } from '../data/types';
import { useEffect, useRef, useState } from 'react';
import { Alert, Avatar, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, Menu, MenuItem, Stack, Tooltip, Typography } from '@mui/material';
import { ProfileLink } from '../components/ProfileLink';
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded';
import ContactPhoneRounded from '@mui/icons-material/ContactPhoneRounded';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import { FeedSkeleton, UpdateCard } from '../components/Shared';
import { UpdateComposer } from '../components/UpdateComposer';
import { getInitials } from '../data/profile';
import type { CareUpdate, Dog, FeedState, NewUpdate, Role, SitterProfile } from '../data/types';

function formatUpdateDay(timestamp: string) {
  return new Date(timestamp).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function UpdatesView({ owners, sitters, dog, role, sitterName, updates, state, onBack, onRetry, onSend, onDogProfile, onPerson }: { owners: OwnerContact[]; sitters: SitterProfile[]; onDogProfile: () => void; onPerson: () => void; dog: Dog; role: Role; sitterName?: string; updates: CareUpdate[]; state: FeedState; onBack: () => void; onRetry: () => void; onSend: (update: NewUpdate) => Promise<void> }) {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [ownerOpen, setOwnerOpen] = useState(false);
  const dogOwner = owners.find((person) => person.id === dog.ownerId);
  const isOwner = role === 'owner';
  const personName = isOwner ? sitterName : dogOwner?.name;
  const personRole = isOwner ? 'Sitter' : 'Owner';
  const personInitials = isOwner ? (sitterName ? getInitials(sitterName) : undefined) : dogOwner?.initials;
  const contact = dog.emergency.contact.trim();
  const contactHref = /^[+\d][\d ()-]{5,}$/.test(contact) ? `tel:${contact.replace(/[ ()-]/g, '')}` : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) ? `mailto:${contact}` : undefined;
  const messages = [...updates].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const authorNames = new Map(sitters.map((profile) => [profile.userId, profile.name]));
  const conversationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === 'ready' && conversationRef.current) conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
  }, [dog.id, messages.length, state]);

  return <Stack sx={{ height: '100%', minHeight: 0 }}>
    <Box sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) auto', alignItems: 'center', gap: 0.75, py: 1, flexShrink: 0 }}>
      <ProfileLink heading name={`${dog.name} - Dog`} label={`View ${dog.name}'s profile`} image={dog.image} onClick={onDogProfile} />
      <ProfileLink
        name={personName ? `${personName} - ${personRole}` : personRole}
        label={`View ${personRole.toLowerCase()} profile`}
        initials={personInitials}
        disabled={isOwner && !sitterName}
        onClick={isOwner ? onPerson : () => setOwnerOpen(true)}
      />
      <Stack direction="row" spacing={0.75}>
        {role === 'sitter' && <Tooltip title="Emergency contact"><IconButton aria-label="Emergency contact" onClick={() => setContactOpen(true)}><ContactPhoneRounded /></IconButton></Tooltip>}
        <IconButton id="updates-menu-button" aria-label="Updates options" aria-haspopup="menu" aria-controls={menuAnchor ? 'updates-menu' : undefined} aria-expanded={Boolean(menuAnchor)} onClick={(event) => setMenuAnchor(event.currentTarget)}><MoreHorizRounded /></IconButton>
      </Stack>
      <Menu id="updates-menu" anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)} slotProps={{ list: { 'aria-labelledby': 'updates-menu-button' } }}>
        <MenuItem onClick={() => { setMenuAnchor(null); onBack(); }}>{role === 'owner' ? 'My dogs' : 'Dogs in my care'}</MenuItem>
        {role === 'sitter' && <MenuItem onClick={() => { setMenuAnchor(null); setContactOpen(true); }}><ContactPhoneRounded fontSize="small" sx={{ mr: 1 }} />Emergency contact</MenuItem>}
        <MenuItem disabled={state === 'loading'} onClick={() => { setMenuAnchor(null); onRetry(); }}><RefreshRounded fontSize="small" sx={{ mr: 1 }} />Refresh updates</MenuItem>
      </Menu>
    </Box>
    <Dialog open={contactOpen} onClose={() => setContactOpen(false)} fullWidth maxWidth="xs" aria-labelledby="emergency-title">
      <DialogTitle id="emergency-title">{dog.name}’s emergency contact</DialogTitle><DialogContent><Typography sx={{ fontWeight: 700 }}>{dog.emergency.name || 'No contact name provided'}</Typography><Typography>{contact || 'No contact details provided'}</Typography>{!contactHref && <Alert severity="info" sx={{ mt: 2 }}>No callable number or email is available for this demo contact.</Alert>}</DialogContent><DialogActions><Button onClick={() => setContactOpen(false)}>Close</Button>{contactHref && <Button href={contactHref} variant="contained">{contactHref.startsWith('tel:') ? 'Call contact' : 'Email contact'}</Button>}</DialogActions>
    </Dialog>
    <Dialog open={ownerOpen} onClose={() => setOwnerOpen(false)} fullWidth maxWidth="xs" aria-labelledby="owner-title"><DialogTitle id="owner-title">Owner profile</DialogTitle><DialogContent><Stack spacing={1}><Avatar>{dogOwner?.initials}</Avatar><Typography variant="h6">{dogOwner?.name ?? 'Owner details unavailable'}</Typography><Typography color="text.secondary">Caring for {dog.name}</Typography><Typography>{dogOwner?.contact ?? 'Contact details unavailable'}</Typography></Stack></DialogContent><DialogActions><Button onClick={() => setOwnerOpen(false)}>Close</Button></DialogActions></Dialog>
    <Divider />

    <Box ref={conversationRef} sx={{ flex: 1, minHeight: 0, overflowY: 'auto', py: 2 }}>
      {state === 'error' && <Alert severity="error" action={<Button onClick={onRetry}>Retry</Button>}>Updates could not be loaded. Please try again.</Alert>}
      {state === 'loading' && <FeedSkeleton dogName={dog.name} />}
      {state === 'ready' && messages.length === 0 && <Stack sx={{ minHeight: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center', px: 2 }}><Typography variant="h6">No updates yet</Typography><Typography variant="body2" color="text.secondary">Photos and care updates for {dog.name} will appear here when their sitter shares them.</Typography></Stack>}
      {state === 'ready' && messages.length > 0 && <Stack spacing={2.5} sx={{ minHeight: '100%', justifyContent: 'flex-end' }}>
        {messages.map((update, index) => {
          const day = formatUpdateDay(update.timestamp);
          const previousDay = index > 0 ? formatUpdateDay(messages[index - 1].timestamp) : '';
          const showDay = day !== previousDay;
          return <Box key={update.id}>{showDay && <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}><Chip label={day} variant="outlined" sx={{ bgcolor: 'action.hover', color: 'text.secondary' }} /></Box>}<UpdateCard update={update} dogName={dog.name} authorName={authorNames.get(update.authorId)} outgoing={role === 'sitter'} /></Box>;
        })}
      </Stack>}
    </Box>
    {role === 'sitter' && <Box sx={{ pb: 1, flexShrink: 0 }}><UpdateComposer key={dog.id} dog={dog} onSend={onSend} /></Box>}
  </Stack>;
}
