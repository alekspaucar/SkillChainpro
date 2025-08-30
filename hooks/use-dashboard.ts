"use client"

import { useState, useEffect } from "react"
import type { TokenBalance, UserInteraction, SearchResult } from "@/types/dashboard"

export function useDashboard(userAddress: string | null) {
  const [tokenBalance, setTokenBalance] = useState<TokenBalance>({
    available: 20,
    used: 0,
    total: 20,
    resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
  })

  const [recentInteractions, setRecentInteractions] = useState<UserInteraction[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!userAddress) return

    // Load saved data from localStorage
    const savedBalance = localStorage.getItem(`tokens_${userAddress}`)
    const savedInteractions = localStorage.getItem(`interactions_${userAddress}`)

    if (savedBalance) {
      const balance = JSON.parse(savedBalance)
      // Check if reset time has passed
      if (new Date() > new Date(balance.resetTime)) {
        // Reset daily tokens
        setTokenBalance({
          available: 20,
          used: 0,
          total: 20,
          resetTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        })
      } else {
        setTokenBalance({
          ...balance,
          resetTime: new Date(balance.resetTime),
        })
      }
    }

    if (savedInteractions) {
      setRecentInteractions(JSON.parse(savedInteractions))
    } else {
      // Mock some initial interactions
      const mockInteractions: UserInteraction[] = [
        {
          address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
          name: "Alice Developer",
          lastInteraction: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          tokensExchanged: 5,
          skills: ["React", "TypeScript"],
        },
        {
          address: "0x8ba1f109551bD432803012645Hac189451b934",
          name: "Bob Designer",
          lastInteraction: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          tokensExchanged: 3,
          skills: ["UX Design", "Figma"],
        },
      ]
      setRecentInteractions(mockInteractions)
      localStorage.setItem(`interactions_${userAddress}`, JSON.stringify(mockInteractions))
    }
  }, [userAddress])

  const useTokens = (amount: number) => {
    if (tokenBalance.available >= amount) {
      const newBalance = {
        ...tokenBalance,
        available: tokenBalance.available - amount,
        used: tokenBalance.used + amount,
      }
      setTokenBalance(newBalance)
      if (userAddress) {
        localStorage.setItem(`tokens_${userAddress}`, JSON.stringify(newBalance))
      }
      return true
    }
    return false
  }

  const addInteraction = (interaction: UserInteraction) => {
    const updatedInteractions = [interaction, ...recentInteractions.filter((i) => i.address !== interaction.address)]
    setRecentInteractions(updatedInteractions)
    if (userAddress) {
      localStorage.setItem(`interactions_${userAddress}`, JSON.stringify(updatedInteractions))
    }
  }

  const searchUser = async (address: string): Promise<SearchResult | null> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock search results
    const mockUsers: SearchResult[] = [
      {
        address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
        name: "Alice Developer",
        skills: ["React", "TypeScript", "Node.js"],
        totalTokensReceived: 45,
      },
      {
        address: "0x8ba1f109551bD432803012645Hac189451b934",
        name: "Bob Designer",
        skills: ["UX Design", "Figma", "Prototyping"],
        totalTokensReceived: 32,
      },
      {
        address: "0x1234567890123456789012345678901234567890",
        name: "Charlie Backend",
        skills: ["Python", "Django", "PostgreSQL"],
        totalTokensReceived: 28,
      },
    ]

    setIsLoading(false)
    return mockUsers.find((user) => user.address.toLowerCase() === address.toLowerCase()) || null
  }

  return {
    tokenBalance,
    recentInteractions,
    isLoading,
    useTokens,
    addInteraction,
    searchUser,
  }
}
