"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserSearch } from "@/components/user-search"
import { useDashboard } from "@/hooks/use-dashboard"
import Link from "next/link"

export default function SearchPage() {
  const { searchUser } = useDashboard()
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (address: string) => {
    setIsLoading(true)
    try {
      const result = await searchUser(address)
      return result
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold">Buscar Usuario</h1>
            <p className="text-sm text-muted-foreground">Encuentra usuarios por su dirección de wallet</p>
          </div>
        </div>

        <UserSearch onSearch={handleSearch} isLoading={isLoading} />
      </div>
    </div>
  )
}
