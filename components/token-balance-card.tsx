"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { TokenBalance } from "@/types/dashboard"
import { Coins, Clock } from "lucide-react"

interface TokenBalanceCardProps {
  balance: TokenBalance
}

export function TokenBalanceCard({ balance }: TokenBalanceCardProps) {
  const progressValue = (balance.used / balance.total) * 100
  const timeUntilReset = balance.resetTime.getTime() - Date.now()
  const hoursUntilReset = Math.max(0, Math.floor(timeUntilReset / (1000 * 60 * 60)))
  const minutesUntilReset = Math.max(0, Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60)))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Tokens Disponibles</CardTitle>
        <Coins className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary mb-2">{balance.available}</div>
        <p className="text-xs text-muted-foreground mb-4">de {balance.total} tokens diarios</p>

        <Progress value={progressValue} className="mb-4" />

        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          Reinicio en {hoursUntilReset}h {minutesUntilReset}m
        </div>
      </CardContent>
    </Card>
  )
}
