import { getInitials } from '../data/profile';
import { useState } from 'react';
import { Avatar, Box, Paper, Skeleton, Stack, Typography } from '@mui/material';
import PetsRounded from '@mui/icons-material/PetsRounded';
import DirectionsWalkRounded from '@mui/icons-material/DirectionsWalkRounded';
import RestaurantRounded from '@mui/icons-material/RestaurantRounded';
import SportsTennisRounded from '@mui/icons-material/SportsTennisRounded';
import BedtimeRounded from '@mui/icons-material/BedtimeRounded';
import FavoriteBorderRounded from '@mui/icons-material/FavoriteBorderRounded';
import type { CareUpdate } from '../data/types';

import { visualTokens } from '../visualTokens';
import { imageFrameSx } from '../imageStyles';

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
  if (failedSrc === src) return <Box role="img" aria-label={`${alt} (photo unavailable)`} sx={{ ...imageFrameSx, height, bgcolor: 'background.paper', display: 'grid', placeContent: 'center', textAlign: 'center', gap: 1 }}>
    <PetsRounded sx={{ mx: 'auto', fontSize: 42 }} /><Typography variant="body2">Photo unavailable</Typography>
  </Box>;
  return <Box component="img" src={src} alt={alt} onError={() => setFailedSrc(src)} sx={{ ...imageFrameSx, width: '100%', height, display: 'block', objectFit: 'cover', objectPosition: position }} />;
}

export function UpdateCard({ update, dogName, authorName, outgoing = false }: { update: CareUpdate; dogName: string; authorName?: string; outgoing?: boolean }) {
  const Icon = typeIcons[update.type];
  const date = new Date(update.timestamp);
  const initials = authorName ? getInitials(authorName) : '?';
  return <Box component="article" sx={{ display: 'flex', flexDirection: outgoing ? 'row-reverse' : 'row', alignItems: 'flex-start', gap: 1 }}>
    <Avatar sx={{ bgcolor: 'background.paper', color: 'primary.dark', width: 30, height: 30, fontSize: 11, mt: 1 }}>{initials}</Avatar>
    <Box sx={{ minWidth: 0, maxWidth: '82%' }}>
      <Typography variant="caption" color="text.secondary" sx={{ ml: 1.25 }}>{authorName ?? 'Sitter'}</Typography>
      <Paper variant="outlined" sx={{ overflow: 'hidden', borderRadius: `${visualTokens.imageRadius}px`, bgcolor: 'background.paper' }}>
        <Photo src={update.image} alt={`${update.type} update from ${dogName}’s sitter`} height={170} />
        <Box sx={{ px: 1.5, pt: 1, pb: 1.25 }}>
          <Stack direction="row" spacing={.7} sx={{ alignItems: 'center', color: 'text.primary', mb: update.text ? .5 : 0 }}><Icon sx={{ fontSize: 17 }} /><Typography variant="caption" sx={{ fontWeight: 700 }}>{update.type}</Typography></Stack>
          {update.text && <Typography variant="body2" sx={{ color: 'text.primary' }}>{update.text}</Typography>}
        </Box>
      </Paper>
      <Typography variant="caption" color="text.secondary" sx={{ ml: 1.25 }}><time dateTime={update.timestamp}>{date.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' })}</time></Typography>
    </Box>
  </Box>;
}

export function FeedSkeleton({ dogName }: { dogName: string }) {
  return <Stack spacing={2.5} role="status" aria-label="Loading care updates" sx={{ p: 2 }}><Typography variant="body2" color="text.secondary">Loading {dogName}’s updates…</Typography>{[1, 2].map((id) => <Stack key={id} direction="row" spacing={1}><Skeleton variant="rounded" width={30} height={30} sx={{ borderRadius: `${visualTokens.imageRadius}px` }} /><Box sx={{ width: '72%' }}><Skeleton variant="rounded" height={150} /><Skeleton width="35%" /></Box></Stack>)}</Stack>;
}
