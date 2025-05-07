"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { ethers } from "ethers"
import { useNetwork } from "./network-context"

const WalletContext = createContext(null)

export function WalletProvider({ children }) {
  const [wallet, setWallet] = useState(null)
  const [balance, setBalance] = useState(null)
  const [transactions, setTransactions] = useState([])
  const { currentNetwork, getProvider } = useNetwork()

  const createNewWallet = useCallback(async () => {
    try {
      // Generate a random wallet
      const newWallet = ethers.Wallet.createRandom()

      const walletData = {
        address: newWallet.address,
        privateKey: newWallet.privateKey,
        mnemonic: newWallet.mnemonic.phrase,
      }

      // Save to state
      setWallet(walletData)

      // Save to local storage (in a real app, this should be encrypted)
      localStorage.setItem("glintWallet", JSON.stringify(walletData))

      return walletData
    } catch (error) {
      console.error("Error creating wallet:", error)
      throw error
    }
  }, [])

  const importWalletFromKey = useCallback(async (privateKey) => {
    try {
      // Create wallet from private key
      const importedWallet = new ethers.Wallet(privateKey)

      const walletData = {
        address: importedWallet.address,
        privateKey: importedWallet.privateKey,
      }

      // Save to state
      setWallet(walletData)

      // Save to local storage (in a real app, this should be encrypted)
      localStorage.setItem("glintWallet", JSON.stringify(walletData))

      return walletData
    } catch (error) {
      console.error("Error importing wallet from private key:", error)
      throw error
    }
  }, [])

  const importWalletFromSeed = useCallback(async (seedPhrase) => {
    try {
      // Create wallet from seed phrase
      const importedWallet = ethers.Wallet.fromPhrase(seedPhrase)

      const walletData = {
        address: importedWallet.address,
        privateKey: importedWallet.privateKey,
        mnemonic: seedPhrase,
      }

      // Save to state
      setWallet(walletData)

      // Save to local storage (in a real app, this should be encrypted)
      localStorage.setItem("glintWallet", JSON.stringify(walletData))

      return walletData
    } catch (error) {
      console.error("Error importing wallet from seed phrase:", error)
      throw error
    }
  }, [])

  const fetchBalance = useCallback(async () => {
    if (!wallet || !currentNetwork) return

    try {
      const provider = getProvider()
      if (!provider) return

      const balance = await provider.getBalance(wallet.address)
      setBalance(ethers.formatEther(balance))

      return ethers.formatEther(balance)
    } catch (error) {
      console.error("Error fetching balance:", error)
    }
  }, [wallet, currentNetwork, getProvider])

  const sendTransaction = useCallback(
    async (to, amount) => {
      if (!wallet || !currentNetwork) {
        throw new Error("Wallet or network not initialized")
      }

      try {
        const provider = getProvider()
        if (!provider) {
          throw new Error("Provider not available")
        }

        // Create wallet with provider
        const walletWithProvider = new ethers.Wallet(wallet.privateKey, provider)

        // Send transaction
        const tx = await walletWithProvider.sendTransaction({
          to,
          value: ethers.parseEther(amount),
        })

        // Add to transactions
        const newTx = {
          hash: tx.hash,
          to,
          from: wallet.address,
          amount,
          timestamp: Date.now(),
          status: "pending",
          type: "sent",
        }

        setTransactions((prev) => [newTx, ...prev])

        // Return transaction hash
        return tx.hash
      } catch (error) {
        console.error("Error sending transaction:", error)
        throw error
      }
    },
    [wallet, currentNetwork, getProvider],
  )

  const disconnectWallet = useCallback(() => {
    setWallet(null)
    setBalance(null)
    setTransactions([])
    localStorage.removeItem("glintWallet")
  }, [])

  const deleteWallet = useCallback(() => {
    setWallet(null)
    setBalance(null)
    setTransactions([])
    localStorage.removeItem("glintWallet")
  }, [])

  // Load wallet from local storage on initial render
  useState(() => {
    const savedWallet = localStorage.getItem("glintWallet")
    if (savedWallet) {
      try {
        const parsedWallet = JSON.parse(savedWallet)
        setWallet(parsedWallet)

        // Mock transactions for demo
        setTransactions([
          {
            hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
            to: "0x1234567890abcdef1234567890abcdef12345678",
            from: parsedWallet.address,
            amount: "0.1",
            timestamp: Date.now() - 86400000, // 1 day ago
            status: "confirmed",
            type: "sent",
          },
          {
            hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
            to: parsedWallet.address,
            from: "0xabcdef1234567890abcdef1234567890abcdef12",
            amount: "0.5",
            timestamp: Date.now() - 172800000, // 2 days ago
            status: "confirmed",
            type: "received",
          },
        ])
      } catch (error) {
        console.error("Error loading wallet from local storage:", error)
      }
    }
  }, [])

  const value = {
    wallet,
    balance,
    transactions,
    createNewWallet,
    importWalletFromKey,
    importWalletFromSeed,
    fetchBalance,
    sendTransaction,
    disconnectWallet,
    deleteWallet,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider")
  }
  return context
}
