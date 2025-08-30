"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2, User, ExternalLink } from "lucide-react"
import type { SearchResult } from "@/types/dashboard"
import Link from "next/link"

interface UserSearchProps {
  onSearch: (address: string) => Promise<SearchResult | null>
  isLoading: boolean
}

export function UserSearch({ onSearch, isLoading }: UserSearchProps) {
  const [searchAddress, setSearchAddress] = useState("")
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (!searchAddress.trim()) return

    setHasSearched(true)
    const result = await onSearch(searchAddress.trim())
    setSearchResult(result)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const searchSuggestions = [
    "0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4",
    "0x8ba1f109551bD432803012645Hac189451b934",
    "0x1234567890123456789012345678901234567890",
  ]

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="0x742d35Cc6634C0532925a3b8D4..."
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={isLoading || !searchAddress.trim()}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {!hasSearched && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Direcciones de ejemplo:</p>
          <div className="flex flex-wrap gap-2">
            {searchSuggestions.map((address) => (
              <Button
                key={address}
                variant="outline"
                size="sm"
                className="text-xs bg-transparent"
                onClick={() => setSearchAddress(address)}
              >
                {address.slice(0, 6)}...{address.slice(-4)}
              </Button>
            ))}
          </div>
        </div>
      )}

      {hasSearched && (
        <div>
          {searchResult ? (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{searchResult.name || "Usuario Anónimo"}</h3>
                        <p className="text-xs text-muted-foreground">
                          {searchResult.address.slice(0, 6)}...{searchResult.address.slice(-4)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {searchResult.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {searchResult.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{searchResult.skills.length - 3}
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground">{searchResult.totalTokensReceived} tokens recibidos</p>
                  </div>

                  <Link href={`/user/${searchResult.address}`}>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Ver Perfil
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">Usuario no encontrado</p>
                <p className="text-xs text-muted-foreground mt-1">Verifica que la dirección de wallet sea correcta</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
