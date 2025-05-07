"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { ethers } from "ethers"

const NetworkContext = createContext(null)

export function NetworkProvider({ children }) {
  const [networks] = useState([
    {
      name: "Ethereum",
      chainId: 1,
      rpcUrl: "https://eth.llamarpc.com",
      explorer: "https://etherscan.io",
      currency: "ETH",
      symbol: "ETH",
      testnet: false,
    },
    {
      name: "Polygon",
      chainId: 137,
      rpcUrl: "https://polygon.llamarpc.com",
      explorer: "https://polygonscan.com",
      currency: "MATIC",
      symbol: "MATIC",
      testnet: false,
    },
    {
      name: "Optimism",
      chainId: 10,
      rpcUrl: "https://optimism.llamarpc.com",
      explorer: "https://optimistic.etherscan.io",
      currency: "ETH",
      symbol: "OP",
      testnet: false,
    },
    {
      name: "Arbitrum",
      chainId: 42161,
      rpcUrl: "https://arbitrum.llamarpc.com",
      explorer: "https://arbiscan.io",
      currency: "ETH",
      symbol: "ARB",
      testnet: false,
    },
    {
      name: "Sepolia",
      chainId: 11155111,
      rpcUrl: "https://rpc.sepolia.org",
      explorer: "https://sepolia.etherscan.io",
      currency: "ETH",
      symbol: "SEP",
      testnet: true,
    },
  ])

  const [currentNetwork, setCurrentNetwork] = useState(networks[0])
  const [provider, setProvider] = useState(null)

  const setNetwork = useCallback((network) => {
    setCurrentNetwork(network)

    // Initialize provider for the new network
    try {
      const newProvider = new ethers.JsonRpcProvider(network.rpcUrl)
      setProvider(newProvider)
    } catch (error) {
      console.error("Error initializing provider:", error)
      setProvider(null)
    }
  }, [])

  const getProvider = useCallback(() => {
    if (provider) return provider

    // Initialize provider if not already done
    try {
      const newProvider = new ethers.JsonRpcProvider(currentNetwork.rpcUrl)
      setProvider(newProvider)
      return newProvider
    } catch (error) {
      console.error("Error initializing provider:", error)
      return null
    }
  }, [provider, currentNetwork])

  // Initialize provider on first render
  useState(() => {
    getProvider()
  }, [getProvider])

  const value = {
    networks,
    currentNetwork,
    setNetwork,
    getProvider,
  }

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
}

export function useNetwork() {
  const context = useContext(NetworkContext)
  if (!context) {
    throw new Error("useNetwork must be used within a NetworkProvider")
  }
  return context
}
