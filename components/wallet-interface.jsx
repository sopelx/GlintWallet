"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useWallet } from "@/context/wallet-context"
import { useNetwork } from "@/context/network-context"
import WalletHeader from "./wallet-header"
import WalletDashboard from "./wallet-dashboard"
import SendTransaction from "./send-transaction"
import ReceiveScreen from "./receive-screen"
import SettingsScreen from "./settings-screen"
import TransactionHistory from "./transaction-history"
import BottomNav from "./bottom-nav"
import NetworkSelector from "./network-selector"

export default function WalletInterface() {
  const [activeView, setActiveView] = useState("dashboard")
  const [isNetworkSelectorOpen, setIsNetworkSelectorOpen] = useState(false)
  const { wallet, balance, fetchBalance } = useWallet()
  const { currentNetwork } = useNetwork()

  useEffect(() => {
    if (wallet && currentNetwork) {
      fetchBalance()

      // Set up interval to refresh balance
      const interval = setInterval(() => {
        fetchBalance()
      }, 30000) // Every 30 seconds

      return () => clearInterval(interval)
    }
  }, [wallet, currentNetwork, fetchBalance])

  const getScreenComponent = () => {
    switch (activeView) {
      case "dashboard":
        return <WalletDashboard />
      case "send":
        return <SendTransaction onBack={() => setActiveView("dashboard")} />
      case "receive":
        return <ReceiveScreen onBack={() => setActiveView("dashboard")} />
      case "history":
        return <TransactionHistory onBack={() => setActiveView("dashboard")} />
      case "settings":
        return <SettingsScreen onBack={() => setActiveView("dashboard")} />
      default:
        return <WalletDashboard />
    }
  }

  return (
    <motion.div
      className="fixed inset-0 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <WalletHeader onNetworkClick={() => setIsNetworkSelectorOpen(true)} />

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            className="absolute inset-0 overflow-y-auto pb-20 scrollbar-thin scrollbar-thumb-[#3A3A4C] scrollbar-track-transparent"
            initial={{ opacity: 0, x: activeView === "dashboard" ? 0 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {getScreenComponent()}
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav activeView={activeView} setActiveView={setActiveView} />

      <AnimatePresence>
        {isNetworkSelectorOpen && <NetworkSelector onClose={() => setIsNetworkSelectorOpen(false)} />}
      </AnimatePresence>
    </motion.div>
  )
}
