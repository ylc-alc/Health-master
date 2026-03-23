# Personalised Workout Planner

A mobile-friendly, single-page HTML workout planner designed for home training with minimal equipment.

This project provides a **4-week structured workout programme** with a simple planner, guided session flow, progress tracking in the browser, and lightweight day-to-day adjustments such as **Easier mode**, **Low energy day**, and **Joint-friendly day**.

## Overview

The planner was built for a user who trains at home with:

- **1.5 kg dumbbell**
- **floor mat**
- **no bench**
- **no chair**

The product is intentionally lightweight. It does not require a backend, account system, or external dependencies. All progress is stored locally in the browser using `localStorage`.

## Features

- **4-week pre-designed programme**
- **4 workout days per week**
- **One visible week at a time** for a cleaner interface
- **Sequential progression** based on the next incomplete session
- **Single primary Start workout CTA**
- **Session details view** before training
- **Pre-start summary sheet** with effective session timing
- **Live workout timer** with round and exercise flow
- **Easier mode** for reduced density
- **Today’s adjustment** options:
  - Standard day
  - Low energy day
  - Joint-friendly day
- **Mobile-first overlay design**
- **Browser-only progress tracking**
- **Orange-red energetic colour palette**

## Why this project exists

Many lightweight workout generators are structurally weak in one or more of these ways:

- workouts finish too quickly
- there is no real progression
- sessions are too random
- exercise choices assume equipment the user does not have
- mobile usability is poor during an active workout

This planner was designed to address those issues while still staying simple enough to run as a single HTML file.

## Tech stack

- **HTML**
- **CSS**
- **Vanilla JavaScript**
- **localStorage** for saved progress and settings

No framework or build step is required.

## Getting started

### Option 1: Open directly
Download the HTML file and open it in a browser.

### Option 2: Serve locally
If you prefer to run it through a local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## How it works

### Programme structure
The planner uses a **fixed schedule**, not random daily generation.

Each programme session is mapped in sequence, for example:

- Week 1 Day 1 → specific workout template
- Week 1 Day 2 → specific workout template
- ...
- Week 4 Day 4 → specific workout template

### Session flow
When the user clicks **Start workout**, the app:

1. finds the **next incomplete session**
2. applies current settings such as Easier mode or Today’s adjustment
3. shows the **pre-start summary**
4. launches the session timer
5. marks the session complete when finished

### Progress logic
The app progresses by the **next incomplete planned session**, not by calendar date.

This avoids problems when users miss days or train on an irregular schedule.

## Mobile UX principles

The planner was designed to work well on phones during real training.

Key mobile decisions:

- full-height workout overlays
- sticky headers and action areas
- cleaner one-week-only planner view
- horizontal planner layout
- larger touch targets
- background scroll lock when overlays are open

## Project structure

This is currently a single-file application.

```text
personalised_workout_planner_v8.html
```

The file contains:

- layout
- styling
- programme data
- workout templates
- timer logic
- planner rendering
- progress storage logic

If the project is later expanded, a sensible split would be:

```text
/
├─ index.html
├─ styles.css
├─ app.js
├─ data/
│  ├─ workouts.js
│  └─ programme.js
└─ docs/
   └─ handover.md
```

## Design constraints

This project is intentionally conservative because of the user setup:

- very light dumbbell only
- no bench or chair support
- small home training space
- training should stay practical and low-risk

For that reason, progression is driven mainly by:

- rounds
- time under tension
- tempo control
- movement quality
- rest management
- simple exercise variation

rather than heavy external load.

## Current limitations

- No cloud sync or multi-device support
- No user account system
- No automatic long-term adaptation based on performance history
- No embedded exercise video library
- No analytics or reporting layer
- All persistence depends on the current browser’s local storage

## Roadmap

Potential future improvements:

- exercise-level substitutions selectable by the user
- richer pre-session planning flow
- post-workout feedback input
- completion history and adherence summaries
- optional export/import of progress
- split CSS/JS/data into separate files for maintainability
- accessibility pass for keyboard and screen reader behaviour

## Contributing

Contributions are welcome.

If you want to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on both desktop and mobile
5. Open a pull request with a clear description

Please keep changes aligned with the core product principles:

- simple and low-friction
- mobile-first
- safe for minimal-equipment home use
- no unnecessary complexity

## Testing checklist

Before merging changes, test:

- planner renders correctly on desktop and mobile
- only the current week is shown
- future sessions remain locked
- the main Start workout CTA loads the correct session
- session details and pre-start summary open correctly
- timer controls are clickable
- Easier mode changes effective session density
- Today’s adjustment changes the live session behaviour
- completion updates the planner state
- progress persists after refresh
- reset programme clears state correctly

## Security and privacy

This project does not send workout data to a server.

All progress and settings are stored locally in the browser. Users should be aware that clearing browser storage will remove saved progress.

## Licence

Choose a licence for this project and add it as `LICENSE`.

A common choice for open-source personal tools is the **MIT License**.

## Acknowledgements

Built as a lightweight custom workout planner for a home-training use case where existing general fitness tools were either too generic or too dependent on unavailable equipment.
