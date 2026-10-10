import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || 4170);
const DATA_PATH = process.env.VERCEL ? path.join('/tmp', 'medora-data.json') : path.join(__dirname, 'data.json');
const COOKIE_NAME = 'medora_session';
const SESSION_TTL = 1000 * 60 * 60 * 24 * 7;
const SESSION_SECRET = process.env.SESSION_SECRET || 'medora-local-demo-secret-change-before-production';
const isProd = process.env.NODE_ENV === 'production';

app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});

const doctors = [
  { id: 'dr-olivia-bennett', name: 'Dr. Olivia Bennett', specialty: 'Cardiology', experience: '12 years experience', rating: 4.9, reviews: 128, fee: 850, nextAvailable: 'Today, 4:30 PM', location: 'Medora Care · Central', mode: ['In person', 'Video'], image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=480&q=85', initials: 'OB', color: 'lavender', bio: 'A calm, patient-first approach to heart health, prevention and long-term wellbeing.' },
  { id: 'dr-ethan-cole', name: 'Dr. Ethan Cole', specialty: 'Dermatology', experience: '9 years experience', rating: 4.8, reviews: 96, fee: 700, nextAvailable: 'Today, 5:15 PM', location: 'Medora Care · West', mode: ['In person', 'Video'], image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=480&q=85', initials: 'EC', color: 'blue', bio: 'Specializes in evidence-informed skin care and practical treatment planning.' },
  { id: 'dr-amara-wilson', name: 'Dr. Amara Wilson', specialty: 'General Physician', experience: '11 years experience', rating: 5.0, reviews: 154, fee: 550, nextAvailable: 'Tomorrow, 9:00 AM', location: 'Medora Care · Central', mode: ['In person', 'Video'], image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=480&q=85', initials: 'AW', color: 'peach', bio: 'Helps patients make sense of everyday health concerns with clear, compassionate care.' },
  { id: 'dr-noah-kim', name: 'Dr. Noah Kim', specialty: 'Orthopedics', experience: '14 years experience', rating: 4.9, reviews: 113, fee: 900, nextAvailable: 'Tomorrow, 10:30 AM', location: 'Medora Care · North', mode: ['In person'], image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=480&q=85', initials: 'NK', color: 'mint', bio: 'Focuses on movement, injury prevention and supporting patients in their return to daily activity.' },
  { id: 'dr-sophia-martin', name: 'Dr. Sophia Martin', specialty: 'Pediatrics', experience: '8 years experience', rating: 4.9, reviews: 87, fee: 650, nextAvailable: 'Wed, 11:00 AM', location: 'Medora Care · East', mode: ['In person', 'Video'], image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=480&q=85', initials: 'SM', color: 'rose', bio: 'Supports families with thoughtful, age-appropriate primary and preventive care.' },
  { id: 'dr-mateo-rivera', name: 'Dr. Mateo Rivera', specialty: 'Mental Wellness', experience: '10 years experience', rating: 4.8, reviews: 102, fee: 750, nextAvailable: 'Wed, 1:30 PM', location: 'Medora Care · Online', mode: ['Video'], image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=480&q=85', initials: 'MR', color: 'sage', bio: 'Creates a supportive space for conversations about stress, resilience and emotional wellbeing.' }
];

const now = new Date();
const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1);
const dateString = (date) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const addDays = (n) => { const d = new Date(); d.setDate(d.getDate()+n); return dateString(d); };
const hashPassword = (password, salt = crypto.randomBytes(16).toString('hex')) => ({ salt, hash: crypto.scryptSync(password, salt, 64).toString('hex') });
const verifyPassword = (password, salt, hash) => crypto.timingSafeEqual(Buffer.from(crypto.scryptSync(password, salt, 64).toString('hex'), 'hex'), Buffer.from(hash, 'hex'));
const demoPassword = hashPassword('MedoraDemo2026!');
const demoUser = { id: 'user-demo-medora', name: 'Alex Morgan', email: 'demo@medora.health', passwordSalt: demoPassword.salt, passwordHash: demoPassword.hash, createdAt: new Date().toISOString() };
const seedAppointments = [
  { id: 'apt-demo-1', userId: demoUser.id, doctorId: doctors[0].id, date: addDays(1), time: '10:30 AM', type: 'Video consultation', status: 'Upcoming', reason: 'Routine follow-up', createdAt: new Date().toISOString() },
  { id: 'apt-demo-2', userId: demoUser.id, doctorId: doctors[2].id, date: addDays(-12), time: '2:00 PM', type: 'In-person visit', status: 'Completed', reason: 'General consultation', createdAt: new Date(Date.now()-12*86400000).toISOString() }
];
const seedStore = () => ({ users: [demoUser], appointments: seedAppointments });
let store;
try {
  if (fs.existsSync(DATA_PATH)) store = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
  else { store = seedStore(); fs.writeFileSync(DATA_PATH, JSON.stringify(store, null, 2)); }
  if (!Array.isArray(store.users)) store.users = [];
  if (!Array.isArray(store.appointments)) store.appointments = [];
  if (!store.users.some((u) => u.email === demoUser.email)) store.users.push(demoUser);
  if (!store.appointments.some((a) => a.id === 'apt-demo-1')) store.appointments.push(...seedAppointments.filter((a) => !store.appointments.some((old) => old.id === a.id)));
  fs.writeFileSync(DATA_PATH, JSON.stringify(store, null, 2));
} catch (e) {
  console.error('Could not initialize local data store:', e.message);
  store = seedStore();
}
const saveStore = () => fs.writeFileSync(DATA_PATH, JSON.stringify(store, null, 2));
const sign = (value) => crypto.createHmac('sha256', SESSION_SECRET).update(value).digest('base64url');
const makeSession = (userId) => {
  const payload = `${userId}.${Date.now() + SESSION_TTL}`;
  return `${Buffer.from(payload).toString('base64url')}.${sign(payload)}`;
};
const readSession = (token) => {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  let payload;
  try { payload = Buffer.from(parts[0], 'base64url').toString(); } catch { return null; }
  if (sign(payload) !== parts[1]) return null;
  const splitAt = payload.lastIndexOf('.');
  if (splitAt < 0) return null;
  const userId = payload.slice(0, splitAt);
  const expiry = Number(payload.slice(splitAt + 1));
  if (!Number.isFinite(expiry) || expiry < Date.now()) return null;
  return store.users.find((u) => u.id === userId) || null;
};
const parseCookies = (header = '') => Object.fromEntries(header.split(';').map((part) => part.trim()).filter(Boolean).map((part) => {
  const index = part.indexOf('='); return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
}));
const setSessionCookie = (res, userId) => {
  const cookie = `${COOKIE_NAME}=${encodeURIComponent(makeSession(userId))}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_TTL / 1000}${isProd ? '; Secure' : ''}`;
  res.setHeader('Set-Cookie', cookie);
};
const clearSessionCookie = (res) => res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${isProd ? '; Secure' : ''}`);
const currentUser = (req) => readSession(parseCookies(req.headers.cookie)[COOKIE_NAME]);
const publicUser = (user) => ({ id: user.id, name: user.name, email: user.email });
const requireAuth = (req, res, next) => {
  const user = currentUser(req);
  if (!user) return res.status(401).json({ error: 'Please sign in to continue.' });
  req.user = user;
  next();
};
const validEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const safeDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T00:00:00`).getTime());

app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'MEDORA', mode: 'portfolio-demo' }));
app.get('/api/session', (req, res) => {
  const user = currentUser(req);
  res.json({ authenticated: Boolean(user), user: user ? publicUser(user) : null });
});
app.post('/api/auth/register', (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (name.length < 2 || name.length > 70) return res.status(400).json({ error: 'Please enter a name between 2 and 70 characters.' });
  if (!validEmail(email) || email.length > 254) return res.status(400).json({ error: 'Please enter a valid email address.' });
  if (password.length < 8 || password.length > 128) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  if (store.users.some((u) => u.email === email)) return res.status(409).json({ error: 'An account with this email already exists. Please sign in.' });
  const secrets = hashPassword(password);
  const user = { id: `user-${crypto.randomUUID()}`, name, email, passwordSalt: secrets.salt, passwordHash: secrets.hash, createdAt: new Date().toISOString() };
  store.users.push(user); saveStore(); setSessionCookie(res, user.id);
  res.status(201).json({ user: publicUser(user) });
});
app.post('/api/auth/login', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const user = store.users.find((u) => u.email === email);
  if (!user || !verifyPassword(password, user.passwordSalt, user.passwordHash)) return res.status(401).json({ error: 'Email or password is incorrect.' });
  setSessionCookie(res, user.id);
  res.json({ user: publicUser(user) });
});
app.post('/api/auth/demo', (_req, res) => {
  const user = store.users.find((u) => u.email === demoUser.email) || demoUser;
  setSessionCookie(res, user.id);
  res.json({ user: publicUser(user), demo: true });
});
app.post('/api/auth/logout', (_req, res) => { clearSessionCookie(res); res.json({ ok: true }); });
app.patch('/api/profile', requireAuth, (req, res) => {
  const name = String(req.body?.name || '').trim();
  if (name.length < 2 || name.length > 70) return res.status(400).json({ error: 'Please enter a name between 2 and 70 characters.' });
  req.user.name = name;
  saveStore();
  res.json({ user: publicUser(req.user) });
});
app.get('/api/doctors', (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase();
  const specialty = String(req.query.specialty || 'All specialties');
  const mode = String(req.query.mode || 'Any visit');
  let result = doctors.filter((doctor) => {
    const matchesQ = !q || `${doctor.name} ${doctor.specialty} ${doctor.bio}`.toLowerCase().includes(q);
    const matchesSpecialty = specialty === 'All specialties' || doctor.specialty === specialty;
    const matchesMode = mode === 'Any visit' || doctor.mode.some((m) => m.toLowerCase().includes(mode.toLowerCase()));
    return matchesQ && matchesSpecialty && matchesMode;
  });
  res.json({ doctors: result, total: result.length });
});
app.get('/api/dashboard', requireAuth, (req, res) => {
  const appointments = store.appointments.filter((a) => a.userId === req.user.id).sort((a,b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  const upcoming = appointments.filter((a) => a.status === 'Upcoming');
  const visits = appointments.filter((a) => a.status === 'Completed');
  res.json({
    user: publicUser(req.user),
    stats: { upcoming: upcoming.length, completed: visits.length, savedDoctors: 4, carePlan: 'On track' },
    appointments,
    records: [
      { id: 'rec-001', title: 'Annual wellness overview', category: 'Visit summary', date: addDays(-32), doctor: 'Dr. Amara Wilson', type: 'PDF summary', icon: 'file' },
      { id: 'rec-002', title: 'Complete blood count', category: 'Lab result', date: addDays(-68), doctor: 'Medora Diagnostics', type: 'Lab report', icon: 'activity' },
      { id: 'rec-003', title: 'Vaccination record', category: 'Immunization', date: addDays(-120), doctor: 'Medora Care Team', type: 'Health document', icon: 'shield' }
    ],
    wellness: [ { label: 'Sleep', value: '7h 40m', detail: 'Sample weekly average', progress: 82 }, { label: 'Movement', value: '6,240', detail: 'Sample daily steps', progress: 64 }, { label: 'Hydration', value: '6 / 8', detail: 'Sample glasses today', progress: 75 } ]
  });
});
app.get('/api/appointments', requireAuth, (req, res) => {
  const appointments = store.appointments.filter((a) => a.userId === req.user.id).sort((a,b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  res.json({ appointments: appointments.map((a) => ({ ...a, doctor: doctors.find((d) => d.id === a.doctorId) || null })) });
});
app.post('/api/appointments', requireAuth, (req, res) => {
  const doctor = doctors.find((d) => d.id === String(req.body?.doctorId || ''));
  const date = String(req.body?.date || '');
  const time = String(req.body?.time || '');
  const type = String(req.body?.type || 'Video consultation');
  const reason = String(req.body?.reason || '').trim().slice(0, 180);
  if (!doctor) return res.status(400).json({ error: 'Please choose a doctor from the list.' });
  if (!safeDate(date) || date < dateString(new Date())) return res.status(400).json({ error: 'Please choose today or a future date.' });
  if (!['9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','4:30 PM','5:00 PM','5:30 PM'].includes(time)) return res.status(400).json({ error: 'Please choose an available time slot.' });
  const normalizeMode = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (!doctor.mode.some((m) => normalizeMode(type).includes(normalizeMode(m)))) return res.status(400).json({ error: 'This doctor does not offer that visit type.' });
  const appointment = { id: `apt-${crypto.randomUUID()}`, userId: req.user.id, doctorId: doctor.id, date, time, type, status: 'Upcoming', reason, createdAt: new Date().toISOString() };
  store.appointments.push(appointment); saveStore();
  res.status(201).json({ appointment: { ...appointment, doctor }, confirmation: 'Your demo appointment has been saved to this local portfolio application.' });
});
app.patch('/api/appointments/:id/cancel', requireAuth, (req, res) => {
  const appointment = store.appointments.find((a) => a.id === req.params.id && a.userId === req.user.id);
  if (!appointment) return res.status(404).json({ error: 'Appointment not found.' });
  if (appointment.status !== 'Upcoming') return res.status(400).json({ error: 'Only upcoming demo appointments can be cancelled.' });
  appointment.status = 'Cancelled'; saveStore();
  res.json({ appointment });
});
app.post('/api/contact', (req, res) => {
  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim();
  const message = String(req.body?.message || '').trim();
  if (name.length < 2 || !validEmail(email) || message.length < 8) return res.status(400).json({ error: 'Please complete each field with valid details.' });
  res.status(201).json({ ok: true, message: 'Thank you. This is a portfolio demo, so your message was validated but not sent to an inbox.' });
});

const distPath = path.join(__dirname, '../public');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get(/.*/, (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});
export default app;

if (process.env.VERCEL !== '1') {
  app.listen(PORT, process.env.HOST || '127.0.0.1', () => {
    console.log(`\nMEDORA API listening on port ${PORT}`);
    console.log('Demo sign-in: choose “Explore interactive demo” on the login screen.');
    console.log('Portfolio demo only — do not enter real health information.\n');
  });
}
