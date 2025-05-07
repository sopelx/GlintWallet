"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { WalletType } from "./wallet-dashboard"
import { Loader2 } from "lucide-react"

export default function TransactionForm({
  wallet,
  provider,
  addTransaction,
}: {
  wallet: WalletType
  provider: ethers.JsonRpcProvider | null
  addTransaction: (tx: any) => void
}) {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const sendTransaction = async () => {
    if (!provider) {
      setError("Provider not connected. Please refresh the page or try again later.")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Validate recipient address
      if (!ethers.isAddress(recipient)) {
        throw new Error("Invalid recipient address")
      }

      // Validate amount
      const amountInEther = Number.parseFloat(amount)
      if (isNaN(amountInEther) || amountInEther <= 0) {
        throw new Error("Invalid amount")
      }

      // Check if user has enough balance
      const balance = Number.parseFloat(wallet.balance)
      if (amountInEther > balance) {
        throw new Error("Insufficient balance")
      }

      // Create wallet instance with provider
      const walletWithProvider = new ethers.Wallet(wallet.privateKey, provider)

      // Test provider connection before sending
      try {
        await provider.getBlockNumber()
      } catch (e) {
        throw new Error("Network connection error. Please try again later.")
      }

      // Send transaction
      const tx = await walletWithProvider.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount),
      })

      // Add to transaction history
      addTransaction({
        hash: tx.hash,
        to: recipient,
        amount: amount,
        timestamp: Date.now(),
        status: "pending",
      })

      setSuccess(`Transaction sent! Hash: ${tx.hash}`)

      // Reset form
      setRecipient("")
      setAmount("")
    } catch (err: any) {
      console.error("Error sending transaction:", err)
      setError(err.message || "Failed to send transaction")
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

      {success && (
        <Alert>
          <AlertDescription className="break-all">{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="recipient">Recipient Address</Label>
        <Input id="recipient" placeholder="0x..." value={recipient} onChange={(e) => setRecipient(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (ETH)</Label>
        <Input
          id="amount"
          type="number"
          step="0.0001"
          min="0"
          placeholder="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <Button onClick={sendTransaction} disabled={loading || !recipient || !amount || !provider} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Transaction"
        )}
      </Button>
    </div>
  )
}
