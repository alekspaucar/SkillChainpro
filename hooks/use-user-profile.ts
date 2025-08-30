"use client"

import { useState, useEffect } from "react"
import type { UserProfile } from "@/types/user"

// Mock user database
const MOCK_USERS: Record<string, UserProfile> = {
  "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4": {
    address: "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    name: "Alice Developer",
    bio: "Full-stack developer especializada en React y Node.js. Me encanta crear interfaces de usuario intuitivas y APIs robustas.",
    skills: [
      { id: "react", name: "React", category: "frontend", level: 5, tokensReceived: 28 },
      { id: "typescript", name: "TypeScript", category: "frontend", level: 4, tokensReceived: 22 },
      { id: "nodejs", name: "Node.js", category: "backend", level: 4, tokensReceived: 18 },
      { id: "graphql", name: "GraphQL", category: "backend", level: 3, tokensReceived: 12 },
    ],
    totalTokensReceived: 80,
    totalTokensSent: 45,
    joinedAt: new Date("2024-01-15"),
  },
  "0x8ba1f109551bD432803012645Hac189451b934": {
    address: "0x8ba1f109551bD432803012645Hac189451b934",
    name: "Bob Designer",
    bio: "UX/UI Designer con 5 años de experiencia. Especializado en design systems y prototipado interactivo.",
    skills: [
      { id: "ux-design", name: "UX Design", category: "design", level: 5, tokensReceived: 35 },
      { id: "ui-design", name: "UI Design", category: "design", level: 4, tokensReceived: 28 },
      { id: "figma", name: "Figma", category: "design", level: 5, tokensReceived: 25 },
      { id: "prototyping", name: "Prototyping", category: "design", level: 4, tokensReceived: 15 },
    ],
    totalTokensReceived: 103,
    totalTokensSent: 32,
    joinedAt: new Date("2024-02-20"),
  },
  "0x1234567890123456789012345678901234567890": {
    address: "0x1234567890123456789012345678901234567890",
    name: "Charlie Backend",
    bio: "Backend engineer enfocado en arquitecturas escalables y microservicios. Python y Go enthusiast.",
    skills: [
      { id: "python", name: "Python", category: "backend", level: 5, tokensReceived: 32 },
      { id: "django", name: "Django", category: "backend", level: 4, tokensReceived: 24 },
      { id: "postgresql", name: "PostgreSQL", category: "backend", level: 4, tokensReceived: 18 },
      { id: "docker", name: "Docker", category: "backend", level: 3, tokensReceived: 14 },
      { id: "go", name: "Go", category: "backend", level: 3, tokensReceived: 10 },
    ],
    totalTokensReceived: 98,
    totalTokensSent: 28,
    joinedAt: new Date("2024-03-10"),
  },
}

export function useUserProfile(address: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true)
      setError(null)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      const userProfile = MOCK_USERS[address]

      if (userProfile) {
        setProfile(userProfile)
      } else {
        setError("Usuario no encontrado")
      }

      setIsLoading(false)
    }

    if (address) {
      loadProfile()
    }
  }, [address])

  return { profile, isLoading, error }
}
