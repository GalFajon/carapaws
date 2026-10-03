import { useRef, useState } from 'react';
import { Avatar, Button, CircularProgress, IconButton, Menu, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material';
import AddPhotoAlternateRounded from '@mui/icons-material/AddPhotoAlternateRounded';
import CloseRounded from '@mui/icons-material/CloseRounded';
import SendRounded from '@mui/icons-material/SendRounded';
import { samplePhotos } from '../data/mockData';
import type { Dog, NewUpdate, UpdateType } from '../data/types';

const kinds: UpdateType[] = ['Walk', 'Meal', 'Play', 'Rest', 'General'];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function UpdateComposer({ dog, onSend }: { dog: Dog; onSend: (update: NewUpdate) => Promise<void> }) {
  const [type, setType] = useState<UpdateType>('Walk');
  const [image, setImage] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sampleAnchor, setSampleAnchor] = useState<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function chooseFile(file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please choose an image file.'); return; }
    if (file.size > MAX_IMAGE_BYTES) { setError('Please choose a photo smaller than 5 MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === 'string') { setImage(reader.result); setError(''); } };
    reader.onerror = () => setError('That photo could not be opened.');
    reader.readAsDataURL(file);
  }

  async function send() {
    if (!image || sending) return;
    setError(''); setSending(true);
    try { await onSend({ dogId: dog.id, type, image, text }); setImage(''); setText(''); setType('Walk'); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not share this update.'); }
    finally { setSending(false); }
  }

  return <Paper variant="outlined" sx={{ p: 1.5, flexShrink: 0 }}>
    <Stack spacing={1}>
      {image && <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}><Avatar src={image} alt="Selected update photo" variant="rounded" /><Typography variant="caption" sx={{ flex: 1 }}>Photo attached</Typography><IconButton size="small" aria-label="Remove photo" onClick={() => setImage('')}><CloseRounded fontSize="small" /></IconButton></Stack>}
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Select size="small" value={type} onChange={(event) => setType(event.target.value as UpdateType)} inputProps={{ 'aria-label': 'Update type' }} sx={{ minWidth: 100 }}>{kinds.map((kind) => <MenuItem key={kind} value={kind}>{kind}</MenuItem>)}</Select>
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={(event) => { chooseFile(event.target.files?.[0]); event.target.value = ''; }} />
        <IconButton aria-label="Attach photo" onClick={() => inputRef.current?.click()}><AddPhotoAlternateRounded /></IconButton>
        <Button size="small" onClick={(event) => setSampleAnchor(event.currentTarget)}>Sample photo</Button>
        <Menu anchorEl={sampleAnchor} open={Boolean(sampleAnchor)} onClose={() => setSampleAnchor(null)}>{samplePhotos.map((photo) => <MenuItem key={photo.src} onClick={() => { setImage(photo.src); setError(''); setSampleAnchor(null); }}>{photo.label}</MenuItem>)}</Menu>
      </Stack>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'flex-end' }}>
        <TextField size="small" multiline maxRows={3} fullWidth placeholder={`Update ${dog.name}’s owner (optional message)`} value={text} onChange={(event) => setText(event.target.value)} slotProps={{ htmlInput: { maxLength: 400 } }} />
        <IconButton color="primary" aria-label="Send update" onClick={() => void send()} disabled={!image || sending}>{sending ? <CircularProgress size={22} /> : <SendRounded />}</IconButton>
      </Stack>
      {error && <Typography variant="caption" color="error">{error}</Typography>}
    </Stack>
  </Paper>;
}
