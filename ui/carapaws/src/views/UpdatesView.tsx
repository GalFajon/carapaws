import { useEffect, useRef } from 'react';
import { Avatar, Box, Chip, Divider, IconButton, Stack, Typography } from '@mui/material';
import ArrowBackRounded from '@mui/icons-material/ArrowBackRounded';
import RefreshRounded from '@mui/icons-material/RefreshRounded';
import { FeedSkeleton, UpdateCard } from '../components/Shared';
import { UpdateComposer } from '../components/UpdateComposer';
import type { CareUpdate, Dog, FeedState, NewUpdate, Role } from '../data/types';

export function UpdatesView({ dog, role, sitterName, updates, state, onBack, onRetry, onSend }: { dog: Dog; role: Role; sitterName?: string; updates: CareUpdate[]; state: FeedState; onBack: () => void; onRetry: () => void; onSend: (update: NewUpdate) => Promise<void> }) {
  const messages = [...updates].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  const conversationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === 'ready' && conversationRef.current) conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
  }, [dog.id, messages.length, state]);

  return <Stack sx={{ height: '100%', minHeight: 0 }}>
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', pt: 1, pb: 1 }}>
      <IconButton aria-label="Back" onClick={onBack}><ArrowBackRounded /></IconButton>
      <Avatar sx={{ bgcolor: 'background.paper', color: 'primary.dark', border: 1, borderColor: 'divider' }}>{sitterName ? sitterName.split(' ').map((part) => part[0]).slice(0, 2).join('') : dog.name[0]}</Avatar>
      <Box sx={{ flex: 1 }}><Typography component="h1" variant="h6">{dog.name}’s updates</Typography><Typography variant="caption" color="text.secondary">{sitterName ? `From ${sitterName}` : 'No sitter added yet'}</Typography></Box>
      <IconButton aria-label="Refresh updates" onClick={onRetry}><RefreshRounded /></IconButton>
    </Stack>
    <Divider />

    <Box ref={conversationRef} sx={{ flex: 1, minHeight: 0, overflowY: 'auto', py: 2 }}>
      {state === 'loading' && <FeedSkeleton dogName={dog.name} />}
      {state === 'ready' && messages.length === 0 && <Stack sx={{ minHeight: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center', px: 2 }}><Typography variant="h6">No updates yet</Typography><Typography variant="body2" color="text.secondary">Photos and care updates for {dog.name} will appear here once a sitter is assigned.</Typography></Stack>}
      {state === 'ready' && <Stack spacing={2.5} sx={{ minHeight: '100%', justifyContent: 'flex-end' }}>
        {messages.map((update, index) => {
          const day = new Date(update.timestamp).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' });
          const previousDay = index > 0 ? new Date(messages[index - 1].timestamp).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
          const showDay = day !== previousDay;
          return <Box key={update.id}>{showDay && <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}><Chip label={day} size="small" variant="outlined" /></Box>}<UpdateCard update={update} dogName={dog.name} outgoing={role === 'sitter'} /></Box>;
        })}
      </Stack>}
    </Box>
    {role === 'sitter' && <Box sx={{ pb: 1 }}><UpdateComposer key={dog.id} dog={dog} onSend={onSend} /></Box>}
  </Stack>;
}
