/*
 * AGV Task Portal: application logic (no build step, no dependencies).
 *
 * Data flow:
 *   data.js (published, read-only for everyone)
 *     -> Team Leader edits in Admin mode are kept as a local draft in this browser
 *     -> "Export data.js" downloads the updated file
 *     -> upload it to GitHub, and every team member sees the new version.
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------- storage (never throws)
  function storeFor(session) {
    try { return session ? window.sessionStorage : window.localStorage; } catch (e) { return null; }
  }
  const store = {
    get(k, session) { try { const s = storeFor(session); return s ? s.getItem(k) : null; } catch (e) { return null; } },
    set(k, v, session) { try { const s = storeFor(session); if (s) s.setItem(k, v); } catch (e) { /* ignore */ } },
    del(k, session) { try { const s = storeFor(session); if (s) s.removeItem(k); } catch (e) { /* ignore */ } }
  };
  const KEY = {
    draft: 'agvPortal.draft',
    admin: 'agvPortal.admin',
    member: 'agvPortal.member',
    view: 'agvPortal.view',
    theme: 'agvPortal.theme',
    collapsed: 'agvPortal.collapsed'
  };

  // ---------------------------------------------------------------- constants & helpers
  const STATUSES = [
    { id: 'todo', label: 'To Do' },
    { id: 'doing', label: 'In Progress' },
    { id: 'done', label: 'Done' }
  ];
  const STATUS_LABEL = { todo: 'To Do', doing: 'In Progress', done: 'Done' };
  const PRIORITY_LABEL = { high: 'High', normal: 'Normal', low: 'Low' };
  const VIEWS = ['board', 'timeline', 'schedule', 'team', 'docs'];

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const DAY_MS = 86400000;

  const parseDate = (s) => { const p = String(s).split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); };
  const toISO = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  const addDays = (iso, n) => { const d = parseDate(iso); d.setDate(d.getDate() + n); return toISO(d); };
  const diffDays = (a, b) => Math.round((parseDate(b) - parseDate(a)) / DAY_MS); // b - a, DST-safe
  const isValidISO = (s) => /^\d{4}-\d{2}-\d{2}$/.test(String(s)) && !isNaN(parseDate(s));
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const fmtShort = (iso) => { const d = parseDate(iso); return MONTHS[d.getMonth()] + ' ' + d.getDate(); };
  const fmtDay = (iso) => WEEKDAYS[parseDate(iso).getDay()] + ', ' + fmtShort(iso);
  const fmtLong = (iso) => fmtDay(iso) + ', ' + parseDate(iso).getFullYear();

  const params = new URLSearchParams(location.search);
  // ?date=YYYY-MM-DD lets you preview the portal "as of" another day.
  const TODAY = isValidISO(params.get('date')) ? params.get('date') : toISO(new Date());

  // ---------------------------------------------------------------- data
  const PUBLISHED = window.PORTAL_DATA;
  const app = $('#app');
  if (!PUBLISHED || !Array.isArray(PUBLISHED.tasks)) {
    app.innerHTML = '<div class="empty-state"><h2>Could not load data.js</h2><p>Check that <code>data.js</code> is next to <code>index.html</code> and contains valid JSON after <code>window.PORTAL_DATA =</code>.</p></div>';
    return;
  }

  let isAdmin = store.get(KEY.admin, true) === '1';
  let data = null;

  const state = {
    view: VIEWS.includes(params.get('view')) ? params.get('view') : (VIEWS.includes(store.get(KEY.view)) ? store.get(KEY.view) : 'board'),
    member: 'all',
    category: 'all',
    q: '',
    collapsed: new Set(safeParse(store.get(KEY.collapsed), []))
  };

  function safeParse(s, fallback) { try { const v = JSON.parse(s); return v == null ? fallback : v; } catch (e) { return fallback; } }

  function normalize(d) {
    d.project = d.project || {};
    d.members = d.members || [];
    d.categories = d.categories || [];
    d.groups = d.groups || [];
    d.phases = d.phases || [];
    d.milestones = d.milestones || [];
    d.tasks = (d.tasks || []).map((t) => Object.assign({ assignees: [], status: 'todo', priority: 'normal', description: '', deliverable: '', docLink: '' }, t));
    d.github = Object.assign({ orgName: '', orgUrl: '', uploadUrl: '', folderRoot: 'Mechanical', rule: '', repos: [], steps: [], readmeTemplate: '' }, d.github || {});
    return d;
  }

  // ---------------------------------------------------------------- GitHub documentation helpers
  const slug = (s) => {
    const full = String(s || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    // cut long names at a word boundary and drop a dangling "the/and/of…"
    if (full.length <= 40) return full;
    let cut = full.slice(0, 41).replace(/-[^-]*$/, '');
    while (/-(the|and|of|for|a|an|to|with)$/.test(cut)) cut = cut.replace(/-[^-]*$/, '');
    return cut;
  };
  const safeUrl = (u) => /^https:\/\//i.test(String(u || '')) ? String(u) : '';
  function taskFolder(t) {
    if (t.folder) return t.folder;
    const g = groupById(t.group);
    return [data.github.folderRoot, g.id + '_' + slug(g.short || g.title), t.code + '_' + slug(t.title)].filter(Boolean).join('/');
  }
  // Documentation state of a task: documented (has a GitHub link), missing (done/overdue without one), or "document as you go".
  function docInfo(t) {
    if (safeUrl(t.docLink)) return { cls: 'ok', text: 'On GitHub', state: 'ok' };
    if (t.status === 'done') return { cls: 'late', text: 'Not on GitHub', state: 'missing' };
    if (t.status === 'doing') return { cls: 'soon', text: 'Upload as you go', state: 'pending' };
    return null;
  }
  const uploadUrl = () => safeUrl(data.github.uploadUrl) || safeUrl(data.github.orgUrl);
  // Direct links into the task's pre-created folder in the mechanical repo (only when repoUrl is set).
  const folderPath = (t) => taskFolder(t).split('/').map(encodeURIComponent).join('/');
  const folderUrl = (t) => safeUrl(data.github.repoUrl) ? data.github.repoUrl.replace(/\/+$/, '') + '/tree/' + (data.github.branch || 'main') + '/' + folderPath(t) : '';
  const folderUploadUrl = (t) => safeUrl(data.github.repoUrl) ? data.github.repoUrl.replace(/\/+$/, '') + '/upload/' + (data.github.branch || 'main') + '/' + folderPath(t) : '';
  const ghMini = '<svg viewBox="0 0 16 16" width="11" height="11" aria-hidden="true"><path fill="currentColor" d="M8 0a8 8 0 00-2.53 15.59c.4.07.55-.17.55-.38v-1.34c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.89-1.17-.89-1.17-.73-.5.05-.49.05-.49.81.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 014 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 008 0z"/></svg>';

  function loadData() {
    data = normalize(clone(PUBLISHED));
    if (isAdmin) {
      const draft = safeParse(store.get(KEY.draft), null);
      if (draft && Array.isArray(draft.tasks)) {
        // If the published file already equals the draft, the draft has been published: drop it.
        if (JSON.stringify(normalize(clone(draft))) === JSON.stringify(data)) store.del(KEY.draft);
        else data = normalize(draft);
      }
    }
  }
  const hasDraft = () => !!store.get(KEY.draft);
  function commit(message) {
    data.project.lastUpdated = TODAY;
    store.set(KEY.draft, JSON.stringify(data));
    render();
    if (message) toast(message);
  }

  // lookups
  const memberById = (id) => data.members.find((m) => m.id === id) || { id: id, label: id, name: '', role: '' };
  const memberName = (m) => (m.name && m.name.trim()) || m.label || m.id;
  // Short chip label: first name, plus last-name initial when two members share a first name ("Ahmed A.").
  function memberShort(m) {
    const parts = (m.name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return m.id;
    const clash = data.members.some((o) => o.id !== m.id && (o.name || '').trim().split(/\s+/)[0] === parts[0]);
    return clash && parts.length > 1 ? parts[0] + ' ' + parts[parts.length - 1].charAt(0) + '.' : parts[0];
  }
  const groupById = (id) => data.groups.find((g) => g.id === id) || { id: id, title: id, short: id, category: '' };
  const catById = (id) => data.categories.find((c) => c.id === id) || { id: id, name: id, hue: 'blue' };
  const hueOfTask = (t) => catById(groupById(t.group).category).hue || 'blue';

  function codeKey(code) { return String(code).split('.').map((n) => String(parseInt(n, 10) || 0).padStart(4, '0')).join('.'); }
  function sortedTasks() {
    const gOrder = new Map(data.groups.map((g, i) => [g.id, i]));
    return data.tasks.slice().sort((a, b) =>
      ((gOrder.has(a.group) ? gOrder.get(a.group) : 999) - (gOrder.has(b.group) ? gOrder.get(b.group) : 999)) ||
      codeKey(a.code).localeCompare(codeKey(b.code)) || a.start.localeCompare(b.start));
  }
  function matches(t) {
    const q = state.q.trim().toLowerCase();
    if (state.member !== 'all' && !t.assignees.includes(state.member)) return false;
    if (state.category !== 'all' && groupById(t.group).category !== state.category) return false;
    if (q) {
      const g = groupById(t.group);
      const hay = [t.code, t.title, t.description, t.deliverable, g.id, g.title, g.short].concat(t.assignees.map((id) => memberName(memberById(id)))).join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }
  const visibleTasks = () => sortedTasks().filter(matches);

  function dueInfo(t) {
    if (t.status === 'done') return { cls: 'ok', text: 'Done', late: false };
    const d = diffDays(TODAY, t.due);
    if (d < 0) return { cls: 'late', text: 'Overdue ' + (-d) + 'd', late: true };
    if (d === 0) return { cls: 'soon', text: 'Due today', late: false };
    if (d <= 3) return { cls: 'soon', text: 'Due in ' + d + 'd', late: false };
    if (t.status === 'todo' && diffDays(TODAY, t.start) < 0) return { cls: 'soon', text: 'Should have started', late: false };
    return null;
  }

  // ---------------------------------------------------------------- chrome (header, filters, admin bar)
  function renderChrome() {
    const p = data.project;
    document.title = (p.name || 'AGV') + ' · Task Portal';
    $('#projectName').textContent = p.name || 'Task Portal';
    $('#projectSubtitle').textContent = p.subtitle || '';
    $('#lastUpdated').textContent = 'Last updated ' + (p.lastUpdated ? fmtLong(p.lastUpdated) : '—');
    $('#adminBtn').textContent = isAdmin ? 'Exit admin' : 'Team Leader';

    // filters
    const mf = $('#memberFilter');
    mf.innerHTML = '<option value="all">All members</option>' + data.members.map((m) =>
      '<option value="' + esc(m.id) + '">' + esc(memberName(m)) + (m.name ? ' (' + esc(m.label) + ')' : '') + '</option>').join('');
    if (state.member !== 'all' && !data.members.some((m) => m.id === state.member)) state.member = 'all';
    mf.value = state.member;
    const cf = $('#categoryFilter');
    cf.innerHTML = '<option value="all">All categories</option>' + data.categories.map((c) =>
      '<option value="' + esc(c.id) + '">' + esc(c.id + ' · ' + c.name) + '</option>').join('');
    cf.value = state.category;
    $$('.tabs [data-view]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.view === state.view)));

    renderStats();
    renderAdminBar();
  }

  function renderStats() {
    const all = data.tasks;
    const scope = state.member === 'all' ? all : all.filter((t) => t.assignees.includes(state.member));
    const done = scope.filter((t) => t.status === 'done').length;
    const doing = scope.filter((t) => t.status === 'doing').length;
    const late = scope.filter((t) => t.status !== 'done' && diffDays(TODAY, t.due) < 0).length;
    const pct = scope.length ? Math.round((done / scope.length) * 100) : 0;
    const weekEnd = addDays(TODAY, 6);
    const dueWeek = scope.filter((t) => t.status !== 'done' && t.due >= TODAY && t.due <= weekEnd).length;
    const nextMs = data.milestones.slice().sort((a, b) => a.date.localeCompare(b.date)).find((m) => m.date >= TODAY);
    const p = data.project;
    const totalDays = diffDays(p.start, p.end) + 1;
    const elapsed = Math.min(totalDays, Math.max(0, diffDays(p.start, TODAY) + 1));
    const who = state.member === 'all' ? 'Whole team' : memberName(memberById(state.member));
    let msHtml;
    if (nextMs) {
      const d = diffDays(TODAY, nextMs.date);
      msHtml = '<div class="k">Next milestone · ' + esc(nextMs.id) + '</div><div class="v">' + (d === 0 ? 'Today' : d + ' <small>days</small>') + '</div><div class="sub" title="' + esc(nextMs.title) + '">' + esc(fmtShort(nextMs.date)) + ' · ' + esc(nextMs.title) + '</div>';
    } else {
      msHtml = '<div class="k">Milestones</div><div class="v">All passed</div><div class="sub">Project end ' + esc(fmtShort(p.end)) + '</div>';
    }
    $('#stats').innerHTML =
      '<div class="stat"><div class="k">Progress · ' + esc(who) + '</div><div class="v">' + pct + '% <small>' + done + '/' + scope.length + ' done</small></div><div class="progress"><i style="width:' + pct + '%"></i></div></div>' +
      '<div class="stat"><div class="k">In progress / due in 7 days</div><div class="v">' + doing + ' <small>/ ' + dueWeek + '</small></div><div class="sub">' + (state.member === 'all' ? 'across all members' : 'assigned to ' + esc(who)) + '</div></div>' +
      '<div class="stat' + (late ? ' alert' : '') + '"><div class="k">Overdue</div><div class="v">' + late + '</div><div class="sub">' + (late ? 'needs attention' : 'nothing overdue') + '</div></div>' +
      '<div class="stat">' + msHtml + '</div>' +
      '<div class="stat" style="grid-column:1/-1;padding:8px 14px"><div class="k">Timeline · day ' + elapsed + ' of ' + totalDays + ' (' + esc(fmtShort(p.start)) + ' → ' + esc(fmtShort(p.end)) + ')</div><div class="progress"><i style="width:' + Math.round((elapsed / totalDays) * 100) + '%;background:var(--accent)"></i></div></div>';
  }

  function renderAdminBar() {
    const bar = $('#adminBar');
    if (!isAdmin) { bar.hidden = true; bar.innerHTML = ''; return; }
    bar.hidden = false;
    const dirty = hasDraft();
    bar.innerHTML = '<div class="wrap">' +
      '<span class="tag">Admin</span>' +
      '<span class="state">' + (dirty
        ? '<span class="dirty">● Unpublished changes</span> (saved in this browser only). Export data.js and upload it to GitHub to publish.'
        : 'In sync with the published version.') + '</span>' +
      '<button class="btn btn-primary btn-sm" data-act="new">+ New task</button>' +
      '<button class="btn btn-sm" data-act="export">Export data.js</button>' +
      '<button class="btn btn-sm" data-act="import">Import…</button>' +
      '<button class="btn btn-sm" data-act="settings">Project settings</button>' +
      (dirty ? '<button class="btn btn-sm" data-act="discard">Discard changes</button>' : '') +
      '</div>';
  }

  // ---------------------------------------------------------------- main render
  function render() {
    renderChrome();
    const tasks = visibleTasks();
    let html = githubReminder();
    if (data.project.announcement && state.view !== 'team' && state.view !== 'docs') {
      html += '<div class="announcement"><span aria-hidden="true">📌</span><p>' + esc(data.project.announcement) + '</p></div>';
    }
    html += '<div style="height:14px"></div>';
    if (state.view === 'board') html += renderBoard(tasks);
    else if (state.view === 'timeline') html += renderTimeline(tasks);
    else if (state.view === 'schedule') html += renderSchedule(tasks);
    else if (state.view === 'docs') html += renderDocs(tasks);
    else html += renderTeam();
    app.innerHTML = html;
    if (state.view === 'board' && isAdmin) wireDragAndDrop();
    if (state.view === 'timeline') scrollTimelineToToday();
  }

  // ---------------------------------------------------------------- GitHub reminder + docs view
  function githubReminder() {
    const gh = data.github, url = uploadUrl();
    if (!url && !gh.rule) return '';
    const scope = state.member === 'all' ? data.tasks : data.tasks.filter((t) => t.assignees.includes(state.member));
    const missing = scope.filter((t) => (docInfo(t) || {}).state === 'missing').length;
    const pending = scope.filter((t) => (docInfo(t) || {}).state === 'pending').length;
    const who = state.member === 'all' ? 'The team has' : 'You have';
    let status = '';
    if (missing) status = '<span class="badge late">' + who + ' ' + missing + ' finished task' + (missing === 1 ? '' : 's') + ' not on GitHub</span>';
    if (pending) status += '<span class="badge soon">' + pending + ' in progress: upload as you go</span>';
    if (!missing && !pending) {
      status = scope.some((t) => t.status !== 'todo')
        ? '<span class="badge ok">All started work is on GitHub</span>'
        : '<span class="badge info">No work started yet. When you start, upload the same day.</span>';
    }
    return '<div class="gh-reminder' + (missing ? ' urgent' : '') + '">' +
      '<div class="gh-icon" aria-hidden="true"><svg viewBox="0 0 16 16" width="22" height="22"><path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/></svg></div>' +
      '<div class="gh-text"><b>' + esc(gh.rule || 'Upload your work to GitHub and document it the same day.') + '</b><div class="gh-status">' + status + '</div></div>' +
      '<div class="gh-actions">' + (url ? '<a class="btn btn-primary btn-sm" href="' + esc(url) + '" target="_blank" rel="noopener">Open team GitHub ↗</a>' : '') +
      (state.view !== 'docs' ? '<button class="btn btn-sm" type="button" data-view="docs">How to document</button>' : '') + '</div></div>';
  }

  function renderDocs(tasks) {
    const gh = data.github;
    const started = tasks.filter((t) => t.status !== 'todo').sort((a, b) => a.due.localeCompare(b.due));
    const documented = started.filter((t) => safeUrl(t.docLink)).length;
    let html = '<div class="docs-grid">';
    html += '<section class="phase-card"><div class="phase-head hue-green"><span class="wk">Rule</span><h2>Document everything immediately</h2></div>' +
      '<ol class="docs-steps">' + gh.steps.map((s) => '<li>' + esc(s) + '</li>').join('') + '</ol></section>';
    html += '<section class="phase-card"><div class="phase-head hue-blue"><span class="wk">Links</span><h2>Team GitHub</h2></div><ul class="repo-list">' +
      gh.repos.map((r) => '<li>' + (safeUrl(r.url) ? '<a href="' + esc(r.url) + '" target="_blank" rel="noopener"><b>' + esc(r.name) + '</b> ↗</a>' : '<b>' + esc(r.name) + '</b>') + (r.purpose ? '<div class="small muted">' + esc(r.purpose) + '</div>' : '') + '</li>').join('') +
      '</ul><div class="readme-box"><div class="readme-head"><span class="small muted">README.md template for every task folder</span><button class="btn btn-sm" type="button" data-act="copy-readme">Copy template</button></div><pre>' + esc(gh.readmeTemplate) + '</pre></div></section>';
    html += '</div>';

    html += '<section class="phase-card"><div class="phase-head hue-rose"><span class="wk">Tracker</span><h2>Documentation status of started tasks</h2><span class="range">' + documented + ' / ' + started.length + ' documented</span></div>';
    if (!started.length) {
      html += '<div class="table-wrap"><p class="muted" style="padding:12px 16px">No task has started yet. As soon as a task is In Progress or Done it appears here, and it must have a GitHub link.</p></div>';
    } else {
      html += '<div class="table-wrap"><table class="sched"><thead><tr><th>Code</th><th>Task</th><th>Assigned</th><th>Status</th><th>GitHub</th></tr></thead><tbody>' +
        started.map((t) => {
          const di = docInfo(t);
          return '<tr class="hue-' + esc(hueOfTask(t)) + '" data-open="' + esc(t.id) + '"><td class="code">' + esc(t.code) + '</td><td>' + esc(t.title) + '<div class="small muted mono">' + esc(taskFolder(t)) + '</div></td>' +
            '<td><div class="who">' + chips(t.assignees) + '</div></td><td><span class="pill"><span class="dot st-' + esc(t.status) + '"></span>' + STATUS_LABEL[t.status] + '</span></td>' +
            '<td>' + (safeUrl(t.docLink) ? '<a class="badge ok" href="' + esc(t.docLink) + '" target="_blank" rel="noopener">Open ↗</a>' : '<span class="badge ' + di.cls + '">' + esc(di.text) + '</span>') + '</td></tr>';
        }).join('') + '</tbody></table></div>';
    }
    html += '</section>';

    html += '<section class="phase-card"><div class="phase-head hue-amber"><span class="wk">Checklists</span><h2>What to upload for each task type</h2></div><div class="checklists">' +
      data.groups.map((g) => '<div class="checklist hue-' + esc(catById(g.category).hue) + '"><h4><span class="code">' + esc(g.id) + '</span> ' + esc(g.short || g.title) + '</h4><ul>' + (g.docs || []).map((d) => '<li>' + esc(d) + '</li>').join('') + '</ul></div>').join('') +
      '</div></section>';
    return html;
  }

  function chips(ids) {
    return ids.map((id, i) => {
      const m = memberById(id);
      const cls = 'chip' + (i === 0 ? ' owner' : '') + (state.member === id ? ' me' : '');
      return '<span class="' + cls + '" title="' + esc(memberName(m) + (m.role ? ' · ' + m.role : '') + (i === 0 ? ' (owner)' : '')) + '">' + esc(memberShort(m)) + '</span>';
    }).join('');
  }

  // ---------------------------------------------------------------- board
  function renderBoard(tasks) {
    if (!data.tasks.length) return '<div class="empty-state">No tasks yet.' + (isAdmin ? ' Use “+ New task” to add one.' : '') + '</div>';
    return '<div class="board">' + STATUSES.map((s) => {
      const list = tasks.filter((t) => t.status === s.id);
      return '<section class="col" aria-label="' + s.label + '">' +
        '<header class="col-head"><span class="dot st-' + s.id + '"></span>' + s.label + '<span class="count">' + list.length + '</span></header>' +
        '<div class="col-body" data-drop="' + s.id + '">' + (list.map(cardHTML).join('') || '<p class="empty">' + (state.member !== 'all' || state.q || state.category !== 'all' ? 'No matching tasks' : 'Nothing here') + '</p>') + '</div>' +
        '</section>';
    }).join('') + '</div>' +
    (isAdmin ? '<p class="hint">Admin: drag cards between columns or use the status menu on each card.</p>' : '');
  }

  function cardHTML(t) {
    const g = groupById(t.group);
    const due = dueInfo(t);
    const di = docInfo(t);
    return '<article class="card hue-' + esc(hueOfTask(t)) + '" data-open="' + esc(t.id) + '" tabindex="0"' + (isAdmin ? ' draggable="true"' : '') + '>' +
      '<div class="card-top"><span class="code">' + esc(t.code) + '</span><span class="grp">' + esc(g.id + ' · ' + (g.short || g.title)) + '</span>' + (t.priority === 'high' ? '<span class="prio">High</span>' : '') + '</div>' +
      '<h3>' + esc(t.title) + '</h3>' +
      '<div class="card-meta"><span class="tnum">' + esc(fmtShort(t.start)) + ' → <b>' + esc(fmtShort(t.due)) + '</b></span>' + (due && t.status !== 'done' ? '<span class="badge ' + due.cls + '">' + esc(due.text) + '</span>' : '') + (di ? '<span class="badge ' + di.cls + '">' + ghMini + esc(di.text) + '</span>' : '') + '</div>' +
      '<div class="card-foot">' + chips(t.assignees) +
      (isAdmin ? '<select data-status-for="' + esc(t.id) + '" aria-label="Status">' + STATUSES.map((s) => '<option value="' + s.id + '"' + (s.id === t.status ? ' selected' : '') + '>' + s.label + '</option>').join('') + '</select>' : '') +
      '</div></article>';
  }

  function wireDragAndDrop() {
    $$('.card[draggable="true"]').forEach((card) => {
      card.addEventListener('dragstart', (e) => { card.classList.add('dragging'); e.dataTransfer.setData('text/plain', card.dataset.open); e.dataTransfer.effectAllowed = 'move'; });
      card.addEventListener('dragend', () => card.classList.remove('dragging'));
    });
    $$('.col-body[data-drop]').forEach((col) => {
      col.addEventListener('dragover', (e) => { e.preventDefault(); col.classList.add('drag-over'); });
      col.addEventListener('dragleave', (e) => { if (!col.contains(e.relatedTarget)) col.classList.remove('drag-over'); });
      col.addEventListener('drop', (e) => {
        e.preventDefault(); col.classList.remove('drag-over');
        setStatus(e.dataTransfer.getData('text/plain'), col.dataset.drop);
      });
    });
  }

  function setStatus(id, status) {
    const t = data.tasks.find((x) => x.id === id);
    if (!t || t.status === status) return;
    t.status = status;
    commit(t.code + ' → ' + STATUS_LABEL[status]);
  }

  // ---------------------------------------------------------------- timeline (Gantt)
  function renderTimeline(tasks) {
    const p = data.project;
    const start = p.start, days = diffDays(p.start, p.end) + 1;
    const narrow = window.innerWidth < 700;
    const dayW = narrow ? 24 : 30;
    const labelW = narrow ? 150 : 300;
    const x = (iso) => diffDays(start, iso) * dayW;
    const span = (a, b) => (diffDays(a, b) + 1) * dayW;
    const weekend = p.weekendDays || [5, 6];
    const visibleIds = new Set(tasks.map((t) => t.id));
    const filtering = state.member !== 'all' || state.category !== 'all' || state.q.trim();

    // header: phases
    let h = '<div class="g-row g-head"><div class="g-label">Phase</div><div class="g-track">' +
      data.phases.map((ph) => '<div class="g-phase hue-' + esc(ph.hue || 'blue') + '" style="left:' + (x(ph.start) + 2) + 'px;width:' + (span(ph.start, ph.end) - 4) + 'px" title="' + esc(ph.weeks + ': ' + ph.title + ' (' + fmtShort(ph.start) + ' – ' + fmtShort(ph.end) + ')') + '">' + esc(ph.weeks + ' · ' + ph.title) + '</div>').join('') +
      '</div></div>';

    // header: days
    let dayCells = '';
    for (let i = 0; i < days; i++) {
      const iso = addDays(start, i), d = parseDate(iso);
      const first = i === 0 || d.getDate() === 1;
      dayCells += '<div class="g-day' + (weekend.includes(d.getDay()) ? ' we' : '') + (iso === TODAY ? ' today' : '') + (first ? ' first' : '') + '" style="left:' + (i * dayW) + 'px">' +
        (first ? '<span class="mon">' + MONTHS[d.getMonth()] + '</span>' : '') +
        d.getDate() + '<small>' + WEEKDAYS[d.getDay()].charAt(0) + '</small></div>';
    }
    h += '<div class="g-row g-head g-days"><div class="g-label">Task</div><div class="g-track">' + dayCells + '</div></div>';

    // header: milestones
    h += '<div class="g-row g-head g-ms-row"><div class="g-label">Milestones</div><div class="g-track">' +
      data.milestones.map((m) => '<div class="g-ms" style="left:' + (x(m.date) + dayW) + 'px" title="' + esc(m.id + ' · ' + fmtLong(m.date) + ' · ' + m.title) + '"><span>' + esc(m.id) + '</span></div>').join('') +
      '</div></div>';

    // body
    let body = '';
    data.categories.forEach((c) => {
      const groups = data.groups.filter((g) => g.category === c.id);
      const catHasRows = groups.some((g) => data.tasks.some((t) => t.group === g.id && visibleIds.has(t.id)));
      if (filtering && !catHasRows) return;
      body += '<div class="g-row g-cat hue-' + esc(c.hue) + '"><div class="g-label">' + esc(c.id + ' · ' + c.name) + '</div><div class="g-track"></div></div>';
      groups.forEach((g) => {
        const all = sortedTasks().filter((t) => t.group === g.id);
        const shown = all.filter((t) => visibleIds.has(t.id));
        if (filtering && !shown.length) return;
        const collapsed = state.collapsed.has(g.id);
        const pct = all.length ? Math.round(all.filter((t) => t.status === 'done').length / all.length * 100) : 0;
        let sum = '';
        if (all.length) {
          const s = all.reduce((m, t) => (t.start < m ? t.start : m), all[0].start);
          const e = all.reduce((m, t) => (t.due > m ? t.due : m), all[0].due);
          sum = '<div class="g-sum" style="left:' + x(s) + 'px;width:' + span(s, e) + 'px" title="' + esc(g.id + ': ' + fmtShort(s) + ' – ' + fmtShort(e) + ' · ' + pct + '% done') + '"><i style="width:' + pct + '%"></i></div>';
        }
        body += '<div class="g-row g-group hue-' + esc(c.hue) + (collapsed ? ' collapsed' : '') + '" data-toggle="' + esc(g.id) + '" role="button" tabindex="0" aria-expanded="' + !collapsed + '">' +
          '<div class="g-label"><span class="caret">▾</span><span class="code">' + esc(g.id) + '</span><span class="t" title="' + esc(g.title) + '">' + esc(g.short || g.title) + '</span><span class="pct">' + pct + '%</span></div>' +
          '<div class="g-track">' + sum + '</div></div>';
        if (collapsed) return;
        (filtering ? shown : all).forEach((t) => {
          const due = dueInfo(t);
          const late = !!(due && due.late);
          const mine = state.member !== 'all' && t.assignees.includes(state.member);
          const who = t.assignees.map((id) => memberShort(memberById(id))).join(', ');
          body += '<div class="g-row g-task hue-' + esc(c.hue) + '" data-open="' + esc(t.id) + '" tabindex="0">' +
            '<div class="g-label"><span class="code">' + esc(t.code) + '</span><span class="t" title="' + esc(t.title) + '">' + esc(t.title) + '</span></div>' +
            '<div class="g-track"><div class="g-bar st-' + esc(t.status) + (late ? ' late' : '') + (mine ? ' me' : '') + '" style="left:' + x(t.start) + 'px;width:' + span(t.start, t.due) + 'px" title="' +
            esc(t.code + ' ' + t.title + '\n' + fmtShort(t.start) + ' → ' + fmtShort(t.due) + ' · ' + STATUS_LABEL[t.status] + '\n' + who) + '">' + esc(who) + '</div></div></div>';
        });
      });
    });
    if (!body) body = '<div class="g-row"><div class="g-label muted">No matching tasks</div><div class="g-track"></div></div>';

    // overlay: weekends, phase boundaries, milestone lines, today line
    let ov = '';
    for (let i = 0; i < days; i++) if (weekend.includes(parseDate(addDays(start, i)).getDay())) ov += '<div class="we" style="left:' + (i * dayW) + 'px"></div>';
    data.phases.slice(1).forEach((ph) => { ov += '<div class="phase-line" style="left:' + x(ph.start) + 'px"></div>'; });
    data.milestones.forEach((m) => { ov += '<div class="ms-line" style="left:' + (x(m.date) + dayW) + 'px"></div>'; });
    if (TODAY >= start && TODAY <= p.end) ov += '<div class="today-line" style="left:' + (x(TODAY) + dayW / 2 - 1) + 'px"></div>';

    const legend = '<div class="gantt-legend">' +
      '<span><i class="sw" style="background:color-mix(in srgb,var(--todo) 22%,var(--surface));box-shadow:inset 0 0 0 1px var(--todo)"></i>To Do</span>' +
      '<span><i class="sw" style="background:var(--doing)"></i>In Progress</span>' +
      '<span><i class="sw" style="background:var(--done)"></i>Done</span>' +
      '<span><i class="sw" style="box-shadow:inset 0 0 0 2px var(--danger)"></i>Overdue</span>' +
      '<span><i class="sw" style="background:var(--weekend);box-shadow:inset 0 0 0 1px var(--border)"></i>Weekend (' + weekend.map((d) => WEEKDAYS[d]).join('/') + ')</span>' +
      '<span class="spacer">Click a group to collapse · click a bar for details</span></div>';

    return legend + '<div class="gantt-scroll" id="ganttScroll"><div class="gantt" style="--day-w:' + dayW + 'px;--label-w:' + labelW + 'px;--days:' + days + '">' +
      h + '<div class="g-body" style="position:relative"><div class="g-overlay">' + ov + '</div>' + body + '</div></div></div>' +
      '<div style="height:14px"></div>' + milestoneList();
  }

  function milestoneList() {
    return '<div class="phase-card"><div class="phase-head hue-rose"><span class="wk">Milestones</span><h2>Key deadlines</h2></div><div class="table-wrap"><table class="sched"><thead><tr><th>ID</th><th>Deadline</th><th>Milestone</th><th>Days left</th></tr></thead><tbody>' +
      data.milestones.slice().sort((a, b) => a.date.localeCompare(b.date)).map((m) => {
        const d = diffDays(TODAY, m.date);
        return '<tr style="cursor:default"><td class="code" style="--c:var(--danger)">' + esc(m.id) + '</td><td class="date deadline">' + esc(fmtLong(m.date)) + '</td><td>' + esc(m.title) + '</td><td class="tnum">' + (d < 0 ? '<span class="badge info">passed</span>' : d === 0 ? '<span class="badge soon">today</span>' : d) + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';
  }

  function scrollTimelineToToday() {
    const sc = $('#ganttScroll'), line = $('.today-line');
    if (!sc || !line) return;
    const labelW = parseInt(getComputedStyle($('.gantt')).getPropertyValue('--label-w'), 10) || 0;
    // put "today" about a third of the way into the visible (non-sticky) track area
    const target = line.offsetLeft - (sc.clientWidth - labelW) / 3;
    sc.scrollLeft = Math.max(0, target);
  }

  // ---------------------------------------------------------------- weekly schedule
  function renderSchedule(tasks) {
    const phases = data.phases;
    const inPhase = (t, ph) => t.due >= ph.start && t.due <= ph.end;
    const orphan = tasks.filter((t) => !phases.some((ph) => inPhase(t, ph)));
    let html = '<div class="gantt-legend"><span>Tasks are listed under the phase in which their <b>deadline</b> falls.</span><span class="spacer"><button class="btn btn-sm" type="button" data-act="print">Print / Save as PDF</button></span></div>';
    phases.forEach((ph) => {
      const list = tasks.filter((t) => inPhase(t, ph)).sort((a, b) => a.due.localeCompare(b.due) || codeKey(a.code).localeCompare(codeKey(b.code)));
      const ms = data.milestones.filter((m) => m.date >= ph.start && m.date <= ph.end);
      html += '<section class="phase-card"><div class="phase-head hue-' + esc(ph.hue || 'blue') + '"><span class="wk">' + esc(ph.weeks) + '</span><h2>' + esc(ph.title) + '</h2><span class="range">' + esc(fmtDay(ph.start)) + ' – ' + esc(fmtDay(ph.end)) + ' · ' + (diffDays(ph.start, ph.end) + 1) + ' days</span></div>' +
        (ph.goals && ph.goals.length ? '<ul class="phase-goals">' + ph.goals.map((g) => '<li>' + esc(g) + '</li>').join('') + '</ul>' : '') +
        ms.map((m) => '<div class="ms-note">' + esc(m.id) + ' · ' + esc(fmtDay(m.date)) + ': ' + esc(m.title) + '</div>').join('') +
        scheduleTable(list) + '</section>';
    });
    if (orphan.length) html += '<section class="phase-card"><div class="phase-head"><span class="wk">Outside phases</span><h2>Other tasks</h2></div>' + scheduleTable(orphan) + '</section>';
    return html;
  }

  function scheduleTable(list) {
    if (!list.length) return '<div class="table-wrap"><p class="muted" style="padding:12px 16px">No matching tasks in this phase.</p></div>';
    return '<div class="table-wrap"><table class="sched"><thead><tr><th>Code</th><th>Task</th><th>Assigned</th><th>Start</th><th>Deadline</th><th>Status</th></tr></thead><tbody>' +
      list.map((t) => {
        const due = dueInfo(t);
        return '<tr class="hue-' + esc(hueOfTask(t)) + '" data-open="' + esc(t.id) + '"><td class="code">' + esc(t.code) + '</td><td>' + esc(t.title) + '<div class="small muted">' + esc(groupById(t.group).short || '') + (t.deliverable ? ' · ' + esc(t.deliverable) : '') + '</div></td>' +
          '<td><div class="who">' + chips(t.assignees) + '</div></td><td class="date">' + esc(fmtDay(t.start)) + '</td><td class="date deadline">' + esc(fmtDay(t.due)) + '</td>' +
          '<td><span class="pill"><span class="dot st-' + esc(t.status) + '"></span>' + STATUS_LABEL[t.status] + '</span>' + (due && t.status !== 'done' ? ' <span class="badge ' + due.cls + '">' + esc(due.text) + '</span>' : '') +
          (docInfo(t) ? ' <span class="badge ' + docInfo(t).cls + '">' + ghMini + esc(docInfo(t).text) + '</span>' : '') + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  // ---------------------------------------------------------------- team
  function renderTeam() {
    let html = '<div class="gantt-legend"><span>' + (isAdmin
      ? 'Admin: type real names/roles below to map the placeholders. Remember the published site is public.'
      : 'Pick yourself in the <b>Member</b> filter (or open your personal link) to highlight your tasks everywhere.') + '</span></div>';
    html += '<div class="team-grid">' + data.members.map((m) => {
      const mine = sortedTasks().filter((t) => t.assignees.includes(m.id)).sort((a, b) => a.due.localeCompare(b.due));
      const done = mine.filter((t) => t.status === 'done').length;
      const owned = mine.filter((t) => t.assignees[0] === m.id).length;
      const next = mine.find((t) => t.status !== 'done');
      const late = mine.filter((t) => t.status !== 'done' && diffDays(TODAY, t.due) < 0).length;
      const undocumented = mine.filter((t) => (docInfo(t) || {}).state === 'missing').length;
      return '<article class="member' + (state.member === m.id ? ' me' : '') + '">' +
        '<div class="member-head"><div class="avatar">' + esc(m.id) + '</div><div class="who"><h3>' + esc(memberName(m)) + (m.name ? ' <span class="small muted">' + esc(m.label) + '</span>' : '') + '</h3><div class="role">' + esc(m.role || '—') + '</div></div></div>' +
        (isAdmin ? '<div class="member-edit"><input data-member-field="name" data-member="' + esc(m.id) + '" placeholder="Real name for ' + esc(m.label) + '" value="' + esc(m.name || '') + '" aria-label="Name for ' + esc(m.label) + '"><input data-member-field="role" data-member="' + esc(m.id) + '" placeholder="Role" value="' + esc(m.role || '') + '" aria-label="Role for ' + esc(m.label) + '"></div>' : '') +
        '<div class="member-stats"><span><b>' + mine.length + '</b> tasks</span><span><b>' + owned + '</b> as owner</span><span><b>' + done + '</b> done</span>' + (late ? '<span class="badge late">' + late + ' overdue</span>' : '') + (undocumented ? '<span class="badge late">' + ghMini + ' ' + undocumented + ' not on GitHub</span>' : '') + '</div>' +
        (next ? '<div class="small">Next deadline: <b>' + esc(fmtDay(next.due)) + '</b> · ' + esc(next.code + ' ' + next.title) + '</div>' : '<div class="small muted">No open tasks</div>') +
        '<ul>' + mine.map((t) => '<li class="hue-' + esc(hueOfTask(t)) + '" data-open="' + esc(t.id) + '"><span class="dot st-' + esc(t.status) + '"></span><span class="code">' + esc(t.code) + '</span><span class="t" title="' + esc(t.title) + '">' + esc(t.title) + '</span><span class="d">' + esc(fmtShort(t.due)) + '</span></li>').join('') + '</ul>' +
        '<div class="member-actions"><button class="btn btn-sm" type="button" data-show-member="' + esc(m.id) + '">Show on board</button><button class="btn btn-sm" type="button" data-copy-link="' + esc(m.id) + '">Copy personal link</button></div>' +
        '</article>';
    }).join('') + '</div>';
    return html;
  }

  // ---------------------------------------------------------------- modal
  const modal = $('#modal'), modalBody = $('#modalBody');
  let lastFocus = null;
  function openModal(html) {
    lastFocus = document.activeElement;
    modalBody.innerHTML = html;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    const f = modalBody.querySelector('input:not([type=hidden]), textarea, select, button');
    (f || $('.modal-x')).focus();
  }
  function closeModal() {
    modal.hidden = true;
    modalBody.innerHTML = '';
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function openTask(id) {
    const t = data.tasks.find((x) => x.id === id);
    if (!t) return;
    const g = groupById(t.group), c = catById(g.category);
    const due = dueInfo(t);
    const dur = diffDays(t.start, t.due) + 1;
    openModal('<div class="hue-' + esc(c.hue) + '">' +
      '<div class="detail-top"><span class="code">' + esc(t.code) + '</span><span>' + esc(c.id + ' · ' + c.name) + '</span><span>›</span><span>' + esc(g.id + ' · ' + (g.short || '')) + '</span></div>' +
      '<h2 id="modalTitle">' + esc(t.title) + '</h2>' +
      '<div class="detail-top" style="margin-top:10px"><span class="pill"><span class="dot st-' + esc(t.status) + '"></span>' + STATUS_LABEL[t.status] + '</span>' + (due && t.status !== 'done' ? '<span class="badge ' + due.cls + '">' + esc(due.text) + '</span>' : '') + (t.priority === 'high' ? '<span class="prio">High priority</span>' : '<span class="small">' + esc(PRIORITY_LABEL[t.priority] || '') + ' priority</span>') + '</div>' +
      '<div class="detail-grid"><div><div class="k">Start</div><div class="v">' + esc(fmtDay(t.start)) + '</div></div><div><div class="k">Deadline</div><div class="v">' + esc(fmtDay(t.due)) + '</div></div><div><div class="k">Duration</div><div class="v">' + dur + ' day' + (dur === 1 ? '' : 's') + '</div></div></div>' +
      (t.description ? '<div class="detail-sec"><h4>What to do</h4><p>' + esc(t.description) + '</p></div>' : '') +
      (t.deliverable ? '<div class="detail-sec"><h4>Deliverable</h4><p>' + esc(t.deliverable) + '</p></div>' : '') +
      '<div class="detail-sec"><h4>Assigned to</h4><div class="people">' + (t.assignees.length ? t.assignees.map((mid, i) => {
        const m = memberById(mid);
        return '<div class="person"><span class="chip' + (state.member === mid ? ' me' : '') + '">' + esc(m.id) + '</span><b>' + esc(memberName(m)) + '</b>' + (i === 0 ? '<span class="badge info">owner</span>' : '') + '<span class="role">' + esc(m.role || '') + '</span></div>';
      }).join('') : '<span class="muted">Unassigned</span>') + '</div></div>' +
      '<div class="detail-sec"><h4>Parent task</h4><p class="muted">' + esc(g.id + ': ' + g.title) + '</p></div>' +
      '<div class="detail-sec doc-sec"><h4>' + ghMini + ' Document on GitHub (same day!)</h4>' +
      (safeUrl(t.docLink)
        ? '<p><a class="badge ok" href="' + esc(t.docLink) + '" target="_blank" rel="noopener">Open the uploaded work ↗</a></p>'
        : '<p class="small">' + (t.status === 'done' ? '<span class="badge late">Marked done but not on GitHub yet: upload it now.</span>' : 'Upload your files as soon as you produce them, not at the end.') + '</p>') +
      '<div class="small muted" style="margin-top:6px">Suggested folder</div><div class="linkbox" style="margin-top:4px"><input readonly class="mono" value="' + esc(taskFolder(t)) + '" aria-label="Suggested GitHub folder"><button class="btn btn-sm" type="button" data-act="copy-folder" data-id="' + esc(t.id) + '">Copy</button></div>' +
      ((g.docs || []).length ? '<div class="small muted" style="margin-top:8px">Upload at least</div><ul class="doc-list">' + g.docs.map((d) => '<li>' + esc(d) + '</li>').join('') + '<li>README.md in the folder (template in <b>GitHub &amp; Docs</b>)</li></ul>' : '') +
      '<div class="gh-actions" style="margin-top:10px">' +
      (folderUploadUrl(t) ? '<a class="btn btn-primary btn-sm" href="' + esc(folderUploadUrl(t)) + '" target="_blank" rel="noopener">Upload to my task folder ↗</a><a class="btn btn-sm" href="' + esc(folderUrl(t)) + '" target="_blank" rel="noopener">Open folder ↗</a>'
        : (uploadUrl() ? '<a class="btn btn-sm" href="' + esc(uploadUrl()) + '" target="_blank" rel="noopener">Open team GitHub ↗</a>' : '')) +
      '</div></div>' +
      (isAdmin ? '<div class="modal-actions"><button class="btn btn-danger left" type="button" data-act="delete" data-id="' + esc(t.id) + '">Delete</button><button class="btn" type="button" data-act="duplicate" data-id="' + esc(t.id) + '">Duplicate</button><button class="btn btn-primary" type="button" data-act="edit" data-id="' + esc(t.id) + '">Edit task</button></div>' : '') +
      '</div>');
  }

  function nextCode(groupId) {
    const nums = data.tasks.filter((t) => t.group === groupId).map((t) => parseInt(String(t.code).split('.')[1], 10) || 0);
    const gnum = String(groupId).replace(/\D/g, '') || '0';
    return gnum + '.' + ((nums.length ? Math.max.apply(null, nums) : 0) + 1);
  }

  function openEditor(id, template) {
    const existing = id ? data.tasks.find((x) => x.id === id) : null;
    const g0 = data.groups[0] ? data.groups[0].id : '';
    const t = existing ? clone(existing) : Object.assign({
      id: '', group: g0, code: nextCode(g0), title: '', description: '', deliverable: '',
      assignees: state.member !== 'all' ? [state.member] : [], start: TODAY < data.project.start ? data.project.start : TODAY,
      due: addDays(TODAY < data.project.start ? data.project.start : TODAY, 6), status: 'todo', priority: 'normal'
    }, template || {});
    openModal('<h2 id="modalTitle">' + (existing ? 'Edit task ' + esc(t.code) : 'New task') + '</h2>' +
      '<form class="form" id="taskForm" novalidate>' +
      '<label>Parent task<select name="group">' + data.groups.map((g) => '<option value="' + esc(g.id) + '"' + (g.id === t.group ? ' selected' : '') + '>' + esc(g.id + ' · ' + (g.short || g.title)) + '</option>').join('') + '</select></label>' +
      '<label>Code<input name="code" value="' + esc(t.code) + '" placeholder="e.g. 1.6" required></label>' +
      '<label class="full">Title<input name="title" value="' + esc(t.title) + '" placeholder="Short, action-oriented title" required></label>' +
      '<label class="full">Description<textarea name="description" placeholder="What exactly needs to be done?">' + esc(t.description) + '</textarea></label>' +
      '<label class="full">Deliverable<input name="deliverable" value="' + esc(t.deliverable) + '" placeholder="What proves the task is done?"></label>' +
      '<label class="full">GitHub link to the uploaded work (folder or commit)<input name="docLink" type="url" value="' + esc(t.docLink) + '" placeholder="https://github.com/Graduation-Project-2027/…"></label>' +
      '<label>Start<input type="date" name="start" value="' + esc(t.start) + '" required></label>' +
      '<label>Deadline<input type="date" name="due" value="' + esc(t.due) + '" required></label>' +
      '<label>Status<select name="status">' + STATUSES.map((s) => '<option value="' + s.id + '"' + (s.id === t.status ? ' selected' : '') + '>' + s.label + '</option>').join('') + '</select></label>' +
      '<label>Priority<select name="priority">' + Object.keys(PRIORITY_LABEL).map((k) => '<option value="' + k + '"' + (k === t.priority ? ' selected' : '') + '>' + PRIORITY_LABEL[k] + '</option>').join('') + '</select></label>' +
      '<div class="full"><div class="small muted" style="font-weight:600;margin-bottom:4px">Assigned to <span style="font-weight:400">(first ticked = owner)</span></div><div class="assignee-picker">' +
      data.members.map((m) => '<label title="' + esc(memberName(m) + (m.role ? ' · ' + m.role : '')) + '"><input type="checkbox" name="assignees" value="' + esc(m.id) + '"' + (t.assignees.includes(m.id) ? ' checked' : '') + '>' + esc(memberShort(m)) + '</label>').join('') +
      '</div><div class="small muted" id="ownerHint" style="margin-top:4px"></div></div>' +
      '<div class="form-error" id="formError" hidden></div>' +
      '<div class="modal-actions full"><button class="btn left" type="button" data-close>Cancel</button><button class="btn btn-primary" type="submit">' + (existing ? 'Save changes' : 'Add task') + '</button></div>' +
      '</form>');

    const form = $('#taskForm');
    // keep assignee order: previously-assigned first (owner stays owner), newly ticked appended
    let order = t.assignees.slice();
    const ownerHint = () => { $('#ownerHint').textContent = order.length ? 'Owner: ' + memberName(memberById(order[0])) : 'No one assigned yet'; };
    ownerHint();
    $$('input[name=assignees]', form).forEach((cb) => cb.addEventListener('change', () => {
      order = order.filter((x) => x !== cb.value);
      if (cb.checked) order.push(cb.value);
      ownerHint();
    }));
    if (!existing) form.group.addEventListener('change', () => { form.code.value = nextCode(form.group.value); });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const f = form.elements;
      const rec = {
        id: existing ? existing.id : 't' + Date.now().toString(36),
        group: f.group.value, code: f.code.value.trim(), title: f.title.value.trim(),
        description: f.description.value.trim(), deliverable: f.deliverable.value.trim(), docLink: f.docLink.value.trim(),
        assignees: order.slice(), start: f.start.value, due: f.due.value, status: f.status.value, priority: f.priority.value
      };
      const err = !rec.title ? 'Title is required.' : !rec.code ? 'Code is required.' :
        rec.docLink && !safeUrl(rec.docLink) ? 'GitHub link must start with https://' :
        !isValidISO(rec.start) || !isValidISO(rec.due) ? 'Start and deadline dates are required.' :
        rec.due < rec.start ? 'Deadline must be on or after the start date.' :
        data.tasks.some((x) => x.code === rec.code && x.id !== rec.id) ? 'Another task already uses code ' + rec.code + '.' : '';
      if (err) { const el = $('#formError'); el.textContent = err; el.hidden = false; return; }
      if (existing) Object.assign(existing, rec); else data.tasks.push(rec);
      closeModal();
      commit(existing ? 'Saved ' + rec.code : 'Added ' + rec.code);
    });
  }

  function deleteTask(id) {
    const t = data.tasks.find((x) => x.id === id);
    if (!t) return;
    openModal('<h2 id="modalTitle">Delete task ' + esc(t.code) + '?</h2><p style="margin-top:10px">“' + esc(t.title) + '” will be removed from your local draft. Nothing changes for the team until you export and publish data.js.</p>' +
      '<div class="modal-actions"><button class="btn left" type="button" data-close>Cancel</button><button class="btn btn-primary" style="background:var(--danger);border-color:var(--danger)" type="button" data-act="confirm-delete" data-id="' + esc(id) + '">Delete task</button></div>');
  }

  // ---------------------------------------------------------------- admin: login, export, import, settings
  async function sha256(text) {
    if (!(window.crypto && crypto.subtle)) throw new Error('no-subtle');
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  function openLogin() {
    openModal('<h2 id="modalTitle">Team Leader login</h2>' +
      '<p class="muted" style="margin-top:6px">Admin mode lets you add, edit, delete and assign tasks. Changes stay in this browser until you export <code>data.js</code> and upload it to GitHub.</p>' +
      '<form class="form" id="loginForm"><label class="full">Passcode<input type="password" name="pass" autocomplete="current-password" required></label>' +
      '<div class="form-error" id="formError" hidden></div>' +
      '<div class="modal-actions full"><button class="btn left" type="button" data-close>Cancel</button><button class="btn btn-primary" type="submit">Enter admin mode</button></div></form>');
    $('#loginForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const err = $('#formError');
      try {
        const h = await sha256(e.target.pass.value);
        if (h !== PUBLISHED.project.adminPasscodeHash && h !== data.project.adminPasscodeHash) { err.textContent = 'Wrong passcode.'; err.hidden = false; return; }
      } catch (x) { err.textContent = 'This browser blocks secure hashing here. Open the site over https (GitHub Pages) or localhost.'; err.hidden = false; return; }
      isAdmin = true;
      store.set(KEY.admin, '1', true);
      closeModal();
      loadData();
      render();
      toast('Admin mode on');
    });
  }

  function exitAdmin() {
    isAdmin = false;
    store.del(KEY.admin, true);
    loadData();
    render();
    toast(hasDraft() ? 'Admin mode off (your draft is kept in this browser)' : 'Admin mode off');
  }

  function buildDataFile() {
    const header = [
      '/*',
      ' * AGV Mechanical Phase: Task Portal DATA FILE',
      ' * Exported from Admin mode on ' + TODAY + '.',
      ' * Upload this file to the GitHub repository (replace the existing data.js).',
      ' * status: "todo" | "doing" | "done" · priority: "high" | "normal" | "low" · dates: "YYYY-MM-DD"',
      ' * NOTE: the published site is public; anything written here can be seen by anyone who has the link.',
      ' */'
    ].join('\n');
    return header + '\nwindow.PORTAL_DATA = ' + JSON.stringify(data, null, 2) + ';\n';
  }

  function exportData() {
    data.project.lastUpdated = TODAY;
    store.set(KEY.draft, JSON.stringify(data));
    const blob = new Blob([buildDataFile()], { type: 'text/javascript' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'data.js';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    render();
    openModal('<h2 id="modalTitle">data.js downloaded</h2>' +
      '<p style="margin-top:10px">To publish it to the team:</p>' +
      '<ol style="margin:8px 0 0;padding-left:20px;line-height:1.8"><li>Open your portal repository on GitHub.</li><li>Click <b>Add file → Upload files</b>.</li><li>Drag in the downloaded <code>data.js</code> (it replaces the old one).</li><li>Click <b>Commit changes</b>. The site updates in about 1 minute.</li></ol>' +
      '<p class="hint">After the site updates, reload this page in admin mode: the “Unpublished changes” banner disappears automatically.</p>' +
      '<div class="modal-actions"><button class="btn" type="button" data-act="copy-json">Copy file contents</button><button class="btn btn-primary" type="button" data-close>Done</button></div>');
  }

  function importData(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result);
      const s = text.indexOf('{'), e = text.lastIndexOf('}');
      const parsed = s >= 0 && e > s ? safeParse(text.slice(s, e + 1), null) : null;
      if (!parsed || !Array.isArray(parsed.tasks) || !Array.isArray(parsed.members)) { toast('That file is not a valid portal data file'); return; }
      data = normalize(parsed);
      commit('Imported ' + data.tasks.length + ' tasks into your draft');
    };
    reader.readAsText(file);
  }

  function openSettings() {
    const p = data.project;
    openModal('<h2 id="modalTitle">Project settings</h2>' +
      '<form class="form" id="settingsForm">' +
      '<label class="full">Project name<input name="name" value="' + esc(p.name) + '"></label>' +
      '<label class="full">Subtitle<input name="subtitle" value="' + esc(p.subtitle) + '"></label>' +
      '<label class="full">Announcement (shown at the top; leave empty to hide)<textarea name="announcement">' + esc(p.announcement) + '</textarea></label>' +
      '<label class="full">GitHub link the team should upload to (organization, repository or folder)<input name="uploadUrl" type="url" value="' + esc(data.github.uploadUrl) + '" placeholder="https://github.com/Graduation-Project-2027/…"></label>' +
      '<label class="full">GitHub reminder text (shown on every page)<input name="rule" value="' + esc(data.github.rule) + '"></label>' +
      '<label class="full">New admin passcode (leave empty to keep the current one)<input type="password" name="pass" autocomplete="new-password" placeholder="At least 8 characters"></label>' +
      '<div class="form-error" id="formError" hidden></div>' +
      '<p class="hint full">Phases, milestones and parent tasks (T1–T7) can be edited directly in <code>data.js</code>.</p>' +
      '<div class="modal-actions full"><button class="btn left" type="button" data-close>Cancel</button><button class="btn btn-primary" type="submit">Save</button></div></form>');
    $('#settingsForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = e.target.elements;
      if (f.uploadUrl.value.trim() && !safeUrl(f.uploadUrl.value.trim())) { const el = $('#formError'); el.textContent = 'GitHub link must start with https://'; el.hidden = false; return; }
      if (f.pass.value) {
        if (f.pass.value.length < 8) { const el = $('#formError'); el.textContent = 'Passcode must be at least 8 characters.'; el.hidden = false; return; }
        try { p.adminPasscodeHash = await sha256(f.pass.value); } catch (x) { const el = $('#formError'); el.textContent = 'Could not hash the passcode in this browser.'; el.hidden = false; return; }
      }
      data.github.uploadUrl = f.uploadUrl.value.trim();
      data.github.rule = f.rule.value.trim();
      p.name = f.name.value.trim() || p.name;
      p.subtitle = f.subtitle.value.trim();
      p.announcement = f.announcement.value.trim();
      closeModal();
      commit(f.pass.value ? 'Saved. New passcode takes effect once you publish data.js' : 'Project settings saved');
    });
  }

  // ---------------------------------------------------------------- misc UI
  let toastTimer = null;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 2600);
  }

  async function copyText(text, okMsg) {
    try {
      await navigator.clipboard.writeText(text);
      toast(okMsg);
    } catch (e) {
      openModal('<h2 id="modalTitle">Copy this</h2><div class="linkbox"><input readonly value="' + esc(text) + '" onfocus="this.select()"></div><div class="modal-actions"><button class="btn btn-primary" type="button" data-close>Done</button></div>');
    }
  }

  function personalLink(memberId) {
    return location.origin + location.pathname + '?member=' + encodeURIComponent(memberId);
  }

  function applyTheme(t) {
    if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
    else document.documentElement.removeAttribute('data-theme');
  }

  function setMember(id) {
    state.member = id;
    if (id === 'all') store.del(KEY.member); else store.set(KEY.member, id);
  }

  // ---------------------------------------------------------------- events
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-close],[data-act],[data-open],[data-toggle],[data-view],[data-show-member],[data-copy-link]');
    if (!el || e.target.closest('select, input, textarea, a[href]')) return;
    if (el.hasAttribute('data-close')) { closeModal(); return; }
    if (el.dataset.view) {
      state.view = el.dataset.view; store.set(KEY.view, state.view); render(); return;
    }
    if (el.dataset.toggle) {
      const g = el.dataset.toggle;
      if (state.collapsed.has(g)) state.collapsed.delete(g); else state.collapsed.add(g);
      store.set(KEY.collapsed, JSON.stringify(Array.from(state.collapsed)));
      render(); return;
    }
    if (el.dataset.showMember) { setMember(el.dataset.showMember); state.view = 'board'; store.set(KEY.view, 'board'); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    if (el.dataset.copyLink) { copyText(personalLink(el.dataset.copyLink), 'Personal link for ' + memberName(memberById(el.dataset.copyLink)) + ' copied'); return; }
    if (el.dataset.act) {
      const act = el.dataset.act, id = el.dataset.id;
      if (!isAdmin && !['print', 'copy-json', 'copy-folder', 'copy-readme'].includes(act)) return;
      if (act === 'copy-folder') { const t = data.tasks.find((x) => x.id === id); if (t) copyText(taskFolder(t), 'Folder name copied'); }
      else if (act === 'copy-readme') copyText(data.github.readmeTemplate, 'README template copied');
      else if (act === 'new') openEditor(null);
      else if (act === 'edit') openEditor(id);
      else if (act === 'duplicate') {
        const src = data.tasks.find((x) => x.id === id);
        if (src) openEditor(null, Object.assign(clone(src), { id: '', code: nextCode(src.group), title: src.title + ' (copy)', status: 'todo' }));
      }
      else if (act === 'delete') deleteTask(id);
      else if (act === 'confirm-delete') { const t = data.tasks.find((x) => x.id === id); data.tasks = data.tasks.filter((x) => x.id !== id); closeModal(); commit('Deleted ' + (t ? t.code : 'task')); }
      else if (act === 'export') exportData();
      else if (act === 'copy-json') copyText(buildDataFile(), 'data.js contents copied');
      else if (act === 'import') $('#importFile').click();
      else if (act === 'settings') openSettings();
      else if (act === 'discard') {
        openModal('<h2 id="modalTitle">Discard local changes?</h2><p style="margin-top:10px">Your draft will be replaced by the currently published data.js. This cannot be undone.</p><div class="modal-actions"><button class="btn left" type="button" data-close>Cancel</button><button class="btn btn-primary" type="button" data-act="confirm-discard">Discard draft</button></div>');
      }
      else if (act === 'confirm-discard') { store.del(KEY.draft); closeModal(); loadData(); render(); toast('Draft discarded'); }
      else if (act === 'print') window.print();
      return;
    }
    if (el.dataset.open) openTask(el.dataset.open);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.hidden) { closeModal(); return; }
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-open],[data-toggle]') && !e.target.matches('select,input,button')) {
      e.preventDefault(); e.target.click();
    }
  });

  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t.id === 'memberFilter') { setMember(t.value); render(); }
    else if (t.id === 'categoryFilter') { state.category = t.value; render(); }
    else if (t.matches('[data-status-for]')) setStatus(t.dataset.statusFor, t.value);
    else if (t.matches('[data-member-field]') && isAdmin) {
      const m = data.members.find((x) => x.id === t.dataset.member);
      if (m) { m[t.dataset.memberField] = t.value.trim(); commit('Updated ' + m.label); }
    }
    else if (t.id === 'importFile' && t.files && t.files[0]) { importData(t.files[0]); t.value = ''; }
  });

  let searchTimer = null;
  $('#searchInput').addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { state.q = e.target.value; render(); }, 150);
  });

  $('#adminBtn').addEventListener('click', () => { if (isAdmin) exitAdmin(); else openLogin(); });
  $('#themeBtn').addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') ||
      (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    applyTheme(next); store.set(KEY.theme, next);
  });

  let resizeTimer = null, lastNarrow = window.innerWidth < 700;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const narrow = window.innerWidth < 700;
      if (narrow !== lastNarrow && state.view === 'timeline') render();
      lastNarrow = narrow;
    }, 150);
  });

  // ---------------------------------------------------------------- boot
  applyTheme(store.get(KEY.theme));
  loadData();
  const urlMember = params.get('member');
  const fromUrl = urlMember && data.members.find((m) => m.id.toLowerCase() === urlMember.toLowerCase() || String(m.id).replace(/\D/g, '') === urlMember);
  if (fromUrl) setMember(fromUrl.id);
  else if (store.get(KEY.member)) state.member = store.get(KEY.member);
  render();
  if (location.hash === '#admin' && !isAdmin) openLogin();
})();
