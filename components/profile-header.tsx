"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { UserProfile } from "@/types/user"
import { Edit, Wallet, LogOut } from "lucide-react"

interface ProfileHeaderProps {
  profile: UserProfile
  isOwnProfile?: boolean
  onEdit?: () => void
  onLogout?: () => void
}

export function ProfileHeader({ profile, isOwnProfile = false, onEdit, onLogout }: ProfileHeaderProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{profile.name || "Usuario Anónimo"}</h1>
                <p className="text-sm text-muted-foreground">
                  {profile.address.slice(0, 6)}...{profile.address.slice(-4)}
                </p>
              </div>
            </div>

            {profile.bio && <p className="text-sm text-muted-foreground mb-4">{profile.bio}</p>}
          </div>

          {isOwnProfile && (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={onLogout}
                className="hover:bg-accent hover:text-accent-foreground bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{profile.totalTokensReceived}</div>
            <div className="text-xs text-muted-foreground">Tokens Recibidos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{profile.totalTokensSent}</div>
            <div className="text-xs text-muted-foreground">Tokens Enviados</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
