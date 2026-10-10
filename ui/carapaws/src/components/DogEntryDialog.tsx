import { useState } from 'react';
import { Alert, Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField, Typography } from '@mui/material';
import AddPhotoAlternateRounded from '@mui/icons-material/AddPhotoAlternateRounded';
import PetsRounded from '@mui/icons-material/PetsRounded';
import type { Dog } from '../data/types';

type DogDetails = Omit<Dog, 'id' | 'ownerId' | 'image' | 'loves' | 'dislikes'> & {
  loves: string;
  dislikes: string;
};

const initialDetails: DogDetails = {
  name: '', breed: '', age: '', gender: '', feeding: '', medical: '',
  emergency: { name: '', contact: '' }, loves: '', dislikes: '',
};
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function DogEntryDialog({ ownerId, onClose, onAdd }: { ownerId: string; onClose: () => void; onAdd: (dog: Dog) => void }) {
  const [details, setDetails] = useState<DogDetails>(initialDetails);
  const [image, setImage] = useState('');
  const [imageError, setImageError] = useState('');

  function update<K extends keyof DogDetails>(field: K, value: DogDetails[K]) {
    setDetails((current) => ({ ...current, [field]: value }));
  }

  function chooseImage(file?: File) {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setImageError('Choose an image file.'); return; }
    if (file.size > MAX_IMAGE_BYTES) { setImageError('Choose a photo smaller than 5 MB.'); return; }
    const reader = new FileReader();
    reader.onload = () => { if (typeof reader.result === 'string') { setImage(reader.result); setImageError(''); } };
    reader.onerror = () => setImageError('That photo could not be opened.');
    reader.readAsDataURL(file);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const split = (value: string) => value.split(',').map((item) => item.trim()).filter(Boolean);
    onAdd({
      id: crypto.randomUUID(), ownerId,
      name: details.name.trim(), breed: details.breed.trim(), age: details.age.trim(), gender: details.gender,
      image: image || '/images/dog-placeholder.svg',
      feeding: details.feeding.trim() || 'Not provided yet',
      medical: details.medical.trim() || 'Not provided yet',
      emergency: { name: details.emergency.name.trim(), contact: details.emergency.contact.trim() },
      loves: split(details.loves), dislikes: split(details.dislikes),
    });
  }

  return <Dialog open onClose={onClose} fullWidth maxWidth="sm" aria-labelledby="add-dog-title" slotProps={{ paper: { sx: { maxHeight: '92dvh' } } }}>
    <DialogTitle id="add-dog-title" variant="h5">Add your dog</DialogTitle>
    <DialogContent>
      <Box component="form" id="add-dog-form" onSubmit={submit} sx={{ pt: 1 }}>
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">Demo only — details stay in this app session and disappear when you reload.</Typography>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Avatar src={image || undefined} sx={{ width: 72, height: 72, bgcolor: 'background.paper', color: 'primary.dark', border: 1, borderColor: 'divider' }}><PetsRounded /></Avatar>
            <Button component="label" variant="outlined" startIcon={<AddPhotoAlternateRounded />}>Choose photo<input hidden type="file" accept="image/*" onChange={(event) => { chooseImage(event.target.files?.[0]); event.target.value = ''; }} /></Button>
          </Stack>
          {imageError && <Alert severity="error">{imageError}</Alert>}
          <TextField label="Dog's name" value={details.name} onChange={(event) => update('name', event.target.value)} required fullWidth slotProps={{ htmlInput: { maxLength: 60 } }} />
          <TextField label="Breed" value={details.breed} onChange={(event) => update('breed', event.target.value)} required fullWidth slotProps={{ htmlInput: { maxLength: 80 } }} />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField label="Age" placeholder="e.g. 4 years" value={details.age} onChange={(event) => update('age', event.target.value)} required fullWidth slotProps={{ htmlInput: { maxLength: 30 } }} />
            <TextField select label="Gender" value={details.gender} onChange={(event) => update('gender', event.target.value)} required fullWidth>
              <MenuItem value="Female">Female</MenuItem><MenuItem value="Male">Male</MenuItem><MenuItem value="Other">Other</MenuItem><MenuItem value="Not specified">Prefer not to say</MenuItem>
            </TextField>
          </Stack>
          <TextField label="Feeding routine" placeholder="Times, portions, food" value={details.feeding} onChange={(event) => update('feeding', event.target.value)} multiline minRows={2} fullWidth />
          <TextField label="Medical information" placeholder="Medication, allergies or care needs" value={details.medical} onChange={(event) => update('medical', event.target.value)} multiline minRows={2} fullWidth />
          <Typography variant="h6" component="h3">Emergency contact</Typography>
          <TextField label="Contact name" value={details.emergency.name} onChange={(event) => update('emergency', { ...details.emergency, name: event.target.value })} required fullWidth slotProps={{ htmlInput: { maxLength: 80 } }} />
          <TextField label="Contact phone or email" value={details.emergency.contact} onChange={(event) => update('emergency', { ...details.emergency, contact: event.target.value })} required fullWidth slotProps={{ htmlInput: { maxLength: 120 } }} />
          <TextField label="Things they love" helperText="Separate items with commas" value={details.loves} onChange={(event) => update('loves', event.target.value)} fullWidth />
          <TextField label="Things they dislike" helperText="Separate items with commas" value={details.dislikes} onChange={(event) => update('dislikes', event.target.value)} fullWidth />
        </Stack>
      </Box>
    </DialogContent>
    <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}><Button onClick={onClose}>Cancel</Button><Button type="submit" form="add-dog-form" variant="contained">Add dog</Button></DialogActions>
  </Dialog>;
}
