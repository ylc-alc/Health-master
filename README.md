# Personalised 4-Week Workout Planner

A static GitHub Pages-friendly workout planner for short home sessions using a mat and one 1.5 kg dumbbell.

## Structure

- `index.html`  
  Page shell and overlay markup only

- `css/`  
  Split stylesheets by concern

- `js/data/`  
  Workout templates and schedule

- `js/app.js`  
  Current working runtime entry point

- `js/state.js`  
  Shared mutable runtime state and cached DOM references

- `js/storage.js`  
  Local storage and import/export helpers

- `js/utils/`  
  Formatting and guard helpers

## Current refactor stage

This is a first-cut modular split from a single-file project.

What is already split:
- HTML shell
- CSS
- workout data
- schedule
- storage helpers
- formatting helpers

What is intentionally still centralised:
- most runtime logic in `js/app.js`

The placeholder files under `js/render/`, `js/actions/`, and `js/player/` are reserved for the next extraction phase.

## Run locally

Because this uses ES modules, open it through a local server rather than double-clicking the file directly.

Examples:
- VS Code Live Server
- Python simple server
- any static local dev server

## Hosting

This project is suitable for GitHub Pages as a static site.
