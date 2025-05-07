"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { useWallet } from "@/context/wallet-context"
import { ArrowLeft, Copy, CheckCircle2, Share2 } from "lucide-react"
import QRCode from "react-qr-code"

export default function ReceiveScreen({ onBack }) {
  const { wallet } = useWallet()
  const [copied, setCopied] = useState(false)
  const qrRef = useRef(null)

  const copyAddress = () => {
    if (wallet?.address) {
      navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareAddress = async () => {
    if (wallet?.address && navigator.share) {
      try {
        await navigator.share({
          title: "My Ethereum Address",
          text: wallet.address,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    }
  }

  return (
    <div className="min-h-full p-4">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-[#2A2A3C] transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <h2 className="text-xl font-semibold ml-2">Receive</h2>
      </div>

      <div className="flex flex-col items-center">
        <motion.div
          className="bg-white p-6 rounded-2xl mb-6"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          ref={qrRef}
        >
          <QRCode value={wallet?.address || ""} size={200} level="H" fgColor="#000000" bgColor="#FFFFFF" />
        </motion.div>

        <div className="w-full bg-[#2A2A3C]/50 rounded-xl p-5 mb-6">
          <h3 className="text-sm font-medium text-gray-400 mb-2">YOUR ADDRESS</h3>
          <div className="bg-[#3A3A4C] rounded-lg p-3 break-all text-sm text-white font-mono mb-4">
            {wallet?.address}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={copyAddress}
              className="flex-1 py-3 rounded-xl bg-[#2A2A3C] text-white font-medium flex items-center justify-center space-x-2 transform transition-all hover:scale-[1.02] active:scale-[0.98] border border-[#3A3A4C]"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-1 text-green-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-1" />
                  <span>Copy</span>
                </>
              )}
            </button>

            {navigator.share && (
              <button
                onClick={shareAddress}
                className="flex-1 py-3 rounded-xl bg-[#2A2A3C] text-white font-medium flex items-center justify-center space-x-2 transform transition-all hover:scale-[1.02] active:scale-[0.98] border border-[#3A3A4C]"
              >
                <Share2 className="w-4 h-4 mr-1" />
                <span>Share</span>
              </button>
            )}
          </div>
        </div>

        <div className="w-full bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
          <p className="text-purple-300 text-sm">
            <strong>Note:</strong> Send only Ethereum and ERC-20 tokens to this address. Sending other types of
            cryptocurrencies may result in permanent loss.
          </p>
        </div>
      </div>
    </div>
  )
}
