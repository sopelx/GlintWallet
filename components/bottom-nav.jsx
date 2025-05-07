"use client"

import { motion } from "framer-motion"
import { Home, Send, Wallet, Settings, History } from "lucide-react"

export default function BottomNav({ activeView, setActiveView }) {
  const navItems = [
    { id: "dashboard", icon: Home, label: "Home" },
    { id: "send", icon: Send, label: "Send" },
    { id: "receive", icon: Wallet, label: "Receive" },
    { id: "history", icon: History, label: "History" },
    { id: "settings", icon: Settings, label: "Settings" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1E1E2D]/90 backdrop-blur-lg border-t border-[#2A2A3C] py-2 px-4 z-20">
      <div className="flex justify-between items-center">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeView === item.id}
            onClick={() => setActiveView(item.id)}
          />
        ))}
      </div>
    </div>
  )
}

function NavItem({ icon: Icon, label, isActive, onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="flex flex-col items-center justify-center w-16 py-1 relative"
    >
      <div className={`p-2 rounded-full ${isActive ? "bg-[#2A2A3C]" : ""}`}>
        <Icon className={`w-5 h-5 ${isActive ? "text-purple-400" : "text-gray-400"}`} />
      </div>
      <span className={`text-xs mt-1 ${isActive ? "text-purple-400" : "text-gray-400"}`}>{label}</span>

      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute -bottom-2 w-1 h-1 rounded-full bg-purple-500"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  )
}
