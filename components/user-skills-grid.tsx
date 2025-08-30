"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SkillCard } from "@/components/skill-card"
import type { UserProfile } from "@/types/user"

interface UserSkillsGridProps {
  profile: UserProfile
  onSkillSelect?: (skillId: string) => void
}

export function UserSkillsGrid({ profile, onSkillSelect }: UserSkillsGridProps) {
  const skillsByCategory = profile.skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<string, typeof profile.skills>,
  )

  const categoryNames = {
    frontend: "Frontend",
    backend: "Backend",
    design: "Diseño",
    other: "Otras",
  }

  return (
    <div className="space-y-6">
      {Object.entries(skillsByCategory).map(([category, skills]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg">
              {categoryNames[category as keyof typeof categoryNames] || category}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className={`cursor-pointer transition-transform hover:scale-105 ${
                    onSkillSelect ? "hover:shadow-md" : ""
                  }`}
                  onClick={() => onSkillSelect?.(skill.id)}
                >
                  <SkillCard skill={skill} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
