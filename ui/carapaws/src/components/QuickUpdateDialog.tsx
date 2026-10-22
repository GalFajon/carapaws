import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import type { Dog, NewUpdate } from '../data/types';
import { UpdateComposer } from './UpdateComposer';

export function QuickUpdateDialog({ dog, onSend, onClose, onSent }: { dog: Dog; onSend: (update: NewUpdate) => Promise<void>; onClose: () => void; onSent: () => void }) {
  const [sending, setSending] = useState(false);

  async function send(update: NewUpdate) {
    setSending(true);
    try {
      await onSend(update);
      onSent();
    } finally {
      setSending(false);
    }
  }

  return <Dialog open onClose={() => { if (!sending) onClose(); }} fullWidth maxWidth="sm" aria-labelledby="quick-update-title" aria-describedby="quick-update-description">
    <DialogTitle id="quick-update-title">Quick update for {dog.name}</DialogTitle>
    <DialogContent>
      <Typography id="quick-update-description" color="text.secondary" sx={{ mb: 2 }}>Add a photo and an optional message for {dog.name}’s owner.</Typography>
      <UpdateComposer dog={dog} onSend={send} />
    </DialogContent>
    <DialogActions><Button onClick={onClose} disabled={sending}>Cancel</Button></DialogActions>
  </Dialog>;
}
