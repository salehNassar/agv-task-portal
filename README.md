# AGV Mechanical Phase: Task Portal

A lightweight static web portal (HTML + CSS + JS, no build step, no server) for the AGV graduation project's mechanical phase: **Task Board**, **Timeline (Gantt)**, **Weekly Schedule**, and **Team** views.

| File | Purpose |
|---|---|
| `index.html` | Page shell |
| `styles.css` | Styling (light/dark, responsive) |
| `app.js` | All logic: views, filters, admin mode, export/import |
| `data.js` | **The only file you edit**: tasks, members, phases, milestones |

## How it works

- **Team members (viewers)** open the link and see everything read-only. They choose themselves in the *Member* filter, or open a personal link like `…/?member=3`, to highlight their own tasks, deadlines and progress.
- **Team leader (admin)** clicks **Team Leader** (or opens `…/#admin`) and enters the passcode. In admin mode you can add, edit, duplicate, delete and assign tasks, drag cards between columns, map real names to `Member 1…10`, and edit the announcement.
- Admin changes are saved **in your browser only** until you publish: click **Export data.js**, upload the file to GitHub (replacing the old one), and everyone sees the update within about a minute.

> The team leader has the admin passcode. Change the default one right away in *Project settings*, then export and publish `data.js`.
>
> The passcode only hides the editing UI. It is **not** real security: the page source is public. What actually protects your data is that only people with write access to the GitHub repository can change `data.js`. Viewers can't change what others see.
>
> The site is public. Anyone with the link can read it, including any real names you enter.

### GitHub documentation rule
Every page shows a reminder to **upload work to the team GitHub ([Graduation-Project-2027](https://github.com/Graduation-Project-2027)) and document it the same day**, with a personal count ("You have 2 finished tasks not on GitHub").

- Every task shows a **suggested folder name** (e.g. `Mechanical/T1_chassis-cad/1.2_model-the-aluminum-profile-frame`) and a checklist of what to upload for that task type.
- The **GitHub & Docs** tab has the step-by-step rules, a README template to copy, and a tracker of every started task and whether it's on GitHub.
- Badges: 🟠 *Upload as you go* (in progress, no link yet) · 🔴 *Not on GitHub* (marked done without a link) · 🟢 *On GitHub* (link added).
- When a member sends you their folder link, open the task in admin mode → **Edit task** → paste it into *GitHub link*, then export and publish `data.js`.
- To send the team to a specific repo/folder instead of the organization page: *Project settings → GitHub link the team should upload to*. More repos can be listed under `"github" → "repos"` in `data.js`.

Useful URL options: `?member=3` (personal view), `?view=timeline|schedule|team|board`, `?date=2026-10-20` (preview the portal "as of" another day).

## Project schedule (Sep 28 – Nov 9, 2026)

Milestones: **MS1 Mon Oct 12** draft CAD & research complete · **MS2 Mon Oct 19** design freeze & workshop deals locked · **MS3 Mon Oct 26** all materials procured · **MS4 Mon Nov 9** mechanical system assembled & tested.

### Weeks 1–2 · CAD & Research (Mon Sep 28 – Mon Oct 12)
| Code | Task | Start | Deadline |
|---|---|---|---|
| 1.1 | Define chassis requirements & design envelope | Sep 28 | **Wed Sep 30** |
| 2.1 | Replace omni wheels with differential layout (2 mid drive + front caster) | Sep 28 | **Thu Oct 1** |
| 2.2 | Drive motor & encoder sizing | Sep 29 | **Sun Oct 4** |
| 5.1 | Search for ready-made four-scissor lift CAD | Sep 28 | **Mon Oct 5** |
| 1.2 | Model the aluminum-profile frame | Sep 30 | **Thu Oct 8** |
| 3.1 | Suppliers: motors, encoders, wheels & caster | Oct 1 | **Thu Oct 8** |
| 3.2 | Suppliers: aluminum profiles, sheets & connectors | Sep 30 | **Thu Oct 8** |
| 5.2 | Shortlist & compare lift candidates | Oct 3 | **Thu Oct 8** |
| 1.3 | Model the 4-side aluminum-sheet enclosure | Oct 5 | **Mon Oct 12** |
| 2.3 | Model motor, encoder, wheel & caster mounts | Oct 3 | **Mon Oct 12** |
| 3.3 | Workshop survey & quotations | Oct 3 | **Mon Oct 12** |
| 3.4 | Detailed pricing table v1 | Oct 8 | **Mon Oct 12** |
| 5.3 | Select lift model, verify & extract dimensions | Oct 8 | **Mon Oct 12** |
| 6.1 | Material selection study for the lift | Oct 5 | **Mon Oct 12** |

### Week 3 · Design Freeze & Deals (Tue Oct 13 – Mon Oct 19)
| Code | Task | Start | Deadline |
|---|---|---|---|
| 1.4 | Frame structural check (FEA) | Oct 13 | **Thu Oct 15** |
| 2.4 | Stability & tip-over check (CG vs. 3-point support) | Oct 13 | **Thu Oct 15** |
| 3.5 | Final pricing table & budget approval | Oct 13 | **Thu Oct 15** |
| 5.4 | Finalize lift CAD & integrate into chassis | Oct 13 | **Thu Oct 15** |
| 6.2 | Manufacturing method per lift part | Oct 8 | **Thu Oct 15** |
| 1.5 | Chassis design freeze & manufacturing drawings | Oct 15 | **Mon Oct 19** |
| 3.6 | Lock in workshop deals | Oct 16 | **Mon Oct 19** |
| 6.3 | Finalize materials & lift manufacturing drawings | Oct 13 | **Mon Oct 19** |

### Week 4 · Procurement (Tue Oct 20 – Mon Oct 26)
| Code | Task | Start | Deadline |
|---|---|---|---|
| 4.1 | Procure aluminum materials | Oct 20 | **Thu Oct 22** |
| 4.2 | Procure motors, encoders, wheels & caster | Oct 20 | **Mon Oct 26** |
| 4.3 | Incoming inspection & workshop hand-off | Oct 24 | **Mon Oct 26** |
| 7.1 | Procure lift materials & hardware | Oct 20 | **Mon Oct 26** |

### Weeks 5–6 · Fabrication, Assembly & Testing (Tue Oct 27 – Mon Nov 9)
| Code | Task | Start | Deadline |
|---|---|---|---|
| 4.4 | Cut & drill profiles; cut & bend sheets | Oct 27 | **Sun Nov 1** |
| 7.2 | Manufacture lift parts at the workshop | Oct 27 | **Mon Nov 2** |
| 4.5 | Frame assembly + drive-train installation | Nov 1 | **Thu Nov 5** |
| 7.3 | Assemble the four-scissor lift | Nov 2 | **Thu Nov 5** |
| 4.6 | Enclosure sheet fitting | Nov 4 | **Fri Nov 6** |
| 7.4 | Mount the lift on the chassis | Nov 5 | **Sat Nov 7** |
| 4.7 | Chassis initial mechanical tests | Nov 6 | **Mon Nov 9** |
| 7.5 | Lift functional & load tests | Nov 7 | **Mon Nov 9** |
| 7.6 | Mechanical test report & hand-over | Nov 8 | **Mon Nov 9** |

Tasks start **unassigned**. The team leader assigns them in admin mode (**Assign tasks** grid, or per task via **Edit task**). Full descriptions and deliverables are in the portal (click any task).

## Deploy for free on GitHub Pages (about 5 minutes)

1. Sign in to GitHub → **New repository** (e.g. `agv-task-portal`), set it to **Public**, and create it.
   (GitHub Pages on a *private* repo needs a paid plan. You can create the repo under your team's GitHub organization if you have permission.)
2. On the new repo page click **uploading an existing file**, drag in `index.html`, `styles.css`, `app.js`, `data.js` (and this `README.md`), then **Commit changes**.
3. Go to **Settings → Pages**. Under *Build and deployment* choose **Deploy from a branch**, branch **`main`**, folder **`/ (root)`**, then **Save**.
4. Wait about 1 minute and refresh. The link appears at the top of the Pages settings:
   `https://salehnassar.github.io/agv-task-portal/`
5. Share the link with the team. Personal links: `…/agv-task-portal/?member=1` … `?member=10` (in the portal, **Team → Copy personal link**).

### Updating tasks later
Open the portal → **Team Leader** → make changes → **Export data.js** → in the GitHub repo **Add file → Upload files** → drop the new `data.js` → **Commit changes**. The team sees the update after about a minute (a normal refresh is enough, since `data.js` is never cached).

You can also edit `data.js` directly on GitHub with the pencil icon. Keep it valid JSON: double quotes, no trailing commas.

### Preview locally
Double-click `index.html`. It works straight from disk. (Admin login needs `https://` or `localhost`, so log in on the published site.)
