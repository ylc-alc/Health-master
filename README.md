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
