"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { UserProfile, Skill } from "@/types/user"
import type { TokenBalance } from "@/types/dashboard"
import { Send, Star, AlertCircle, CheckCircle } from "lucide-react"

interface SendTokensModalProps {
  isOpen: boolean
  onClose: () => void
  recipient: UserProfile
  selectedSkillId?: string
  tokenBalance: TokenBalance
  onSendTokens: (skillId: string, amount: number, message?: string) => Promise<boolean>
}

export function SendTokensModal({
  isOpen,
  onClose,
  recipient,
  selectedSkillId,
  tokenBalance,
  onSendTokens,
}: SendTokensModalProps) {
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(
    selectedSkillId ? recipient.skills.find((s) => s.id === selectedSkillId) || null : null,
  )
  const [amount, setAmount] = useState([1])
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSend = async () => {
    if (!selectedSkill || amount[0] <= 0) return

    setIsLoading(true)
    const result = await onSendTokens(selectedSkill.id, amount[0], message)

    if (result) {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
        // Reset form
        setSelectedSkill(null)
        setAmount([1])
        setMessage("")
      }, 2000)
    }

    setIsLoading(false)
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
      setSelectedSkill(selectedSkillId ? recipient.skills.find((s) => s.id === selectedSkillId) || null : null)
      setAmount([1])
      setMessage("")
      setSuccess(false)
    }
  }

  const maxTokens = Math.min(tokenBalance.available, 10) // Max 10 tokens per transaction

  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Tokens Enviados</h3>
            <p className="text-muted-foreground">
              Has enviado {amount[0]} tokens a {recipient.name} por su habilidad en {selectedSkill?.name}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Enviar Tokens de Reconocimiento
          </DialogTitle>
          <DialogDescription>
            Reconoce las habilidades de {recipient.name || "este usuario"} enviando tokens
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Recipient Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold">
                    {recipient.name?.charAt(0) || recipient.address.slice(2, 4).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold">{recipient.name || "Usuario Anónimo"}</h4>
                  <p className="text-xs text-muted-foreground">
                    {recipient.address.slice(0, 6)}...{recipient.address.slice(-4)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skill Selection */}
          <div className="space-y-3">
            <Label>Selecciona una habilidad</Label>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {recipient.skills.map((skill) => (
                <Card
                  key={skill.id}
                  className={`cursor-pointer transition-colors ${
                    selectedSkill?.id === skill.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedSkill(skill)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{skill.name}</h5>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < skill.level ? "fill-accent text-accent" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {skill.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">{skill.tokensReceived} tokens</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Amount Selection */}
          {selectedSkill && (
            <div className="space-y-3">
              <Label>Cantidad de tokens ({amount[0]})</Label>
              <div className="space-y-4">
                <Slider value={amount} onValueChange={setAmount} max={maxTokens} min={1} step={1} className="w-full" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 token</span>
                  <span>{maxTokens} tokens (máximo)</span>
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          {selectedSkill && (
            <div className="space-y-2">
              <Label htmlFor="message">Mensaje (opcional)</Label>
              <Input
                id="message"
                placeholder="Excelente trabajo en..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">{message.length}/100 caracteres</p>
            </div>
          )}

          {/* Warnings */}
          {tokenBalance.available === 0 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No tienes tokens disponibles para enviar hoy.</AlertDescription>
            </Alert>
          )}

          {selectedSkill && amount[0] > tokenBalance.available && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>No tienes suficientes tokens. Disponibles: {tokenBalance.available}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSend}
            disabled={!selectedSkill || amount[0] <= 0 || amount[0] > tokenBalance.available || isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar {amount[0]} Token{amount[0] > 1 ? "s" : ""}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
