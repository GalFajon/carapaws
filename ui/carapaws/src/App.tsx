import { useEffect, useState } from 'react';
import { AppBar, Avatar, Box, ButtonBase, Container, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { SitterProfileView } from './views/SitterProfileView';
import LogoutRounded from '@mui/icons-material/LogoutRounded';
import MoreHorizRounded from '@mui/icons-material/MoreHorizRounded';
import { outlinedControlSx } from './visualTokens';
import { DogEntryDialog } from './components/DogEntryDialog';
import { Brand } from './components/Shared';
import { careService } from './data/careService';
import { assignments as demoAssignments, demoSitters as initialSitters, dogs as demoDogs, initialUpdates, owner as demoOwner, owners as initialOwners, sitter, sitterProfiles as initialProfiles } from './data/mockData';
import type { CareAssignment, CareUpdate, Dog, FeedState, NewUpdate, Role, SitterRequest, User, SitterProfile } from './data/types';
import { DogView } from './views/DogView';
import { DogListView } from './views/DogListView';
import { FindSitterView } from './views/FindSitterView';
import { WelcomeView } from './views/WelcomeView';
import { LoginView } from './views/LoginView';
import { SignupView } from './views/SignupView';
import type { SignupResult } from './views/SignupView';
import { UpdatesView } from './views/UpdatesView';

type Screen = 'list' | 'dog' | 'updates' | 'sitter' | 'find';

function App() {
  const [loginRole, setLoginRole] = useState<Role | null>(null);
  const [signupRole, setSignupRole] = useState<Role | null>(null);
  const [owner, setOwner] = useState<User & { contact?: string; location?: string }>(demoOwner);
  const [demoSitters, setDemoSitters] = useState<User[]>(initialSitters);
  const [sitterProfiles, setSitterProfiles] = useState<SitterProfile[]>(initialProfiles);
  const [owners, setOwners] = useState(initialOwners);
  const [listBrowse, setListBrowse] = useState({ query: '', page: 1 });
  const [editingDog, setEditingDog] = useState(false);
  const [currentDogId, setCurrentDogId] = useState<string | null>(() => {
    try { return localStorage.getItem(`carapaws:current-dog:${owner.id}`); } catch { return null; }
  });
  const [profileId, setProfileId] = useState(sitter.id);
  const [profileReturnScreen, setProfileReturnScreen] = useState<Screen>('list');
  const [activeSitterId, setActiveSitterId] = useState(sitter.id);
  const [role, setRole] = useState<Role | null>(null);
  const [screen, setScreen] = useState<Screen>('list');
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const [ownerDogs, setOwnerDogs] = useState<Dog[]>(demoDogs);
  const [assignments, setAssignments] = useState<CareAssignment[]>(demoAssignments);
  const [sitterRequests, setSitterRequests] = useState<SitterRequest[]>([]);
  const [updates, setUpdates] = useState<CareUpdate[]>(initialUpdates);
  const [feedState, setFeedState] = useState<FeedState>('loading');
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);


  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, [screen, role, selectedDogId, signupRole, loginRole]);

  async function refresh() {
    setFeedState('loading');
    try { setUpdates(await careService.listUpdates()); setFeedState('ready'); }
    catch { setFeedState('error'); }
  }

  function signIn(nextRole: Role) {
    setListBrowse({ query: '', page: 1 });
    setRole(nextRole);
    if (nextRole === 'sitter') setActiveSitterId(sitter.id);
    const currentDog = ownerDogs.find((dog) => dog.ownerId === owner.id && dog.id === currentDogId) ?? ownerDogs.find((dog) => dog.ownerId === owner.id);
    setSelectedDogId(nextRole === 'owner' ? currentDog?.id ?? null : null);
    setScreen(nextRole === 'owner' && currentDog ? 'updates' : 'list');
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
    setListBrowse({ query: '', page: 1 });
    setActiveSitterId(sitterId); setRole('sitter'); setSelectedDogId(null); setScreen('list'); setMenuAnchor(null);
  }

  function makeCurrentDog(dogId: string) {
    if (role !== 'owner' || !ownerDogs.some((dog) => dog.id === dogId && dog.ownerId === owner.id)) return;
    setCurrentDogId(dogId);
    try { localStorage.setItem(`carapaws:current-dog:${owner.id}`, dogId); } catch { /* Retain the choice in session when storage is unavailable. */ }
  }

  function finishSignup(result: SignupResult) {
    const { dog, profile } = result;
    setSignupRole(null);
    setListBrowse({ query: '', page: 1 });
    setRole(result.user.role);
    setFeedState('ready');
    if (result.user.role === 'owner' && dog) {
      setOwner({ ...result.user, contact: result.contact, location: result.location });
      setOwners((users) => [...users, { ...result.user, contact: result.contact }]);
      setOwnerDogs((dogs) => [...dogs, dog]);
      setCurrentDogId(dog.id);
      setSelectedDogId(dog.id);
      setScreen('updates');
    } else if (profile) {
      setDemoSitters((users) => [...users, result.user]);
      setSitterProfiles((profiles) => [...profiles, profile]);
      setActiveSitterId(result.user.id);
      setSelectedDogId(null);
      setScreen('list');
    }
  }

  function removeDog() {
    const dog = ownerDogs.find((item) => item.id === selectedDogId);
    if (!dog || screen !== 'dog') return;
    if (role === 'owner' && dog.ownerId === owner.id) {
      const remaining = ownerDogs.filter((item) => item.id !== dog.id);
      setOwnerDogs(remaining);
      setAssignments((items) => items.filter((item) => item.dogId !== dog.id));
      setSitterRequests((items) => items.filter((item) => item.dogId !== dog.id));
      const nextCurrent = remaining.find((item) => item.ownerId === owner.id && item.id === currentDogId) ?? remaining.find((item) => item.ownerId === owner.id);
      setCurrentDogId(nextCurrent?.id ?? null);
      try {
        if (nextCurrent) localStorage.setItem(`carapaws:current-dog:${owner.id}`, nextCurrent.id);
        else localStorage.removeItem(`carapaws:current-dog:${owner.id}`);
      } catch { /* Session state still updates when storage is unavailable. */ }
    } else if (role === 'sitter') {
      setAssignments((items) => items.filter((item) => !(item.dogId === dog.id && item.sitterId === activeSitterId)));
    } else return;
    setEditingDog(false);
    setSelectedDogId(null);
    setListBrowse({ query: '', page: 1 });
    setScreen('list');
  }

  function signOut() { setLoginRole(role); setSignupRole(null); setRole(null); setSelectedDogId(null); setScreen('list'); setMenuAnchor(null); }
  function navigate(destination: Screen) { setScreen(destination); }
  function openSitterProfile(userId: string) {
    setProfileId(userId);
    setProfileReturnScreen(screen);
    setScreen('sitter');
  }
  function selectDog(dogId: string) { setSelectedDogId(dogId); setScreen('updates'); }

  if (signupRole) return <SignupView role={signupRole} usernames={sitterProfiles.map((profile) => profile.username)} onBack={() => setSignupRole(null)} onComplete={finishSignup} />;
  if (!role) {
    if (!loginRole) return <WelcomeView onChooseRole={setLoginRole} />;
    return <LoginView key={loginRole} role={loginRole} onSignIn={() => signIn(loginRole)} onSignUp={() => setSignupRole(loginRole)} onBack={() => setLoginRole(null)} />;
  }

  const user = role === 'owner' ? owner : demoSitters.find((item) => item.id === activeSitterId) ?? sitter;
  const visibleDogs = role === 'owner' ? ownerDogs.filter((dog) => dog.ownerId === owner.id) : ownerDogs.filter((dog) => assignments.some((item) => item.dogId === dog.id && item.sitterId === activeSitterId));
  const selectedDog = visibleDogs.find((dog) => dog.id === selectedDogId);
  const selectedAssignment = assignments.find((item) => item.dogId === selectedDogId);
  const assignedSitter = sitterProfiles.find((profile) => profile.userId === selectedAssignment?.sitterId);
  const pendingSitter = sitterProfiles.find((profile) => profile.userId === sitterRequests.find((request) => request.dogId === selectedDogId && request.status === 'pending')?.sitterId);
  const incoming = sitterRequests.filter((item) => item.sitterId === activeSitterId && item.status === 'pending')
    .flatMap((request) => { const dog = ownerDogs.find((item) => item.id === request.dogId); return dog ? [{ request, dog }] : []; });
  const visibleUpdates = updates.filter((update) => update.dogId === selectedDogId);

  return <Box sx={{ minHeight: '100dvh', height: screen === 'updates' ? '100dvh' : undefined, display: 'flex', flexDirection: 'column', bgcolor: 'background.default', pb: 'env(safe-area-inset-bottom)' }}>
    <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
      <Container maxWidth="sm"><Toolbar disableGutters sx={{ minHeight: { xs: 56, sm: 56 }, gap: 1 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}><Brand /></Box>
        <ButtonBase aria-label={`Open profile options for ${user.name}`} aria-haspopup="menu" aria-expanded={Boolean(menuAnchor)} onClick={(event) => setMenuAnchor(event.currentTarget)} sx={{ ...outlinedControlSx, display: 'flex', alignItems: 'center', gap: 1, minWidth: 0, maxWidth: 180, minHeight: 48, px: 1, pr: 1.25, textAlign: 'left' }}>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'background.paper', color: 'primary.dark', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{user.initials}</Avatar>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 800, lineHeight: 1.2 }}>{user.name}</Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2, fontWeight: 700 }}>{role === 'owner' ? 'Dog owner' : `@${sitterProfiles.find((profile) => profile.userId === user.id)?.username}`}</Typography>
          </Box>
          <MoreHorizRounded sx={{ fontSize: 19, color: 'primary.main', flexShrink: 0 }} />
        </ButtonBase>
      </Toolbar></Container>
    </AppBar>

    <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
      {role === 'sitter' && <MenuItem onClick={() => { setMenuAnchor(null); openSitterProfile(activeSitterId); }}>My profile</MenuItem>}
      {role === 'sitter' && <MenuItem onClick={() => { setMenuAnchor(null); signIn('owner'); }}>Switch to owner</MenuItem>}
      {demoSitters.map((demoSitter) => <MenuItem key={demoSitter.id} selected={role === 'sitter' && activeSitterId === demoSitter.id} onClick={() => switchToSitter(demoSitter.id)}>Switch to @{sitterProfiles.find((profile) => profile.userId === demoSitter.id)?.username}</MenuItem>)}
      <MenuItem onClick={signOut}><LogoutRounded fontSize="small" sx={{ mr: 1 }} />Sign out</MenuItem>
    </Menu>

    <Container component="main" maxWidth="sm" sx={{ py: screen === 'updates' ? 0 : 3, px: { xs: 2, sm: 3 }, flex: screen === 'updates' ? 1 : undefined, minHeight: 0 }}>
      {screen === 'sitter' && <SitterProfileView initialProfile={initialProfiles.some((profile) => profile.userId === profileId) ? undefined : sitterProfiles.find((profile) => profile.userId === profileId)} key={profileId} userId={profileId} onBack={() => navigate(profileReturnScreen)} />}
      {screen === 'list' && <DogListView owners={owners} browse={listBrowse} onBrowse={setListBrowse} onMakeCurrent={makeCurrentDog} currentDogId={(visibleDogs.find((dog) => dog.id === currentDogId) ?? visibleDogs[0])?.id} updates={updates} dogs={visibleDogs} role={role} ownerId={owner.id} incoming={role === 'sitter' ? incoming : []} onSelect={selectDog} onAdd={(dog) => setOwnerDogs((current) => [dog, ...current])} onRespond={respondToRequest} onSend={sendUpdate} />}
      {screen === 'dog' && selectedDog && <DogView owners={owners} onRemove={removeDog} dog={selectedDog} role={role} updates={visibleUpdates} assignedSitter={assignedSitter} pendingSitter={pendingSitter} onEdit={() => setEditingDog(true)} onBack={() => navigate('updates')} onUpdates={() => navigate('updates')} onFindSitter={() => navigate('find')} onSitter={openSitterProfile} />}
      {screen === 'find' && role === 'owner' && selectedDog && <FindSitterView dog={selectedDog} profiles={sitterProfiles} assignment={selectedAssignment} requests={sitterRequests.filter((item) => item.dogId === selectedDog.id)} onBack={() => navigate('dog')} onViewProfile={openSitterProfile} onRequest={(id) => addSitter(selectedDog.id, id)} />}
      {screen === 'updates' && selectedDog && <UpdatesView owners={owners} sitters={sitterProfiles} key={`${role}:${selectedDog.id}`} dog={selectedDog} role={role} sitterName={assignedSitter?.name} updates={visibleUpdates} state={feedState} onDogProfile={() => navigate('dog')} onPerson={() => { if (assignedSitter) openSitterProfile(assignedSitter.userId); }} onBack={() => navigate('list')} onRetry={() => void refresh()} onSend={sendUpdate} />}
    </Container>

    {editingDog && role === 'owner' && selectedDog && <DogEntryDialog dog={selectedDog} ownerId={owner.id} onClose={() => setEditingDog(false)} onAdd={(edited) => { setOwnerDogs((dogs) => dogs.map((dog) => dog.id === edited.id ? edited : dog)); setEditingDog(false); }} />}

  </Box>;
}

export default App;
