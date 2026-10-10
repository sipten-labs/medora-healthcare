import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowDownLeft, ArrowLeft, ArrowRight, ArrowUpRight, Bell, Calendar,
  CalendarCheck, CalendarClock, Check, CheckCircle2, ChevronDown, ChevronLeft,
  ChevronRight, CircleHelp, Clock3, FileHeart, FileText, Filter, Heart, HeartPulse,
  Home, LogOut, Menu, MessageCircle, MoreHorizontal, Search, ShieldCheck, SlidersHorizontal,
  Sparkles, Stethoscope, UserRound, UsersRound, Video, X, Plus, MapPin, Star, LockKeyhole,
  Mail, Eye, EyeOff, Smartphone, ClipboardCheck
} from 'lucide-react';

const SPECIALTIES = ['All specialties', 'Cardiology', 'Dermatology', 'General Physician', 'Orthopedics', 'Pediatrics', 'Mental Wellness'];
const TIMES = ['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM'];
const api = async (url, options = {}) => {
  const response = await fetch(url, { credentials: 'include', ...options, headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...(options.headers || {}) } });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
  return data;
};
const money = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount || 0);
const formatDate = (value, opts = { weekday: 'short', day: 'numeric', month: 'short' }) => {
  if (!value) return 'Choose a date';
  return new Intl.DateTimeFormat('en-IN', opts).format(new Date(`${value}T12:00:00`));
};
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
const initials = (name = 'Medora User') => name.split(/\s+/).filter(Boolean).slice(0,2).map((p) => p[0]).join('').toUpperCase();

function Brand({ compact = false }) {
  return <div className={`brand ${compact ? 'brand-compact' : ''}`}><div className="brand-mark"><HeartPulse size={21} strokeWidth={2.3} /></div><div className="brand-word">MEDORA<span>CARE, MADE CLEAR</span></div></div>;
}
function Avatar({ name, image, size = 'normal' }) {
  return image ? <img className={`avatar avatar-${size}`} src={image} alt={name} /> : <div className={`avatar avatar-${size} avatar-initials`}>{initials(name)}</div>;
}
function Button({ children, variant = 'primary', size = 'normal', className = '', ...props }) {
  return <button className={`btn btn-${variant} btn-${size} ${className}`} {...props}>{children}</button>;
}
function Toast({ toast, onClose }) {
  useEffect(() => { if (!toast) return; const id = setTimeout(onClose, 4200); return () => clearTimeout(id); }, [toast, onClose]);
  if (!toast) return null;
  return <div className={`toast toast-${toast.kind || 'success'}`} role="status"><span className="toast-icon">{toast.kind === 'error' ? <X size={17}/> : <Check size={17}/>}</span><span>{toast.message}</span><button aria-label="Dismiss notification" onClick={onClose}><X size={16}/></button></div>;
}
function DemoNotice() {
  return <div className="demo-notice"><ShieldCheck size={15}/><span><strong>Portfolio demo</strong> · Use sample data only. No real medical service or appointment is provided.</span></div>;
}
function LoginPage({ onAuthenticated, notify }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const update = (key, val) => setForm((current) => ({ ...current, [key]: val }));
  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const result = await api(`/api/auth/${mode === 'register' ? 'register' : 'login'}`, { method: 'POST', body: JSON.stringify(form) });
      onAuthenticated(result.user); notify({ kind: 'success', message: mode === 'register' ? 'Your demo account is ready.' : 'Welcome back to MEDORA.' });
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  const demoLogin = async () => {
    setBusy(true); setError('');
    try { const result = await api('/api/auth/demo', { method: 'POST', body: JSON.stringify({}) }); onAuthenticated(result.user); notify({ kind: 'success', message: 'Welcome to the interactive demo.' }); }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };
  return <div className="auth-screen">
    <aside className="auth-story">
      <div className="auth-story-glow"/><Brand />
      <div className="auth-story-content">
        <div className="eyebrow eyebrow-light"><span/> A BETTER WAY TO CARE</div>
        <h1>Care that feels<br/><em>clearer.</em></h1>
        <p>Your health journey, thoughtfully connected. Find care, manage visits and keep the little things in one calm place.</p>
        <div className="auth-proof"><div className="proof-avatars"><Avatar name="Olivia Bennett" image="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=100&q=80"/><Avatar name="Amara Wilson" image="https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=100&q=80"/><Avatar name="Ethan Cole" image="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=100&q=80"/></div><div><div className="proof-stars"><Star size={13} fill="currentColor"/><Star size={13} fill="currentColor"/><Star size={13} fill="currentColor"/><Star size={13} fill="currentColor"/><Star size={13} fill="currentColor"/></div><span>Designed around people, not paperwork</span></div></div>
      </div>
      <div className="auth-story-bottom"><span>Thoughtful care starts here.</span><span>01 / 03</span></div>
    </aside>
    <main className="auth-main">
      <div className="auth-mobile-brand"><Brand/></div>
      <div className="auth-form-wrap">
        <div className="auth-topline"><span>{mode === 'register' ? 'YOUR HEALTH SPACE' : 'WELCOME TO MEDORA'}</span><span>Need help? <button className="text-button" onClick={() => notify({ kind: 'info', message: 'This portfolio demo has no live support desk.' })}>Contact us</button></span></div>
        <div className="auth-heading"><div className="auth-icon"><HeartPulse size={23}/></div><h2>{mode === 'register' ? 'Create your account' : 'Welcome back'}</h2><p>{mode === 'register' ? 'A little more connected. A little less complicated.' : 'Pick up where your care journey left off.'}</p></div>
        <form className="auth-form" onSubmit={submit}>
          {mode === 'register' && <label>Full name<div className="input-wrap"><UserRound size={17}/><input autoComplete="name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Alex Morgan" required minLength={2}/></div></label>}
          <label>Email address<div className="input-wrap"><Mail size={17}/><input autoComplete="email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" required/></div></label>
          <label>Password<div className="input-wrap"><LockKeyhole size={17}/><input autoComplete={mode === 'register' ? 'new-password' : 'current-password'} type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => update('password', e.target.value)} placeholder={mode === 'register' ? 'At least 8 characters' : 'Enter your password'} required minLength={8}/><button type="button" className="input-action" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((v) => !v)}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <Button type="submit" className="auth-submit" disabled={busy}>{busy ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'}<ArrowRight size={17}/></Button>
        </form>
        <div className="auth-divider"><span/> <span>OR CONTINUE WITH</span> <span/></div>
        <Button variant="outline" className="demo-login" onClick={demoLogin} disabled={busy}><Sparkles size={16}/> Explore interactive demo</Button>
        <p className="auth-switch">{mode === 'register' ? 'Already have an account?' : "Don't have an account?"} <button className="text-button" onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setError(''); }}>{mode === 'register' ? 'Sign in' : 'Create an account'}</button></p>
        <p className="auth-disclaimer"><ShieldCheck size={14}/> Your privacy matters. This is a sample portfolio experience, not a medical service.</p>
      </div>
      <div className="auth-footer"><span>© 2026 MEDORA Concept</span><span>Privacy · Terms · Help</span></div>
    </main>
  </div>;
}

function Sidebar({ activeView, setActiveView, user, onLogout, mobileOpen, closeMobile }) {
  const groups = [
    { label: 'WORKSPACE', items: [{ id: 'overview', label: 'Overview', icon: Home }, { id: 'doctors', label: 'Find a doctor', icon: Stethoscope }, { id: 'appointments', label: 'Appointments', icon: CalendarCheck, count: null }, { id: 'records', label: 'Health records', icon: FileHeart }] },
    { label: 'PERSONAL', items: [{ id: 'profile', label: 'My profile', icon: UserRound }] }
  ];
  return <><div className={`sidebar-scrim ${mobileOpen ? 'show' : ''}`} onClick={closeMobile}/><aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
    <div className="sidebar-brand"><Brand/><button className="mobile-close" onClick={closeMobile} aria-label="Close menu"><X size={20}/></button></div>
    <div className="workspace-chip"><div className="workspace-dot"><HeartPulse size={16}/></div><div><strong>Personal space</strong><span>Patient workspace</span></div><ChevronDown size={15}/></div>
    <nav className="side-nav" aria-label="Main navigation">{groups.map((group) => <div className="nav-group" key={group.label}><div className="nav-label">{group.label}</div>{group.items.map((item) => { const Icon = item.icon; return <button key={item.id} className={`nav-item ${activeView === item.id ? 'active' : ''}`} onClick={() => { setActiveView(item.id); closeMobile(); }}><Icon size={18}/><span>{item.label}</span>{item.count && <span className="nav-count">{item.count}</span>}{activeView === item.id && <span className="active-indicator"/>}</button>; })}</div>)}</nav>
    <div className="sidebar-bottom"><div className="side-help"><div className="help-icon"><CircleHelp size={19}/></div><strong>Need a hand?</strong><p>We're here to help you find your way.</p><button onClick={() => { setActiveView('help'); closeMobile(); }}>Visit help centre <ArrowRight size={14}/></button><div className="help-deco">✳</div></div><div className="side-account"><Avatar name={user?.name}/><div className="side-account-info"><strong>{user?.name || 'MEDORA Member'}</strong><span>Patient account</span></div><button aria-label="Sign out" onClick={onLogout}><LogOut size={17}/></button></div></div>
  </aside></>;
}
function Topbar({ user, onMenu, onNotifications, setView }) {
  return <header className="topbar"><div className="topbar-left"><button className="mobile-menu" aria-label="Open menu" onClick={onMenu}><Menu size={20}/></button><div className="breadcrumb"><span>Workspace</span><ChevronRight size={14}/><strong>{({ overview: 'Overview', doctors: 'Find a doctor', appointments: 'Appointments', records: 'Health records', profile: 'My profile', help: 'Help centre' })[window.__medoraView || 'overview']}</strong></div></div><div className="topbar-actions"><div className="status-pill"><span/> All systems normal</div><button className="icon-button notification-button" aria-label="Notifications" onClick={onNotifications}><Bell size={18}/><i/></button><button className="topbar-user" onClick={() => setView('profile')}><Avatar name={user?.name}/><span>{user?.name?.split(' ')[0] || 'Member'}</span><ChevronDown size={14}/></button></div></header>;
}
function PageIntro({ eyebrow, title, children, action }) {
  return <div className="page-intro"><div><div className="eyebrow"><span/>{eyebrow}</div><h1>{title}</h1>{children && <p>{children}</p>}</div>{action}</div>;
}
function MetricCard({ icon: Icon, label, value, sub, tone = 'teal', trend }) {
  return <div className="metric-card"><div className={`metric-icon metric-${tone}`}><Icon size={20}/></div><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-sub">{trend && <span className="trend"><ArrowUpRight size={13}/>{trend}</span>}{sub}</div></div>;
}
function AppointmentCard({ appointment, doctor, onCancel, onDetails }) {
  const d = doctor || appointment.doctor;
  const completed = appointment.status === 'Completed';
  const cancelled = appointment.status === 'Cancelled';
  return <div className="appointment-row"><Avatar name={d?.name || 'Doctor'} image={d?.image}/><div className="appointment-person"><strong>{d?.name || 'Care team'}</strong><span>{d?.specialty || 'Consultation'} <span className="dot-sep">·</span> {appointment.type}</span><div className="appointment-mobile-date"><Calendar size={13}/>{formatDate(appointment.date)} <span>·</span> {appointment.time}</div></div><div className="appointment-datetime"><strong>{formatDate(appointment.date)}</strong><span>{appointment.time}</span></div><span className={`status-tag ${completed ? 'status-completed' : cancelled ? 'status-cancelled' : 'status-upcoming'}`}><span/>{appointment.status}</span><button className="row-more" aria-label="Appointment options" onClick={() => onDetails(appointment)}><MoreHorizontal size={20}/></button></div>;
}
function DoctorCard({ doctor, onBook, onDetails, compact = false }) {
  return <article className={`doctor-card ${compact ? 'doctor-card-compact' : ''}`}><div className="doctor-card-top"><div className="doctor-image-wrap"><img src={doctor.image} alt={doctor.name} loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex'; }}/><div className={`doctor-fallback fallback-${doctor.color || 'mint'}`}>{doctor.initials || initials(doctor.name)}</div><span className="verified-badge" title="Sample profile"><Check size={12}/></span></div><button className="favorite-button" aria-label={`Save ${doctor.name}`} onClick={() => onDetails(doctor)}><Heart size={17}/></button></div><div className="doctor-rating"><Star size={13} fill="currentColor"/><strong>{doctor.rating}</strong><span>({doctor.reviews} reviews)</span></div><h3>{doctor.name}</h3><div className="doctor-specialty">{doctor.specialty}</div><div className="doctor-experience"><ShieldCheck size={14}/>{doctor.experience}</div><div className="doctor-card-bottom"><div><strong>{money(doctor.fee)}</strong><span>/ visit</span></div><Button size="small" onClick={() => onBook(doctor)}>Book visit <ArrowRight size={14}/></Button></div></article>;
}
function SpecialtyTile({ item, onClick }) {
  const Icon = item.icon;
  return <button className="specialty-tile" onClick={() => onClick(item.name)}><span className={`specialty-icon ${item.tone}`}><Icon size={20}/></span><span>{item.name}</span><ChevronRight size={15}/></button>;
}
function Overview({ user, dashboard, doctors, onView, onBook, onDoctorDetails, onAppointmentDetails }) {
  const upcoming = dashboard?.appointments?.filter((a) => a.status === 'Upcoming') || [];
  const nextAppointment = upcoming[0];
  const nextDoctor = doctors.find((d) => d.id === nextAppointment?.doctorId);
  const specialties = [
    { name: 'Cardiology', icon: HeartPulse, tone: 'tone-red' }, { name: 'Dermatology', icon: Sparkles, tone: 'tone-purple' }, { name: 'General Physician', icon: Stethoscope, tone: 'tone-teal' }, { name: 'Orthopedics', icon: Activity, tone: 'tone-blue' }
  ];
  const firstName = user?.name?.split(' ')[0] || 'Alex';
  return <div className="page-content overview-page">
    <PageIntro eyebrow={`${new Intl.DateTimeFormat('en-US',{weekday:'long',month:'short',day:'numeric'}).format(new Date()).toUpperCase()} · YOUR CARE AT A GLANCE`} title={<>{new Date().getHours()<12?'Good morning':new Date().getHours()<17?'Good afternoon':'Good evening'}, {firstName}<span className="greeting-sun">✳</span></>} >Your health journey, thoughtfully organised. Here's what's happening today.</PageIntro>
    <div className="overview-hero-grid">
      <section className="next-visit-card"><div className="next-visit-top"><span className="next-visit-label"><span className="live-dot"/> NEXT APPOINTMENT</span><button className="dark-icon-button" aria-label="Appointment options" onClick={() => onAppointmentDetails(nextAppointment)}><MoreHorizontal size={19}/></button></div>{nextAppointment ? <><div className="visit-time-row"><div className="visit-date-box"><span>{new Intl.DateTimeFormat('en-US',{month:'short'}).format(new Date(`${nextAppointment.date}T12:00:00`)).toUpperCase()}</span><strong>{new Date(`${nextAppointment.date}T12:00:00`).getDate()}</strong></div><div className="visit-time-copy"><h2>{formatDate(nextAppointment.date,{weekday:'long',month:'long',day:'numeric'})}</h2><p><Clock3 size={15}/>{nextAppointment.time} <span>·</span> {nextAppointment.type}</p></div></div><div className="visit-divider"/><div className="visit-doctor"><Avatar name={nextDoctor?.name || 'Care team'} image={nextDoctor?.image}/><div><strong>{nextDoctor?.name || 'Your care team'}</strong><span>{nextDoctor?.specialty || 'Consultation'}</span></div><Button variant="light" size="small" onClick={() => onAppointmentDetails(nextAppointment)}>View details <ArrowRight size={14}/></Button></div></> : <div className="no-visit"><div className="no-visit-icon"><CalendarClock size={25}/></div><h2>Nothing scheduled yet</h2><p>Make a little time for your wellbeing.</p><Button variant="light" onClick={() => onView('doctors')}>Find a doctor <ArrowRight size={15}/></Button></div>}<div className="hero-decoration hero-circle-one"/><div className="hero-decoration hero-circle-two"/></section>
      <section className="care-note-card"><div className="care-note-orbit"><HeartPulse size={25}/></div><div className="care-note-copy"><span className="tiny-overline">A LITTLE REMINDER</span><h3>Care is a journey,<br/>not a checklist.</h3><p>Small, consistent steps can make a meaningful difference. You're doing better than you think.</p></div><div className="care-note-footer"><span>YOUR WELLBEING MATTERS</span><span>✳</span></div><div className="care-note-shape"/></section>
    </div>
    <div className="metrics-grid"><MetricCard icon={CalendarCheck} label="Upcoming visits" value={dashboard?.stats?.upcoming ?? 0} sub="On your calendar" tone="teal"/><MetricCard icon={ClipboardCheck} label="Visits completed" value={dashboard?.stats?.completed ?? 0} sub="Your care history" tone="purple"/><MetricCard icon={Heart} label="Saved doctors" value={dashboard?.stats?.savedDoctors ?? 4} sub="In your care circle" tone="rose"/><MetricCard icon={ShieldCheck} label="Care plan" value="On track" sub="Keep it up" tone="blue" trend="Good"/></div>
    <div className="section-row"><div><div className="section-kicker">YOUR CARE CIRCLE</div><h2>Find the right specialist</h2><p>Thoughtful care starts with the right conversation.</p></div><button className="link-button" onClick={() => onView('doctors')}>View all doctors <ArrowRight size={16}/></button></div>
    <div className="specialty-grid">{specialties.map((item) => <SpecialtyTile key={item.name} item={item} onClick={(name) => { window.__medoraSpecialty = name; onView('doctors'); }}/>)}</div>
    <div className="section-row doctor-section-heading"><div><div className="section-kicker">MEET YOUR CARE TEAM</div><h2>Recommended for you</h2><p>Explore our sample profiles and find a good fit.</p></div><button className="link-button" onClick={() => onView('doctors')}>Explore directory <ArrowRight size={16}/></button></div>
    <div className="doctor-grid">{doctors.slice(0,3).map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} compact onBook={onBook} onDetails={onDoctorDetails}/>)}</div>
    <div className="section-row recent-heading"><div><div className="section-kicker">KEEP EVERYTHING IN ONE PLACE</div><h2>Recent appointments</h2></div><button className="link-button" onClick={() => onView('appointments')}>See appointment history <ArrowRight size={16}/></button></div>
    <div className="appointment-list">{dashboard?.appointments?.slice(0,3).map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} doctor={doctors.find((d) => d.id === appointment.doctorId)} onCancel={onView} onDetails={onAppointmentDetails}/>)}{!dashboard?.appointments?.length && <div className="empty-state"><CalendarClock size={27}/><strong>Your appointment history starts here</strong><p>Booked demo appointments will appear in this space.</p></div>}</div>
    <DemoNotice/>
  </div>;
}
function DoctorsPage({ doctors, loading, onBook, onDetails, initialSpecialty }) {
  const [query, setQuery] = useState('');
  const [specialty, setSpecialty] = useState(initialSpecialty || 'All specialties');
  const [mode, setMode] = useState('Any visit');
  useEffect(() => { setSpecialty(initialSpecialty || 'All specialties'); }, [initialSpecialty]);
  const filtered = doctors.filter((d) => (!query || `${d.name} ${d.specialty} ${d.bio}`.toLowerCase().includes(query.toLowerCase())) && (specialty === 'All specialties' || d.specialty === specialty) && (mode === 'Any visit' || d.mode.some((m) => m.toLowerCase().includes(mode.toLowerCase()))));
  return <div className="page-content"><PageIntro eyebrow="YOUR CARE, YOUR WAY" title="Find your doctor" >Meet experienced care professionals and choose the kind of visit that works for you.</PageIntro>
    <div className="doctor-search-panel"><div className="search-field"><Search size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search doctors, specialties…" aria-label="Search doctors"/><kbd>⌘ K</kbd></div><div className="filter-field"><SlidersHorizontal size={16}/><select value={specialty} onChange={(e) => setSpecialty(e.target.value)} aria-label="Filter by specialty">{SPECIALTIES.map((s) => <option key={s}>{s}</option>)}</select><ChevronDown size={14}/></div><div className="filter-field"><Video size={16}/><select value={mode} onChange={(e) => setMode(e.target.value)} aria-label="Filter by visit type"><option>Any visit</option><option>In person</option><option>Video</option></select><ChevronDown size={14}/></div><Button variant="outline" onClick={() => { setQuery(''); setSpecialty('All specialties'); setMode('Any visit'); }}><X size={15}/> Reset</Button></div>
    <div className="results-bar"><span><strong>{filtered.length}</strong> care professionals <span className="dot-sep">·</span> Sample profiles</span><div><span className="sort-label">SORT BY</span><button className="sort-button">Recommended <ChevronDown size={14}/></button></div></div>
    {loading ? <div className="loading-state">Finding care professionals…</div> : filtered.length ? <div className="doctor-directory-grid">{filtered.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} onBook={onBook} onDetails={onDetails}/>)}</div> : <div className="empty-state empty-large"><Search size={28}/><h3>No matching doctors</h3><p>Try a different name or clear your filters.</p><Button variant="outline" onClick={() => { setQuery(''); setSpecialty('All specialties'); setMode('Any visit'); }}>Clear filters</Button></div>}
    <DemoNotice/>
  </div>;
}
function AppointmentsPage({ appointments, doctors, onBook, onDetails, onCancel }) {
  const [tab, setTab] = useState('All appointments');
  const filtered = appointments.filter((a) => tab === 'All appointments' || (tab === 'Upcoming' ? a.status === 'Upcoming' : tab === 'Completed' ? a.status === 'Completed' : a.status === 'Cancelled'));
  return <div className="page-content"><PageIntro eyebrow="YOUR SCHEDULE, SIMPLIFIED" title="Appointments" action={<Button onClick={() => onBook(null)}><Plus size={17}/> Book a visit</Button>}>A clear view of your upcoming care and previous visits.</PageIntro>
    <div className="appointment-summary-grid"><div className="appointment-summary-card"><div className="summary-icon summary-teal"><CalendarClock size={20}/></div><div><span>Upcoming</span><strong>{appointments.filter((a) => a.status === 'Upcoming').length}</strong></div></div><div className="appointment-summary-card"><div className="summary-icon summary-purple"><CheckCircle2 size={20}/></div><div><span>Completed</span><strong>{appointments.filter((a) => a.status === 'Completed').length}</strong></div></div><div className="appointment-summary-card"><div className="summary-icon summary-sage"><ClipboardCheck size={20}/></div><div><span>Total visits</span><strong>{appointments.length}</strong></div></div></div>
    <div className="records-panel"><div className="panel-header"><div><h2>Your schedule</h2><p>Manage your sample appointments in one place.</p></div><button className="icon-button" aria-label="More options" onClick={() => onDetails(null)}><MoreHorizontal size={19}/></button></div><div className="tabs-line">{['All appointments','Upcoming','Completed','Cancelled'].map((name) => <button key={name} className={`tab-button ${tab === name ? 'selected' : ''}`} onClick={() => setTab(name)}>{name}<span>{name === 'All appointments' ? appointments.length : appointments.filter((a) => a.status === (name === 'Upcoming' ? 'Upcoming' : name)).length}</span></button>)}</div>
      {filtered.length ? <div className="appointment-list appointment-list-full">{filtered.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} doctor={doctors.find((d) => d.id === appointment.doctorId)} onDetails={onDetails} onCancel={onCancel}/>)}</div> : <div className="empty-state empty-large"><Calendar size={28}/><h3>No appointments here</h3><p>When you book a visit, it will appear in this list.</p><Button onClick={() => onBook(null)}>Book a visit <ArrowRight size={15}/></Button></div>}</div><DemoNotice/>
  </div>;
}
function RecordsPage({ dashboard }) {
  const records = dashboard?.records || [];
  return <div className="page-content"><PageIntro eyebrow="YOUR HEALTH, ORGANIZED" title="Health records">A simple, structured place for your visit summaries and health documents.</PageIntro>
    <div className="records-privacy-banner"><div className="privacy-icon"><ShieldCheck size={22}/></div><div><strong>Your information stays personal</strong><p>These are fictional sample records for the MEDORA portfolio demo. No real health records are connected.</p></div><span className="privacy-badge">DEMO DATA</span></div>
    <div className="records-panel"><div className="panel-header"><div><h2>Documents & summaries</h2><p>{records.length} sample records available</p></div><Button variant="outline" onClick={() => window.alert('Uploads are not enabled in this portfolio demo.')}><Plus size={16}/> Add record</Button></div><div className="records-table-head"><span>DOCUMENT</span><span>DATE ADDED</span><span>CARE PROVIDER</span><span>TYPE</span><span/></div>
      {records.map((record) => <div className="record-row" key={record.id}><div className="record-title"><div className={`record-icon ${record.category === 'Lab result' ? 'record-purple' : record.category === 'Immunization' ? 'record-blue' : ''}`}>{record.category === 'Lab result' ? <Activity size={19}/> : record.category === 'Immunization' ? <ShieldCheck size={19}/> : <FileText size={19}/>}</div><div><strong>{record.title}</strong><span>{record.category}</span></div></div><div className="record-date">{formatDate(record.date,{day:'numeric',month:'short',year:'numeric'})}</div><div className="record-doctor">{record.doctor}</div><div><span className="record-type">{record.type}</span></div><button className="row-more" aria-label={`View ${record.title}`} onClick={() => window.alert('Sample document preview: '+record.title+'\n\nThis record is illustrative only. No real medical information is stored.') }><MoreHorizontal size={19}/></button></div>)}
    </div><div className="records-footnote"><ShieldCheck size={15}/> For this portfolio concept, records are illustrative and not intended for clinical use.</div><DemoNotice/>
  </div>;
}
function ProfilePage({ user, onSave, onLogout, notify }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  useEffect(() => { setName(user?.name || ''); setEmail(user?.email || ''); }, [user]);
  return <div className="page-content"><PageIntro eyebrow="A LITTLE ABOUT YOU" title="My profile">Keep your account details clear and up to date.</PageIntro>
    <div className="profile-layout"><div className="profile-main-card"><div className="profile-card-header"><div><h2>Personal information</h2><p>Your basic account details</p></div><span className="profile-edit-tag"><UserRound size={14}/> Account</span></div><div className="profile-hero"><div className="profile-avatar-large">{initials(name)}</div><div><h3>{name || 'MEDORA Member'}</h3><p>{email}</p><span className="member-since"><CheckCircle2 size={13}/> Demo account</span></div><Button variant="outline" size="small" onClick={() => notify({ kind: 'info', message: 'Profile photo upload is not enabled in this demo.' })}>Edit photo</Button></div><form className="profile-form" onSubmit={(e) => { e.preventDefault(); onSave({ name: name.trim(), email }); }}><label>Full name<input value={name} onChange={(e) => setName(e.target.value)} required minLength={2}/></label><label>Email address<input value={email} type="email" onChange={(e) => setEmail(e.target.value)} required disabled/></label><label>Account type<input value="Patient · Portfolio demo" disabled/></label><div className="profile-form-actions"><Button type="button" variant="ghost" onClick={() => { setName(user?.name || ''); notify({ kind: 'info', message: 'Changes reset.' }); }}>Cancel</Button><Button type="submit">Save changes <ArrowRight size={15}/></Button></div></form></div><aside className="profile-security-card"><div className="security-icon"><ShieldCheck size={23}/></div><h3>Your privacy matters</h3><p>MEDORA is a self-initiated portfolio concept. It is not connected to a real medical provider or electronic health record.</p><div className="security-list"><span><CheckCircle2 size={15}/> Sample data only</span><span><CheckCircle2 size={15}/> Local demo storage</span><span><CheckCircle2 size={15}/> No medical advice</span></div><button className="signout-link" onClick={onLogout}><LogOut size={15}/> Sign out of this demo</button></aside></div><DemoNotice/>
  </div>;
}
function HelpPage({ notify }) {
  return <div className="page-content"><PageIntro eyebrow="WE'RE HERE TO HELP" title="Help centre">A few useful notes for exploring the MEDORA concept.</PageIntro><div className="help-grid"><article><div className="help-card-icon"><CalendarCheck size={22}/></div><h3>Booking a visit</h3><p>Choose a doctor, select an available sample time and save the demo confirmation to your appointment list.</p></article><article><div className="help-card-icon"><FileHeart size={22}/></div><h3>Health records</h3><p>Records are fictional examples that demonstrate layout and navigation. You cannot upload clinical documents here.</p></article><article><div className="help-card-icon"><ShieldCheck size={22}/></div><h3>Privacy & safety</h3><p>Please do not enter real medical information. Authentication and storage are intended for local portfolio demonstration only.</p></article></div><div className="contact-panel"><div><div className="section-kicker">SEND A NOTE</div><h2>We'd love to hear from you.</h2><p>This form validates an example message locally; it does not send email.</p></div><ContactForm notify={notify}/></div><DemoNotice/></div>;
}
function ContactForm({ notify }) {
  const [form,setForm] = useState({ name:'', email:'', message:'' }); const [busy,setBusy]=useState(false); const [error,setError]=useState('');
  const submit=async(e)=>{e.preventDefault();setBusy(true);setError('');try{const r=await api('/api/contact',{method:'POST',body:JSON.stringify(form)});notify({kind:'info',message:r.message});setForm({name:'',email:'',message:''});}catch(err){setError(err.message);}finally{setBusy(false);}};
  return <form className="contact-form" onSubmit={submit}><label>Name<input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required minLength={2} placeholder="Your name"/></label><label>Email<input type="email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} required placeholder="you@example.com"/></label><label>Message<textarea value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})} required minLength={8} rows="3" placeholder="How can we help?"/></label>{error&&<div className="form-error">{error}</div>}<Button type="submit" disabled={busy}>{busy?'Checking…':'Validate message'} <ArrowRight size={15}/></Button></form>;
}
function BookingModal({ selectedDoctor, doctors, onClose, onBooked, notify }) {
  const [doctorId,setDoctorId] = useState(selectedDoctor?.id || doctors[0]?.id || '');
  const [date,setDate] = useState(todayISO());
  const [time,setTime] = useState('10:00 AM');
  const [type,setType] = useState(selectedDoctor?.mode?.includes('Video') && !selectedDoctor?.mode?.includes('In person') ? 'Video consultation' : 'In-person visit');
  const [reason,setReason] = useState('');
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const doctor = doctors.find((d) => d.id === doctorId) || selectedDoctor;
  useEffect(() => { if (selectedDoctor?.id) setDoctorId(selectedDoctor.id); }, [selectedDoctor]);
  const submit = async(e) => {
    e.preventDefault(); setBusy(true); setError('');
    try { const result = await api('/api/appointments',{method:'POST',body:JSON.stringify({doctorId,date,time,type,reason})}); onBooked(result.appointment); onClose(); notify({kind:'success',message:`Demo visit booked with ${doctor?.name || 'your doctor'}.`}); }
    catch(err) { setError(err.message); } finally { setBusy(false); }
  };
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e)=>{if(e.target===e.currentTarget)onClose();}}><section className="booking-modal" role="dialog" aria-modal="true" aria-labelledby="booking-title"><div className="modal-top"><div><div className="eyebrow"><span/> PLAN YOUR VISIT</div><h2 id="booking-title">Book an appointment</h2><p>Choose a time that works for you.</p></div><button className="icon-button" onClick={onClose} aria-label="Close booking"><X size={19}/></button></div><form onSubmit={submit}><label>Choose a doctor<select value={doctorId} onChange={(e)=>{setDoctorId(e.target.value);const d=doctors.find((x)=>x.id===e.target.value);if(d?.mode?.length===1)setType(d.mode[0]==='Video'?'Video consultation':'In-person visit');else setType('In-person visit');}} required>{doctors.map((d)=><option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>)}</select></label>{doctor&&<div className="booking-doctor-summary"><Avatar name={doctor.name} image={doctor.image}/><div><strong>{doctor.name}</strong><span>{doctor.specialty} · {doctor.experience}</span></div><div className="booking-fee"><strong>{money(doctor.fee)}</strong><span>sample fee</span></div></div>}<div className="form-columns"><label>Visit date<input type="date" min={todayISO()} value={date} onChange={(e)=>setDate(e.target.value)} required/></label><label>Visit type<select value={type} onChange={(e)=>setType(e.target.value)} required><option value="In-person visit" disabled={!doctor?.mode?.includes('In person')}>In-person visit</option><option value="Video consultation" disabled={!doctor?.mode?.includes('Video')}>Video consultation</option></select></label></div><div className="booking-time-label"><strong>Available times</strong><span>Local time · Sample slots</span></div><div className="time-slot-grid">{TIMES.map((slot)=> <button type="button" key={slot} className={`time-slot ${time===slot?'selected':''}`} onClick={()=>setTime(slot)}>{time===slot&&<Check size={13}/>} {slot}</button>)}</div><label>What would you like to discuss? <span className="optional-label">OPTIONAL</span><textarea value={reason} onChange={(e)=>setReason(e.target.value)} rows="2" maxLength={180} placeholder="Add a short note (please don't enter real health information)."/></label>{error&&<div className="form-error" role="alert">{error}</div>}<div className="booking-disclaimer"><ShieldCheck size={16}/><span>Demo booking only. No real appointment is created with a healthcare provider.</span></div><div className="modal-actions"><Button type="button" variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" disabled={busy}>{busy?'Saving…':'Confirm demo visit'} <ArrowRight size={15}/></Button></div></form></section></div>;
}
function DetailModal({ item, doctors, onClose, onBook, onCancel }) {
  if (!item) return null;
  const isAppointment = Boolean(item.doctorId);
  const doctor = isAppointment ? doctors.find((d)=>d.id===item.doctorId) : item;
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e)=>{if(e.target===e.currentTarget)onClose();}}><section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title"><div className="detail-top-actions"><span className="eyebrow"><span/>{isAppointment?'APPOINTMENT DETAILS':'CARE PROFESSIONAL'}</span><button className="icon-button" onClick={onClose} aria-label="Close details"><X size={19}/></button></div>{isAppointment ? <><div className="detail-doctor-header"><Avatar name={doctor?.name||'Care team'} image={doctor?.image} size="large"/><div><h2 id="detail-title">{doctor?.name||'Your care team'}</h2><p>{doctor?.specialty||'Consultation'}</p><span className={`status-tag ${item.status==='Upcoming'?'status-upcoming':item.status==='Completed'?'status-completed':'status-cancelled'}`}><span/>{item.status}</span></div></div><div className="detail-facts"><div><Calendar size={17}/><span>Date</span><strong>{formatDate(item.date,{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</strong></div><div><Clock3 size={17}/><span>Time</span><strong>{item.time}</strong></div><div><Video size={17}/><span>Visit type</span><strong>{item.type}</strong></div><div><ClipboardCheck size={17}/><span>Reference</span><strong className="reference-id">{item.id.toUpperCase()}</strong></div></div>{item.reason&&<div className="detail-reason"><span>NOTE</span><p>{item.reason}</p></div>}<div className="booking-disclaimer"><ShieldCheck size={16}/><span>This is a sample appointment from the portfolio demo, not a medical booking.</span></div><div className="modal-actions">{item.status==='Upcoming'&&<Button variant="outline" onClick={()=>{onCancel(item);onClose();}}>Cancel demo visit</Button>}<Button onClick={onClose}>Done</Button></div></> : <><div className="detail-doctor-header"><Avatar name={doctor?.name||'Doctor'} image={doctor?.image} size="large"/><div><h2 id="detail-title">{doctor?.name}</h2><p>{doctor?.specialty}</p><span className="doctor-rating"><Star size={13} fill="currentColor"/><strong>{doctor?.rating}</strong><span>({doctor?.reviews} sample reviews)</span></span></div></div><p className="detail-bio">{doctor?.bio}</p><div className="detail-facts"><div><ShieldCheck size={17}/><span>Experience</span><strong>{doctor?.experience}</strong></div><div><MapPin size={17}/><span>Location</span><strong>{doctor?.location}</strong></div><div><Clock3 size={17}/><span>Availability</span><strong>{doctor?.nextAvailable}</strong></div><div><Video size={17}/><span>Visit options</span><strong>{doctor?.mode?.join(' & ')}</strong></div></div><div className="doctor-detail-bottom"><div><strong>{money(doctor?.fee)}</strong><span> / sample visit fee</span></div><Button onClick={()=>{onClose();onBook(doctor);}}>Book a demo visit <ArrowRight size={15}/></Button></div><p className="small-disclaimer">Fictional healthcare professional. Ratings, qualifications and availability are illustrative sample data.</p></>}</section></div>;
}

export default function App() {
  const [user,setUser] = useState(null);
  const [authChecked,setAuthChecked] = useState(false);
  const [dashboard,setDashboard] = useState(null);
  const [doctors,setDoctors] = useState([]);
  const [loadingDoctors,setLoadingDoctors] = useState(true);
  const [activeView,setActiveViewState] = useState('overview');
  const [mobileOpen,setMobileOpen] = useState(false);
  const [bookingDoctor,setBookingDoctor] = useState(null);
  const [detailItem,setDetailItem] = useState(null);
  const [toast,setToast] = useState(null);
  const [showNotifications,setShowNotifications] = useState(false);
  const [loadError,setLoadError] = useState('');
  const notify = useCallback((value) => setToast(value), []);
  const closeToast = useCallback(() => setToast(null), []);
  const setActiveView = useCallback((view) => { window.__medoraView = view; setActiveViewState(view); }, []);
  const refreshDashboard = useCallback(async () => { try { const data = await api('/api/dashboard'); setDashboard(data); setUser(data.user); setLoadError(''); } catch (e) { setLoadError(e.message); } }, []);
  const loadDoctors = useCallback(async () => { setLoadingDoctors(true); try { const data = await api('/api/doctors'); setDoctors(data.doctors); } catch (e) { setLoadError(e.message); } finally { setLoadingDoctors(false); } }, []);
  useEffect(() => {
    window.__medoraView = 'overview';
    Promise.all([api('/api/session').then((r) => { if (r.authenticated) setUser(r.user); }).catch(() => setLoadError('Could not connect to the MEDORA API. Start the project using the README instructions.')), loadDoctors()]).finally(() => setAuthChecked(true));
  }, [loadDoctors]);
  useEffect(() => { if (user) refreshDashboard(); }, [user?.id, refreshDashboard]);
  useEffect(() => { if (!user) return; const onKey = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase()==='k') { e.preventDefault(); setActiveView('doctors'); setTimeout(()=>document.querySelector('.doctor-search-panel input')?.focus(),80); } if(e.key==='Escape'){setBookingDoctor(null);setDetailItem(null);setMobileOpen(false);} }; window.addEventListener('keydown',onKey); return ()=>window.removeEventListener('keydown',onKey); }, [user,setActiveView]);
  const signOut = async () => { try { await api('/api/auth/logout',{method:'POST',body:JSON.stringify({})}); } catch {} setUser(null); setDashboard(null); setActiveView('overview'); setMobileOpen(false); notify({kind:'success',message:'You have signed out of the demo.'}); };
  const onAuthenticated = (newUser) => { setUser(newUser); setActiveView('overview'); };
  const book = (doctor) => { setBookingDoctor(doctor || doctors[0] || null); if(!doctors.length){notify({kind:'error',message:'Doctor directory is still loading.'});return;} };
  const onBooked = async () => { await refreshDashboard(); };
  const cancelAppointment = async (appointment) => { if(!appointment?.id) return; try { await api(`/api/appointments/${appointment.id}/cancel`,{method:'PATCH'}); await refreshDashboard(); notify({kind:'success',message:'Demo appointment cancelled.'}); } catch(e) { notify({kind:'error',message:e.message}); } };
  const openDetails = (item) => { if(!item){notify({kind:'info',message:'Choose an appointment row to view its details.'});return;} setDetailItem(item); };
  const saveProfile = async ({name}) => { try { const result = await api('/api/profile',{method:'PATCH',body:JSON.stringify({name})}); setUser(result.user); await refreshDashboard(); notify({kind:'success',message:'Your demo profile name has been saved.'}); } catch (e) { notify({kind:'error',message:e.message}); } };
  const selectedSpecialty = window.__medoraSpecialty || null;
  useEffect(()=>{if(activeView==='doctors' && selectedSpecialty){window.__medoraSpecialty=null;}},[activeView,selectedSpecialty]);
  if (!authChecked) return <div className="app-loading"><Brand/><div className="loading-spinner"/><p>Preparing your care space…</p></div>;
  if (loadError && !user && !doctors.length) return <div className="fatal-screen"><div className="fatal-card"><Brand/><div className="fatal-icon"><Activity size={26}/></div><h1>We couldn't connect</h1><p>{loadError}</p><p>Open this project folder in a terminal and run <code>npm install</code>, then <code>npm run dev</code>.</p><Button onClick={()=>window.location.reload()}>Try again <ArrowRight size={15}/></Button></div></div>;
  if(!user) return <><LoginPage onAuthenticated={onAuthenticated} notify={notify}/><Toast toast={toast} onClose={closeToast}/></>;
  const viewContent = activeView === 'overview' ? <Overview user={user} dashboard={dashboard} doctors={doctors} onView={setActiveView} onBook={book} onDoctorDetails={setDetailItem} onAppointmentDetails={openDetails}/> : activeView === 'doctors' ? <DoctorsPage key="doctors" doctors={doctors} loading={loadingDoctors} onBook={book} onDetails={setDetailItem} initialSpecialty={selectedSpecialty}/> : activeView === 'appointments' ? <AppointmentsPage appointments={dashboard?.appointments||[]} doctors={doctors} onBook={book} onDetails={openDetails} onCancel={cancelAppointment}/> : activeView === 'records' ? <RecordsPage dashboard={dashboard}/> : activeView === 'profile' ? <ProfilePage user={user} onSave={saveProfile} onLogout={signOut} notify={notify}/> : <HelpPage notify={notify}/>;
  return <div className="app-shell"><Sidebar activeView={activeView} setActiveView={setActiveView} user={user} onLogout={signOut} mobileOpen={mobileOpen} closeMobile={()=>setMobileOpen(false)}/><main className="app-main"><Topbar user={user} onMenu={()=>setMobileOpen(true)} onNotifications={()=>setShowNotifications((v)=>!v)} setView={setActiveView}/>{showNotifications&&<div className="notifications-popover"><div className="popover-top"><strong>Notifications</strong><button onClick={()=>setShowNotifications(false)} aria-label="Close notifications"><X size={16}/></button></div><div className="notification-item"><div className="notification-mark"><CalendarCheck size={16}/></div><div><strong>Keep your care organized</strong><p>Any sample bookings will appear in Appointments.</p><span>Just now</span></div></div><div className="notification-item"><div className="notification-mark notification-purple"><ShieldCheck size={16}/></div><div><strong>Portfolio demo reminder</strong><p>Please use fictional data only.</p><span>For your safety</span></div></div></div>}{viewContent}<footer className="app-footer"><div><Brand compact/><span>Thoughtful care starts here.</span></div><div><span>© 2026 MEDORA Concept</span><span>Portfolio demonstration · Not a medical service</span></div></footer></main>{bookingDoctor&&<BookingModal key={bookingDoctor.id || 'new-booking'} selectedDoctor={bookingDoctor} doctors={doctors} onClose={()=>setBookingDoctor(null)} onBooked={onBooked} notify={notify}/ >}{detailItem&&<DetailModal item={detailItem} doctors={doctors} onClose={()=>setDetailItem(null)} onBook={book} onCancel={cancelAppointment}/>}<Toast toast={toast} onClose={closeToast}/></div>;
}
