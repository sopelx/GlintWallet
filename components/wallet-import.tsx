"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { WalletType } from "./wallet-dashboard"
import { Loader2 } from "lucide-react"

export default function WalletImport({ setWallet }: { setWallet: (wallet: WalletType) => void }) {
  const [privateKey, setPrivateKey] = useState("")
  const [seedPhrase, setSeedPhrase] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const importFromPrivateKey = async () => {
    setLoading(true)
    setError(null)

    try {
      // Validate private key format
      if (!privateKey.startsWith("0x")) {
        throw new Error("Private key must start with 0x")
      }

      const wallet = new ethers.Wallet(privateKey)

      setWallet({
        address: wallet.address,
        privateKey: wallet.privateKey,
        balance: "0.0",
      })
    } catch (err) {
      console.error("Error importing wallet from private key:", err)
      setError("Invalid private key. Please check and try again.")
    } finally {
      setLoading(false)
    }
  }

  const importFromSeedPhrase = async () => {
    setLoading(true)
    setError(null)

    try {
      // Validate seed phrase (mnemonic)
      if (!ethers.Mnemonic.isValidMnemonic(seedPhrase)) {
        throw new Error("Invalid seed phrase")
      }

      const wallet = ethers.Wallet.fromPhrase(seedPhrase)

      setWallet({
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: seedPhrase,
        balance: "0.0",
      })
    } catch (err) {
      console.error("Error importing wallet from seed phrase:", err)
      setError("Invalid seed phrase. Please check and try again.")
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

      <Tabs defaultValue="privateKey" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="privateKey">Private Key</TabsTrigger>
          <TabsTrigger value="seedPhrase">Seed Phrase</TabsTrigger>
        </TabsList>

        <TabsContent value="privateKey" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="privateKey">Private Key</Label>
            <Input
              id="privateKey"
              type="password"
              placeholder="0x..."
              value={privateKey}
              onChange={(e) => setPrivateKey(e.target.value)}
            />
          </div>

          <Button onClick={importFromPrivateKey} disabled={loading || !privateKey} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              "Import Wallet"
            )}
          </Button>
        </TabsContent>

        <TabsContent value="seedPhrase" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="seedPhrase">Seed Phrase (12 or 24 words)</Label>
            <Input
              id="seedPhrase"
              type="password"
              placeholder="Enter your seed phrase..."
              value={seedPhrase}
              onChange={(e) => setSeedPhrase(e.target.value)}
            />
          </div>

          <Button onClick={importFromSeedPhrase} disabled={loading || !seedPhrase} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              "Import Wallet"
            )}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  )
}
