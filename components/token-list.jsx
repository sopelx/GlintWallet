"use client"

import { motion } from "framer-motion"
import { useWallet } from "@/context/wallet-context"
import { useNetwork } from "@/context/network-context"

export default function TokenList() {
  const { balance } = useWallet()
  const { currentNetwork } = useNetwork()

  // Mock token data - in a real app, this would come from an API
  const tokens = [
    {
      symbol: currentNetwork?.currency || "ETH",
      name: currentNetwork?.name === "Ethereum" ? "Ethereum" : currentNetwork?.currency || "Ethereum",
      balance: balance || "0.0000",
      price: 3245.67,
      change: "+5.67%",
      isPositive: true,
      logo: "/ethereum-logo.png",
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      balance: "125.45",
      price: 1.0,
      change: "+0.01%",
      isPositive: true,
      logo: "/usdc-logo.png",
    },
    {
      symbol: "LINK",
      name: "Chainlink",
      balance: "15.78",
      price: 14.23,
      change: "-2.34%",
      isPositive: false,
      logo: "/chainlink-logo.png",
    },
  ]

  return (
    <div className="space-y-3">
      {tokens.map((token, index) => (
        <TokenItem key={index} token={token} delay={index * 0.1} />
      ))}
    </div>
  )
}

function TokenItem({ token, delay }) {
  const usdValue = (Number.parseFloat(token.balance) * token.price).toFixed(2)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-[#1E1E2D]/80 backdrop-blur-sm rounded-xl p-4 border border-[#2A2A3C]"
    >
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-[#2A2A3C] flex items-center justify-center">
          <img src={token.logo || "/placeholder.svg"} alt={token.symbol} className="w-full h-full object-cover" />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-white">{token.symbol}</h3>
              <p className="text-xs text-gray-400">{token.name}</p>
            </div>

            <div className="text-right">
              <p className="font-medium text-white">
                {token.balance} {token.symbol}
              </p>
              <div className="flex items-center justify-end">
                <p className="text-xs text-gray-400 mr-1">${usdValue}</p>
                <span className={`text-xs ${token.isPositive ? "text-green-400" : "text-red-400"}`}>
                  {token.change}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
