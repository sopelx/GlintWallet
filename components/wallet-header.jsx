"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useWallet } from "@/context/wallet-context"
import { useNetwork } from "@/context/network-context"
import { Copy, CheckCircle2, ChevronDown } from "lucide-react"

export default function WalletHeader({ onNetworkClick }) {
  const { wallet, balance } = useWallet()
  const { currentNetwork } = useNetwork()
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const formatAddress = (address) => {
    if (!address) return ""
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div className="relative">
      {/* Gradient background with blur effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A2E] to-transparent pointer-events-none z-0" />

      <div className="relative z-10 px-4 pt-6 pb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mr-2">
              <span className="text-white text-sm font-bold">G</span>
            </div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400">
              GLINT
            </h1>
          </div>

          <button
            onClick={onNetworkClick}
            className="flex items-center space-x-1 bg-[#2A2A3C]/80 backdrop-blur-sm rounded-full py-1 px-3 text-sm text-gray-300 border border-[#3A3A4C]/50"
          >
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span>{currentNetwork?.name || "Ethereum"}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="bg-[#1E1E2D]/80 backdrop-blur-lg rounded-2xl p-4 border border-[#2A2A3C]">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-sm font-medium text-gray-400">TOTAL BALANCE</h2>
            <button
              onClick={copyAddress}
              className="flex items-center space-x-1 text-xs text-gray-400 hover:text-gray-300 transition-colors"
            >
              <span>{formatAddress(wallet?.address)}</span>
              {copied ? <CheckCircle2 className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          <div className="flex items-baseline">
            <h3 className="text-2xl font-bold text-white mr-2">
              {balance ? Number.parseFloat(balance).toFixed(4) : "0.0000"}
            </h3>
            <span className="text-sm text-gray-400">{currentNetwork?.currency || "ETH"}</span>
          </div>

          <motion.div className="h-1 bg-[#2A2A3C] rounded-full mt-3 overflow-hidden" initial={{ width: "100%" }}>
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
