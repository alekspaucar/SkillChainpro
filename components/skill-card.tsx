"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SkillManagementModal } from "@/components/skill-management-modal"
import type { Skill } from "@/types/user"
import { Star, Edit, Trash2 } from "lucide-react"

interface SkillCardProps {
  skill: Skill
  isEditable?: boolean
  onEdit?: (skill: Skill) => void
  onDelete?: (skillId: string) => void
}

export function SkillCard({ skill, isEditable = false, onEdit, onDelete }: SkillCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "frontend":
        return "bg-primary/10 text-primary"
      case "backend":
        return "bg-accent/10 text-accent"
      case "design":
        return "bg-secondary/50 text-secondary-foreground"
      case "mobile":
        return "bg-blue-100 text-blue-700"
      case "devops":
        return "bg-green-100 text-green-700"
      case "data":
        return "bg-purple-100 text-purple-700"
      case "ai":
        return "bg-pink-100 text-pink-700"
      case "blockchain":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className="relative group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-sm mb-1">{skill.name}</h3>
            <Badge variant="secondary" className={getCategoryColor(skill.category)}>
              {skill.category}
            </Badge>
          </div>

          {isEditable && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <SkillManagementModal
                mode="edit"
                skill={skill}
                onSave={onEdit!}
                trigger={
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                    <Edit className="h-3 w-3" />
                  </Button>
                }
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete?.(skill.id)}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < skill.level ? "fill-accent text-accent" : "text-muted-foreground"}`}
              />
            ))}
          </div>

          <div className="text-xs text-muted-foreground">{skill.tokensReceived} tokens</div>
        </div>
      </CardContent>
    </Card>
  )
}
