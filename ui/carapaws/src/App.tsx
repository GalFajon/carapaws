import { useEffect, useState } from 'react';
import { AppBar, Avatar, BottomNavigation, BottomNavigationAction, Box, ButtonBase, Container, Menu, MenuItem, Paper, Stack, Toolbar, Typography } from '@mui/material';
import PersonRounded from '@mui/icons-material/PersonRounded';
import { SitterProfileView } from './views/SitterProfileView';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded';
import ListRounded from '@mui/icons-material/ListRounded';
import PetsRounded from '@mui/icons-material/PetsRounded';
import PhotoLibraryRounded from '@mui/icons-material/PhotoLibraryRounded';
import SearchRounded from '@mui/icons-material/SearchRounded';
import { Brand } from './components/Shared';
import { careService } from './data/careService';
import { assignments as demoAssignments, demoSitters, dogs as demoDogs, initialUpdates, owner, sitter, sitterProfiles } from './data/mockData';
import type { CareAssignment, CareUpdate, Dog, FeedState, NewUpdate, Role, SitterRequest } from './data/types';
import { DogView } from './views/DogView';
import { DogListView } from './views/DogListView';
import { FindSitterView } from './views/FindSitterView';
import { LoginView } from './views/LoginView';
import { UpdatesView } from './views/UpdatesView';

type Screen = 'list' | 'dog' | 'updates' | 'sitter' | 'find';

function SplashScreen() {
  return <Stack role="status" aria-label="Opening CaraPaws" sx={{ minHeight: '100dvh', alignItems: 'center', justifyContent: 'center', p: 3, bgcolor: 'background.paper' }}>
    <Brand stacked />
  </Stack>;
}

function App() {
  const [profileId, setProfileId] = useState(sitter.id);
  const [profileReturnScreen, setProfileReturnScreen] = useState<Screen>('list');
  const [activeSitterId, setActiveSitterId] = useState(sitter.id);
  const [splash, setSplash] = useState(true);
  const [role, setRole] = useState<Role | null>(null);
  const [screen, setScreen] = useState<Screen>('list');
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [ownerDogs, setOwnerDogs] = useState<Dog[]>(demoDogs);
  const [assignments, setAssignments] = useState<CareAssignment[]>(demoAssignments);
  const [sitterRequests, setSitterRequests] = useState<SitterRequest[]>([]);
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
    if (nextRole === 'sitter') setActiveSitterId(sitter.id);
    setSelectedDogId(null);
    setScreen('list');
    void refresh();
  }

  async function sendUpdate(input: NewUpdate) {
    const assignment = assignments.find((item) => item.dogId === input.dogId && item.sitterId === activeSitterId);
    if (!assignment) throw new Error('This dog is not in your care list.');
    const created = await careService.createUpdate(input, assignment, activeSitterId);
    setUpdates((current) => [created, ...current]);
    setFeedState('ready');
  }

  function addSitter(dogId: string, sitterId: string) {
    const profile = sitterProfiles.find((item) => item.userId === sitterId);
    if (!profile?.available || assignments.some((item) => item.dogId === dogId) || sitterRequests.some((item) => item.dogId === dogId && item.status === 'pending')) return;
    setSitterRequests((current) => [...current, { id: crypto.randomUUID(), dogId, sitterId, status: 'pending' }]);
  }

  function respondToRequest(requestId: string, decision: 'accepted' | 'declined') {
    const request = sitterRequests.find((item) => item.id === requestId && item.sitterId === activeSitterId && item.status === 'pending');
    if (!request) return;
    setSitterRequests((current) => current.map((item) => item.id === requestId ? { ...item, status: decision } : item));
    if (decision === 'accepted') setAssignments((current) => [...current, { id: request.id, dogId: request.dogId, sitterId: request.sitterId }]);
  }

  function switchToSitter(sitterId: string) {
    setActiveSitterId(sitterId); setRole('sitter'); setSelectedDogId(null); setScreen('list'); setMenuAnchor(null);
  }

  function signOut() { setRole(null); setSelectedDogId(null); setScreen('list'); setMenuAnchor(null); }
  function navigate(destination: Screen) { setScreen(destination); }
  function selectDog(dogId: string) { setSelectedDogId(dogId); setScreen('dog'); }

  if (splash) return <SplashScreen />;
  if (!role) return <LoginView onSignIn={signIn} />;

  const user = role === 'owner' ? owner : demoSitters.find((item) => item.id === activeSitterId) ?? sitter;
  const visibleDogs = role === 'owner' ? ownerDogs : ownerDogs.filter((dog) => assignments.some((item) => item.dogId === dog.id && item.sitterId === activeSitterId));
  const selectedDog = visibleDogs.find((dog) => dog.id === selectedDogId);
  const selectedAssignment = assignments.find((item) => item.dogId === selectedDogId);
  const assignedSitter = sitterProfiles.find((profile) => profile.userId === selectedAssignment?.sitterId);
  const pendingSitter = sitterProfiles.find((profile) => profile.userId === sitterRequests.find((request) => request.dogId === selectedDogId && request.status === 'pending')?.sitterId);
  const incoming = sitterRequests.filter((item) => item.sitterId === activeSitterId && item.status === 'pending')
    .flatMap((request) => { const dog = ownerDogs.find((item) => item.id === request.dogId); return dog ? [{ request, dog }] : []; });
  const visibleUpdates = updates.filter((update) => update.dogId === selectedDogId);

  return <Box sx={{ minHeight: '100dvh', bgcolor: 'background.default', pb: screen === 'updates' ? 0 : 'calc(72px + env(safe-area-inset-bottom))' }}>
    <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Container maxWidth="sm"><Toolbar disableGutters sx={{ minHeight: 56, gap: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}><Brand /></Box>
        <ButtonBase aria-label={`Open profile options for ${user.name}`} aria-haspopup="menu" aria-expanded={Boolean(menuAnchor)} onClick={(event) => setMenuAnchor(event.currentTarget)} sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, maxWidth: 180, minHeight: 48, px: 1, pr: 1.25, border: 1, borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper', textAlign: 'left', '&:hover': { borderColor: 'primary.main' } }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'background.paper', color: 'primary.dark', border: 1, borderColor: 'primary.main', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{user.initials}</Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 800, lineHeight: 1.2 }}>{user.name}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2, fontWeight: 700 }}>{role === 'owner' ? 'Dog owner' : `@${sitterProfiles.find((profile) => profile.userId === user.id)?.username}`}</Typography>
          </Box>
          <MoreHorizRounded sx={{ fontSize: 19, color: 'primary.main', flexShrink: 0 }} />
        </ButtonBase>
      </Toolbar></Container>
    </AppBar>

    <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
      <MenuItem disabled>Demo controls</MenuItem>
      {role === 'sitter' && <MenuItem onClick={() => { setMenuAnchor(null); setRole('owner'); setSelectedDogId(null); setScreen('list'); }}>Switch to owner</MenuItem>}
      {demoSitters.map((demoSitter) => <MenuItem key={demoSitter.id} selected={role === 'sitter' && activeSitterId === demoSitter.id} onClick={() => switchToSitter(demoSitter.id)}>Switch to @{sitterProfiles.find((profile) => profile.userId === demoSitter.id)?.username}</MenuItem>)}
      <MenuItem onClick={signOut}><LogoutRounded fontSize="small" sx={{ mr: 1 }} />Sign out</MenuItem>
    </Menu>

    <Container component="main" maxWidth="sm" sx={{ py: screen === 'updates' ? 0 : 3, px: { xs: 2.5, sm: 3 }, height: screen === 'updates' ? 'calc(100dvh - 124px - env(safe-area-inset-bottom))' : undefined }}>
      {screen === 'sitter' && <SitterProfileView key={profileId} userId={profileId} onBack={() => navigate(profileReturnScreen)} />}
      {screen === 'list' && <DogListView dogs={visibleDogs} role={role} ownerId={owner.id} incoming={role === 'sitter' ? incoming : []} onSelect={selectDog} onAdd={(dog) => setOwnerDogs((current) => [dog, ...current])} onRespond={respondToRequest} />}
      {screen === 'dog' && selectedDog && <DogView dog={selectedDog} role={role} updates={visibleUpdates} assignedSitter={assignedSitter} pendingSitter={pendingSitter} onBack={() => navigate('list')} onUpdates={() => navigate('updates')} onFindSitter={() => navigate('find')} onSitter={(id) => { setProfileId(id); setProfileReturnScreen('dog'); navigate('sitter'); }} />}
      {screen === 'find' && role === 'owner' && selectedDog && <FindSitterView dog={selectedDog} profiles={sitterProfiles} assignment={selectedAssignment} requests={sitterRequests.filter((item) => item.dogId === selectedDog.id)} onBack={() => navigate('dog')} onViewProfile={(id) => { setProfileId(id); setProfileReturnScreen('find'); navigate('sitter'); }} onRequest={(id) => addSitter(selectedDog.id, id)} />}
      {screen === 'updates' && selectedDog && <UpdatesView dog={selectedDog} role={role} sitterName={assignedSitter?.name} updates={visibleUpdates} state={feedState} onBack={() => navigate('dog')} onRetry={() => void refresh()} onSend={sendUpdate} />}
    </Container>

    <Paper elevation={0} sx={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 600, pb: 'env(safe-area-inset-bottom)', zIndex: 10, borderTop: 1, borderColor: 'divider', borderRadius: '18px 18px 0 0' }}>
      <BottomNavigation showLabels value={screen} onChange={(_event, value: Screen) => navigate(value)}>
        {role === 'sitter' && <BottomNavigationAction label="My profile" value="sitter" icon={<PersonRounded />} onClick={() => { setProfileId(activeSitterId); setProfileReturnScreen('list'); }} />}
        <BottomNavigationAction label="Dogs" value="list" icon={<ListRounded />} />
        {selectedDog && <BottomNavigationAction label={selectedDog.name} value="dog" icon={<PetsRounded />} />}
        {role === 'owner' && selectedDog && <BottomNavigationAction label="Find sitter" value="find" icon={<SearchRounded />} />}
        {selectedDog && <BottomNavigationAction label="Updates" value="updates" icon={<PhotoLibraryRounded />} />}
      </BottomNavigation>
    </Paper>
  </Box>;
}

export default App;
