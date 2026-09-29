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

The board currently holds **Part 1 · Mechanical & Cross-functional Prep** (Sep 28 – **Sun Nov 15, 2026**): mechanical design, manufacturing and the mechanical preparation for the electrical and software teams (CAD, URDF, mounting points). **Part 2 (Electrical)** and **Part 3 (Software)** are already listed as placeholders on the timeline and will be appended later as new categories with their own phases.

### Rules
- **Waterfall phases A → B → C → D.** A phase is locked (🔒) until every task of the previous phase is Done. The portal enforces this: tasks in a locked phase cannot be moved to In Progress or Done. Tasks inside a phase run in parallel.
- **All 10 members work in every phase.** Each phase distributes Member 1–10 across its tasks (each member on exactly one task per phase). The first member listed on a task is its owner.
- **Everyone sees everything.** The site is public and read-only; filters only highlight, they never hide tasks from anyone.

### Schedule

| Task | Phase | Start → Deadline | Duration | Assignees |
|---|---|---|---|---|
| 1. Chassis CAD | A | Mon Sep 28 → **Wed Oct 14** | 17 days | 4 members: [M1, M2, M3, M4] |
| 2. Wheel alignment calculations to choose the wheel diameter | A | Mon Sep 28 → **Mon Oct 5** | 8 days | 1 member: [M5] |
| 3. Lifting mechanism CAD edits (DFM) | A | Mon Sep 28 → **Mon Oct 12** | 15 days | 3 members: [M7, M6, M8] |
| 4. Sheet metal cover CAD | A | Mon Sep 28 → **Wed Oct 14** | 17 days | 2 members: [M9, M10] |
| **Gate A** | | **Wed Oct 14**: Phase A 100% complete → Phase B unlocks | | |
| 5. Chassis with mechanism assembly | B | Thu Oct 15 → **Mon Oct 19** | 5 days | 2 members: [M1, M9] |
| 6. Chassis stress analysis | B | Thu Oct 15 → **Sun Oct 25** | 11 days | 3 members: [M2, M3, M4] |
| 7. Mechanisms' modal analysis | B | Thu Oct 15 → **Sun Oct 25** | 11 days | 3 members: [M6, M7, M8] |
| 8. Purchase list (Al extrusion, bearings, wheels, hoverboard motors) | B | Thu Oct 15 → **Thu Oct 22** | 8 days | 2 members: [M5, M10] |
| **Gate B** | | **Sun Oct 25**: Phase B 100% complete → Phase C unlocks | | |
| 9. Chassis and mechanisms' manufacturing | C | Mon Oct 26 → **Sun Nov 8** | 14 days | 8 members: [M3, M1, M2, M4, M5, M6, M7, M10] |
| 10. CAD's URDF | C | Mon Oct 26 → **Wed Nov 4** | 10 days | 2 members: [M8, M9] |
| **Gate C** | | **Sun Nov 8**: Phase C 100% complete → Phase D unlocks | | |
| 11. Electric components testing, connecting, and fixing to the chassis | D | Mon Nov 9 → **Sun Nov 15** | 7 days | 6 members: [M10, M1, M2, M3, M5, M6] |
| 12. New car simulation calculations and implementation | D | Mon Nov 9 → **Sun Nov 15** | 7 days | 4 members: [M4, M7, M8, M9] |
| **Part 1 done** | | **Sun Nov 15** | | |

The team leader can change assignees, head-counts and dates in admin mode (**Assign tasks** grid / **Edit task**) and maps real people to Member 1–10 on the **Team** tab. The earlier 35-task plan is archived inside `data.js` (`"archive"`) and in the mechanical repo's `archive/plan-v1/` folder.

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
