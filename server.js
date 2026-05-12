require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

const PORT = 3737;
const DATA_DIR = path.join(__dirname, 'data');
const TASKS_FILE = path.join(DATA_DIR, 'tasks.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');
const GOOGLE_ACCOUNTS_FILE = path.join(DATA_DIR, 'google_accounts.json');
const PLANNER_FILE = path.join(DATA_DIR, 'planner.json');
const HOME_SETTINGS_FILE = path.join(DATA_DIR, 'home_settings.json');

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  'http://localhost:3737/api/google/callback'
);

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function readJSON(file, def = []) {
  try { return JSON.parse(fs.readFileSync(file, 'utf-8')); }
  catch { return def; }
}
function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf-8');
}
function serveFile(res, filePath, mime) {
  try {
    const data = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': mime });
    res.end(data);
  } catch {
    res.writeHead(404); res.end('Not found');
  }
}
function jsonRes(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}
function getBody(req) {
  return new Promise(resolve => {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve({}); } });
  });
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];
  const method = req.method;

  if (method === 'OPTIONS') { jsonRes(res, {}); return; }

  if (url.startsWith('/api/')) {
    if (url === '/api/tasks' && method === 'GET') {
      jsonRes(res, readJSON(TASKS_FILE));
    }
    else if (url === '/api/tasks' && method === 'POST') {
      const task = await getBody(req);
      const tasks = readJSON(TASKS_FILE);
      tasks.push(task);
      writeJSON(TASKS_FILE, tasks);
      jsonRes(res, tasks);
    }
    else if (url.match(/^\/api\/tasks\/\d+\/toggle$/) && method === 'POST') {
      const id = parseInt(url.split('/')[3]);
      const tasks = readJSON(TASKS_FILE);
      const t = tasks.find(t => t.id === id);
      if (t) t.done = !t.done;
      writeJSON(TASKS_FILE, tasks);
      jsonRes(res, tasks);
    }
    else if (url.match(/^\/api\/tasks\/\d+$/) && method === 'DELETE') {
      const id = parseInt(url.split('/')[3]);
      let tasks = readJSON(TASKS_FILE);
      tasks = tasks.filter(t => t.id !== id);
      writeJSON(TASKS_FILE, tasks);
      jsonRes(res, tasks);
    }
    else if (url.match(/^\/api\/tasks\/\d+$/) && method === 'PUT') {
      const id = parseInt(url.split('/')[3]);
      const updateData = await getBody(req);
      const tasks = readJSON(TASKS_FILE);
      const t = tasks.find(t => t.id === id);
      if (t) {
        if (updateData.title !== undefined) t.title = updateData.title;
        if (updateData.priority !== undefined) t.priority = updateData.priority;
      }
      writeJSON(TASKS_FILE, tasks);
      jsonRes(res, tasks);
    }
    else if (url === '/api/planner' && method === 'GET') {
      jsonRes(res, readJSON(PLANNER_FILE));
    }
    else if (url === '/api/home-settings' && method === 'GET') {
      jsonRes(res, readJSON(HOME_SETTINGS_FILE, { notes: '', gif: '' }));
    }
    else if (url === '/api/home-settings' && method === 'POST') {
      const data = await getBody(req);
      const current = readJSON(HOME_SETTINGS_FILE, { notes: '', gif: '' });
      if (data.notes !== undefined) current.notes = data.notes;
      if (data.gif !== undefined) current.gif = data.gif;
      writeJSON(HOME_SETTINGS_FILE, current);
      jsonRes(res, current);
    }
    else if (url === '/api/planner' && method === 'POST') {
      const task = await getBody(req);
      const tasks = readJSON(PLANNER_FILE);
      tasks.push(task);
      writeJSON(PLANNER_FILE, tasks);
      jsonRes(res, tasks);
    }
    else if (url.match(/^\/api\/planner\/\d+\/toggle$/) && method === 'POST') {
      const id = parseInt(url.split('/')[3]);
      const tasks = readJSON(PLANNER_FILE);
      const t = tasks.find(t => t.id === id);
      if (t) t.done = !t.done;
      writeJSON(PLANNER_FILE, tasks);
      jsonRes(res, tasks);
    }
    else if (url === '/api/planner' && method === 'DELETE') {
      writeJSON(PLANNER_FILE, []);
      jsonRes(res, []);
    }
    else if (url.match(/^\/api\/planner\/\d+$/) && method === 'PUT') {
      const id = parseInt(url.split('/')[3]);
      const updateData = await getBody(req);
      const tasks = readJSON(PLANNER_FILE);
      const t = tasks.find(t => t.id === id);
      if (t) {
        if (updateData.day !== undefined) t.day = updateData.day;
        if (updateData.shift !== undefined) t.shift = updateData.shift;
        if (updateData.title !== undefined) t.title = updateData.title;
      }
      writeJSON(PLANNER_FILE, tasks);
      jsonRes(res, tasks);
    }
    else if (url.match(/^\/api\/planner\/\d+$/) && method === 'DELETE') {
      const id = parseInt(url.split('/')[3]);
      let tasks = readJSON(PLANNER_FILE);
      tasks = tasks.filter(t => t.id !== id);
      writeJSON(PLANNER_FILE, tasks);
      jsonRes(res, tasks);
    }
    else if (url === '/api/sessions' && method === 'GET') {
      jsonRes(res, readJSON(SESSIONS_FILE));
    }
    else if (url === '/api/sessions' && method === 'POST') {
      const session = await getBody(req);
      const sessions = readJSON(SESSIONS_FILE);
      sessions.push(session);
      writeJSON(SESSIONS_FILE, sessions);
      jsonRes(res, sessions);
    }
    else if (url.match(/^\/api\/sessions\/\d+$/) && method === 'DELETE') {
      const id = parseInt(url.split('/')[3]);
      let sessions = readJSON(SESSIONS_FILE);
      sessions = sessions.filter(s => s.id !== id);
      writeJSON(SESSIONS_FILE, sessions);
      jsonRes(res, sessions);
    }
    else if (url === '/api/export' && method === 'GET') {
      jsonRes(res, {
        tasks: readJSON(TASKS_FILE),
        sessions: readJSON(SESSIONS_FILE),
        exportedAt: new Date().toISOString()
      });
    }
    else if (url === '/api/google/auth' && method === 'GET') {
      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['https://www.googleapis.com/auth/calendar.events', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
        prompt: 'consent'
      });
      res.writeHead(302, { Location: authUrl });
      res.end();
    }
    else if (url.startsWith('/api/google/callback') && method === 'GET') {
      const qs = new URL(req.url, `http://${req.headers.host}`).searchParams;
      const code = qs.get('code');
      if (code) {
        try {
          const { tokens } = await oauth2Client.getToken(code);
          oauth2Client.setCredentials(tokens);
          const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' });
          const userInfo = await oauth2.userinfo.get();
          const accounts = readJSON(GOOGLE_ACCOUNTS_FILE);
          const existingIdx = accounts.findIndex(a => a.email === userInfo.data.email);
          const accData = { email: userInfo.data.email, name: userInfo.data.name, picture: userInfo.data.picture, tokens: tokens };
          if (existingIdx >= 0) accounts[existingIdx] = accData;
          else accounts.push(accData);
          writeJSON(GOOGLE_ACCOUNTS_FILE, accounts);
          res.writeHead(302, { Location: '/?tab=config' });
          res.end();
        } catch (err) {
          res.writeHead(500); res.end('Auth error: ' + err.message);
        }
      } else {
        res.writeHead(400); res.end('No code');
      }
    }
    else if (url === '/api/google/accounts' && method === 'GET') {
      const accounts = readJSON(GOOGLE_ACCOUNTS_FILE).map(a => ({ email: a.email, name: a.name, picture: a.picture }));
      jsonRes(res, accounts);
    }
    else if (url.startsWith('/api/google/accounts/') && method === 'DELETE') {
      const email = decodeURIComponent(url.split('/')[4]);
      let accounts = readJSON(GOOGLE_ACCOUNTS_FILE);
      accounts = accounts.filter(a => a.email !== email);
      writeJSON(GOOGLE_ACCOUNTS_FILE, accounts);
      jsonRes(res, { success: true });
    }
    else if (url === '/api/google/sync' && method === 'POST') {
      const accounts = readJSON(GOOGLE_ACCOUNTS_FILE);
      if (accounts.length === 0) return jsonRes(res, { error: 'No accounts linked' }, 400);
      let tasks = readJSON(TASKS_FILE);
      let changes = 0;
      const defaultAcc = accounts[0];

      // PULL: Busca eventos do Google
      for (const acc of accounts) {
        const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
        auth.setCredentials(acc.tokens);
        const calendar = google.calendar({ version: 'v3', auth });
        const timeMin = new Date(); timeMin.setHours(0,0,0,0);
        const timeMax = new Date(); timeMax.setDate(timeMax.getDate() + 90);
        try {
          const apiRes = await calendar.events.list({
            calendarId: 'primary', timeMin: timeMin.toISOString(), timeMax: timeMax.toISOString(),
            singleEvents: true, orderBy: 'startTime'
          });
          const events = apiRes.data.items || [];
          for (const ev of events) {
            let task = tasks.find(t => t.googleEventId === ev.id);
            const evDate = ev.start.date || (ev.start.dateTime ? ev.start.dateTime.split('T')[0] : null);
            
            if (!task && evDate) {
              const isDone = ev.summary && ev.summary.startsWith('[CONCLUÍDO]');
              const cleanTitle = isDone ? ev.summary.replace('[CONCLUÍDO]', '').trim() : (ev.summary || 'Evento Google');
              task = {
                id: Date.now() + Math.floor(Math.random()*1000),
                title: cleanTitle, date: evDate, priority: 'media', note: 'Sync: ' + acc.email,
                done: isDone, createdAt: new Date().toISOString(), 
                googleEventId: ev.id, googleAccount: acc.email,
                isGoogleOnly: true // <--- Nova Flag
              };
              tasks.push(task);
              changes++;
            } else if (task && task.isGoogleOnly) {
                const isDone = ev.summary && ev.summary.startsWith('[CONCLUÍDO]');
                if (isDone !== task.done) { task.done = isDone; changes++; }
            }
          }
        } catch (e) { console.error('PULL Error', acc.email, e.message); }
      }
      
      // PUSH: Envia tarefas do App para o Google
      for (const t of tasks) {
        if (t.isGoogleOnly) continue; // Não envia de volta o que veio de lá
        
        const d = new Date(t.date); d.setHours(0,0,0,0);
        const today = new Date(); today.setHours(0,0,0,0);
        if (d >= today) {
          const targetAcc = accounts.find(a => a.email === t.googleAccount) || defaultAcc;
          const auth = new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
          auth.setCredentials(targetAcc.tokens);
          const calendar = google.calendar({ version: 'v3', auth });
          const summary = t.done ? '[CONCLUÍDO] ' + t.title : t.title;

          if (!t.googleEventId) {
            try {
              const ev = await calendar.events.insert({
                calendarId: 'primary',
                resource: { summary, start: { date: t.date }, end: { date: t.date } }
              });
              t.googleEventId = ev.data.id;
              t.googleAccount = targetAcc.email;
              changes++;
            } catch (e) { console.error('PUSH Create Error', e.message); }
          } else {
            try {
              const ev = await calendar.events.get({ calendarId: 'primary', eventId: t.googleEventId });
              if (ev.data.summary !== summary) {
                await calendar.events.patch({
                  calendarId: 'primary', eventId: t.googleEventId,
                  resource: { summary }
                });
                changes++;
              }
            } catch (e) { console.error('PUSH Update Error', e.message); }
          }
        }
      }

      if (changes > 0) writeJSON(TASKS_FILE, tasks);
      jsonRes(res, { success: true, changes, tasks });
    }
    else {
      jsonRes(res, { error: 'Not found' }, 404);
    }
    return;
  }

  let filePath = path.join(__dirname, 'public', url === '/' ? 'index.html' : url);
  const ext = path.extname(filePath);
  const mime = MIME[ext] || 'application/octet-stream';
  serveFile(res, filePath, mime);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('\n🚀 EstudaVitor rodando em http://localhost:3737');
  console.log('   Acesse pelo celular em http://<seu-ip>:3737');
  console.log('   Dados salvos em: ' + DATA_DIR + '\n');
});
