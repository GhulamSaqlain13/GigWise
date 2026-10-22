"use client"

import { useSyncExternalStore } from "react"

const noopSubscribe = () => () => {}

// cacheComponents forbids new Date() during prerender, even in Client
// Components. The server snapshot renders nothing; the client fills it in.
export function CurrentYear() {
  return useSyncExternalStore(noopSubscribe, () => new Date().getFullYear(), () => null)
}
