"use client"

import React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { useWallet } from "@/context/wallet-context"
import { useNetwork } from "@/context/network-context"
import { ArrowLeft, Send, AlertCircle, Loader2, CheckCircle2 } from "lucide-react"
import { ethers } from "ethers"
import Confetti from "react-confetti"
import { useWindowSize } from "@/hooks/use-window-size"

export default function SendTransaction({ onBack }) {
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [step, setStep] = useState(1) // 1: form, 2: confirm, 3: processing, 4: success
  const [error, setError] = useState(null)
  const [txHash, setTxHash] = useState(null)
  const { wallet, balance, sendTransaction } = useWallet()
  const { currentNetwork } = useNetwork()
  const { width, height } = useWindowSize()

  const handleContinue = () => {
    setError(null)

    // Validate recipient
    if (!recipient) {
      setError("Please enter a recipient address")
      return
    }

    try {
      if (!ethers.isAddress(recipient)) {
        setError("Invalid Ethereum address")
        return
      }
    } catch (err) {
      setError("Invalid Ethereum address")
      return
    }

    // Validate amount
    if (!amount || isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    if (Number.parseFloat(amount) > Number.parseFloat(balance)) {
      setError("Insufficient balance")
      return
    }

    // Proceed to confirmation
    setStep(2)
  }

  const handleSend = async () => {
    setStep(3)
    setError(null)

    try {
      const hash = await sendTransaction(recipient, amount)
      setTxHash(hash)
      setStep(4)
    } catch (err) {
      setError(err.message || "Transaction failed")
      setStep(2)
    }
  }

  return (
    <div className="min-h-full p-4">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-[#2A2A3C] transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <h2 className="text-xl font-semibold ml-2">Send {currentNetwork?.currency || "ETH"}</h2>
      </div>

      <AnimatedSteps currentStep={step}>
        {/* Step 1: Transaction Form */}
        <div className="space-y-6">
          {error && (
            <motion.div
              className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Recipient Address</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="0x..."
                className="w-full bg-[#2A2A3C] border border-[#3A3A4C] rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount ({currentNetwork?.currency || "ETH"})
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  step="0.0001"
                  min="0"
                  className="w-full bg-[#2A2A3C] border border-[#3A3A4C] rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  <button onClick={() => setAmount(balance)} className="text-xs text-purple-400 hover:text-purple-300">
                    MAX
                  </button>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Available: {balance} {currentNetwork?.currency || "ETH"}
              </p>
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={!recipient || !amount}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium flex items-center justify-center space-x-2 transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span>Continue</span>
          </button>
        </div>

        {/* Step 2: Confirmation */}
        <div className="space-y-6">
          <div className="bg-[#2A2A3C]/50 rounded-xl p-5 space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">FROM</h3>
              <p className="text-sm font-mono bg-[#3A3A4C] p-2 rounded-md overflow-hidden text-ellipsis text-gray-200">
                {wallet?.address}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-1">TO</h3>
              <p className="text-sm font-mono bg-[#3A3A4C] p-2 rounded-md overflow-hidden text-ellipsis text-gray-200">
                {recipient}
              </p>
            </div>

            <div className="flex justify-between items-center py-3 border-t border-b border-[#3A3A4C]">
              <span className="text-gray-300">Amount</span>
              <span className="text-white font-medium">
                {amount} {currentNetwork?.currency || "ETH"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-300">Network Fee (est.)</span>
              <span className="text-gray-300">~0.0005 {currentNetwork?.currency || "ETH"}</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#3A3A4C]">
              <span className="text-gray-300">Total</span>
              <span className="text-white font-medium">
                {(Number.parseFloat(amount) + 0.0005).toFixed(4)} {currentNetwork?.currency || "ETH"}
              </span>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-4 px-6 rounded-xl bg-[#2A2A3C] text-white font-medium flex items-center justify-center space-x-2 transform transition-all hover:scale-[1.02] active:scale-[0.98] border border-[#3A3A4C]"
            >
              <span>Back</span>
            </button>

            <button
              onClick={handleSend}
              className="flex-1 py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium flex items-center justify-center space-x-2 transform transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Send className="w-4 h-4 mr-1" />
              <span>Confirm & Send</span>
            </button>
          </div>
        </div>

        {/* Step 3: Processing */}
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-20 h-20 rounded-full bg-[#2A2A3C] flex items-center justify-center mb-6">
            <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Processing Transaction</h3>
          <p className="text-gray-400 text-sm max-w-xs">
            Your transaction is being processed. This may take a few moments.
          </p>
        </div>

        {/* Step 4: Success */}
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Transaction Sent!</h3>
          <p className="text-gray-400 text-sm max-w-xs mb-6">
            Your transaction has been successfully submitted to the network.
          </p>

          {txHash && (
            <div className="bg-[#2A2A3C]/50 rounded-xl p-4 w-full mb-6">
              <h4 className="text-sm font-medium text-gray-400 mb-1">TRANSACTION HASH</h4>
              <p className="text-xs font-mono bg-[#3A3A4C] p-2 rounded-md overflow-hidden text-ellipsis text-gray-200">
                {txHash}
              </p>
            </div>
          )}

          <button
            onClick={onBack}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium flex items-center justify-center space-x-2 transform transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Back to Wallet</span>
          </button>

          <Confetti width={width} height={height} recycle={false} numberOfPieces={200} gravity={0.2} />
        </div>
      </AnimatedSteps>
    </div>
  )
}

function AnimatedSteps({ currentStep, children }) {
  return (
    <div className="relative">
      {React.Children.map(children, (child, index) => {
        const step = index + 1

        if (step !== currentStep) return null

        return (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: step > currentStep ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: step < currentStep ? -20 : 20 }}
            transition={{ duration: 0.3 }}
          >
            {child}
          </motion.div>
        )
      })}
    </div>
  )
}
