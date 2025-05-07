"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useWallet } from "@/context/wallet-context"
import { useNetwork } from "@/context/network-context"
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, ExternalLink, Clock } from "lucide-react"

export default function TransactionHistory({ onBack }) {
  const { transactions } = useWallet()
  const { currentNetwork } = useNetwork()
  const [filter, setFilter] = useState("all") // all, sent, received

  const filteredTransactions =
    transactions?.filter((tx) => {
      if (filter === "all") return true
      if (filter === "sent") return tx.type === "sent"
      if (filter === "received") return tx.type === "received"
      return true
    }) || []

  return (
    <div className="min-h-full p-4">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-[#2A2A3C] transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <h2 className="text-xl font-semibold ml-2">Transaction History</h2>
      </div>

      <div className="flex mb-6 bg-[#2A2A3C] rounded-xl p-1">
        <button
          onClick={() => setFilter("all")}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1 transition-all text-sm ${
            filter === "all" ? "bg-[#3A3A4C] text-white shadow-md" : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <span>All</span>
        </button>
        <button
          onClick={() => setFilter("sent")}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1 transition-all text-sm ${
            filter === "sent" ? "bg-[#3A3A4C] text-white shadow-md" : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <ArrowUpRight className="w-3 h-3 mr-1" />
          <span>Sent</span>
        </button>
        <button
          onClick={() => setFilter("received")}
          className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1 transition-all text-sm ${
            filter === "received" ? "bg-[#3A3A4C] text-white shadow-md" : "text-gray-400 hover:text-gray-300"
          }`}
        >
          <ArrowDownLeft className="w-3 h-3 mr-1" />
          <span>Received</span>
        </button>
      </div>

      <div className="space-y-4">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx, index) => (
            <TransactionItem key={index} transaction={tx} network={currentNetwork} delay={index * 0.05} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 bg-[#2A2A3C] rounded-full flex items-center justify-center mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No Transactions</h3>
            <p className="text-gray-400 text-sm max-w-xs">
              {filter === "all"
                ? "You haven't made any transactions yet."
                : filter === "sent"
                  ? "You haven't sent any transactions yet."
                  : "You haven't received any transactions yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function TransactionItem({ transaction, network, delay }) {
  const isReceived = transaction.type === "received"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-[#1E1E2D]/80 backdrop-blur-sm rounded-xl p-4 border border-[#2A2A3C]"
    >
      <div className="flex items-center">
        <div
          className={`w-10 h-10 rounded-full ${
            isReceived ? "bg-green-500/20" : "bg-purple-500/20"
          } flex items-center justify-center mr-3`}
        >
          {isReceived ? (
            <ArrowDownLeft className="w-5 h-5 text-green-400" />
          ) : (
            <ArrowUpRight className="w-5 h-5 text-purple-400" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-white">{isReceived ? "Received" : "Sent"}</h3>
              <p className="text-xs text-gray-400">{new Date(transaction.timestamp).toLocaleString()}</p>
            </div>

            <div className="text-right">
              <p className={`font-medium ${isReceived ? "text-green-400" : "text-purple-400"}`}>
                {isReceived ? "+" : "-"}
                {transaction.amount} {network?.currency || "ETH"}
              </p>
              <p className="text-xs text-gray-400">${(Number.parseFloat(transaction.amount) * 3245.67).toFixed(2)}</p>
            </div>
          </div>

          {transaction.hash && (
            <div className="mt-3 pt-3 border-t border-[#2A2A3C] flex justify-between items-center">
              <p className="text-xs text-gray-400 font-mono">
                {transaction.hash.substring(0, 10)}...{transaction.hash.substring(transaction.hash.length - 6)}
              </p>
              <a
                href={`${network?.explorer}/tx/${transaction.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-purple-400 flex items-center hover:text-purple-300"
              >
                View
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
