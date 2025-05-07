"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useWallet } from "@/context/wallet-context"
import { useTheme } from "@/context/theme-context"
import { ArrowLeft, Moon, Sun, Eye, EyeOff, Copy, CheckCircle2, LogOut, Trash2, Shield, HelpCircle } from "lucide-react"

export default function SettingsScreen({ onBack }) {
  const { wallet, disconnectWallet, deleteWallet } = useWallet()
  const { theme, setTheme } = useTheme()
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [showSeedPhrase, setShowSeedPhrase] = useState(false)
  const [copied, setCopied] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-full p-4">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-[#2A2A3C] transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <h2 className="text-xl font-semibold ml-2">Settings</h2>
      </div>

      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-[#1E1E2D]/80 backdrop-blur-sm rounded-xl p-4 border border-[#2A2A3C]">
          <h3 className="text-lg font-medium mb-4">Appearance</h3>

          <div className="flex items-center justify-between">
            <span className="text-gray-300">Theme</span>
            <div className="flex bg-[#2A2A3C] rounded-lg p-1">
              <button
                onClick={() => setTheme("light")}
                className={`p-2 rounded-md flex items-center justify-center ${
                  theme === "light" ? "bg-[#3A3A4C] text-white" : "text-gray-400"
                }`}
              >
                <Sun className="w-4 h-4" />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-2 rounded-md flex items-center justify-center ${
                  theme === "dark" ? "bg-[#3A3A4C] text-white" : "text-gray-400"
                }`}
              >
                <Moon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-[#1E1E2D]/80 backdrop-blur-sm rounded-xl p-4 border border-[#2A2A3C]">
          <h3 className="text-lg font-medium mb-4">Security</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-300">Private Key</h4>
                <button
                  onClick={() => setShowPrivateKey(!showPrivateKey)}
                  className="p-2 rounded-full hover:bg-[#3A3A4C] transition-colors"
                >
                  {showPrivateKey ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>

              <div className="bg-[#2A2A3C] rounded-lg p-3 flex items-center justify-between">
                <p className="text-sm font-mono text-gray-300 overflow-hidden text-ellipsis">
                  {showPrivateKey ? wallet?.privateKey : "••••••••••••••••••••••••••••••••"}
                </p>
                <button
                  onClick={() => copyToClipboard(wallet?.privateKey, "privateKey")}
                  className="p-2 rounded-full hover:bg-[#3A3A4C] transition-colors ml-2"
                >
                  {copied === "privateKey" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {wallet?.mnemonic && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium text-gray-300">Seed Phrase</h4>
                  <button
                    onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                    className="p-2 rounded-full hover:bg-[#3A3A4C] transition-colors"
                  >
                    {showSeedPhrase ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>

                <div className="bg-[#2A2A3C] rounded-lg p-3 flex items-center justify-between">
                  <p className="text-sm font-mono text-gray-300 overflow-hidden text-ellipsis">
                    {showSeedPhrase ? wallet.mnemonic : "••••• ••••• ••••• •••••"}
                  </p>
                  <button
                    onClick={() => copyToClipboard(wallet.mnemonic, "seedPhrase")}
                    className="p-2 rounded-full hover:bg-[#3A3A4C] transition-colors ml-2"
                  >
                    {copied === "seedPhrase" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <div className="bg-yellow-500/10 rounded-lg p-3">
              <div className="flex items-start">
                <Shield className="w-5 h-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
                <p className="text-yellow-300 text-sm">
                  Never share your private key or seed phrase with anyone. Anyone with access to these can control your
                  wallet and funds.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="bg-[#1E1E2D]/80 backdrop-blur-sm rounded-xl p-4 border border-[#2A2A3C]">
          <h3 className="text-lg font-medium mb-4">Account</h3>

          <div className="space-y-3">
            <button
              onClick={disconnectWallet}
              className="w-full py-3 px-4 rounded-xl bg-[#2A2A3C] text-white font-medium flex items-center justify-center space-x-2 transform transition-all hover:scale-[1.02] active:scale-[0.98] border border-[#3A3A4C]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span>Disconnect Wallet</span>
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 px-4 rounded-xl bg-red-500/10 text-red-400 font-medium flex items-center justify-center space-x-2 transform transition-all hover:scale-[1.02] active:scale-[0.98] border border-red-500/30"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              <span>Delete Wallet</span>
            </button>
          </div>
        </div>

        {/* Support */}
        <div className="bg-[#1E1E2D]/80 backdrop-blur-sm rounded-xl p-4 border border-[#2A2A3C]">
          <h3 className="text-lg font-medium mb-4">Support</h3>

          <div className="space-y-3">
            <a
              href="https://glint.sopel.codes/help"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#2A2A3C] text-white font-medium flex items-center justify-center space-x-2 transform transition-all hover:scale-[1.02] active:scale-[0.98] border border-[#3A3A4C]"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              <span>Help Center</span>
            </a>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 py-4">Glint Wallet v1.0.0</div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-[#1E1E2D] rounded-2xl w-full max-w-sm border border-[#2A2A3C] overflow-hidden p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-semibold text-white mb-4">Delete Wallet</h3>

            <div className="bg-red-500/10 rounded-lg p-4 mb-6">
              <p className="text-red-300 text-sm">
                <strong>Warning:</strong> This action cannot be undone. Deleting your wallet will remove it from this
                device permanently.
              </p>
              <p className="text-red-300 text-sm mt-2">
                Make sure you have backed up your private key or seed phrase before proceeding.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#2A2A3C] text-white font-medium flex items-center justify-center transform transition-all hover:scale-[1.02] active:scale-[0.98] border border-[#3A3A4C]"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  deleteWallet()
                  setShowDeleteConfirm(false)
                }}
                className="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white font-medium flex items-center justify-center transform transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
