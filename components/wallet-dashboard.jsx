"use client"

import { useState, useEffect } from "react"
import { ethers } from "ethers"
import WalletDetails from "./wallet-details"
import WalletSetup from "./wallet-setup"
import TransactionForm from "./transaction-form"
import TransactionList from "./transaction-list"
import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownLeft, Clock, TrendingUp, Wallet } from "lucide-react"
import TokenList from "./token-list"

/**
 * @typedef {Object} WalletType
 * @property {string} address - The wallet address
 * @property {string} privateKey - The private key
 * @property {string} [mnemonic] - Optional mnemonic phrase
 * @property {string} balance - The wallet balance
 */

export default function WalletDashboard() {
  const [wallet, setWallet] = useState(null)
  const [provider, setProvider] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [network, setNetwork] = useState({
    name: "Ethereum",
    chainId: 1,
    rpcUrl: "https://eth.llamarpc.com",
    explorer: "https://etherscan.io",
    currency: "ETH",
    testnet: false,
  })
  const [activeTab, setActiveTab] = useState("tokens")

  const recentTransactions = transactions?.slice(0, 3) || []

  // Initialize provider when component mounts
  useEffect(() => {
    const initProvider = async () => {
      try {
        const newProvider = new ethers.JsonRpcProvider(network.rpcUrl)
        await newProvider.getBlockNumber() // Test connection
        setProvider(newProvider)
        console.log(`Connected to ${network.name}`)
      } catch (error) {
        console.error("Failed to initialize provider:", error)
        setProvider(null)
      }
    }

    initProvider()
  }, [network])

  // Update wallet balance when wallet or provider changes
  useEffect(() => {
    const updateBalance = async () => {
      if (wallet && provider) {
        try {
          const balance = await provider.getBalance(wallet.address)
          setWallet({
            ...wallet,
            balance: ethers.formatEther(balance),
          })
        } catch (error) {
          console.error("Failed to fetch balance:", error)
        }
      }
    }

    if (wallet && provider) {
      updateBalance()
      const interval = setInterval(updateBalance, 15000)
      return () => clearInterval(interval)
    }
  }, [wallet, provider])

  // Add transaction to history
  const addTransaction = (tx) => {
    setTransactions([tx, ...transactions])
  }

  return (
    <div className="p-4 space-y-6">
      {!wallet ? (
        <WalletSetup setWallet={setWallet} />
      ) : (
        <>
          <WalletDetails wallet={wallet} setWallet={setWallet} provider={provider} network={network} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Send Transaction</h2>
              <TransactionForm wallet={wallet} provider={provider} addTransaction={addTransaction} />
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Transaction History</h2>
              <TransactionList transactions={transactions} network={network} />
            </div>
          </div>
        </>
      )}
      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-3">
        <QuickAction
          icon={<ArrowUpRight className="w-5 h-5" />}
          label="Send"
          color="from-purple-600 to-pink-600"
          link="/send"
        />
        <QuickAction
          icon={<ArrowDownLeft className="w-5 h-5" />}
          label="Receive"
          color="from-blue-600 to-indigo-600"
          link="/receive"
        />
        <QuickAction
          icon={<TrendingUp className="w-5 h-5" />}
          label="Swap"
          color="from-green-600 to-teal-600"
          link="/swap"
        />
        <QuickAction
          icon={<Clock className="w-5 h-5" />}
          label="History"
          color="from-orange-600 to-amber-600"
          link="/history"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#2A2A3C]">
        <button
          onClick={() => setActiveTab("tokens")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "tokens" ? "text-white border-b-2 border-purple-500" : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Tokens
        </button>
        <button
          onClick={() => setActiveTab("nfts")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "nfts" ? "text-white border-b-2 border-purple-500" : "text-gray-400 hover:text-gray-300"
          }`}
        >
          NFTs
        </button>
        <button
          onClick={() => setActiveTab("activity")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "activity" ? "text-white border-b-2 border-purple-500" : "text-gray-400 hover:text-gray-300"
          }`}
        >
          Activity
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "tokens" && <TokenList />}

        {activeTab === "nfts" && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 bg-[#2A2A3C] rounded-full flex items-center justify-center mb-4">
              <Wallet className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No NFTs Found</h3>
            <p className="text-gray-400 text-sm max-w-xs">
              Your NFT collection will appear here once you acquire some digital collectibles.
            </p>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((tx, index) => <TransactionItem key={index} transaction={tx} />)
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 bg-[#2A2A3C] rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">No Transactions Yet</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  Your transaction history will appear here once you start using your wallet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Market Trends */}
      <div>
        <h2 className="text-lg font-medium mb-4">Market Trends</h2>
        <div className="bg-[#1E1E2D]/80 backdrop-blur-sm rounded-xl border border-[#2A2A3C] overflow-hidden">
          <div className="grid grid-cols-3 divide-x divide-[#2A2A3C]">
            <MarketTrendItem symbol="ETH" price="3,245.67" change="+5.67%" isPositive={true} />
            <MarketTrendItem symbol="BTC" price="42,891.30" change="-1.23%" isPositive={false} />
            <MarketTrendItem symbol="SOL" price="103.45" change="+12.38%" isPositive={true} />
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickAction({ icon, label, color, link }) {
  return (
    <motion.div whileTap={{ scale: 0.95 }} className="flex flex-col items-center">
      <div
        className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-2 shadow-lg`}
      >
        {icon}
      </div>
      <span className="text-xs text-gray-300">{label}</span>
    </motion.div>
  )
}

function TransactionItem({ transaction }) {
  const isReceived = transaction.type === "received"

  return (
    <div className="bg-[#1E1E2D]/80 backdrop-blur-sm rounded-xl p-4 border border-[#2A2A3C]">
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
                {transaction.amount} ETH
              </p>
              <p className="text-xs text-gray-400">${(Number.parseFloat(transaction.amount) * 3245.67).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MarketTrendItem({ symbol, price, change, isPositive }) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-1">
        <span className="font-medium text-white">{symbol}</span>
        <span className={`text-xs ${isPositive ? "text-green-400" : "text-red-400"}`}>{change}</span>
      </div>
      <p className="text-sm text-gray-300">${price}</p>
    </div>
  )
}
