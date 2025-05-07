"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { WalletType } from "./wallet-dashboard"
import { Loader2 } from "lucide-react"

export default function WalletCreate({ setWallet }: { setWallet: (wallet: WalletType) => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createWallet = async () => {
    setLoading(true)
    setError(null)

    try {
      // Generate a random mnemonic (24 words)
      const wallet = ethers.Wallet.createRandom()

      setWallet({
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic?.phrase,
        balance: "0.0",
      })
    } catch (err) {
      console.error("Error creating wallet:", err)
      setError("Failed to create wallet. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-center">
        <Button onClick={createWallet} disabled={loading} className="w-full md:w-auto">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Wallet...
            </>
          ) : (
            "Create New Wallet"
          )}
        </Button>
      </div>
    </div>
  )
}
