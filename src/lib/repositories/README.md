# Repositories (Frontend Presentation Mode)

This folder isolates all data access used by UI pages.

## Current mode

- Data source: local JSON files in `/data`.
- Runtime adapter: `src/lib/mock/database.ts`.
- Consumers: pages in `src/app` call repository functions only.

## Why this matters

The UI does not depend on raw JSON or HTTP details.
When backend endpoints are ready, only repository implementations need to change.

## Replace with backend later

1. Keep exported function names and return shapes.
2. Replace `mockDb` calls with `apiClient` calls.
3. Keep page components unchanged.
