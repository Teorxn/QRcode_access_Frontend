# API layer

This folder centralizes all calls to the backend.

## Structure

- `endpoints.ts`: backend route map.
- `employees.ts`: employee domain requests.
- `history.ts`: access history requests.
- `scan.ts`: QR validation and dashboard stats requests.
- `index.ts`: public barrel exports.

## Usage

```ts
import { employeesApi } from "@/lib/api";

const employees = await employeesApi.list({ search: "Maria" });
```

## Environment

Set `NEXT_PUBLIC_API_URL` in `.env.local`.
