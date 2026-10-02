# AGV Graduation Project: Task Portal

Live board: **https://salehnassar.github.io/agv-task-portal/**

A lightweight static web portal (HTML + CSS + JS, no build step, no server): **Task Board**, **Timeline (Gantt)**, **Schedule**, **Team** and **GitHub & Docs** views.

| File | Purpose |
|---|---|
| `index.html` | Page shell |
| `styles.css` | Styling (light/dark, responsive) |
| `app.js` | All logic: views, phase gates, admin mode, export/import |
| `data.js` | **The board data**: tasks, members, phases, gates (edited from admin mode or by the GitHub automation) |

## Scope: Part 1 of the project

The board currently holds **Part 1 · Mechanical & Cross-functional Prep** (deadline **Sun Nov 15, 2026**): mechanical design, manufacturing and the mechanical preparation for the electrical and software teams (CAD, URDF, mounting points). **Part 2 (Electrical)** and **Part 3 (Software)** are already listed as placeholders on the timeline and will be appended later as new categories with their own phases.

### Rules
- **Waterfall phases A → B → C → D.** A phase is locked (🔒) until every task of the previous phase is Done. The portal enforces this: tasks in a locked phase cannot be moved to In Progress or Done. Tasks inside a phase run in parallel.
- **Phase D starts after the mechanical work (A–C).** It is empty for now; the team leader adds its tasks later (**+ New task** → Phase D). New tasks continue the numbering (Task 11, 12, …) and get their own GitHub folder automatically on the first upload.
- **The team leader decides who, how many and when.** In admin mode, **Plan & assign** shows every task with: who works on it (first ticked = owner), how many people it needs (0 = not decided), and its start and deadline. A warning appears if a phase is planned to start before the previous one ends.
- **Phases and gates follow the tasks.** A phase spans its tasks' earliest start to latest deadline, and each gate sits at the end of its phase, so moving a deadline moves the phase and its gate automatically.
- **Everyone sees everything.** The site is public and read-only; filters only highlight, they never hide tasks from anyone.

### Starting plan (editable)

| Phase | Tasks | Planned dates |
|---|---|---|
| A · Design | 1 Chassis CAD · 2 Wheel alignment calculations (wheel diameter) · 3 Lift CAD edits (DFM) · 4 Sheet metal cover CAD | Sun Oct 4 → Sat Oct 10 |
| B · Integration & Analysis | 5 Chassis + mechanism assembly · 6 Chassis stress analysis · 7 Mechanisms' modal analysis · 8 Purchase list | Sun Oct 11 → Sat Oct 17 |
| C · Manufacturing & URDF | 9 Chassis and mechanisms' manufacturing · 10 CAD's URDF | Sun Oct 18 → Sat Oct 24 |
| D · After Mechanical | Tasks to be added | from Oct 25 (Part 1 deadline Nov 15) |

Every task starts at about one week, with no assignees and no head-count. The live board is the source of truth for dates and assignments. Earlier versions of the plan are archived inside `data.js` (`"archive"`) and in the mechanical repo's `archive/` folder.

## How it works

- **Team members (viewers)** open the link and see everything read-only. They pick their number in the *Member* filter, or open a personal link like `…/?member=3`, to highlight their tasks.
- **Team leader (admin)** clicks **Team Leader** and enters the passcode. Changes stay **in that browser** until you click **Export data.js** and upload the file to this repo (Add file → Upload files → Commit). The site updates in about a minute.
- The passcode only hides the editing UI. It is not real security: what protects the board is that only people with write access to this repo can change `data.js`.

### GitHub automation: "Closes Task N"
Work is uploaded to [`Graduation-Project-2027/AGV-Mechanical-Phase`](https://github.com/Graduation-Project-2027/AGV-Mechanical-Phase), where every task has its own folder (each task in the portal has an **Upload to my task folder** button).

A GitHub Action in that repo (`.github/workflows/close-portal-tasks.yml`) watches pushes to `main`. When a commit message contains **`Closes Task N`** (also `Closes Task #N`, `Fixes Task N`, `Closes Tasks 1, 3 and 4`), it sets Task N to **Done** in this repo's `data.js` and links the commit as the task's documentation. The board shows it about 1–2 minutes later.

One-time setup (team leader): create a fine-grained token with **Contents: Read and write** on `salehNassar/agv-task-portal` only, and save it as the secret **`PORTAL_TOKEN`** in the AGV-Mechanical-Phase repo (Settings → Secrets and variables → Actions). Without it the workflow does nothing.

If you have unpublished admin changes while the automation closes a task, the portal merges the automation's Done states and links into your draft the next time you open it in admin mode, so exporting never undoes them.

Useful URL options: `?member=3` (personal view), `?view=timeline|schedule|team|board|docs`, `?date=2026-10-20` (preview the board "as of" another day).
