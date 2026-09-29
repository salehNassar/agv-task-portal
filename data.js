/*
 * AGV Mechanical Phase: Task Portal DATA FILE
 * Exported from Admin mode on 2026-09-30.
 * Upload this file to the GitHub repository (replace the existing data.js).
 * status: "todo" | "doing" | "done" · priority: "high" | "normal" | "low" · dates: "YYYY-MM-DD"
 * NOTE: the published site is public; anything written here can be seen by anyone who has the link.
 */
window.PORTAL_DATA = {
  "project": {
    "name": "AGV Graduation Project",
    "subtitle": "Part 1 · Mechanical & Cross-functional Prep (Sep 28 – Nov 15, 2026)",
    "start": "2026-09-28",
    "end": "2026-11-15",
    "weekendDays": [
      5,
      6
    ],
    "lastUpdated": "2026-09-30",
    "announcement": "New plan: Part 1 is now 12 tasks in 4 phases (A → B → C → D). A phase starts only when the previous phase is 100% complete; tasks inside a phase run in parallel. Part 1 must be finished by Sun Nov 15. Electrical and Software parts will be added later.",
    "adminPasscodeHash": "d8249d067e64caeaf6ce5ad4d7e0cdfafe62ca9b35f5bbccb845ccff240a6dd8"
  },
  "github": {
    "orgName": "Graduation-Project-2027",
    "orgUrl": "https://github.com/Graduation-Project-2027",
    "uploadUrl": "https://github.com/Graduation-Project-2027/AGV-Mechanical-Phase",
    "folderRoot": "",
    "rule": "Upload your work to the team GitHub and document it the SAME DAY you do it. No upload = not done.",
    "repos": [
      {
        "name": "AGV-Mechanical-Phase",
        "url": "https://github.com/Graduation-Project-2027/AGV-Mechanical-Phase",
        "purpose": "Upload ALL mechanical-phase work here. Every task already has its own folder with a README to fill in."
      },
      {
        "name": "Graduation-Project-2027 (organization)",
        "url": "https://github.com/Graduation-Project-2027",
        "purpose": "All team repositories. Members only (sign in with your GitHub account)."
      }
    ],
    "steps": [
      "Open your task in this portal and click \"Upload to my task folder\" (every task already has its own folder in AGV-Mechanical-Phase).",
      "Drag your files in and commit. Web upload max is 25 MB per file; for bigger CAD use GitHub Desktop (max 100 MB per file) or upload a STEP export.",
      "Update the README.md in your task folder: what you did, key numbers/decisions, open issues.",
      "Commit message format: \"Task N: what you did\", e.g. \"Task 1: frame v2 with cross-members for lift base\".",
      "When the task is finished, put \"Closes Task N\" in the commit message. The board moves the task to Done automatically (within about 2 minutes).",
      "Do it the SAME DAY you work on the task, not at the end."
    ],
    "readmeTemplate": "# <task code> <task title>\nOwner: <Member X> · Date: <YYYY-MM-DD>\n\n## What was done\n- ...\n\n## Key results / numbers / decisions\n- ...\n\n## Files in this folder\n- ...\n\n## Open issues & next steps\n- ...",
    "repoUrl": "https://github.com/Graduation-Project-2027/AGV-Mechanical-Phase",
    "branch": "main"
  },
  "members": [
    {
      "id": "M1",
      "label": "Member 1",
      "name": "",
      "role": "Chassis lead"
    },
    {
      "id": "M2",
      "label": "Member 2",
      "name": "",
      "role": "Chassis structures"
    },
    {
      "id": "M3",
      "label": "Member 3",
      "name": "",
      "role": "Chassis & manufacturing lead"
    },
    {
      "id": "M4",
      "label": "Member 4",
      "name": "",
      "role": "Chassis structures & simulation"
    },
    {
      "id": "M5",
      "label": "Member 5",
      "name": "",
      "role": "Wheels, drive & procurement"
    },
    {
      "id": "M6",
      "label": "Member 6",
      "name": "",
      "role": "Lift mechanism"
    },
    {
      "id": "M7",
      "label": "Member 7",
      "name": "",
      "role": "Lift mechanism lead"
    },
    {
      "id": "M8",
      "label": "Member 8",
      "name": "",
      "role": "Lift, URDF & simulation"
    },
    {
      "id": "M9",
      "label": "Member 9",
      "name": "",
      "role": "Cover, assembly & URDF"
    },
    {
      "id": "M10",
      "label": "Member 10",
      "name": "",
      "role": "Cover, procurement & electrical"
    }
  ],
  "categories": [
    {
      "id": "P1",
      "name": "Part 1 · Mechanical & Cross-functional Prep",
      "hue": "blue"
    },
    {
      "id": "P2",
      "name": "Part 2 · Electrical (to be added)",
      "hue": "teal"
    },
    {
      "id": "P3",
      "name": "Part 3 · Software (to be added)",
      "hue": "rose"
    }
  ],
  "groups": [
    {
      "id": "A",
      "category": "P1",
      "hue": "blue",
      "short": "Phase A · Design",
      "gated": false,
      "title": "Phase A: CAD design of chassis, wheels, lift (DFM) and sheet-metal cover"
    },
    {
      "id": "B",
      "category": "P1",
      "hue": "purple",
      "short": "Phase B · Integration & Analysis",
      "gated": true,
      "title": "Phase B: full assembly, stress and modal analysis, purchase list"
    },
    {
      "id": "C",
      "category": "P1",
      "hue": "amber",
      "short": "Phase C · Manufacturing & URDF",
      "gated": true,
      "title": "Phase C: manufacturing and assembly of chassis and mechanisms; URDF from CAD"
    },
    {
      "id": "D",
      "category": "P1",
      "hue": "green",
      "short": "Phase D · Electrical & Simulation Prep",
      "gated": true,
      "title": "Phase D: electrical components on the chassis; simulation of the new car"
    }
  ],
  "phases": [
    {
      "id": "PA",
      "group": "A",
      "weeks": "Phase A",
      "title": "Design (CAD)",
      "start": "2026-09-28",
      "end": "2026-10-14",
      "hue": "blue",
      "goals": [
        "Chassis, sheet-metal cover and lift CAD ready for manufacturing",
        "Wheel diameter chosen from alignment/traction calculations"
      ]
    },
    {
      "id": "PB",
      "group": "B",
      "weeks": "Phase B",
      "title": "Integration & Analysis",
      "start": "2026-10-15",
      "end": "2026-10-25",
      "hue": "purple",
      "goals": [
        "Chassis + lift assembled in CAD without interferences",
        "Stress (static) and modal analysis passed",
        "Purchase list approved and ready to order"
      ]
    },
    {
      "id": "PC",
      "group": "C",
      "weeks": "Phase C",
      "title": "Manufacturing & URDF",
      "start": "2026-10-26",
      "end": "2026-11-08",
      "hue": "amber",
      "goals": [
        "Materials bought; chassis and lift manufactured and assembled",
        "URDF exported from the final CAD for the software team"
      ]
    },
    {
      "id": "PD",
      "group": "D",
      "weeks": "Phase D",
      "title": "Electrical & Simulation Prep",
      "start": "2026-11-09",
      "end": "2026-11-15",
      "hue": "green",
      "goals": [
        "Electrical components tested, wired and fixed to the chassis",
        "Simulation updated for the new car (differential drive, new mass/dimensions)"
      ]
    }
  ],
  "milestones": [
    {
      "id": "Gate A",
      "date": "2026-10-14",
      "title": "Phase A 100% complete → Phase B unlocks"
    },
    {
      "id": "Gate B",
      "date": "2026-10-25",
      "title": "Phase B 100% complete → Phase C unlocks"
    },
    {
      "id": "Gate C",
      "date": "2026-11-08",
      "title": "Phase C 100% complete → Phase D unlocks"
    },
    {
      "id": "Part 1",
      "date": "2026-11-15",
      "title": "Part 1 (Mechanical & Prep) complete"
    }
  ],
  "tasks": [
    {
      "assignees": [
        "M1",
        "M2",
        "M3",
        "M4"
      ],
      "status": "todo",
      "priority": "high",
      "description": "Full SolidWorks model of the new chassis: aluminum-extrusion frame (standard profiles, brackets, T-nuts), mounting points for the drive wheels/hoverboard motors, caster, lift base plate, battery and electronics bay, and front/rear LiDAR mounts. Size members for the 100 kg payload case.",
      "deliverable": "Chassis assembly (.SLDASM) + STEP + profile cut list",
      "docLink": "",
      "id": "p1-1",
      "group": "A",
      "code": "1",
      "title": "Chassis CAD",
      "needed": 4,
      "start": "2026-09-28",
      "due": "2026-10-14",
      "folder": "Phase-A_design/01_chassis-cad",
      "docs": [
        "SolidWorks parts/assembly + STEP export",
        "Screenshots (isometric + key views)",
        "Cut list (profile, length, qty)",
        "README: dimensions, profile sizes, key decisions"
      ]
    },
    {
      "assignees": [
        "M5"
      ],
      "status": "todo",
      "priority": "high",
      "description": "Calculate the required wheel diameter and drive layout: traction and torque for robot + 100 kg payload, target speed, ground clearance, obstacle/threshold height, and alignment of the two drive wheels with the caster (all contact points on one plane, parallel axles). Compare the available hoverboard hub-motor sizes (e.g., 6.5 in, 8 in, 10 in) and recommend one. The result feeds the chassis CAD.",
      "deliverable": "Calculation sheet + recommended wheel/motor size",
      "docLink": "",
      "id": "p1-2",
      "group": "A",
      "code": "2",
      "title": "Wheel alignment calculations to choose the diameter of the wheels used",
      "needed": 1,
      "start": "2026-09-28",
      "due": "2026-10-05",
      "folder": "Phase-A_design/02_wheel-diameter-calcs",
      "docs": [
        "Calculation sheet (Excel/PDF) with all assumptions",
        "Comparison of candidate wheel sizes",
        "README: chosen diameter and why"
      ]
    },
    {
      "assignees": [
        "M7",
        "M6",
        "M8"
      ],
      "status": "todo",
      "priority": "high",
      "description": "Rework the four-scissor lift CAD so local workshops can make it: standard plate/bar thicknesses, laser-cuttable arm profiles, reamed pivot holes with defined tolerances, standard pins/bearings/bushings, bolted instead of welded joints where possible, and fewer unique parts. Keep the proven geometry (arm length, pivot spacing).",
      "deliverable": "DFM-updated lift assembly + list of changes",
      "docLink": "",
      "id": "p1-3",
      "group": "A",
      "code": "3",
      "title": "Lifting mechanism CAD edits (Design for Manufacturing)",
      "needed": 3,
      "start": "2026-09-28",
      "due": "2026-10-12",
      "folder": "Phase-A_design/03_lift-cad-dfm",
      "docs": [
        "Updated SolidWorks files + STEP",
        "List of DFM changes (before → after)",
        "README: tolerances, standard parts used"
      ]
    },
    {
      "assignees": [
        "M9",
        "M10"
      ],
      "status": "todo",
      "priority": "normal",
      "description": "Design the aluminum sheet-metal cover for all four sides using SolidWorks Sheet Metal: fixing to the extrusion slots, removable access panel(s) for battery/electronics, LiDAR windows, cable pass-throughs and ventilation. Export flat patterns (DXF) with bend lines.",
      "deliverable": "Sheet-metal parts + flat-pattern DXFs",
      "docLink": "",
      "id": "p1-4",
      "group": "A",
      "code": "4",
      "title": "Sheet metal cover CAD",
      "needed": 2,
      "start": "2026-09-28",
      "due": "2026-10-14",
      "folder": "Phase-A_design/04_sheet-metal-cover",
      "docs": [
        "Sheet-metal parts + DXF flat patterns",
        "Screenshots",
        "README: sheet thickness/grade, bend radii"
      ]
    },
    {
      "assignees": [
        "M1",
        "M9"
      ],
      "status": "todo",
      "priority": "high",
      "description": "Mate the chassis, cover, drive wheels and the DFM lift into one top-level assembly. Run interference detection through the full lift stroke, check clearances to wiring and cover, and compute the combined mass properties (mass, CG) for the analyses and the URDF.",
      "deliverable": "Top-level assembly + interference report + mass properties",
      "docLink": "",
      "id": "p1-5",
      "group": "B",
      "code": "5",
      "title": "Chassis with mechanism assembly",
      "needed": 2,
      "start": "2026-10-15",
      "due": "2026-10-19",
      "folder": "Phase-B_integration-and-analysis/05_chassis-mechanism-assembly",
      "docs": [
        "Top-level assembly + STEP",
        "Interference check results",
        "Mass properties (mass, CG, inertia)",
        "README: open issues"
      ]
    },
    {
      "assignees": [
        "M2",
        "M3",
        "M4"
      ],
      "status": "todo",
      "priority": "high",
      "description": "Static FEA of the chassis under the 100 kg payload (with dynamic factor) applied through the lift mounts, supported at the drive wheels and caster. Report von Mises stress, safety factor (target ≥ 1.5) and max deflection; propose reinforcement where needed.",
      "deliverable": "FEA report (stress, SF, deflection) + design changes",
      "docLink": "",
      "id": "p1-6",
      "group": "B",
      "code": "6",
      "title": "Chassis stress analysis",
      "needed": 3,
      "start": "2026-10-15",
      "due": "2026-10-25",
      "folder": "Phase-B_integration-and-analysis/06_chassis-stress-analysis",
      "docs": [
        "FEA study files",
        "Report with plots (stress, displacement, SF)",
        "README: load cases, results, changes made"
      ]
    },
    {
      "assignees": [
        "M6",
        "M7",
        "M8"
      ],
      "status": "todo",
      "priority": "high",
      "description": "Frequency (modal) analysis of the lift mechanism, raised and lowered, to find its natural frequencies and mode shapes. Check they stay well away from excitation sources (motor/drive speeds, floor vibration while driving) and stiffen the design if a mode is too low.",
      "deliverable": "Modal analysis report (first modes + recommendations)",
      "docLink": "",
      "id": "p1-7",
      "group": "B",
      "code": "7",
      "title": "Mechanisms' modal analysis",
      "needed": 3,
      "start": "2026-10-15",
      "due": "2026-10-25",
      "folder": "Phase-B_integration-and-analysis/07_mechanism-modal-analysis",
      "docs": [
        "Frequency study files",
        "Report with first 5 modes and shapes",
        "README: excitation check and recommendations"
      ]
    },
    {
      "assignees": [
        "M5",
        "M10"
      ],
      "status": "todo",
      "priority": "high",
      "description": "Build the final purchase list from the CAD: aluminum extrusion (profile, total length, cuts), brackets/T-nuts/fasteners, bearings, wheels and caster, hoverboard motors, sheets and lift stock. For each item: spec, quantity, 2–3 suppliers with price (EGP) and lead time. Get budget approval so ordering starts on day 1 of Phase C.",
      "deliverable": "Approved purchase list with suppliers, prices and lead times",
      "docLink": "",
      "id": "p1-8",
      "group": "B",
      "code": "8",
      "title": "Purchase list (Al extrusion, Bearing, Wheels, Hoverboard motors)",
      "needed": 2,
      "start": "2026-10-15",
      "due": "2026-10-22",
      "folder": "Phase-B_integration-and-analysis/08_purchase-list",
      "docs": [
        "Purchase list (Excel/PDF)",
        "Quotations (photos/PDFs)",
        "README: total budget + recommended suppliers"
      ]
    },
    {
      "assignees": [
        "M3",
        "M1",
        "M2",
        "M4",
        "M5",
        "M6",
        "M7",
        "M10"
      ],
      "status": "todo",
      "priority": "high",
      "description": "Order everything on the purchase list, then manufacture and assemble: cut and drill extrusions, laser-cut and bend sheets, machine lift parts, assemble the frame, drive wheels and caster, lift and cover. Check first-off parts against drawings and finish with a basic mechanical test (rolling, lift stroke, 100 kg static load).",
      "deliverable": "Assembled chassis + lift + test sheet and photos",
      "docLink": "",
      "id": "p1-9",
      "group": "C",
      "code": "9",
      "title": "Chassis and mechanisms' manufacturing",
      "needed": 8,
      "start": "2026-10-26",
      "due": "2026-11-08",
      "folder": "Phase-C_manufacturing-and-urdf/09_manufacturing",
      "docs": [
        "Receipts/invoices",
        "Photos/videos of every step",
        "Measurements and test sheet",
        "README: problems found and fixes"
      ]
    },
    {
      "assignees": [
        "M8",
        "M9"
      ],
      "status": "todo",
      "priority": "normal",
      "description": "Export the final assembly to URDF (SolidWorks to URDF exporter): correct link frames, joint axes and limits (drive wheels, caster, lift), masses and inertias from CAD, and simplified collision meshes. Check it loads in RViz/Gazebo and hand it to the software team (it replaces the old mecanum model).",
      "deliverable": "URDF package (urdf + meshes) that loads in RViz/Gazebo",
      "docLink": "",
      "id": "p1-10",
      "group": "C",
      "code": "10",
      "title": "CAD's URDF",
      "needed": 2,
      "start": "2026-10-26",
      "due": "2026-11-04",
      "folder": "Phase-C_manufacturing-and-urdf/10_cad-urdf",
      "docs": [
        "URDF + meshes + config",
        "Screenshot in RViz/Gazebo",
        "README: frames, joints, how to launch"
      ]
    },
    {
      "assignees": [
        "M10",
        "M1",
        "M2",
        "M3",
        "M5",
        "M6"
      ],
      "status": "todo",
      "priority": "high",
      "description": "Bench-test each electrical component (hoverboard motors + drivers, battery/BMS, controllers, sensors), then mount them on the chassis at the planned points, route and fix the wiring (separate power and logic), and check everything powers up safely.",
      "deliverable": "Components mounted and wired + test checklist",
      "docLink": "",
      "id": "p1-11",
      "group": "D",
      "code": "11",
      "title": "Electric components testing, connecting, and fixing to the chassis",
      "needed": 6,
      "start": "2026-11-09",
      "due": "2026-11-15",
      "folder": "Phase-D_electrical-and-simulation-prep/11_electrical-integration",
      "docs": [
        "Test checklist per component",
        "Wiring photos / diagram",
        "README: issues and fixes"
      ]
    },
    {
      "assignees": [
        "M4",
        "M7",
        "M8",
        "M9"
      ],
      "status": "todo",
      "priority": "high",
      "description": "Update the simulation for the new car: differential-drive kinematics instead of mecanum, new wheel diameter, mass and inertia from the URDF, and the lift model. Recalculate speed/acceleration limits and implement the changes in the Gazebo/ROS setup so the software team can continue.",
      "deliverable": "Updated simulation running the new car + calculation notes",
      "docLink": "",
      "id": "p1-12",
      "group": "D",
      "code": "12",
      "title": "New car simulation calculations and implementation",
      "needed": 4,
      "start": "2026-11-09",
      "due": "2026-11-15",
      "folder": "Phase-D_electrical-and-simulation-prep/12_new-car-simulation",
      "docs": [
        "Calculation notes",
        "Changed config/launch files (or a link to the software repo commit)",
        "Screenshot/video of the simulation",
        "README: what changed"
      ]
    }
  ],
  "roster": [
    "Yasmin Mohamed",
    "Basmala Mohamed",
    "Ahmed Alattar",
    "Youssef Wahba",
    "Nada Ali",
    "Ahmed Elbrolosy",
    "Saleh Nassar",
    "Nadine Elframawy",
    "Basant Salah",
    "Omar Farahat"
  ],
  "archive": {
    "note": "Plan v1 (35 fragmented sub-tasks), archived 2026-09-30 when the board moved to the 12-task phased plan.",
    "archivedOn": "2026-09-30",
    "groups": [
      {
        "id": "T1",
        "category": "A",
        "short": "Chassis CAD",
        "title": "SolidWorks design of the new chassis (aluminum profiles + 4-side aluminum sheet enclosure)",
        "docs": [
          "SolidWorks files (.SLDPRT / .SLDASM) + a STEP export of the assembly",
          "Screenshots of the model (isometric + key views)",
          "Cut list / DXFs / drawings when available",
          "README: dimensions, profile sizes, design decisions"
        ]
      },
      {
        "id": "T2",
        "category": "A",
        "short": "Wheel Config",
        "title": "Wheel configuration in CAD: 2 middle drive wheels (2 motors + 2 encoders) + 1 front caster",
        "docs": [
          "Updated SolidWorks files + STEP export",
          "Motor sizing calculation (Excel/PDF) with all assumptions",
          "Datasheets of the selected motor, encoder, wheels and caster",
          "README: track width, wheelbase, CG/stability result"
        ]
      },
      {
        "id": "T3",
        "category": "A",
        "short": "Market Research",
        "title": "Market research & cost estimation: suppliers, workshops and detailed pricing table",
        "docs": [
          "Pricing table (Excel/Google Sheet export)",
          "Supplier & workshop contacts list",
          "Photos/PDFs of quotations",
          "README: recommended option per item + total budget"
        ]
      },
      {
        "id": "T4",
        "category": "A",
        "short": "Chassis Fabrication",
        "title": "Procurement, fabrication & assembly of the chassis at the selected workshops",
        "docs": [
          "Receipts / invoices (photos)",
          "Photos of every fabrication & assembly step",
          "Measurements and test sheet (deflection, drift, encoder check)",
          "README: problems found and how they were fixed"
        ]
      },
      {
        "id": "T5",
        "category": "B",
        "short": "Lift CAD",
        "title": "Find a proven, ready-made SolidWorks four-scissor lift model and extract reliable dimensions",
        "docs": [
          "Links + license notes of every candidate model found",
          "Downloaded model files of the selected lift + STEP",
          "Comparison matrix (Excel/PDF)",
          "README: key dimensions extracted (arm length, pivots, stroke, pins)"
        ]
      },
      {
        "id": "T6",
        "category": "B",
        "short": "Lift Materials & Mfg",
        "title": "Manufacturing methods & material selection for the selected lift",
        "docs": [
          "Material table per part with justification",
          "Safety-factor calculations (arms, pins)",
          "Process plan (part → process → workshop)",
          "README: final material & manufacturing decisions"
        ]
      },
      {
        "id": "T7",
        "category": "B",
        "short": "Lift Fabrication",
        "title": "Fabrication, assembly & testing of the lifting mechanism",
        "docs": [
          "Receipts / invoices (photos)",
          "Photos + short videos of manufacturing, assembly and tests",
          "Lift test sheet (stroke, levelness, load steps)",
          "README: test results, problems and fixes"
        ]
      }
    ],
    "phases": [
      {
        "id": "P1",
        "weeks": "Weeks 1–2",
        "title": "CAD & Research",
        "start": "2026-09-28",
        "end": "2026-10-12",
        "hue": "blue",
        "goals": [
          "Chassis CAD: aluminum-profile frame + 4-side sheet enclosure (draft)",
          "New wheel layout in CAD: 2 middle drive wheels + front caster; motors sized",
          "Ready-made four-scissor lift CAD found, compared and selected",
          "Market research: suppliers & workshops contacted, pricing table v1"
        ]
      },
      {
        "id": "P2",
        "weeks": "Week 3",
        "title": "Design Freeze & Deals",
        "start": "2026-10-13",
        "end": "2026-10-19",
        "hue": "purple",
        "goals": [
          "All CAD models finalized (chassis + wheels + lift integrated)",
          "Material selection finalized; manufacturing drawings issued",
          "Final pricing table approved; workshop deals locked in"
        ]
      },
      {
        "id": "P3",
        "weeks": "Week 4",
        "title": "Procurement",
        "start": "2026-10-20",
        "end": "2026-10-26",
        "hue": "teal",
        "goals": [
          "Buy all materials: aluminum profiles, sheets, connectors, lift stock",
          "Buy motors, encoders, wheels, caster, lead screws, bearings",
          "Incoming inspection and hand-off of drawings + material to workshops"
        ]
      },
      {
        "id": "P4",
        "weeks": "Weeks 5–6",
        "title": "Fabrication, Assembly & Testing",
        "start": "2026-10-27",
        "end": "2026-11-09",
        "hue": "green",
        "goals": [
          "Workshop manufacturing of chassis and lift parts",
          "Chassis + drive-train assembly; lift assembly and mounting",
          "Initial mechanical testing and test report"
        ]
      }
    ],
    "milestones": [
      {
        "id": "MS1",
        "date": "2026-10-12",
        "title": "Draft CAD & research complete"
      },
      {
        "id": "MS2",
        "date": "2026-10-19",
        "title": "Design freeze & workshop deals locked"
      },
      {
        "id": "MS3",
        "date": "2026-10-26",
        "title": "All materials & components procured"
      },
      {
        "id": "MS4",
        "date": "2026-11-09",
        "title": "Mechanical system assembled & tested"
      }
    ],
    "tasks": [
      {
        "id": "t1-1",
        "group": "T1",
        "code": "1.1",
        "title": "Define chassis requirements & design envelope",
        "description": "Collect the inputs the new chassis must satisfy before modelling: overall footprint and height limit (rack/shelf clearance from GP1), 100 kg payload sizing basis, lift base-plate interface, battery/electronics bay, front & rear LiDAR mounting height, ground clearance. Agree on units, SolidWorks file structure and naming (one shared assembly).",
        "deliverable": "One-page requirements sheet + empty top-level SolidWorks assembly with reference planes",
        "assignees": [
          "M1",
          "M2",
          "M7"
        ],
        "start": "2026-09-28",
        "due": "2026-09-30",
        "status": "todo",
        "priority": "high",
        "folder": "T1_chassis-cad/1.1_define-chassis-requirements-and-design",
        "needed": 3
      },
      {
        "id": "t1-2",
        "group": "T1",
        "code": "1.2",
        "title": "Model the aluminum-profile frame",
        "description": "Build the frame from standard slotted aluminum extrusion profiles (e.g., 40×40 / 30×30, 8 mm slot) joined with standard corner brackets and T-nuts, so workshops only cut to length and drill. Include cross-members to carry the drive-motor mounts, the caster and the lift base plate. Use catalogue profile geometry from the supplier, not hand-drawn sections.",
        "deliverable": "Frame sub-assembly (.SLDASM) + preliminary cut list (profile, length, qty)",
        "assignees": [
          "M1"
        ],
        "start": "2026-09-30",
        "due": "2026-10-08",
        "status": "todo",
        "priority": "high",
        "folder": "T1_chassis-cad/1.2_model-the-aluminum-profile-frame",
        "needed": 1
      },
      {
        "id": "t1-3",
        "group": "T1",
        "code": "1.3",
        "title": "Model the 4-side aluminum-sheet enclosure",
        "description": "Enclose the frame on all four sides with aluminum sheets (e.g., 1.5–2 mm), fixed to the profile slots with T-nuts/screws. Include: removable access panel(s) for battery & electronics, LiDAR windows at scanner height (front & rear), cable pass-throughs and ventilation openings. Use SolidWorks Sheet Metal so flat patterns can be exported.",
        "deliverable": "Enclosure parts (sheet metal) + flat-pattern DXFs (draft)",
        "assignees": [
          "M2"
        ],
        "start": "2026-10-05",
        "due": "2026-10-12",
        "status": "todo",
        "priority": "normal",
        "folder": "T1_chassis-cad/1.3_model-the-4-side-aluminum-sheet",
        "needed": 1
      },
      {
        "id": "t1-4",
        "group": "T1",
        "code": "1.4",
        "title": "Frame structural check (FEA)",
        "description": "Static study of the frame under the 100 kg payload (with dynamic factor, as in the GP1 sizing basis) applied through the lift base-plate interface, supported at the two drive wheels and the caster. Report max stress, safety factor (target ≥ 1.5) and max deflection; stiffen the frame where needed.",
        "deliverable": "FEA summary slide (stress, SF, deflection) + any frame changes",
        "assignees": [
          "M1",
          "M2"
        ],
        "start": "2026-10-13",
        "due": "2026-10-15",
        "status": "todo",
        "priority": "high",
        "folder": "T1_chassis-cad/1.4_frame-structural-check-fea",
        "needed": 2
      },
      {
        "id": "t1-5",
        "group": "T1",
        "code": "1.5",
        "title": "Chassis design freeze & manufacturing drawings",
        "description": "Freeze the chassis assembly (frame + enclosure + drive train + lift interface). Produce the final profile cut list with drilling positions, sheet DXFs with bend lines, and a bill of materials for fasteners/brackets. After this date, changes go through the team leader only.",
        "deliverable": "Frozen assembly + drawing pack (PDF) + DXFs + BOM",
        "assignees": [
          "M2",
          "M1"
        ],
        "start": "2026-10-15",
        "due": "2026-10-19",
        "status": "todo",
        "priority": "high",
        "folder": "T1_chassis-cad/1.5_chassis-design-freeze-and-manufacturing",
        "needed": 2
      },
      {
        "id": "t2-1",
        "group": "T2",
        "code": "2.1",
        "title": "Replace omni wheels with the differential layout",
        "description": "Delete the old omni/mecanum wheel assemblies from the CAD. Place two normal drive wheels at mid-length on a common axle line (each with its own motor + encoder) and one swivel caster at the front. Note: with this layout the robot steers by the speed difference between the two drive wheels; the caster is passive and only follows.",
        "deliverable": "Updated wheel layout in the chassis assembly + track width & wheelbase values",
        "assignees": [
          "M3"
        ],
        "start": "2026-09-28",
        "due": "2026-10-01",
        "status": "todo",
        "priority": "high",
        "folder": "T2_wheel-config/2.1_replace-omni-wheels",
        "needed": 1
      },
      {
        "id": "t2-2",
        "group": "T2",
        "code": "2.2",
        "title": "Drive motor & encoder sizing",
        "description": "Calculate the required wheel torque and speed from: total mass (robot + 100 kg payload), target speed (e.g., 0.5 m/s), acceleration, rolling resistance, small floor thresholds and a safety factor. Output the motor spec to take to the market: rated torque (N·m), rpm after gearbox, voltage, encoder resolution (CPR), shaft size, and the wheel diameter/load rating.",
        "deliverable": "Motor + encoder + wheel specification sheet (input for 3.1)",
        "assignees": [
          "M4"
        ],
        "start": "2026-09-29",
        "due": "2026-10-04",
        "status": "todo",
        "priority": "high",
        "folder": "T2_wheel-config/2.2_drive-motor-and-encoder-sizing",
        "needed": 1
      },
      {
        "id": "t2-3",
        "group": "T2",
        "code": "2.3",
        "title": "Model motor, encoder, wheel & caster mounts",
        "description": "Design the motor brackets, wheel hubs/couplings and caster mounting plate, attached to the profile frame. Use the real dimensions of the candidate motor/wheel from market research (download supplier CAD if available). Check wheel alignment and that both drive wheels touch the ground at the same height as the caster.",
        "deliverable": "Mount parts + updated assembly with candidate components",
        "assignees": [
          "M3",
          "M4"
        ],
        "start": "2026-10-03",
        "due": "2026-10-12",
        "status": "todo",
        "priority": "normal",
        "folder": "T2_wheel-config/2.3_model-motor-encoder-wheel-and-caster",
        "needed": 2
      },
      {
        "id": "t2-4",
        "group": "T2",
        "code": "2.4",
        "title": "Stability & tip-over check (CG vs. 3-point support)",
        "description": "With the drive wheels in the middle and only one front caster, the rear of the robot has no support. Check in CAD (Mass Properties) that the center of gravity, empty and with 100 kg raised on the lift, stays inside the support triangle (between the drive axle and the caster) during acceleration and braking. If it does not, propose a rear caster (common for middle-drive robots) and get the leader's decision before the design freeze.",
        "deliverable": "CG / tip-over check note + recommendation (keep 3-point or add rear caster)",
        "assignees": [
          "M3",
          "M4"
        ],
        "start": "2026-10-13",
        "due": "2026-10-15",
        "status": "todo",
        "priority": "high",
        "folder": "T2_wheel-config/2.4_stability-and-tip-over-check-cg-vs-3",
        "needed": 2
      },
      {
        "id": "t3-1",
        "group": "T3",
        "code": "3.1",
        "title": "Suppliers: motors, encoders, wheels & caster",
        "description": "Find at least 3 local/online sources for geared DC motors with encoders matching the spec from 2.2, drive wheels (diameter, load rating, hub/shaft fit) and a heavy-duty swivel caster. Record price, availability, lead time and datasheet link for each option.",
        "deliverable": "Supplier list (drive components) with datasheets",
        "assignees": [
          "M5",
          "M4"
        ],
        "start": "2026-10-01",
        "due": "2026-10-08",
        "status": "todo",
        "priority": "high",
        "folder": "T3_market-research/3.1_suppliers-motors-encoders-wheels",
        "needed": 2
      },
      {
        "id": "t3-2",
        "group": "T3",
        "code": "3.2",
        "title": "Suppliers: aluminum profiles, sheets & connectors",
        "description": "Find suppliers for aluminum extrusion profiles (sizes used in 1.2), aluminum sheets (thickness/grade from 1.3), corner brackets, T-nuts, end caps and fasteners. Ask whether they cut profiles to length and what the cutting tolerance and price per cut are.",
        "deliverable": "Supplier list (aluminum materials) with prices per meter / per sheet",
        "assignees": [
          "M6"
        ],
        "start": "2026-09-30",
        "due": "2026-10-08",
        "status": "todo",
        "priority": "high",
        "folder": "T3_market-research/3.2_suppliers-aluminum-profiles-sheets",
        "needed": 1
      },
      {
        "id": "t3-3",
        "group": "T3",
        "code": "3.3",
        "title": "Workshop survey & quotations",
        "description": "Visit or call workshops for: profile cutting & drilling, sheet laser cutting & bending, CNC/lathe work (pins, shafts, couplings) and the lift parts. Ask for price, lead time, required file formats (DXF/STEP/PDF) and tolerances. Aim for 2–3 quotations per process.",
        "deliverable": "Workshop comparison (process, price, lead time, contact)",
        "assignees": [
          "M6",
          "M10"
        ],
        "start": "2026-10-03",
        "due": "2026-10-12",
        "status": "todo",
        "priority": "high",
        "folder": "T3_market-research/3.3_workshop-survey-and-quotations",
        "needed": 2
      },
      {
        "id": "t3-4",
        "group": "T3",
        "code": "3.4",
        "title": "Detailed pricing table v1",
        "description": "Merge 3.1–3.3 into one pricing table. Columns: Item · Specification · Qty · Supplier (3 options) · Unit price (EGP) · Total · Lead time · Contact · Notes. Add a 10–15% contingency line and highlight the recommended option per item.",
        "deliverable": "Pricing table v1 (shared spreadsheet)",
        "assignees": [
          "M5",
          "M6"
        ],
        "start": "2026-10-08",
        "due": "2026-10-12",
        "status": "todo",
        "priority": "high",
        "folder": "T3_market-research/3.4_detailed-pricing-table-v1",
        "needed": 2
      },
      {
        "id": "t3-5",
        "group": "T3",
        "code": "3.5",
        "title": "Final pricing table & budget approval",
        "description": "Update quantities from the frozen CAD (1.5, 6.3), add lift items, confirm prices, and present the total budget to the team leader for approval.",
        "deliverable": "Approved final pricing table + total budget",
        "assignees": [
          "M5",
          "M6"
        ],
        "start": "2026-10-13",
        "due": "2026-10-15",
        "status": "todo",
        "priority": "high",
        "folder": "T3_market-research/3.5_final-pricing-table-and-budget-approval",
        "needed": 2
      },
      {
        "id": "t3-6",
        "group": "T3",
        "code": "3.6",
        "title": "Lock in workshop deals",
        "description": "Confirm the selected workshops for chassis and lift parts: agreed price, delivery date (must fit Weeks 5–6), payment terms and the drawing formats they need. Book the manufacturing slots.",
        "deliverable": "Confirmed workshop list with agreed prices and delivery dates",
        "assignees": [
          "M6",
          "M10",
          "M5"
        ],
        "start": "2026-10-16",
        "due": "2026-10-19",
        "status": "todo",
        "priority": "high",
        "folder": "T3_market-research/3.6_lock-in-workshop-deals",
        "needed": 3
      },
      {
        "id": "t4-1",
        "group": "T4",
        "code": "4.1",
        "title": "Procure aluminum materials",
        "description": "Buy aluminum profiles (cut to length if the supplier offers it), sheets, corner brackets, T-nuts and fasteners according to the approved pricing table. Keep all receipts for the budget record.",
        "deliverable": "All chassis materials received + receipts",
        "assignees": [
          "M6",
          "M3"
        ],
        "start": "2026-10-20",
        "due": "2026-10-22",
        "status": "todo",
        "priority": "high",
        "folder": "T4_chassis-fabrication/4.1_procure-aluminum-materials",
        "needed": 2
      },
      {
        "id": "t4-2",
        "group": "T4",
        "code": "4.2",
        "title": "Procure motors, encoders, wheels & caster",
        "description": "Buy the 2 drive motors with encoders, 2 drive wheels (+ hubs/couplings) and the caster(s). Check each motor spins and each encoder gives a signal on the bench before accepting.",
        "deliverable": "Drive components received and bench-checked",
        "assignees": [
          "M5",
          "M4"
        ],
        "start": "2026-10-20",
        "due": "2026-10-26",
        "status": "todo",
        "priority": "high",
        "folder": "T4_chassis-fabrication/4.2_procure-motors-encoders-wheels",
        "needed": 2
      },
      {
        "id": "t4-3",
        "group": "T4",
        "code": "4.3",
        "title": "Incoming inspection & workshop hand-off",
        "description": "Check delivered materials against the BOM (dimensions, quantities, sheet thickness). Deliver material + drawing pack (PDF, DXF) to the workshops and confirm the start date.",
        "deliverable": "Signed-off checklist; workshops have material + drawings",
        "assignees": [
          "M2",
          "M3"
        ],
        "start": "2026-10-24",
        "due": "2026-10-26",
        "status": "todo",
        "priority": "normal",
        "folder": "T4_chassis-fabrication/4.3_incoming-inspection-and-workshop-hand",
        "needed": 2
      },
      {
        "id": "t4-4",
        "group": "T4",
        "code": "4.4",
        "title": "Cut & drill profiles; cut & bend sheets",
        "description": "Follow up the workshop: profile cutting and drilling, sheet laser cutting and bending. Check the first parts against the drawings before the full batch is made.",
        "deliverable": "All chassis parts manufactured and checked",
        "assignees": [
          "M1",
          "M2"
        ],
        "start": "2026-10-27",
        "due": "2026-11-01",
        "status": "todo",
        "priority": "high",
        "folder": "T4_chassis-fabrication/4.4_cut-and-drill-profiles-cut-and-bend",
        "needed": 2
      },
      {
        "id": "t4-5",
        "group": "T4",
        "code": "4.5",
        "title": "Frame assembly + drive-train installation",
        "description": "Assemble the profile frame (check squareness with diagonals), then install the motor brackets, motors, encoders, drive wheels and caster. Check both drive wheels are parallel and at equal height.",
        "deliverable": "Rolling chassis",
        "assignees": [
          "M3",
          "M4",
          "M1"
        ],
        "start": "2026-11-01",
        "due": "2026-11-05",
        "status": "todo",
        "priority": "high",
        "folder": "T4_chassis-fabrication/4.5_frame-assembly-drive-train-installation",
        "needed": 3
      },
      {
        "id": "t4-6",
        "group": "T4",
        "code": "4.6",
        "title": "Enclosure sheet fitting",
        "description": "Fit the four aluminum side sheets and access panels; check the LiDAR windows and cable pass-throughs line up; deburr all edges.",
        "deliverable": "Enclosed chassis",
        "assignees": [
          "M2",
          "M6"
        ],
        "start": "2026-11-04",
        "due": "2026-11-06",
        "status": "todo",
        "priority": "normal",
        "folder": "T4_chassis-fabrication/4.6_enclosure-sheet-fitting",
        "needed": 2
      },
      {
        "id": "t4-7",
        "group": "T4",
        "code": "4.7",
        "title": "Chassis initial mechanical tests",
        "description": "Push/roll test (straight-line drift), turning check, encoder read-out while rotating the wheels, static load test with 100 kg on the frame (measure deflection), and tip-over check with the load at the rear edge.",
        "deliverable": "Chassis test sheet with measured results + photos",
        "assignees": [
          "M4",
          "M5",
          "M3"
        ],
        "start": "2026-11-06",
        "due": "2026-11-09",
        "status": "todo",
        "priority": "high",
        "folder": "T4_chassis-fabrication/4.7_chassis-initial-mechanical-tests",
        "needed": 3
      },
      {
        "id": "t5-1",
        "group": "T5",
        "code": "5.1",
        "title": "Search for ready-made four-scissor lift CAD",
        "description": "Search GrabCAD, TraceParts, 3D ContentCentral, Onshape public documents and papers/datasheets of commercial jacking/lifting AGVs for a four-scissor lift that is a proven design, preferably one already used in a real robot. Prefer native SolidWorks or STEP files with complete part geometry (not surface-only meshes).",
        "deliverable": "Long list of 5+ candidate models with links and source",
        "assignees": [
          "M7",
          "M8"
        ],
        "start": "2026-09-28",
        "due": "2026-10-05",
        "status": "todo",
        "priority": "high",
        "folder": "T5_lift-cad/5.1_search-for-ready-made-four-scissor-lift",
        "needed": 2
      },
      {
        "id": "t5-2",
        "group": "T5",
        "code": "5.2",
        "title": "Shortlist & compare candidates",
        "description": "Compare the best 3 against our requirements: fits inside the new chassis footprint, collapsed height, lift stroke (shelf clearance), rated for the 100 kg payload, actuator type available locally (lead screw / linear actuator), and evidence it has been built and used before.",
        "deliverable": "Comparison matrix with scores + recommended model",
        "assignees": [
          "M8",
          "M7"
        ],
        "start": "2026-10-03",
        "due": "2026-10-08",
        "status": "todo",
        "priority": "high",
        "folder": "T5_lift-cad/5.2_shortlist-and-compare-candidates",
        "needed": 2
      },
      {
        "id": "t5-3",
        "group": "T5",
        "code": "5.3",
        "title": "Select model, verify & extract dimensions",
        "description": "Open the selected model in SolidWorks, check it is complete and dimensionally consistent (move the mechanism through its full stroke, check interferences). Extract the key dimensions: arm length, pivot spacing, pin diameters, collapsed/extended height, actuator stroke and force.",
        "deliverable": "Verified lift model + key-dimension sheet",
        "assignees": [
          "M7",
          "M8"
        ],
        "start": "2026-10-08",
        "due": "2026-10-12",
        "status": "todo",
        "priority": "high",
        "folder": "T5_lift-cad/5.3_select-model-verify-and-extract",
        "needed": 2
      },
      {
        "id": "t5-4",
        "group": "T5",
        "code": "5.4",
        "title": "Finalize lift CAD & integrate into chassis",
        "description": "Scale/adapt the lift to our payload platform if needed (without changing proven ratios), then mate it into the chassis assembly. Check clearances to the frame, drive train, wiring and enclosure through the whole stroke.",
        "deliverable": "Final lift sub-assembly integrated in the chassis assembly",
        "assignees": [
          "M8",
          "M7",
          "M1"
        ],
        "start": "2026-10-13",
        "due": "2026-10-15",
        "status": "todo",
        "priority": "high",
        "folder": "T5_lift-cad/5.4_finalize-lift-cad-and-integrate-into",
        "needed": 3
      },
      {
        "id": "t6-1",
        "group": "T6",
        "code": "6.1",
        "title": "Material selection study for the lift",
        "description": "Choose materials per part: arms (Al 6061-T6 as in GP1 vs. mild steel: strength, weight, cost, local availability), pins (hardened steel), bushings/bearings (bronze bushings vs. flanged ball bearings), platform and base plates. Check the arm and pin safety factors (target ≥ 1.5) with the selected material.",
        "deliverable": "Material table per part with justification",
        "assignees": [
          "M9",
          "M10"
        ],
        "start": "2026-10-05",
        "due": "2026-10-12",
        "status": "todo",
        "priority": "high",
        "folder": "T6_lift-materials-and-mfg/6.1_material-selection-study-for-the-lift",
        "needed": 2
      },
      {
        "id": "t6-2",
        "group": "T6",
        "code": "6.2",
        "title": "Manufacturing method per lift part",
        "description": "Define how each part will be made: laser/water-jet cutting of arms from plate, drilling and reaming pivot holes (tolerance for free rotation), turning of pins and spacers, welding or bolting of the frames, and the actuator (lead screw + nut vs. ready linear actuator). Confirm the chosen workshops can do each process.",
        "deliverable": "Process plan (part → process → workshop)",
        "assignees": [
          "M10",
          "M9"
        ],
        "start": "2026-10-08",
        "due": "2026-10-15",
        "status": "todo",
        "priority": "normal",
        "folder": "T6_lift-materials-and-mfg/6.2_manufacturing-method-per-lift-part",
        "needed": 2
      },
      {
        "id": "t6-3",
        "group": "T6",
        "code": "6.3",
        "title": "Finalize materials & lift manufacturing drawings",
        "description": "Lock the material list and produce manufacturing drawings for every custom lift part (dimensions, tolerances on pivot holes, material, quantity) plus DXFs for cut parts.",
        "deliverable": "Lift drawing pack (PDF + DXF) + final lift BOM",
        "assignees": [
          "M9",
          "M8"
        ],
        "start": "2026-10-13",
        "due": "2026-10-19",
        "status": "todo",
        "priority": "high",
        "folder": "T6_lift-materials-and-mfg/6.3_finalize-materials-and-lift",
        "needed": 2
      },
      {
        "id": "t7-1",
        "group": "T7",
        "code": "7.1",
        "title": "Procure lift materials & hardware",
        "description": "Buy plate/bar stock, pins, bushings/bearings, lead screws + nuts (or linear actuator), couplings and fasteners from the approved pricing table.",
        "deliverable": "All lift materials and hardware received",
        "assignees": [
          "M9",
          "M10"
        ],
        "start": "2026-10-20",
        "due": "2026-10-26",
        "status": "todo",
        "priority": "high",
        "folder": "T7_lift-fabrication/7.1_procure-lift-materials-and-hardware",
        "needed": 2
      },
      {
        "id": "t7-2",
        "group": "T7",
        "code": "7.2",
        "title": "Manufacture lift parts at the workshop",
        "description": "Follow up the workshop: cutting of arms and plates, hole reaming, pin turning. Check first-off parts (especially pivot hole spacing, which sets the lift geometry) before the full batch.",
        "deliverable": "All lift parts manufactured and checked",
        "assignees": [
          "M10",
          "M9"
        ],
        "start": "2026-10-27",
        "due": "2026-11-02",
        "status": "todo",
        "priority": "high",
        "folder": "T7_lift-fabrication/7.2_manufacture-lift-parts-at-the-workshop",
        "needed": 2
      },
      {
        "id": "t7-3",
        "group": "T7",
        "code": "7.3",
        "title": "Assemble the four-scissor lift",
        "description": "Assemble the scissor pairs, pins and bushings, then the actuator(s). Check free motion by hand through the full stroke before powering anything.",
        "deliverable": "Assembled lift (bench)",
        "assignees": [
          "M7",
          "M8"
        ],
        "start": "2026-11-02",
        "due": "2026-11-05",
        "status": "todo",
        "priority": "high",
        "folder": "T7_lift-fabrication/7.3_assemble-the-four-scissor-lift",
        "needed": 2
      },
      {
        "id": "t7-4",
        "group": "T7",
        "code": "7.4",
        "title": "Mount the lift on the chassis",
        "description": "Mount the lift base on the chassis frame at the CAD position; check clearances through the full stroke and that the platform is level.",
        "deliverable": "Lift mounted on chassis",
        "assignees": [
          "M7",
          "M8",
          "M9"
        ],
        "start": "2026-11-05",
        "due": "2026-11-07",
        "status": "todo",
        "priority": "normal",
        "folder": "T7_lift-fabrication/7.4_mount-the-lift-on-the-chassis",
        "needed": 3
      },
      {
        "id": "t7-5",
        "group": "T7",
        "code": "7.5",
        "title": "Lift functional & load tests",
        "description": "Full stroke up/down unloaded, then stepped loads (e.g., 25 → 50 → 100 kg). Measure stroke, platform levelness, synchronization between actuators and whether the lift holds position at power-off. Inspect pins and bushings after the test.",
        "deliverable": "Lift test sheet with measured results + video",
        "assignees": [
          "M8",
          "M10",
          "M9"
        ],
        "start": "2026-11-07",
        "due": "2026-11-09",
        "status": "todo",
        "priority": "high",
        "folder": "T7_lift-fabrication/7.5_lift-functional-and-load-tests",
        "needed": 3
      },
      {
        "id": "t7-6",
        "group": "T7",
        "code": "7.6",
        "title": "Mechanical test report & hand-over",
        "description": "Combine the chassis and lift test results, open issues and photos into a short report and hand the mechanical platform over to the electrical and software teams.",
        "deliverable": "Mechanical phase test report (PDF)",
        "assignees": [
          "M7",
          "M1"
        ],
        "start": "2026-11-08",
        "due": "2026-11-09",
        "status": "todo",
        "priority": "high",
        "folder": "T7_lift-fabrication/7.6_mechanical-test-report-and-hand-over",
        "needed": 2
      }
    ]
  }
};
