import { useEffect, useState } from 'react';
import { AppBar, Avatar, BottomNavigation, BottomNavigationAction, Box, Container, IconButton, Menu, MenuItem, Paper, Stack, Toolbar, Typography } from '@mui/material';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded';
import ListRounded from '@mui/icons-material/ListRounded';
import PetsRounded from '@mui/icons-material/PetsRounded';
import PhotoLibraryRounded from '@mui/icons-material/PhotoLibraryRounded';
import { Brand } from './components/Shared';
import { careService } from './data/careService';
import { dogs, initialUpdates, owner, sitter } from './data/mockData';
import type { CareUpdate, FeedState, NewUpdate, Role } from './data/types';
import { DogView } from './views/DogView';
import { DogListView } from './views/DogListView';
import { LoginView } from './views/LoginView';
import { UpdatesView } from './views/UpdatesView';

type Screen = 'list' | 'dog' | 'updates';

function SplashScreen() {
  return <Stack role="status" aria-label="Opening CaraPaws" sx={{ minHeight: '100dvh', alignItems: 'center', justifyContent: 'center', p: 3, bgcolor: 'primary.light' }}>
    <Box component="img" src="/images/carapaws-logo.png" alt="CaraPaws" sx={{ width: 160, maxWidth: '50vw', borderRadius: 3 }} />
  </Stack>;
}

function App() {
  const [splash, setSplash] = useState(true);
  const [role, setRole] = useState<Role | null>(null);
  const [screen, setScreen] = useState<Screen>('list');
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [updates, setUpdates] = useState<CareUpdate[]>(initialUpdates);
  const [feedState, setFeedState] = useState<FeedState>('loading');
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  useEffect(() => { const timer = window.setTimeout(() => setSplash(false), 1100); return () => window.clearTimeout(timer); }, []);

  async function refresh() {
    setFeedState('loading');
    try { setUpdates(await careService.listUpdates()); setFeedState('ready'); }
    catch { setFeedState('ready'); }
  }

  function signIn(nextRole: Role) {
    setRole(nextRole);
    setSelectedDogId(null);
    setScreen('list');
    void refresh();
  }

  async function sendUpdate(input: NewUpdate) {
    const created = await careService.createUpdate(input);
    setUpdates((current) => [created, ...current]);
    setFeedState('ready');
  }

  function signOut() { setRole(null); setSelectedDogId(null); setScreen('list'); setMenuAnchor(null); }
  function navigate(destination: Screen) { setScreen(destination); }
  function selectDog(dogId: string) { setSelectedDogId(dogId); setScreen('dog'); }

  if (splash) return <SplashScreen />;
  if (!role) return <LoginView onSignIn={signIn} />;

  const user = role === 'owner' ? owner : sitter;
  const selectedDog = dogs.find((dog) => dog.id === selectedDogId);
  const visibleUpdates = updates.filter((update) => update.dogId === selectedDogId);

  return <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default', pb: screen === 'updates' ? 0 : 'calc(72px + env(safe-area-inset-bottom))' }}>
    <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Container maxWidth="sm"><Toolbar disableGutters sx={{ minHeight: 56, gap: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}><Brand /></Box>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', minWidth: 0 }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light', color: 'primary.dark', fontSize: 12, flexShrink: 0 }}>{user.initials}</Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" noWrap>{user.name}</Typography>
            <Typography  variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1 }}>{role.toUpperCase()}</Typography>
          </Box>
        </Stack>
        <IconButton aria-label="Prototype options" onClick={(event) => setMenuAnchor(event.currentTarget)}><MoreHorizRounded /></IconButton>
      </Toolbar></Container>
    </AppBar>

    <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
      <MenuItem disabled>Demo controls</MenuItem>
      <MenuItem onClick={() => { setMenuAnchor(null); setRole(role === 'owner' ? 'sitter' : 'owner'); setSelectedDogId(null); setScreen('list'); }}>Switch to {role === 'owner' ? 'sitter' : 'owner'}</MenuItem>
      <MenuItem onClick={signOut}><LogoutRounded fontSize="small" sx={{ mr: 1 }} />Sign out</MenuItem>
    </Menu>

    <Container component="main" maxWidth="sm" sx={{ py: screen === 'updates' ? 0 : 2.5, height: screen === 'updates' ? 'calc(100dvh - 112px - env(safe-area-inset-bottom))' : undefined }}>
      {screen === 'list' && <DogListView dogs={dogs} role={role} onSelect={selectDog} />}
      {screen === 'dog' && selectedDog && <DogView dog={selectedDog} role={role} updates={visibleUpdates} onBack={() => navigate('list')} onUpdates={() => navigate('updates')} />}
      {screen === 'updates' && selectedDog && <UpdatesView dog={selectedDog} role={role} updates={visibleUpdates} state={feedState} onBack={() => navigate('dog')} onRetry={() => void refresh()} onSend={sendUpdate} />}
    </Container>

    <Paper elevation={3} sx={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 600, pb: 'env(safe-area-inset-bottom)', zIndex: 10 }}>
      <BottomNavigation showLabels value={screen} onChange={(_event, value: Screen) => navigate(value)}>
        <BottomNavigationAction label="Dogs" value="list" icon={<ListRounded />} />
        {selectedDog && <BottomNavigationAction label={selectedDog.name} value="dog" icon={<PetsRounded />} />}
        {selectedDog && <BottomNavigationAction label="Updates" value="updates" icon={<PhotoLibraryRounded />} />}
      </BottomNavigation>
    </Paper>
  </Box>;
}

export default App;
