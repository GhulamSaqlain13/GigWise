"use client"

import { useCallback, useSyncExternalStore } from "react"
import type { Audit, ExperimentSnapshot, GigDraft } from "@/lib/tools/types"
import type { Portfolio } from "@/lib/portfolio/types"

// DEMO PERSISTENCE ONLY. Mirrors the HTML prototype, which kept everything in
// localStorage. Each store will move to Supabase (see CLAUDE.md → Roadmap):
//   drafts → gigs + gig_versions, audits → gig_audits, experiments → gig_metrics
//   + experiments, tasks → roadmap_tasks, portfolios → portfolio_projects.
const defaults = {
  drafts: [] as GigDraft[],
  audits: [] as Audit[],
  experiments: [] as ExperimentSnapshot[],
  tasks: [] as number[],
  portfolios: [] as Portfolio[],
}

export type StoreKey = keyof typeof defaults
type StoreValue<K extends StoreKey> = (typeof defaults)[K]

const PREFIX = "gw_"
const listeners = new Set<() => void>()
const cache = new Map<StoreKey, { raw: string | null; value: unknown }>()

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener("storage", listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", listener)
  }
}

function read<K extends StoreKey>(key: K): StoreValue<K> {
  let raw: string | null = null
  try {
    raw = localStorage.getItem(PREFIX + key)
  } catch {
    // Private mode / blocked storage: fall back to defaults.
  }
  const hit = cache.get(key)
  if (hit && hit.raw === raw) return hit.value as StoreValue<K>

  let value: StoreValue<K> = defaults[key]
  if (raw) {
    try {
      value = JSON.parse(raw)
    } catch {
      // Corrupt entry: ignore.
    }
  }
  cache.set(key, { raw, value })
  return value
}

export function useLocalStore<K extends StoreKey>(key: K) {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => defaults[key],
  )

  const setValue = useCallback(
    (next: StoreValue<K> | ((prev: StoreValue<K>) => StoreValue<K>)) => {
      const resolved =
        typeof next === "function"
          ? (next as (prev: StoreValue<K>) => StoreValue<K>)(read(key))
          : next
      try {
        localStorage.setItem(PREFIX + key, JSON.stringify(resolved))
      } catch {
        throw new Error("Browser storage is full or blocked.")
      }
      listeners.forEach((l) => l())
    },
    [key],
  )

  return [value, setValue] as const
}
