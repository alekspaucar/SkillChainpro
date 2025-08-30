"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useMetaMask } from "@/hooks/use-metamask"
import { Wallet, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function WalletConnect() {
  const { isConnected, account, isLoading, error, connect, disconnect } = useMetaMask()

  if (isConnected && account) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <Wallet className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-lg">Wallet Conectada</CardTitle>
          <CardDescription className="text-sm">
            {account.slice(0, 6)}...{account.slice(-4)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={disconnect} variant="outline" className="w-full bg-transparent">
            Desconectar
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
          <Wallet className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-lg">Conectar Wallet</CardTitle>
        <CardDescription className="text-sm">Conecta tu MetaMask para comenzar a reconocer habilidades</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button onClick={connect} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Conectando...
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 mr-2" />
              Conectar MetaMask
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
