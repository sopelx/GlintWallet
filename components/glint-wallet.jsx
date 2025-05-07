"use client"

import { useState, useEffect } from "react"
import WelcomeScreen from "./welcome-screen"
import WalletInterface from "./wallet-interface"
import { NetworkProvider } from "@/context/network-context"
import { WalletProvider } from "@/context/wallet-context"
import { ThemeProvider } from "@/context/theme-context"
import { AnimatePresence } from "framer-motion"
import LoadingScreen from "./loading-screen"

export default function GlintWallet() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <ThemeProvider>
      <NetworkProvider>
        <WalletProvider>
          <AnimatePresence mode="wait">
            <div className="relative w-full min-h-screen">
              <WalletContainer />
            </div>
          </AnimatePresence>
        </WalletProvider>
      </NetworkProvider>
    </ThemeProvider>
  )
}

function WalletContainer() {
  const [walletExists, setWalletExists] = useState(false)

  useEffect(() => {
    // Check if wallet exists in local storage
    const savedWallet = localStorage.getItem("glintWallet")
    if (savedWallet) {
      setWalletExists(true)
    }
  }, [])

  return (
    <AnimatePresence mode="wait">
      {!walletExists ? (
        <WelcomeScreen onWalletCreated={() => setWalletExists(true)} key="welcome" />
      ) : (
        <WalletInterface key="interface" />
      )}
    </AnimatePresence>
  )
}
