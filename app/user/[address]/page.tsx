"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUserProfile } from "@/hooks/use-user-profile"
import { useMetaMask } from "@/hooks/use-metamask"
import { useDashboard } from "@/hooks/use-dashboard"
import { useTokenSender } from "@/hooks/use-token-sender"
import { UserProfileHeader } from "@/components/user-profile-header"
import { UserSkillsGrid } from "@/components/user-skills-grid"
import { SendTokensModal } from "@/components/send-tokens-modal"
import { WalletConnect } from "@/components/wallet-connect"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function UserProfilePage() {
  const params = useParams()
  const router = useRouter()
  const { isConnected, account } = useMetaMask()
  const address = params.address as string
  const { profile, isLoading, error } = useUserProfile(address)
  const { tokenBalance, useTokens, addInteraction } = useDashboard(account)
  const { sendTokens } = useTokenSender(account, useTokens, addInteraction)

  const [showSendModal, setShowSendModal] = useState(false)
  const [selectedSkillId, setSelectedSkillId] = useState<string | undefined>()

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center space-y-6">
              <h1 className="text-2xl font-bold">Conecta tu Wallet</h1>
              <p className="text-muted-foreground">Necesitas conectar tu wallet para ver perfiles de usuarios</p>
              <WalletConnect />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[80vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Cargando perfil...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>

          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Usuario no encontrado</h2>
              <p className="text-muted-foreground mb-6">No se pudo encontrar un perfil para la dirección: {address}</p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => router.back()}>
                  Volver
                </Button>
                <Link href="/dashboard">
                  <Button>Ir al Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const isOwnProfile = account?.toLowerCase() === address.toLowerCase()

  const handleSendTokens = () => {
    setSelectedSkillId(undefined)
    setShowSendModal(true)
  }

  const handleSkillSelect = (skillId: string) => {
    setSelectedSkillId(skillId)
    setShowSendModal(true)
  }

  const handleSendTokensConfirm = async (skillId: string, amount: number, message?: string) => {
    const skill = profile.skills.find((s) => s.id === skillId)
    if (!skill) return false

    return await sendTokens({
      recipientAddress: profile.address,
      recipientName: profile.name,
      skillId,
      skillName: skill.name,
      amount,
      message,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-2xl font-bold">{isOwnProfile ? "Mi Perfil" : "Perfil de Usuario"}</h1>
        </div>

        <div className="space-y-6">
          <UserProfileHeader profile={profile} onSendTokens={isOwnProfile ? undefined : handleSendTokens} />

          {!isOwnProfile && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Haz clic en cualquier habilidad para enviar tokens de reconocimiento a este usuario.
              </AlertDescription>
            </Alert>
          )}

          <UserSkillsGrid profile={profile} onSkillSelect={isOwnProfile ? undefined : handleSkillSelect} />
        </div>

        {!isOwnProfile && (
          <SendTokensModal
            isOpen={showSendModal}
            onClose={() => setShowSendModal(false)}
            recipient={profile}
            selectedSkillId={selectedSkillId}
            tokenBalance={tokenBalance}
            onSendTokens={handleSendTokensConfirm}
          />
        )}
      </div>
    </div>
  )
}
