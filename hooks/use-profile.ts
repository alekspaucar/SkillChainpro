"use client"

import { useState, useEffect } from "react"
import type { UserProfile, Skill } from "@/types/user"

const DEFAULT_SKILLS: Omit<Skill, "tokensReceived">[] = [
  { id: "frontend", name: "Frontend Development", category: "frontend", level: 1 },
  { id: "backend", name: "Backend Development", category: "backend", level: 1 },
  { id: "ux-design", name: "UX Design", category: "design", level: 1 },
  { id: "ui-design", name: "UI Design", category: "design", level: 1 },
  { id: "react", name: "React", category: "frontend", level: 1 },
  { id: "nodejs", name: "Node.js", category: "backend", level: 1 },
]

export function useProfile(address: string | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!address) {
      setProfile(null)
      return
    }

    setIsLoading(true)

    // Simulate loading profile data (in real app, this would be from blockchain/API)
    const savedProfile = localStorage.getItem(`profile_${address}`)

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    } else {
      // Create default profile
      const defaultProfile: UserProfile = {
        address,
        name: "",
        bio: "",
        skills: DEFAULT_SKILLS.map((skill) => ({ ...skill, tokensReceived: 0 })),
        totalTokensReceived: 0,
        totalTokensSent: 0,
        joinedAt: new Date(),
      }
      setProfile(defaultProfile)
    }

    setIsLoading(false)
  }, [address])

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!profile) return

    const updatedProfile = { ...profile, ...updates }
    setProfile(updatedProfile)
    localStorage.setItem(`profile_${profile.address}`, JSON.stringify(updatedProfile))
  }

  const updateSkill = (skillId: string, updates: Partial<Skill>) => {
    if (!profile) return

    const updatedSkills = profile.skills.map((skill) => (skill.id === skillId ? { ...skill, ...updates } : skill))

    updateProfile({ skills: updatedSkills })
  }

  const addSkill = (skill: Omit<Skill, "tokensReceived">) => {
    if (!profile) return

    const newSkill: Skill = { ...skill, tokensReceived: 0 }
    updateProfile({ skills: [...profile.skills, newSkill] })
  }

  const removeSkill = (skillId: string) => {
    if (!profile) return

    const updatedSkills = profile.skills.filter((skill) => skill.id !== skillId)
    updateProfile({ skills: updatedSkills })
  }

  return {
    profile,
    isLoading,
    updateProfile,
    updateSkill,
    addSkill,
    removeSkill,
  }
}
