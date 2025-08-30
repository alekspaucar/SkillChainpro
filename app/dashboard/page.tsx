"use client"

import { useMetaMask } from "@/hooks/use-metamask"
import { useDashboard } from "@/hooks/use-dashboard"
import { TokenBalanceCard } from "@/components/token-balance-card"
import { UserSearch } from "@/components/user-search"
import { RecentInteractions } from "@/components/recent-interactions"
import { WalletConnect } from "@/components/wallet-connect"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Search } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { isConnected, account } = useMetaMask()
  const { tokenBalance, recentInteractions, isLoading, searchUser } = useDashboard(account)

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center space-y-6">
              <h1 className="text-2xl font-bold">Conecta tu Wallet</h1>
              <p className="text-muted-foreground">Necesitas conectar tu wallet para acceder al dashboard</p>
              <WalletConnect />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Inicio
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Token Balance and Search */}
          <div className="lg:col-span-1 space-y-6">
            <TokenBalanceCard balance={tokenBalance} />

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Buscar Usuario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UserSearch onSearch={searchUser} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent Interactions */}
          <div className="lg:col-span-2">
            <RecentInteractions interactions={recentInteractions} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link href="/profile">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-primary font-semibold">👤</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold">Mi Perfil</div>
                      <div className="text-xs text-muted-foreground">Ver y editar mis habilidades</div>
                    </div>
                  </Button>
                </Link>

                <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                  <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-accent font-semibold">📊</span>
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">Estadísticas</div>
                    <div className="text-xs text-muted-foreground">Próximamente</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
