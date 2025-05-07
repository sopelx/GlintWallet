"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Key, FileText, Loader2, AlertCircle } from "lucide-react"
import { ethers } from "ethers"

export default function ImportWallet({ onBack, onImportWallet }) {
  const [activeTab, setActiveTab] = useState("privateKey")
  const [privateKey, setPrivateKey] = useState("")
  const [seedPhrase, setSeedPhrase] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleImport = async () => {
    setLoading(true)
    setError(null)

    try {
      if (activeTab === "privateKey") {
        // Validate private key
        if (!privateKey.trim()) {
          throw new Error("Please enter a private key")
        }

        // Check if private key is valid
        try {
          // Add 0x prefix if missing
          const formattedKey = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`
          new ethers.Wallet(formattedKey)
          onImportWallet("privateKey", formattedKey)
        } catch (e) {
          throw new Error("Invalid private key format")
        }
      } else {
        // Validate seed phrase
        if (!seedPhrase.trim()) {
          throw new Error("Please enter a seed phrase")
        }

        // Check if seed phrase is valid
        try {
          if (!ethers.Mnemonic.isValidMnemonic(seedPhrase)) {
            throw new Error("Invalid seed phrase")
          }
          onImportWallet("seedPhrase", seedPhrase)
        } catch (e) {
          throw new Error("Invalid seed phrase format")
        }
      }
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <motion.div
      className="bg-[#1E1E2D]/80 backdrop-blur-lg rounded-3xl p-6 border border-[#2A2A3C] shadow-xl"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-[#2A2A3C] transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <h2 className="text-xl font-semibold ml-2">Import Wallet</h2>
      </div>

      <div className="flex mb-6 bg-[#2A2A3C] rounded-xl p-1">
        <button
          onClick={() => {
            setActiveTab("privateKey")
            setError(null)
          }}
          className={`flex-1 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all ${
            activeTab === "privateKey" ? "bg-[#3A3A4C] text-white shadow-md" : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Private Key</span>
        </button>
        <button
          onClick={() => {
            setActiveTab("seedPhrase")
            setError(null)
          }}
          className={`flex-1 py-3 rounded-lg flex items-center justify-center space-x-2 transition-all ${
            activeTab === "seedPhrase" ? "bg-[#3A3A4C] text-white shadow-md" : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Seed Phrase</span>
        </button>
      </div>

      {error && (
        <motion.div
          className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-start"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="w-5 h-5 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{error}</p>
        </motion.div>
      )}

      {activeTab === "privateKey" ? (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Enter your private key</label>
          <input
            type="password"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="0x..."
            className="w-full bg-[#2A2A3C] border border-[#3A3A4C] rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="mt-2 text-xs text-gray-400">
            Your private key typically starts with "0x" followed by 64 hexadecimal characters.
          </p>
        </div>
      ) : (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Enter your seed phrase</label>
          <textarea
            value={seedPhrase}
            onChange={(e) => setSeedPhrase(e.target.value)}
            placeholder="Enter your 12 or 24 word seed phrase separated by spaces"
            rows={4}
            className="w-full bg-[#2A2A3C] border border-[#3A3A4C] rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
          <p className="mt-2 text-xs text-gray-400">
            Your seed phrase typically consists of 12 or 24 words separated by spaces.
          </p>
        </div>
      )}

      <div className="bg-[#2A2A3C]/50 rounded-xl p-4 mb-6">
        <h3 className="text-sm font-medium mb-2 text-purple-300">Security Note</h3>
        <p className="text-gray-300 text-xs">
          Glint never stores your private keys or seed phrases. All cryptographic operations happen locally in your
          browser. Your keys are never transmitted over the internet.
        </p>
      </div>

      <button
        onClick={handleImport}
        disabled={loading || (activeTab === "privateKey" ? !privateKey : !seedPhrase)}
        className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium flex items-center justify-center space-x-2 transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Importing...</span>
          </>
        ) : (
          <span>Import Wallet</span>
        )}
      </button>
    </motion.div>
  )
}
