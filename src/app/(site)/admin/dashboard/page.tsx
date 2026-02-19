
"use client"

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Loader2, 
  Plus, 
  Trash2, 
  LayoutDashboard, 
  Info, 
  Home as HomeIcon, 
  Gamepad2, 
  Calendar as CalendarIcon, 
  Users, 
  FileText,
  Save,
  UserPlus,
  Rocket,
  AlertTriangle,
  Eye,
  EyeOff,
  KeySquare,
  ShieldCheck,
  ShieldOff,
  Gauge,
  DatabaseZap,
  Pencil,
  Github,
  Linkedin,
  Clock,
  MapPin,
  Megaphone,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { eventsData as INITIAL_EVENTS } from '@/lib/events-data';
import { useUser, useAuth, useFirestore, useCollection, useDoc, addDocumentNonBlocking, deleteDocumentNonBlocking, setDocumentNonBlocking, useMemoFirebase } from '@/firebase';
import { collection, doc, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';

const architectCategories = [
  "Organiser",
  "Finance",
  "Social Media",
  "Tech Team",
  "Decoration",
  "Promotion",
  "Management planing and operational Team"
];

export default function DashboardPage() {
  const { toast } = useToast();
  const router = useRouter();
  
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  const adminDocRef = useMemoFirebase(() => user ? doc(firestore, 'roles_admin', user.uid) : undefined, [user, firestore]);
  const { data: adminRole, isLoading: isAdminLoading } = useDoc(adminDocRef);

  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    if (!isUserLoading && !user) {
      router.replace('/admin/auth');
    }
  }, [user, isUserLoading, router]);

  useEffect(() => {
    if (!isAdminLoading) {
      setIsAuthorized(!!adminRole);
    }
  }, [adminRole, isAdminLoading]);


  const [activeTab, setActiveTab] = useState('dashboard');
  
  const sponsorsQuery = useMemoFirebase(() => isAuthorized ? collection(firestore, 'sponsors') : null, [isAuthorized, firestore]);
  const { data: sponsors, isLoading: sponsorsLoading } = useCollection(sponsorsQuery);

  const eventsQuery = useMemoFirebase(() => isAuthorized ? collection(firestore, 'events') : null, [isAuthorized, firestore]);
  const { data: events, isLoading: eventsLoading } = useCollection(eventsQuery);

  const festivalDaysQuery = useMemoFirebase(() => isAuthorized ? query(collection(firestore, 'festivalDays'), orderBy('date', 'asc')) : null, [isAuthorized, firestore]);
  const { data: festivalDays, isLoading: festivalDaysLoading } = useCollection(festivalDaysQuery);

  const registrationsQuery = useMemoFirebase(() => isAuthorized ? collection(firestore, 'participant_registrations') : null, [isAuthorized, firestore]);
  const { data: registrations, isLoading: registrationsLoading } = useCollection(registrationsQuery);
  
  const adminUsersQuery = useMemoFirebase(() => isAuthorized ? collection(firestore, 'admin_users') : null, [isAuthorized, firestore]);
  const { data: adminUsers, isLoading: adminUsersLoading } = useCollection(adminUsersQuery);

  const adminsQuery = useMemoFirebase(() => isAuthorized ? collection(firestore, 'roles_admin') : null, [isAuthorized, firestore]);
  const { data: admins, isLoading: adminsLoading } = useCollection(adminsQuery);
  
  const teamMembersQuery = useMemoFirebase(() => isAuthorized ? query(collection(firestore, 'teamMembers'), orderBy('displayOrder', 'asc')) : null, [isAuthorized, firestore]);
  const { data: teamMembers, isLoading: teamMembersLoading } = useCollection(teamMembersQuery);

  const announcementsQuery = useMemoFirebase(() => isAuthorized ? query(collection(firestore, 'announcements'), orderBy('timestamp', 'desc')) : null, [isAuthorized, firestore]);
  const { data: announcements, isLoading: announcementsLoading } = useCollection(announcementsQuery);


  const sortedTeamMembers = useMemo(() => 
    teamMembers?.slice().sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)) || [],
    [teamMembers]
  );
  
  const adminIds = useMemo(() => new Set(admins?.map(admin => admin.id)), [admins]);

  const [newSponsor, setNewSponsor] = useState({ name: '', logoUrl: '', tier: 'Platinum' });
  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [newEvent, setNewEvent] = useState({
    name: '',
    type: 'Technical',
    description: '',
    eventHead: '',
    rules: '',
    registrationFee: '',
    organiserContact: '',
    imageUrl: '',
    startTime: '',
    location: '',
    festivalDayId: '',
  });
  const [heroContent, setHeroContent] = useState({ mainHeadline: '', subHeadline: '', description: '' });
  const [counterStats, setCounterStats] = useState({ competitions: '10+', workshops: '5+', participants: '50K+', prizePool: '$10K+' });
  const [newArchitect, setNewArchitect] = useState({
    fullName: '',
    role: 'Student Organizer',
    category: 'Organiser',
    profileImageUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    resumeUrl: '',
    displayOrder: 0,
  });
  const [editingArchitect, setEditingArchitect] = useState<any | null>(null);
  const [newDay, setNewDay] = useState({ name: '', date: '' });
  const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '' });


  const heroContentRef = useMemoFirebase(() => isAuthorized ? doc(firestore, 'heroContent', 'main') : null, [isAuthorized, firestore]);
  const { data: heroData, isLoading: heroDataLoading } = useDoc(heroContentRef);
  
  const counterStatsRef = useMemoFirebase(() => isAuthorized ? doc(firestore, 'counterStats', 'main') : null, [isAuthorized, firestore]);
  const { data: counterData, isLoading: counterDataLoading } = useDoc(counterStatsRef);


  useEffect(() => {
    if (heroData) {
        setHeroContent({
            mainHeadline: heroData.mainHeadline || '',
            subHeadline: heroData.subHeadline || '',
            description: heroData.description || '',
        });
    }
  }, [heroData]);
  
  useEffect(() => {
    if (counterData) {
        setCounterStats({
            competitions: counterData.competitions || '',
            workshops: counterData.workshops || '',
            participants: counterData.participants || '',
            prizePool: counterData.prizePool || '',
        });
    }
  }, [counterData]);


  const handleHeroInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setHeroContent(prev => ({ ...prev, [name]: value }));
  };

  const handleCounterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setCounterStats(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateHero = () => {
      if (heroContentRef) {
          setDocumentNonBlocking(heroContentRef, heroContent, { merge: true });
          toast({ title: "Protocol Updated", description: "Hero section content has been saved." });
      }
  };
  
  const handleUpdateCounters = () => {
    if (counterStatsRef) {
        setDocumentNonBlocking(counterStatsRef, counterStats, { merge: true });
        toast({ title: "Protocol Updated", description: "Homepage counters have been saved." });
    }
  };

  
  const handleAddSponsor = () => {
    if (!newSponsor.name || !newSponsor.logoUrl) {
        toast({ variant: "destructive", title: "Incomplete Data", description: "Sponsor name and logo URL are required." });
        return;
    }
    if (sponsorsQuery) {
        addDocumentNonBlocking(sponsorsQuery, { ...newSponsor, websiteUrl: "#", description: "A new sponsor.", contactPersonName: "N/A", contactPersonEmail: "n/a@example.com", id: Math.random().toString(36).substr(2, 9) });
        setNewSponsor({ name: '', logoUrl: '', tier: 'Platinum' });
        toast({ title: "Partner Recruited", description: `${newSponsor.name} added to the roster.` });
    }
  };

  const handleDeleteSponsor = (id: string) => {
      const sponsorDocRef = doc(firestore, 'sponsors', id);
      deleteDocumentNonBlocking(sponsorDocRef);
      toast({ title: "Partner Terminated", description: "Sponsor removed from the roster." });
  };
  
  const handleNewEventChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };
  
  const handleEventTypeChange = (value: string) => {
    setNewEvent(prev => ({...prev, type: value}));
  };
  
  const handleEventDayChange = (value: string) => {
    setNewEvent(prev => ({ ...prev, festivalDayId: value }));
  };


  const handleAddEvent = () => {
    if (!newEvent.name) {
        toast({ variant: "destructive", title: "Incomplete Data", description: "Event name is required." });
        return;
    }
    if (eventsQuery) {
        const slug = newEvent.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        const eventData = {
            ...newEvent,
            slug: slug,
            id: slug,
            isTechnical: newEvent.type === 'Technical',
            longDescription: newEvent.description,
            rules: newEvent.rules.split('\n').filter(rule => rule.trim() !== ''),
            startTime: newEvent.startTime ? new Date(newEvent.startTime).toISOString() : '',
            imgId: "hero-tech",
            iconName: newEvent.type === 'eSports' ? 'Gamepad2' : (newEvent.type === 'Technical' ? 'Code' : 'BrainCircuit'),
            color: newEvent.type === 'Technical' ? "text-primary" : "text-accent",
            prize: "TBD",
        };
        const eventDocRef = doc(firestore, 'events', slug);
        setDocumentNonBlocking(eventDocRef, eventData, { merge: true });
        handleCancelEdit();
        toast({ title: "Arena Initialized", description: `${newEvent.name} has been added.` });
    }
  };

  const handleDeleteEvent = (id: string) => {
      const eventDocRef = doc(firestore, 'events', id);
      deleteDocumentNonBlocking(eventDocRef);
      toast({ title: "Arena Decommissioned", description: "Event removed from the schedule." });
  };

  const handleEditClick = (event: any) => {
    setEditingEvent(event);
    setNewEvent({
        name: event.name || '',
        type: event.type || 'Technical',
        description: event.description || '',
        eventHead: event.eventHead || '',
        rules: Array.isArray(event.rules) ? event.rules.join('\n') : '',
        registrationFee: event.registrationFee || '',
        organiserContact: event.organiserContact || '',
        imageUrl: event.imageUrl || '',
        startTime: event.startTime ? new Date(event.startTime).toISOString().substring(0, 16) : '',
        location: event.location || '',
        festivalDayId: event.festivalDayId || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
    setNewEvent({ name: '', type: 'Technical', description: '', eventHead: '', rules: '', registrationFee: '', organiserContact: '', imageUrl: '', startTime: '', location: '', festivalDayId: '' });
  };

  const handleUpdateEvent = () => {
    if (!editingEvent) return;

    if (!newEvent.name) {
        toast({ variant: "destructive", title: "Incomplete Data", description: "Event name is required." });
        return;
    }

    const eventDocRef = doc(firestore, 'events', editingEvent.id);
    const updateData = {
        name: newEvent.name,
        type: newEvent.type,
        isTechnical: newEvent.type === 'Technical',
        description: newEvent.description,
        longDescription: newEvent.description,
        eventHead: newEvent.eventHead,
        rules: newEvent.rules.split('\n').filter(rule => rule.trim() !== ''),
        registrationFee: newEvent.registrationFee,
        organiserContact: newEvent.organiserContact,
        imageUrl: newEvent.imageUrl,
        startTime: newEvent.startTime ? new Date(newEvent.startTime).toISOString() : '',
        location: newEvent.location,
        festivalDayId: newEvent.festivalDayId,
        iconName: newEvent.type === 'eSports' ? 'Gamepad2' : (newEvent.type === 'Technical' ? 'Code' : 'BrainCircuit'),
        color: newEvent.type === 'Technical' ? "text-primary" : "text-accent",
    };

    setDocumentNonBlocking(eventDocRef, updateData, { merge: true });
    toast({ title: "Arena Updated", description: `${newEvent.name} has been updated.` });
    handleCancelEdit();
  };
  
  const handleSeedEvents = () => {
    if (eventsQuery) {
        INITIAL_EVENTS.forEach(event => {
            const eventDocRef = doc(firestore, 'events', event.slug);
            const eventData = { ...event, name: event.title, id: event.slug };
            setDocumentNonBlocking(eventDocRef, eventData, { merge: true });
        });
        toast({ title: "Database Seeded", description: "Initial event data has been deployed to Firestore." });
    }
  };

  const handleNewArchitectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setNewArchitect(prev => ({ 
      ...prev, 
      [name]: type === 'number' ? (parseInt(value, 10) || 0) : value 
    }));
  };
  
  const handleArchitectCategoryChange = (value: string) => {
    setNewArchitect(prev => ({...prev, category: value}));
  };

  const handleAddArchitect = () => {
      if (!newArchitect.fullName || !newArchitect.profileImageUrl) {
          toast({ variant: "destructive", title: "Incomplete Data", description: "Full Name and Image URL are required." });
          return;
      }
      if (teamMembersQuery) {
          const id = Math.random().toString(36).substr(2, 9);
          const newMemberData = { ...newArchitect, id: id };
          const teamMemberDocRef = doc(firestore, 'teamMembers', id);
          setDocumentNonBlocking(teamMemberDocRef, newMemberData, {});
          setNewArchitect({ fullName: '', role: 'Student Organizer', category: 'Organiser', profileImageUrl: '', linkedinUrl: '', githubUrl: '', portfolioUrl: '', resumeUrl: '', displayOrder: 0 });
          toast({ title: "Architect Onboarded", description: `${newArchitect.fullName} has joined the team.` });
      }
  };

  const handleDeleteArchitect = (id: string) => {
      const architectDocRef = doc(firestore, 'teamMembers', id);
      deleteDocumentNonBlocking(architectDocRef);
      toast({ title: "Architect Removed", description: "Team member has been removed." });
  };
  
  const handleArchitectEditClick = (architect: any) => {
    setEditingArchitect(architect);
    setNewArchitect({
        fullName: architect.fullName || '',
        role: architect.role || 'Student Organizer',
        category: architect.category || 'Organiser',
        profileImageUrl: architect.profileImageUrl || '',
        linkedinUrl: architect.linkedinUrl || '',
        githubUrl: architect.githubUrl || '',
        portfolioUrl: architect.portfolioUrl || '',
        resumeUrl: architect.resumeUrl || '',
        displayOrder: architect.displayOrder || 0,
    });
  };

  const handleCancelArchitectEdit = () => {
    setEditingArchitect(null);
    setNewArchitect({ fullName: '', role: 'Student Organizer', category: 'Organiser', profileImageUrl: '', linkedinUrl: '', githubUrl: '', portfolioUrl: '', resumeUrl: '', displayOrder: 0 });
  };

  const handleUpdateArchitect = () => {
    if (!editingArchitect) return;

    if (!newArchitect.fullName || !newArchitect.profileImageUrl) {
        toast({ variant: "destructive", title: "Incomplete Data", description: "Full Name and Image URL are required." });
        return;
    }

    const architectDocRef = doc(firestore, 'teamMembers', editingArchitect.id);
    const updateData = { ...newArchitect }; 

    setDocumentNonBlocking(architectDocRef, updateData, { merge: true });
    toast({ title: "Architect Updated", description: `${newArchitect.fullName}'s profile has been updated.` });
    handleCancelArchitectEdit();
  };

  const handleNewDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDay(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDay = () => {
    if (!newDay.name || !newDay.date) {
        toast({ variant: "destructive", title: "Incomplete Data", description: "Day name and date are required." });
        return;
    }
    if (!isAuthorized) return;
    const id = newDay.name.toLowerCase().replace(/\s+/g, '-');
    const dayData = { 
        ...newDay,
        id: id,
        date: new Date(newDay.date).toISOString()
    };
    const dayDocRef = doc(firestore, 'festivalDays', id);
    setDocumentNonBlocking(dayDocRef, dayData, { merge: true });
    setNewDay({ name: '', date: '' });
    toast({ title: "Timeline Updated", description: `${newDay.name} has been added.` });
  };

  const handleDeleteDay = (id: string) => {
      const dayDocRef = doc(firestore, 'festivalDays', id);
      deleteDocumentNonBlocking(dayDocRef);
      toast({ title: "Day Removed", description: "The festival day has been removed from the timeline." });
  };

  const handleNewAnnouncementChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setNewAnnouncement(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.content) {
        toast({ variant: "destructive", title: "Incomplete Data", description: "Title and content are required." });
        return;
    }
    if (!isAuthorized || !firestore) {
        toast({ variant: "destructive", title: "Authorization Error", description: "Cannot publish announcement." });
        return;
    }

    const announcementData = {
        ...newAnnouncement,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString()
    };
    const announcementsCollection = collection(firestore, 'announcements');
    addDocumentNonBlocking(announcementsCollection, announcementData);
    setNewAnnouncement({ title: '', content: '' });
    toast({ title: "Announcement Published", description: "The new announcement is now live." });
  };

  const handleDeleteAnnouncement = (id: string) => {
      const announcementDocRef = doc(firestore, 'announcements', id);
      deleteDocumentNonBlocking(announcementDocRef);
      toast({ title: "Announcement Retracted", description: "The announcement has been removed." });
  };

  const formatDashboardDate = (dateString: string) => {
      if (!dateString) return "No date set";
      try {
          return new Date(dateString).toLocaleDateString([], {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
          });
      } catch (e) {
          return "Invalid date";
      }
  };

  const formatDashboardTime = (dateString: string | undefined) => {
      if (!dateString) return "TBD";
      try {
          const date = new Date(dateString);
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      } catch (e) {
          return "Invalid Date";
      }
  };

   const handleLogout = async () => {
    await auth.signOut();
    router.push('/admin/auth');
  };

  const handleToggleAdmin = async (userId: string, isAdmin: boolean) => {
    const userRef = doc(firestore, 'roles_admin', userId);
    if (isAdmin) {
      // To revoke, we need admin permission, which the rule allows.
      deleteDocumentNonBlocking(userRef);
      toast({ title: "Access Revoked", description: "Admin privileges have been removed for the user." });
    } else {
      // To grant, an admin needs to create the doc.
      await setDoc(userRef, {});
      toast({ title: "Access Granted", description: "User has been promoted to administrator." });
    }
  };

  if (isUserLoading || isAdminLoading) {
    return (
        <div className="min-h-screen pt-48 pb-20 px-6 flex flex-col items-center justify-center text-center">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground mt-4">Verifying Credentials...</p>
        </div>
    )
  }

  if (!isAuthorized) {
    return (
        <div className="min-h-screen pt-48 pb-20 px-6 flex flex-col items-center justify-center text-center">
            <div className="glass-panel p-10 max-w-lg w-full border-amber-500/20 relative overflow-hidden bg-black/40">
                <div className="text-center mb-8">
                    <ShieldOff className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                    <h1 className="font-headline text-2xl tracking-tighter text-white uppercase">PENDING AUTHORIZATION</h1>
                    <p className="text-muted-foreground mt-4 max-w-md mx-auto">
                        Your account has been created, but you do not have administrator privileges yet.
                    </p>
                </div>
                <div className="bg-amber-950/50 border border-amber-500/20 p-6 rounded-none space-y-3 text-sm text-amber-200 text-left">
                    <p className="font-bold uppercase tracking-widest text-amber-400">Next Steps:</p>
                    <p>To gain access to the dashboard, an existing administrator must grant you privileges from the 'Admins' tab.</p>
                    <p className="text-xs text-muted-foreground">If you are the first administrator, you must manually add your User ID to the `roles_admin` collection in the Firebase console.</p>
                </div>
                <Button onClick={handleLogout} variant="outline" className="w-full mt-8 border-primary/20 hover:bg-primary/10 rounded-none text-xs font-headline tracking-widest uppercase">
                    LOGOUT AND TRY ANOTHER ACCOUNT
                </Button>
            </div>
        </div>
    )
  }

  return (
    <div className="pt-32 pb-40 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="font-headline text-5xl mb-2 tracking-tighter text-white uppercase">KURUKSHETRA <span className="text-primary">CONTROL</span></h1>
          <p className="text-muted-foreground text-sm uppercase tracking-widest font-bold">Protocol Management Panel</p>
        </div>
        <Button onClick={handleLogout} variant="outline" className="border-primary/20 hover:bg-primary/10 rounded-none text-xs font-headline tracking-widest uppercase">
          TERMINATE SESSION
        </Button>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-8" onValueChange={(value) => { setActiveTab(value); handleCancelEdit(); handleCancelArchitectEdit(); }}>
        <TabsList className="grid grid-cols-4 md:grid-cols-8 bg-white/5 rounded-none p-1 border border-white/10">
          <TabsTrigger value="dashboard" className="rounded-none font-headline text-[10px] tracking-widest py-3 uppercase">Dashboard</TabsTrigger>
          <TabsTrigger value="home" className="rounded-none font-headline text-[10px] tracking-widest py-3 uppercase">Home</TabsTrigger>
          <TabsTrigger value="events" className="rounded-none font-headline text-[10px] tracking-widest py-3 uppercase">Events</TabsTrigger>
          <TabsTrigger value="schedule" className="rounded-none font-headline text-[10px] tracking-widest py-3 uppercase">Schedule</TabsTrigger>
          <TabsTrigger value="announcements" className="rounded-none font-headline text-[10px] tracking-widest py-3 uppercase">Announcements</TabsTrigger>
          <TabsTrigger value="team" className="rounded-none font-headline text-[10px] tracking-widest py-3 uppercase">Team</TabsTrigger>
          <TabsTrigger value="registrations" className="rounded-none font-headline text-[10px] tracking-widest py-3 uppercase">Registrations</TabsTrigger>
          <TabsTrigger value="admins" className="rounded-none font-headline text-[10px] tracking-widest py-3 uppercase">Admins</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="glass-panel border-primary/20 rounded-none bg-black/40">
              <CardHeader className="pb-2">
                <CardDescription className="text-[10px] uppercase tracking-widest">Active Arenas</CardDescription>
                <CardTitle className="font-headline text-3xl text-primary">{events?.length || 0}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="glass-panel border-accent/20 rounded-none bg-black/40">
              <CardHeader className="pb-2">
                <CardDescription className="text-[10px] uppercase tracking-widest">Registrations</CardDescription>
                <CardTitle className="font-headline text-3xl text-accent">{registrations?.length ?? 0}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="glass-panel border-blue-500/20 rounded-none bg-black/40">
              <CardHeader className="pb-2">
                <CardDescription className="text-[10px] uppercase tracking-widest">Session Status</CardDescription>
                <CardTitle className="font-headline text-3xl text-blue-400">ACTIVE</CardTitle>
              </CardHeader>
            </Card>
            <Card className="glass-panel border-green-500/20 rounded-none bg-black/40">
              <CardHeader className="pb-2">
                <CardDescription className="text-[10px] uppercase tracking-widest">Integrity</CardDescription>
                <CardTitle className="font-headline text-3xl text-green-400">100%</CardTitle>
              </CardHeader>
            </Card>
          </div>
          <Card className="glass-panel border-primary/10 rounded-none bg-black/20">
            <CardHeader>
              <CardTitle className="font-headline text-lg tracking-widest uppercase">System Logs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-[10px] font-code text-muted-foreground/60">[08:45:12] Protocol Neon Horizon Initialized</div>
              <div className="text-[10px] font-code text-muted-foreground/60">[09:12:05] Admin Auth Session Verified</div>
              <div className="text-[10px] font-code text-muted-foreground/60">[10:30:44] New Registration: Warrior ID 001</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="home" className="space-y-12">
          <Card className="glass-panel border-primary/20 rounded-none bg-black/40">
            <CardHeader>
              <CardTitle className="font-headline text-xl tracking-widest flex items-center gap-2 uppercase">
                <HomeIcon className="w-5 h-5 text-primary" /> HERO SECTION MANAGER
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Main Headline</Label>
                  <Input 
                    name="mainHeadline"
                    value={heroContent.mainHeadline}
                    onChange={handleHeroInputChange}
                    placeholder="BEYOND THE HORIZON" 
                    className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Sub Headline (Gradient)</Label>
                  <Input 
                    name="subHeadline"
                    value={heroContent.subHeadline}
                    onChange={handleHeroInputChange}
                    placeholder="Battel of Mind" 
                    className="bg-white/5 border-white/10 rounded-none" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest">Description Meta</Label>
                <Textarea 
                  name="description"
                  value={heroContent.description}
                  onChange={handleHeroInputChange}
                  placeholder="The most immersive tech battlefield of the year..." className="bg-white/5 border-white/10 rounded-none min-h-[100px]" />
              </div>
              <Button onClick={handleUpdateHero} className="bg-primary hover:bg-primary/80 rounded-none font-headline tracking-widest text-[10px] py-6 px-8">
                <Save className="w-4 h-4 mr-2" /> UPDATE HERO PROTOCOL
              </Button>
            </CardContent>
          </Card>

          <Card className="glass-panel border-accent/20 rounded-none bg-black/40">
            <CardHeader>
              <CardTitle className="font-headline text-xl tracking-widest flex items-center gap-2 uppercase">
                <Gauge className="w-5 h-5 text-accent" /> COUNTER SETTINGS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Competitions</Label>
                  <Input 
                    name="competitions"
                    value={counterStats.competitions}
                    onChange={handleCounterInputChange}
                    placeholder="10+" 
                    className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Workshops</Label>
                  <Input 
                    name="workshops"
                    value={counterStats.workshops}
                    onChange={handleCounterInputChange}
                    placeholder="5+" 
                    className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Participants</Label>
                  <Input 
                    name="participants"
                    value={counterStats.participants}
                    onChange={handleCounterInputChange}
                    placeholder="50K+" 
                    className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Prize Pool</Label>
                  <Input 
                    name="prizePool"
                    value={counterStats.prizePool}
                    onChange={handleCounterInputChange}
                    placeholder="$10K+" 
                    className="bg-white/5 border-white/10 rounded-none" />
                </div>
              </div>
              <Button onClick={handleUpdateCounters} className="bg-accent text-background hover:bg-accent/80 rounded-none font-headline tracking-widest text-[10px] py-6 px-8">
                <Save className="w-4 h-4 mr-2" /> UPDATE COUNTERS
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="glass-panel border-accent/20 rounded-none bg-black/40 h-fit">
              <CardHeader>
                <CardTitle className="font-headline text-lg tracking-widest flex items-center gap-2 uppercase">
                  <Rocket className="w-4 h-4 text-accent" /> PARTNER PROTOCOLS
                </CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest">Recruit new partners</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Company Identity</Label>
                  <Input 
                    value={newSponsor.name}
                    onChange={(e) => setNewSponsor({...newSponsor, name: e.target.value})}
                    placeholder="e.g. Acme Corp" 
                    className="bg-white/5 border-white/10 rounded-none" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Logo Vector URL</Label>
                  <Input 
                    value={newSponsor.logoUrl}
                    onChange={(e) => setNewSponsor({...newSponsor, logoUrl: e.target.value})}
                    placeholder="https://images.unsplash.com/..." 
                    className="bg-white/5 border-white/10 rounded-none" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Sponsorship Tier</Label>
                  <Select
                    value={newSponsor.tier}
                    onValueChange={(value) => setNewSponsor({ ...newSponsor, tier: value })}
                  >
                    <SelectTrigger className="w-full bg-white/5 border-white/10 p-2 text-xs rounded-none text-white h-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/80 backdrop-blur-md border-white/10 text-white rounded-none">
                      <SelectItem value="Platinum">Platinum</SelectItem>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddSponsor} className="w-full bg-accent text-background hover:bg-accent/80 rounded-none font-headline tracking-widest text-[10px] py-4 uppercase">
                  RECRUIT PARTNER
                </Button>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-headline text-xs tracking-widest text-accent uppercase mb-4">ACTIVE PARTNERS</h3>
              {sponsorsLoading && <TableRow><TableCell colSpan={3} className="text-center"><Loader2 className="mx-auto animate-spin" /></TableCell></TableRow>}
              {sponsors?.map((sponsor) => (
                <div key={sponsor.id} className="glass-panel p-4 border-white/5 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 glass-panel flex items-center justify-center p-1 bg-white">
                      <img src={sponsor.logoUrl} alt={sponsor.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div>
                      <h4 className="font-headline text-[11px] text-white tracking-widest uppercase">{sponsor.name}</h4>
                      <p className="text-[8px] text-accent uppercase tracking-widest font-bold">{sponsor.tier}</p>
                    </div>
                  </div>
                  <Button onClick={() => handleDeleteSponsor(sponsor.id)} variant="ghost" className="text-muted-foreground hover:text-destructive p-2">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="glass-panel border-primary/20 rounded-none bg-black/40 h-fit">
              <CardHeader>
                <CardTitle className="font-headline text-lg tracking-widest flex items-center gap-2 uppercase">
                  {editingEvent ? <Pencil className="w-4 h-4 text-primary" /> : <Plus className="w-4 h-4 text-primary" />}
                  {editingEvent ? 'EDIT ARENA' : 'ADD ARENA'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Event Name</Label>
                  <Input name="name" value={newEvent.name} onChange={handleNewEventChange} className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Event Category</Label>
                  <Select 
                    name="type" 
                    value={newEvent.type} 
                    onValueChange={handleEventTypeChange}
                  >
                    <SelectTrigger className="w-full bg-white/5 border border-white/10 p-2 text-xs rounded-none text-white h-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/80 backdrop-blur-md border-white/10 text-white rounded-none">
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Non-Technical">Non-Technical</SelectItem>
                      <SelectItem value="eSports">eSports</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Festival Day</Label>
                   <Select
                      name="festivalDayId"
                      value={newEvent.festivalDayId}
                      onValueChange={handleEventDayChange}
                  >
                      <SelectTrigger className="w-full bg-white/5 border-white/10 p-2 text-xs rounded-none text-white h-auto" disabled={festivalDaysLoading}>
                          <SelectValue placeholder="Select a day" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/80 backdrop-blur-md border-white/10 text-white rounded-none">
                          {festivalDays?.map(day => (
                              <SelectItem key={day.id} value={day.id}>{day.name}</SelectItem>
                          ))}
                      </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest">Start Time</Label>
                    <Input name="startTime" value={newEvent.startTime} onChange={handleNewEventChange} type="datetime-local" className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest">Location</Label>
                    <Input name="location" value={newEvent.location} onChange={handleNewEventChange} placeholder="e.g. Main Arena" className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Event Description</Label>
                  <Textarea name="description" value={newEvent.description} onChange={handleNewEventChange} className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Event Head</Label>
                  <Input name="eventHead" value={newEvent.eventHead} onChange={handleNewEventChange} className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Event Rules (one rule per line)</Label>
                  <Textarea name="rules" value={newEvent.rules} onChange={handleNewEventChange} className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Registration Fee</Label>
                  <Input name="registrationFee" value={newEvent.registrationFee} onChange={handleNewEventChange} placeholder="e.g., $10 per person" className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Event Organiser Contact (Optional)</Label>
                  <Input name="organiserContact" value={newEvent.organiserContact} onChange={handleNewEventChange} className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Event Logo/Image URL</Label>
                  <Input name="imageUrl" value={newEvent.imageUrl} onChange={handleNewEventChange} placeholder="https://..." className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <Button onClick={editingEvent ? handleUpdateEvent : handleAddEvent} className="w-full bg-primary text-background hover:bg-primary/80 rounded-none font-headline tracking-widest text-[10px] py-4 uppercase">
                   {editingEvent ? 'UPDATE ARENA' : 'INITIALIZE ARENA'}
                </Button>
                {editingEvent && (
                    <Button onClick={handleCancelEdit} variant="secondary" className="w-full rounded-none font-headline tracking-widest text-[10px] py-4 uppercase mt-2">
                      CANCEL EDIT
                    </Button>
                )}
                 <Button onClick={handleSeedEvents} variant="outline" className="w-full border-accent/20 text-accent hover:bg-accent/10 rounded-none font-headline tracking-widest text-[10px] py-4 uppercase">
                  <DatabaseZap className="w-4 h-4 mr-2" /> SEED INITIAL EVENTS
                </Button>
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-headline text-xs tracking-widest text-primary uppercase mb-4">ACTIVE ARENAS</h3>
              {eventsLoading && <div className="text-center"><Loader2 className="mx-auto animate-spin" /></div>}
              {events?.map((event) => (
                <div key={event.id} className="glass-panel p-4 border-white/5 bg-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 glass-panel flex items-center justify-center text-primary">
                      <Gamepad2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-headline text-[11px] text-white tracking-widest uppercase">{event.name}</h4>
                      <p className="text-[8px] text-muted-foreground uppercase tracking-widest">{event.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button onClick={() => handleEditClick(event)} variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDeleteEvent(event.id)} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8">
                        <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="glass-panel border-primary/20 rounded-none bg-black/40 h-fit">
                <CardHeader>
                    <CardTitle className="font-headline text-lg tracking-widest flex items-center gap-2 uppercase">
                        <Plus className="w-4 h-4 text-primary" /> ADD FESTIVAL DAY
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest">Day Name</Label>
                        <Input name="name" value={newDay.name} onChange={handleNewDayChange} placeholder="e.g. Day 1" className="bg-white/5 border-white/10 rounded-none" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase tracking-widest">Date</Label>
                        <Input name="date" value={newDay.date} onChange={handleNewDayChange} type="date" className="bg-white/5 border-white/10 rounded-none" />
                    </div>
                    <Button onClick={handleAddDay} className="w-full bg-primary text-background hover:bg-primary/80 rounded-none font-headline tracking-widest text-[10px] py-4 uppercase">
                        ADD DAY
                    </Button>
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-8">
                <h3 className="font-headline text-xs tracking-widest text-primary uppercase mb-4">CURRENT TIMELINE</h3>
                {festivalDaysLoading && <div className="text-center"><Loader2 className="mx-auto animate-spin" /></div>}
                {festivalDays?.map(day => (
                    <div key={day.id}>
                        <div className="flex justify-between items-center mb-4">
                          <div>
                              <h4 className="font-headline text-lg tracking-widest text-accent uppercase">{day.name}</h4>
                              <p className="text-xs text-muted-foreground">{formatDashboardDate(day.date)}</p>
                          </div>
                          <Button onClick={() => handleDeleteDay(day.id)} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8">
                              <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-2 border-l-2 border-accent/20 pl-4">
                           {events?.filter(e => e.festivalDayId === day.id).map(event => (
                              <div key={event.id} className="glass-panel p-3 border-white/5 bg-white/5 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-headline text-white">{event.name}</p>
                                    <p className="text-xs text-muted-foreground flex items-center gap-2"><Clock className="w-3 h-3" /> {formatDashboardTime(event.startTime)} <MapPin className="w-3 h-3 ml-2" /> {event.location}</p>
                                </div>
                                <Button onClick={() => { setActiveTab('events'); handleEditClick(event); }} variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                                    <Pencil className="w-4 h-4" />
                                </Button>
                              </div>
                           ))}
                           {events?.filter(e => e.festivalDayId === day.id).length === 0 && (
                            <p className="text-sm text-muted-foreground p-3">No events scheduled for this day.</p>
                           )}
                        </div>
                    </div>
                ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="announcements">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="glass-panel border-accent/20 rounded-none bg-black/40 h-fit">
                    <CardHeader>
                        <CardTitle className="font-headline text-lg tracking-widest flex items-center gap-2 uppercase">
                            <Plus className="w-4 h-4 text-accent" /> New Briefing
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest">Title</Label>
                            <Input name="title" value={newAnnouncement.title} onChange={handleNewAnnouncementChange} placeholder="e.g. Schedule Update" className="bg-white/5 border-white/10 rounded-none" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase tracking-widest">Content</Label>
                            <Textarea name="content" value={newAnnouncement.content} onChange={handleNewAnnouncementChange} placeholder="Details about the announcement..." className="bg-white/5 border-white/10 rounded-none min-h-[120px]" />
                        </div>
                        <Button onClick={handleAddAnnouncement} className="w-full bg-accent text-background hover:bg-accent/80 rounded-none font-headline tracking-widest text-[10px] py-4 uppercase">
                           Publish Briefing
                        </Button>
                    </CardContent>
                </Card>
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="font-headline text-xs tracking-widest text-accent uppercase mb-4">Published Briefings</h3>
                    {announcementsLoading && <div className="text-center"><Loader2 className="mx-auto animate-spin" /></div>}
                    {announcements?.map((announcement) => (
                        <div key={announcement.id} className="glass-panel p-4 border-white/5 bg-white/5 flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className="font-headline text-md text-white tracking-widest uppercase">{announcement.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1 mb-2 font-code">{new Date(announcement.timestamp).toLocaleString()}</p>
                                <p className="text-sm text-muted-foreground/80">{announcement.content}</p>
                            </div>
                            <Button onClick={() => handleDeleteAnnouncement(announcement.id)} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8 flex-shrink-0 ml-4">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </TabsContent>

        <TabsContent value="team">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="glass-panel border-primary/20 rounded-none bg-black/40 h-fit">
              <CardHeader>
                 <CardTitle className="font-headline text-lg tracking-widest flex items-center gap-2 uppercase">
                    {editingArchitect ? <Pencil className="w-4 h-4 text-primary" /> : <UserPlus className="w-4 h-4" />}
                    {editingArchitect ? 'EDIT ARCHITECT' : 'RECRUIT ARCHITECT'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Display Order</Label>
                  <Input name="displayOrder" type="number" value={newArchitect.displayOrder} onChange={handleNewArchitectChange} placeholder="e.g. 1" className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Student Name</Label>
                  <Input name="fullName" value={newArchitect.fullName} onChange={handleNewArchitectChange} placeholder="e.g. Jane Doe" className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Role</Label>
                  <Input name="role" value={newArchitect.role} onChange={handleNewArchitectChange} placeholder="e.g. Student Organizer" className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Category</Label>
                  <Select
                    name="category"
                    value={newArchitect.category}
                    onValueChange={handleArchitectCategoryChange}
                  >
                    <SelectTrigger className="w-full bg-white/5 border-white/10 p-2 text-xs rounded-none text-white h-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/80 backdrop-blur-md border-white/10 text-white rounded-none">
                      {architectCategories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Image URL</Label>
                  <Input name="profileImageUrl" value={newArchitect.profileImageUrl} onChange={handleNewArchitectChange} placeholder="https://..." className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">LinkedIn URL</Label>
                  <Input name="linkedinUrl" value={newArchitect.linkedinUrl} onChange={handleNewArchitectChange} placeholder="https://linkedin.com/in/..." className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">GitHub URL (Optional)</Label>
                  <Input name="githubUrl" value={newArchitect.githubUrl} onChange={handleNewArchitectChange} placeholder="https://github.com/..." className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Portfolio URL (Optional)</Label>
                  <Input name="portfolioUrl" value={newArchitect.portfolioUrl} onChange={handleNewArchitectChange} placeholder="https://..." className="bg-white/5 border-white/10 rounded-none" />
                </div>
                 <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest">Resume URL (Optional)</Label>
                  <Input name="resumeUrl" value={newArchitect.resumeUrl} onChange={handleNewArchitectChange} placeholder="https://..." className="bg-white/5 border-white/10 rounded-none" />
                </div>
                <Button onClick={editingArchitect ? handleUpdateArchitect : handleAddArchitect} className="w-full bg-accent text-background hover:bg-accent/80 rounded-none font-headline tracking-widest text-[10px] py-4 uppercase">
                  {editingArchitect ? 'UPDATE MEMBER' : 'ONBOARD MEMBER'}
                </Button>
                {editingArchitect && (
                    <Button onClick={handleCancelArchitectEdit} variant="secondary" className="w-full rounded-none font-headline tracking-widest text-[10px] py-4 uppercase mt-2">
                      CANCEL EDIT
                    </Button>
                )}
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-headline text-xs tracking-widest text-primary uppercase mb-4">ACTIVE ARCHITECTS</h3>
              {teamMembersLoading && <div className="text-center"><Loader2 className="mx-auto animate-spin" /></div>}
              {sortedTeamMembers?.map((member, idx) => (
                  <div key={member.id} className="glass-panel p-4 border-white/5 bg-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="font-headline text-primary text-sm w-6 text-center">{idx + 1}.</span>
                      <img src={member.profileImageUrl} alt={member.fullName} className="w-10 h-10 rounded-full object-cover bg-white/10" />
                      <div>
                        <h4 className="font-headline text-[11px] text-white tracking-widest uppercase">{member.fullName}</h4>
                        <p className="text-[8px] text-muted-foreground uppercase tracking-widest">{member.role} - <span className="text-accent">{member.category}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button onClick={() => handleArchitectEditClick(member)} variant="ghost" size="icon" className="text-muted-foreground hover:text-primary h-8 w-8">
                          <Pencil className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => handleDeleteArchitect(member.id)} variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive h-8 w-8">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="registrations">
          <Card className="glass-panel border-primary/20 rounded-none bg-black/40">
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle className="font-headline text-xl tracking-widest flex items-center gap-2 uppercase">
                  <Users className="w-5 h-5 text-accent" /> WARRIOR ARCHIVE
                </CardTitle>
                <CardDescription className="text-[10px] uppercase tracking-widest mt-1">Live Manifest of Verified Identities</CardDescription>
              </div>
              <Button variant="outline" className="border-primary/20 text-[10px] font-headline tracking-widest rounded-none uppercase">EXPORT MANIFEST</Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="border-white/10">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase tracking-widest">Identity</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Communication</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Arena</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrationsLoading && <TableRow><TableCell colSpan={4} className="text-center"><Loader2 className="mx-auto animate-spin" /></TableCell></TableRow>}
                  {registrations?.map((reg) => (
                    <TableRow key={reg.id} className="border-white/5 hover:bg-white/5">
                      <TableCell className="text-[10px] uppercase font-bold text-white tracking-widest">{reg.fullName}</TableCell>
                      <TableCell className="text-[10px] text-muted-foreground">{reg.email}</TableCell>
                      <TableCell>
                        <span className="text-[9px] px-2 py-0.5 bg-primary/20 text-primary border border-primary/20 font-headline uppercase">
                          {reg.registeredEventIds?.[0] || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell className="text-[10px] font-code text-muted-foreground/60">{new Date(reg.registrationDate).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admins">
          <Card className="glass-panel border-primary/20 rounded-none bg-black/40">
            <CardHeader>
              <CardTitle className="font-headline text-xl tracking-widest flex items-center gap-2 uppercase">
                <KeySquare className="w-5 h-5 text-primary" /> ADMIN ROLE MANAGER
              </CardTitle>
              <CardDescription className="text-[10px] uppercase tracking-widest mt-1">Grant or revoke administrator privileges.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="border-white/10">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase tracking-widest">Identity</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest">Status</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-widest text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(adminUsersLoading || adminsLoading) && (
                      <TableRow>
                          <TableCell colSpan={3} className="text-center">
                              <Loader2 className="mx-auto animate-spin" />
                          </TableCell>
                      </TableRow>
                  )}
                  {adminUsers?.map((adminUser) => {
                    const isAdmin = adminIds.has(adminUser.id);
                    const isSelf = user?.uid === adminUser.id;

                    return (
                        <TableRow key={adminUser.id} className="border-white/5 hover:bg-white/5">
                            <TableCell>
                                <div className="font-bold text-white tracking-widest uppercase text-[11px]">{adminUser.fullName}</div>
                                <div className="text-[10px] text-muted-foreground">{adminUser.email}</div>
                            </TableCell>
                            <TableCell>
                                {isAdmin ? (
                                    <Badge variant="outline" className="text-primary border-primary/40 text-[9px] uppercase tracking-widest">
                                        <ShieldCheck className="w-3 h-3 mr-1" />
                                        Admin
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-muted-foreground border-muted-foreground/40 text-[9px] uppercase tracking-widest">
                                        <ShieldOff className="w-3 h-3 mr-1" />
                                        Participant
                                    </Badge>
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant={isAdmin ? "destructive" : "secondary"}
                                    size="sm"
                                    className="text-[10px] font-headline tracking-widest rounded-none uppercase disabled:opacity-50"
                                    onClick={() => handleToggleAdmin(adminUser.id, isAdmin)}
                                    disabled={isSelf}
                                    title={isSelf ? "Cannot change your own role" : ""}
                                >
                                    {isAdmin ? "Revoke Access" : "Grant Access"}
                                </Button>
                            </TableCell>
                        </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
