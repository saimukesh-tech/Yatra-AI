// Thin fetch wrapper. Not used by the mock services yet, but every
// service module is written against this contract so swapping mock logic
// for a real backend later is a one-file change per service.
//
// A matching basic FastAPI backend now exists in backend/ (see
// backend/README.md) and serves the exact same camelCase JSON shapes as
// src/types/*.ts under an /api prefix (e.g. GET /api/destinations,
// POST /api/trips/{id}/generate). To point this app at it: set
// VITE_API_BASE_URL=http://localhost:8000/api in a local .env (see
// .env.example) and swap a service's mock-returning body for
// `return apiFetch(...)`. No service does this yet - the mock services
// remain the default so the UI keeps working with zero setup.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export class ApiError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!res.ok) {
    throw new ApiError(`Request to ${path} failed`, res.status)
  }
  return res.json() as Promise<T>
}

// Simulates network latency so loading/AI-planning states feel real
// against mock data. Swap for real awaited fetches later.
export const simulateLatency = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
