# PujaPath architecture

## Purpose

PujaPath helps people discover Durga Puja across Purba Bardhaman: themes, stories, real photographs, map locations, nearby pandals, facilities, crowd estimates, emergency resources, and a constrained AI assistant.

## Boundaries

- **Frontend** never holds secret API keys. OpenAI is called only from FastAPI.
- **Images** are stored in object storage (or local disk in development), not as blobs in PostgreSQL.
- **Maps** use Leaflet + OSM now; Google Maps can be added behind the same map adapter later.
- **AI** retrieves verified database context before generating a reply. It must not invent Puja, addresses, timings, facilities, crowd, or emergency numbers.
- **Demo seed data** is labelled DEMO DATA and is never marked verified.

## Layers

```
React (i18n, routes, map UI)
    → FastAPI REST (/api)
        → services (auth, puja, emergency, crowd, assistant)
            → PostgreSQL
            → object storage
            → OpenAI (assistant only)
```

## Roles

- `USER` — browse, report, optional crowd reports, contact, assistant
- `ADMIN` — verify and manage Puja, images, emergency contacts, reports, users

## Map adapter

`getDirectionsUrl(lat, lng)` opens an external navigation service. PujaPath does not implement its own turn-by-turn engine.

## Verification

Important records include `verified` and `last_verified_at`. Public copy must distinguish verified information from demo or unverified records.
