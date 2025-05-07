"use client"

import { motion } from "framer-motion"
import { useNetwork } from "@/context/network-context"
import { X, Check } from "lucide-react"

export default function NetworkSelector({ onClose }) {
  const { networks, currentNetwork, setNetwork } = useNetwork()

  const handleNetworkChange = (network) => {
    setNetwork(network)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center sm:items-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-[#1E1E2D] rounded-t-2xl sm:rounded-2xl w-full max-w-md border border-[#2A2A3C] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-[#2A2A3C]">
          <h2 className="text-lg font-semibold text-white">Select Network</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[#2A2A3C] transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2">
          {networks.map((network) => (
            <button
              key={network.chainId}
              onClick={() => handleNetworkChange(network)}
              className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-[#2A2A3C] transition-colors"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#2A2A3C] flex items-center justify-center mr-3">
                  <span className="text-sm font-medium text-white">{network.symbol}</span>
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-white">{network.name}</h3>
                  <p className="text-xs text-gray-400">{network.testnet ? "Testnet" : "Mainnet"}</p>
                </div>
              </div>

              {currentNetwork?.chainId === network.chainId && <Check className="w-5 h-5 text-purple-400" />}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}
