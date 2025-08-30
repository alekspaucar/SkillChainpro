"use client"

import { useState } from "react"
import type { UserInteraction } from "@/types/dashboard"

interface SendTokensParams {
  recipientAddress: string
  recipientName?: string
  skillId: string
  skillName: string
  amount: number
  message?: string
}

export function useTokenSender(
  userAddress: string | null,
  spendTokens: (amount: number) => boolean,
  addInteraction: (interaction: UserInteraction) => void,
) {
  const [isLoading, setIsLoading] = useState(false)

  const sendTokens = async (params: SendTokensParams): Promise<boolean> => {
    setIsLoading(true)

    if (!userAddress) {
      setIsLoading(false)
      return false
    }

    // Check if user has enough tokens before proceeding
    const success = spendTokens(params.amount)

    if (!success) {
      setIsLoading(false)
      return false
    }

    try {
      // Simulate blockchain transaction delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update recipient's skill tokens (in real app, this would be on blockchain)
      const recipientProfile = localStorage.getItem(`profile_${params.recipientAddress}`)
      if (recipientProfile) {
        const profile = JSON.parse(recipientProfile)
        const skillIndex = profile.skills.findIndex((s: any) => s.id === params.skillId)
        if (skillIndex !== -1) {
          profile.skills[skillIndex].tokensReceived += params.amount
          profile.totalTokensReceived += params.amount
          localStorage.setItem(`profile_${params.recipientAddress}`, JSON.stringify(profile))
        }
      }

      // Add to interactions
      const interaction: UserInteraction = {
        address: params.recipientAddress,
        name: params.recipientName,
        lastInteraction: new Date(),
        tokensExchanged: params.amount,
        skills: [params.skillName],
      }

      addInteraction(interaction)

      // Update sender's total sent tokens
      const senderProfile = localStorage.getItem(`profile_${userAddress}`)
      if (senderProfile) {
        const profile = JSON.parse(senderProfile)
        profile.totalTokensSent += params.amount
        localStorage.setItem(`profile_${userAddress}`, JSON.stringify(profile))
      }

      return true
    } catch (error) {
      console.error("Error sending tokens:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return { sendTokens, isLoading }
}
