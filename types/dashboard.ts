export interface TokenBalance {
  available: number
  used: number
  total: number
  resetTime: Date
}

export interface UserInteraction {
  address: string
  name?: string
  lastInteraction: Date
  tokensExchanged: number
  skills: string[]
}

export interface SearchResult {
  address: string
  name?: string
  skills: string[]
  totalTokensReceived: number
}
