"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { UserInteraction } from "@/types/dashboard"
import { User, ExternalLink, Clock } from "lucide-react"
import Link from "next/link"

interface RecentInteractionsProps {
  interactions: UserInteraction[]
}

export function RecentInteractions({ interactions }: RecentInteractionsProps) {
  const formatTimeAgo = (date: string | Date | number) => {
  const now = new Date()
  let dateObj: Date
  
  // Convertir a Date según el tipo
  if (date instanceof Date) {
    dateObj = date
  } else if (typeof date === 'string') {
    dateObj = new Date(date)
  } else if (typeof date === 'number') {
    dateObj = new Date(date * 1000) // Asumir timestamp en segundos
  } else {
    return "Fecha inválida"
  }
  
  // Verificar si la fecha es válida
  if (isNaN(dateObj.getTime())) {
    return "Fecha inválida"
  }
  
  const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "Hace menos de 1h"
  if (diffInHours < 24) return `Hace ${diffInHours}h`
  const diffInDays = Math.floor(diffInHours / 24)
  return `Hace ${diffInDays}d`
}

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Interacciones Recientes</CardTitle>
      </CardHeader>
      <CardContent>
        {interactions.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground mb-2">No hay interacciones recientes</p>
            <p className="text-xs text-muted-foreground">Busca usuarios y envía tokens para comenzar a interactuar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {interactions.map((interaction) => (
              <div key={interaction.address} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{interaction.name || "Usuario Anónimo"}</h4>
                    <p className="text-xs text-muted-foreground">
                      {interaction.address.slice(0, 6)}...{interaction.address.slice(-4)}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex flex-wrap gap-1">
                        {interaction.skills.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {interaction.skills.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{interaction.skills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-accent mb-1">{interaction.tokensExchanged} tokens</div>
                  <div className="flex items-center text-xs text-muted-foreground mb-2">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatTimeAgo(interaction.lastInteraction)}
                  </div>
                  <Link href={`/user/${interaction.address}`}>
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
