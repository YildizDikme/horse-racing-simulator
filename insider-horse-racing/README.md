# Horse Racing Simulator

A simple horse racing simulator built with Vue 3, Vite, and Vuex.  
The application allows users to generate horses, create race programs, start and pause races, and observe live race progress and results.

---

## Tech Stack

- Vue 3 (Composition API, script setup)
- Vite
- Vuex (state management)
- Vitest (unit testing)
- CSS (custom responsive styling)

---

## Features

- Generate horses with randomized conditions
- Create race programs with multiple rounds and distances
- Start and pause race simulation
- Live horse movement on the track
- Automatic result calculation per round
- Responsive layout for desktop, tablet, and mobile
- Unit tests for critical Vuex actions

---

## Architecture Overview

### State Management (Vuex)

- State: race status, horses, program, positions, results
- Actions: race flow logic such as generateProgram, startOrPause, and tick
- Mutations: synchronous state updates
- Getters: derived and computed race data

### Components

- AppHeader: global actions and race status
- HorseListPanel: displays generated horses
- ProgramPanel: displays race rounds and distances
- TrackPanel: visual race track and live animations
- ResultsPanel: round-based race results

---

## Testing

Unit tests are written using Vitest.

Covered scenarios include:

- Program generation
- Race start and pause state transitions
- Tick dispatch behavior

Run unit tests with:

```bash
npx vitest
```
