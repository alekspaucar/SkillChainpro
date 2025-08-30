"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { UserProfile } from "@/types/user"
import { Wallet, Calendar, Send } from "lucide-react"

interface UserProfileHeaderProps {
  profile: UserProfile
  onSendTokens?: () => void
}

export function UserProfileHeader({ profile, onSendTokens }: UserProfileHeaderProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
    }).format(date)
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{profile.name || "Usuario Anónimo"}</h1>
                <p className="text-sm text-muted-foreground">
                  {profile.address.slice(0, 8)}...{profile.address.slice(-6)}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Calendar className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Miembro desde {formatDate(profile.joinedAt)}</span>
                </div>
              </div>
            </div>

            {profile.bio && (
              <p className="text-sm text-muted-foreground mb-4 max-w-2xl leading-relaxed">{profile.bio}</p>
            )}
          </div>

          {onSendTokens && (
            <Button onClick={onSendTokens} className="ml-4">
              <Send className="w-4 h-4 mr-2" />
              Enviar Tokens
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{profile.totalTokensReceived}</div>
            <div className="text-xs text-muted-foreground">Tokens Recibidos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{profile.totalTokensSent}</div>
            <div className="text-xs text-muted-foreground">Tokens Enviados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">{profile.skills.length}</div>
            <div className="text-xs text-muted-foreground">Habilidades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-foreground">
              {Math.round(profile.skills.reduce((acc, skill) => acc + skill.level, 0) / profile.skills.length)}
            </div>
            <div className="text-xs text-muted-foreground">Nivel Promedio</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
