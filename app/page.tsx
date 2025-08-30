"use client"

import { useMetaMask } from "@/hooks/use-metamask"
import { useProfile } from "@/hooks/use-profile"
import { ProfileHeader } from "@/components/profile-header"
import { SkillCard } from "@/components/skill-card"
import { SkillManagementModal } from "@/components/skill-management-modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WalletConnect } from "@/components/wallet-connect"
import { Plus, Send, LinkIcon, Zap, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { Skill } from "@/types/user"

export default function HomePage() {
  const { isConnected, account, disconnect } = useMetaMask()
  const { profile, isLoading, updateSkill, addSkill, removeSkill } = useProfile(account)
  const router = useRouter()

  const handleLogout = () => {
    disconnect()
    router.push("/")
  }

  const handleAddSkill = (skillData: Omit<Skill, "tokensReceived">) => {
    addSkill(skillData)
  }

  const handleEditSkill = (skillData: Skill) => {
    updateSkill(skillData.id, skillData)
  }

  const handleDeleteSkill = (skillId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta habilidad?")) {
      removeSkill(skillId)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">SkillChain</h1>
              <p className="text-muted-foreground max-w-md text-balance">
                Reconoce y valora las habilidades de otros desarrolladores enviando tokens fungibles en la blockchain
              </p>
            </div>

            <WalletConnect />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mt-12">
              <div className="text-center space-y-2">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <LinkIcon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold">Blockchain</h3>
                <p className="text-sm text-muted-foreground">Tokens seguros y transparentes</p>
              </div>

              <div className="text-center space-y-2">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mx-auto">
                  <Zap className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-semibold">Reconocimiento</h3>
                <p className="text-sm text-muted-foreground">Valora habilidades reales</p>
              </div>

              <div className="text-center space-y-2">
                <div className="w-10 h-10 bg-secondary/50 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="w-5 h-5 text-foreground" />
                </div>
                <h3 className="font-semibold">Comunidad</h3>
                <p className="text-sm text-muted-foreground">Conecta con desarrolladores</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading || !profile) {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Mi Perfil</h1>
          <Link href="/search">
            <Button className="bg-primary hover:bg-primary/90">
              <Send className="w-4 h-4 mr-2" />
              Transferir
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <ProfileHeader
            profile={profile}
            isOwnProfile={true}
            onEdit={() => {
              // TODO: Implement edit profile modal
              console.log("Edit profile")
            }}
            onLogout={handleLogout}
          />

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Mis Habilidades</CardTitle>
              <SkillManagementModal
                mode="add"
                onSave={handleAddSkill}
                trigger={
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar
                  </Button>
                }
              />
            </CardHeader>
            <CardContent>
              {profile.skills.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No tienes habilidades configuradas</p>
                  <SkillManagementModal
                    mode="add"
                    onSave={handleAddSkill}
                    trigger={
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar primera habilidad
                      </Button>
                    }
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profile.skills.map((skill) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      isEditable={true}
                      onEdit={(skill) => {
                        // This will be handled by the SkillManagementModal in edit mode
                      }}
                      onDelete={handleDeleteSkill}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
