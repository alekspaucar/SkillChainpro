"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Edit, X } from "lucide-react"
import type { Skill } from "@/types/user"

interface SkillManagementModalProps {
  mode: "add" | "edit"
  skill?: Skill
  onSave: (skill: Omit<Skill, "tokensReceived"> | Skill) => void
  trigger: React.ReactNode
}

const SKILL_CATEGORIES = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "design", label: "Design" },
  { value: "mobile", label: "Mobile" },
  { value: "devops", label: "DevOps" },
  { value: "data", label: "Data Science" },
  { value: "ai", label: "AI/ML" },
  { value: "blockchain", label: "Blockchain" },
  { value: "other", label: "Otros" },
]

const SKILL_LEVELS = [
  { value: 1, label: "Principiante" },
  { value: 2, label: "Intermedio" },
  { value: 3, label: "Avanzado" },
  { value: 4, label: "Experto" },
  { value: 5, label: "Master" },
]

export function SkillManagementModal({ mode, skill, onSave, trigger }: SkillManagementModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    id: skill?.id || "",
    name: skill?.name || "",
    category: skill?.category || "other",
    level: skill?.level || 1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) return

    const skillData = {
      ...formData,
      id: formData.id || formData.name.toLowerCase().replace(/\s+/g, "-"),
    }

    if (mode === "edit" && skill) {
      onSave({ ...skillData, tokensReceived: skill.tokensReceived })
    } else {
      onSave(skillData)
    }

    setOpen(false)

    // Reset form if adding new skill
    if (mode === "add") {
      setFormData({
        id: "",
        name: "",
        category: "other",
        level: 1,
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {mode === "add" ? (
              <>
                <Plus className="w-4 h-4" />
                Agregar Habilidad
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                Editar Habilidad
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la habilidad</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="ej. React, Node.js, UI Design"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SKILL_CATEGORIES.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Nivel</Label>
            <Select
              value={formData.level.toString()}
              onValueChange={(value) => setFormData({ ...formData, level: Number.parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SKILL_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value.toString()}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {mode === "add" ? "Agregar" : "Guardar"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
