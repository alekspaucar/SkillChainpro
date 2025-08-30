export interface Skill {
  id: string
  name: string
  category: "frontend" | "backend" | "design" | "other"
  level: 1 | 2 | 3 | 4 | 5
  tokensReceived: number
}

export interface UserProfile {
  address: string
  name?: string
  bio?: string
  skills: Skill[]
  totalTokensReceived: number
  totalTokensSent: number
  joinedAt: Date
}
