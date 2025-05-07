"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useWallet } from "@/context/wallet-context"
import CreateWallet from "./create-wallet"
import ImportWallet from "./import-wallet"
import { Sparkles, Import } from "lucide-react"

export default function WelcomeScreen({ onWalletCreated }) {
  const [activeView, setActiveView] = useState("intro") // intro, create, import
  const { createNewWallet, importWalletFromKey, importWalletFromSeed } = useWallet()

  const handleCreateWallet = async () => {
    await createNewWallet()
    onWalletCreated()
  }

  const handleImportWallet = async (type, value) => {
    if (type === "privateKey") {
      await importWalletFromKey(value)
    } else {
      await importWalletFromSeed(value)
    }
    onWalletCreated()
  }

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-md">
        {activeView === "intro" && (
          <IntroScreen onCreateClick={() => setActiveView("create")} onImportClick={() => setActiveView("import")} />
        )}

        {activeView === "create" && (
          <CreateWallet onBack={() => setActiveView("intro")} onCreateWallet={handleCreateWallet} />
        )}

        {activeView === "import" && (
          <ImportWallet onBack={() => setActiveView("intro")} onImportWallet={handleImportWallet} />
        )}
      </div>
    </motion.div>
  )
}

function IntroScreen({ onCreateClick, onImportClick }) {
  return (
    <motion.div
      className="bg-[#1E1E2D]/80 backdrop-blur-lg rounded-3xl p-8 border border-[#2A2A3C] shadow-xl"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <motion.div
          className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
        >
          <span className="text-white text-3xl font-bold">G</span>
        </motion.div>

        <motion.h1
          className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          GLINT WALLET
        </motion.h1>

        <motion.p
          className="text-gray-300 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          The next generation Web3 wallet experience
        </motion.p>

        <motion.div
          className="h-px w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent mb-6"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.7 }}
        />
      </div>

      <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <button
          onClick={onCreateClick}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium flex items-center justify-center space-x-2 transform transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg"
        >
          <Sparkles className="w-5 h-5" />
          <span>Create New Wallet</span>
        </button>

        <button
          onClick={onImportClick}
          className="w-full py-4 px-6 rounded-xl bg-[#2A2A3C] text-white font-medium flex items-center justify-center space-x-2 transform transition-all hover:scale-[1.02] active:scale-[0.98] hover:shadow-md border border-[#3A3A4C]"
        >
          <Import className="w-5 h-5" />
          <span>Import Existing Wallet</span>
        </button>
      </motion.div>

      <motion.p
        className="text-center text-xs text-gray-400 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        By continuing, you agree to our{" "}
        <a href="#" className="text-purple-400 hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="text-purple-400 hover:underline">
          Privacy Policy
        </a>
      </motion.p>
    </motion.div>
  )
}
