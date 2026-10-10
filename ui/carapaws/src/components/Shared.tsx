import { useState } from 'react';
import { Avatar, Box, Chip, Paper, Skeleton, Stack, Typography } from '@mui/material';
import PetsRounded from '@mui/icons-material/PetsRounded';
import DirectionsWalkRounded from '@mui/icons-material/DirectionsWalkRounded';
import RestaurantRounded from '@mui/icons-material/RestaurantRounded';
import SportsTennisRounded from '@mui/icons-material/SportsTennisRounded';
import BedtimeRounded from '@mui/icons-material/BedtimeRounded';
import FavoriteBorderRounded from '@mui/icons-material/FavoriteBorderRounded';
import { sitterProfiles } from '../data/mockData';
import type { CareUpdate } from '../data/types';

const typeIcons = {
  Walk: DirectionsWalkRounded, Meal: RestaurantRounded, Play: SportsTennisRounded,
  Rest: BedtimeRounded, General: FavoriteBorderRounded,
};
export function Brand({ stacked = false }: { stacked?: boolean }) {
  return <Stack direction={stacked ? 'column' : 'row'} spacing={stacked ? 1.5 : 1} sx={{ alignItems: 'center' }}>
    <Box sx={{ width: stacked ? 80 : 36, height: stacked ? 80 : 36, display: 'grid', placeItems: 'center', bgcolor: 'background.paper', color: 'primary.main', border: 1, borderColor: 'divider', borderRadius: '50%' }}><PetsRounded sx={{ fontSize: stacked ? 48 : 20 }} /></Box>
    <Typography variant={stacked ? 'h4' : 'h6'} sx={{ letterSpacing: -0.5, color: 'primary.main', fontSize: stacked ? 38 : undefined }}>CaraPaws</Typography>
  </Stack>;
}

export function Photo({ src, alt, height = 260, position = 'center' }: { src: string; alt: string; height?: number | string; position?: string }) {
  const [failedSrc, setFailedSrc] = useState('');
  if (failedSrc === src) return <Box role="img" aria-label={`${alt} (photo unavailable)`} sx={{ height, bgcolor: 'background.paper', display: 'grid', placeContent: 'center', textAlign: 'center', gap: 1 }}>
    <PetsRounded sx={{ mx: 'auto', fontSize: 42 }} /><Typography variant="body2">Photo unavailable</Typography>
  </Box>;
  return <Box component="img" src={src} alt={alt} onError={() => setFailedSrc(src)} sx={{ width: '100%', height, display: 'block', objectFit: 'cover', objectPosition: position }} />;
}

export function Caregiver({ compact = false }: { compact?: boolean }) {
  const sitter = sitterProfiles[0];
  const initials = sitter.name.split(' ').map((part) => part[0]).slice(0, 2).join('');
  return <Stack direction="row" spacing={1.5} style={{ alignItems: 'center' }}>
    <Avatar sx={{ bgcolor: 'background.paper', color: 'primary.dark', border: 1, borderColor: 'divider', width: compact ? 36 : 46, height: compact ? 36 : 46 }}>{initials}</Avatar>
    <Box sx={{ flex: 1 }}><Typography variant="body2" style={{ fontWeight: 700 }}>{sitter.name}</Typography></Box>
    {!compact && <Chip label="Current sitter" size="small" color="success" variant="outlined" />}
  </Stack>;
}

export function UpdateCard({ update, dogName, outgoing = false }: { update: CareUpdate; dogName: string; outgoing?: boolean }) {
  const Icon = typeIcons[update.type];
  const date = new Date(update.timestamp);
  const author = sitterProfiles.find((profile) => profile.userId === update.authorId);
  const initials = author?.name.split(' ').map((part) => part[0]).slice(0, 2).join('') ?? '?';
  return <Box component="article" sx={{ display: 'flex', flexDirection: outgoing ? 'row-reverse' : 'row', alignItems: 'flex-start', gap: 1 }}>
    <Avatar sx={{ bgcolor: 'background.paper', color: 'primary.dark', border: 1, borderColor: 'divider', width: 30, height: 30, fontSize: 11, mt: 1 }}>{initials}</Avatar>
    <Box sx={{ minWidth: 0, maxWidth: '82%' }}>
      <Typography variant="caption" color="text.secondary" sx={{ ml: 1.25 }}>{author?.name ?? 'Sitter'}</Typography>
      <Paper variant="outlined" sx={{ overflow: 'hidden', borderRadius: 1.5, bgcolor: 'background.paper' }}>
        <Photo src={update.image} alt={`${update.type} update from ${dogName}’s sitter`} height={170} />
        <Box sx={{ px: 1.5, pt: 1, pb: 1.25 }}>
          <Stack direction="row" spacing={.7} sx={{ alignItems: 'center', color: 'primary.main', mb: update.text ? .5 : 0 }}><Icon sx={{ fontSize: 17 }} /><Typography variant="caption" sx={{ fontWeight: 700 }}>{update.type}</Typography></Stack>
          {update.text && <Typography variant="body2" sx={{ color: 'text.primary' }}>{update.text}</Typography>}
        </Box>
      </Paper>
      <Typography variant="caption" color="text.secondary" sx={{ ml: 1.25 }}><time dateTime={update.timestamp}>{date.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}</time></Typography>
    </Box>
  </Box>;
}

export function FeedSkeleton({ dogName }: { dogName: string }) {
  return <Stack spacing={2.5} role="status" aria-label="Loading care updates" sx={{ p: 2 }}><Typography variant="body2" color="text.secondary">Loading {dogName}’s updates…</Typography>{[1, 2].map((id) => <Stack key={id} direction="row" spacing={1}><Skeleton variant="circular" width={30} height={30} /><Box sx={{ width: '72%' }}><Skeleton variant="rounded" height={150} /><Skeleton width="35%" /></Box></Stack>)}</Stack>;
}
