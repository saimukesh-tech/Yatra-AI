# YatraAI

**Plan Smarter. Travel Better.**

An AI-personalized travel planner built for a hackathon demo. YatraAI turns a destination, budget, available time and a handful of interests into a day-by-day itinerary, checks it against your constraints, and can match you with other travelers heading the same way to split transport costs.

## Stack

React 18 + TypeScript + Vite + Tailwind CSS + React Router + lucide-react icons.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

```bash
npm run build    # type-checks and builds to dist/
npm run preview  # serves the production build locally
```

## Demo flow

The primary path, end to end:

```
/  ->  /plan  ->  /planning  ->  /itinerary  ->  /group-match  ->  /transport
```

Suggested demo inputs: destination **Hyderabad**, budget **₹3,000**, duration **2 days**, interests **History, Food, Photography**, constraint *"Prefer less travel"*. On the itinerary page, try **Optimize Trip** (lower the budget/time sliders) to see the before/after comparison, then **Find Compatible Travelers** to see the AI Group Travel Match and shared-transport savings.

Other destinations with rich mock data: Araku Valley, Hampi, Kerala, Ladakh, Madurai, Goa, Ooty, Bengaluru, Delhi, Mumbai, Chennai.

## Project structure

```
src/
  components/    UI building blocks, grouped by domain (common, navigation, hero,
                 destinations, trip, itinerary, group, transport, map, ui)
  pages/         One folder per route
  layouts/       MainLayout (navbar + outlet + footer)
  hooks/         useTripPlanner, useItinerary, useGroupMatching
  context/       TripContext (shared trip/itinerary/group state), ToastContext
  services/      itineraryService, groupMatchService, transportService, api.ts
  utils/         matching.ts (compatibility scoring), constraints.ts (trip health
                 checks), budget.ts
  types/         trip.ts, itinerary.ts, traveler.ts, transport.ts
  data/          mockDestinations, mockAttractions, mockTravelers
```

Business logic (itinerary generation, compatibility scoring, constraint checks) lives entirely in `services/` and `utils/`, not in components — so the mock data sources can be swapped for real API calls later without touching the UI.

## Notes on scope

- **No real photography or map/transport/booking APIs are connected.** Destination "photography" is an illustrated SVG scene system (`components/ui/SceneVisual.tsx`) built specifically for this project so every card, hero and thumbnail shares one consistent visual language. The trip route map is a stylised mock, not a real geocoded map. Shared-transport pricing is clearly labelled **"Estimated"** everywhere it appears — no vehicle is ever booked.
- Saved trips persist to `localStorage` in the browser so **My Trips** survives a refresh; nothing is sent to a server.
- The AI Group Travel Match pool is a static set of mock travelers per destination (`src/data/mockTravelers.ts`), scored against your trip with a modular, weighted compatibility function (`src/utils/matching.ts`: Interest 40% / Time 30% / Destination 20% / Budget 10%) that's designed to be swapped for a real backend later.
