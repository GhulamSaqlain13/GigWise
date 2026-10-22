export type GigDraft = {
  title: string
  description: string
  price: number
  days: number
  createdAt: string
}

export type Audit = {
  title: string
  description: string
  issues: string[]
  score: number
  url: string
  username: string
  createdAt: string
}

export type ExperimentSnapshot = {
  change: string
  impressions: number
  clicks: number
  orders: number
  createdAt: string
}
