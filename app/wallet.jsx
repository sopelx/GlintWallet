"use client"
import { useState, useEffect } from "react"
import { ethers } from "ethers"

export default function GlintWallet() {
  // State for wallet and UI
  const [wallet, setWallet] = useState(null)
  const [provider, setProvider] = useState(null)
  const [activeTab, setActiveTab] = useState("create")
  const [transactions, setTransactions] = useState([])
  const [network, setNetwork] = useState({
    name: "Ethereum",
    chainId: 1,
    rpcUrl: "https://eth.llamarpc.com",
    explorer: "https://etherscan.io",
    currency: "ETH",
    testnet: false,
  })

  // Network configurations
  const networks = [
    {
      name: "Ethereum",
      chainId: 1,
      rpcUrl: "https://eth.llamarpc.com",
      explorer: "https://etherscan.io",
      currency: "ETH",
      testnet: false,
    },
    {
      name: "Polygon",
      chainId: 137,
      rpcUrl: "https://polygon.llamarpc.com",
      explorer: "https://polygonscan.com",
      currency: "MATIC",
      testnet: false,
    },
    {
      name: "Optimism",
      chainId: 10,
      rpcUrl: "https://optimism.llamarpc.com",
      explorer: "https://optimistic.etherscan.io",
      currency: "ETH",
      testnet: false,
    },
    {
      name: "Arbitrum",
      chainId: 42161,
      rpcUrl: "https://arbitrum.llamarpc.com",
      explorer: "https://arbiscan.io",
      currency: "ETH",
      testnet: false,
    },
    {
      name: "Sepolia",
      chainId: 11155111,
      rpcUrl: "https://rpc.sepolia.org",
      explorer: "https://sepolia.etherscan.io",
      currency: "ETH",
      testnet: true,
    },
  ]

  // Initialize provider when network changes
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

  // Create a new wallet
  const createWallet = async () => {
    try {
      const newWallet = ethers.Wallet.createRandom()
      setWallet({
        address: newWallet.address,
        privateKey: newWallet.privateKey,
        mnemonic: newWallet.mnemonic?.phrase,
        balance: "0.0",
      })
    } catch (err) {
      console.error("Error creating wallet:", err)
      alert("Failed to create wallet. Please try again.")
    }
  }

  // Import wallet from private key
  const importFromPrivateKey = (privateKey) => {
    try {
      if (!privateKey.startsWith("0x")) {
        throw new Error("Private key must start with 0x")
      }

      const importedWallet = new ethers.Wallet(privateKey)
      setWallet({
        address: importedWallet.address,
        privateKey: importedWallet.privateKey,
        balance: "0.0",
      })
    } catch (err) {
      console.error("Error importing wallet from private key:", err)
      alert("Invalid private key. Please check and try again.")
    }
  }

  // Import wallet from seed phrase
  const importFromSeedPhrase = (seedPhrase) => {
    try {
      if (!ethers.Mnemonic.isValidMnemonic(seedPhrase)) {
        throw new Error("Invalid seed phrase")
      }

      const importedWallet = ethers.Wallet.fromPhrase(seedPhrase)
      setWallet({
        address: importedWallet.address,
        privateKey: importedWallet.privateKey,
        mnemonic: seedPhrase,
        balance: "0.0",
      })
    } catch (err) {
      console.error("Error importing wallet from seed phrase:", err)
      alert("Invalid seed phrase. Please check and try again.")
    }
  }

  // Send transaction
  const sendTransaction = async (recipient, amount) => {
    if (!provider) {
      alert("Provider not connected. Please refresh the page or try again later.")
      return
    }

    try {
      // Validate recipient address
      if (!ethers.isAddress(recipient)) {
        throw new Error("Invalid recipient address")
      }

      // Validate amount
      const amountInEther = Number.parseFloat(amount)
      if (isNaN(amountInEther) || amountInEther <= 0) {
        throw new Error("Invalid amount")
      }

      // Check if user has enough balance
      const balance = Number.parseFloat(wallet.balance)
      if (amountInEther > balance) {
        throw new Error("Insufficient balance")
      }

      // Create wallet instance with provider
      const walletWithProvider = new ethers.Wallet(wallet.privateKey, provider)

      // Send transaction
      const tx = await walletWithProvider.sendTransaction({
        to: recipient,
        value: ethers.parseEther(amount),
      })

      // Add to transaction history
      addTransaction({
        hash: tx.hash,
        to: recipient,
        amount: amount,
        timestamp: Date.now(),
        status: "pending",
      })

      return tx.hash
    } catch (err) {
      console.error("Error sending transaction:", err)
      throw err
    }
  }

  // Add transaction to history
  const addTransaction = (tx) => {
    setTransactions([tx, ...transactions])
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    setWallet(null)
  }

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    return true
  }

  // Truncate hash for display
  const truncateHash = (hash) => {
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`
  }

  return (
    <main className="min-h-screen bg-[#121212] text-gray-100">
      <div className="max-w-4xl mx-auto p-4">
        <header className="py-8 flex justify-center">
          <div className="relative">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-transparent bg-clip-text">
              Glint
            </h1>
            <div className="absolute -bottom-2 left-0 w-full h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
          </div>
        </header>

        {!wallet ? (
          <div className="space-y-4">
            <div className="flex border-b border-[#333]">
              <button
                className={`px-4 py-2 ${
                  activeTab === "create"
                    ? "border-b-2 border-purple-500 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setActiveTab("create")}
              >
                Create Wallet
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === "import"
                    ? "border-b-2 border-purple-500 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
                onClick={() => setActiveTab("import")}
              >
                Import Wallet
              </button>
            </div>

            <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6">
              {activeTab === "create" ? (
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-gray-100">Create New Wallet</h2>
                  <p className="text-gray-400 mb-6">Generate a new wallet with a seed phrase and private key</p>
                  <div className="flex justify-center">
                    <button
                      onClick={createWallet}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md flex items-center"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                      </svg>
                      Create New Wallet
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-semibold mb-2 text-gray-100">Import Existing Wallet</h2>
                  <p className="text-gray-400 mb-6">Import your wallet using a private key or seed phrase</p>

                  <div className="flex border-b border-[#333] mb-4">
                    <button
                      className={`px-4 py-2 ${
                        activeTab === "privateKey"
                          ? "border-b-2 border-purple-500 text-white"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                      onClick={() => setActiveTab("privateKey")}
                    >
                      Private Key
                    </button>
                    <button
                      className={`px-4 py-2 ${
                        activeTab === "seedPhrase"
                          ? "border-b-2 border-purple-500 text-white"
                          : "text-gray-400 hover:text-gray-200"
                      }`}
                      onClick={() => setActiveTab("seedPhrase")}
                    >
                      Seed Phrase
                    </button>
                  </div>

                  {activeTab === "privateKey" ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="privateKey" className="block text-sm font-medium text-gray-300">
                          Private Key
                        </label>
                        <input
                          id="privateKey"
                          type="password"
                          placeholder="0x..."
                          className="w-full bg-[#2a2a2a] border border-[#444] rounded-md p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              importFromPrivateKey(e.target.value)
                            }
                          }}
                        />
                      </div>
                      <button
                        onClick={() => {
                          const input = document.getElementById("privateKey")
                          importFromPrivateKey(input.value)
                        }}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
                      >
                        <svg
                          className="mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                        </svg>
                        Import with Private Key
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="seedPhrase" className="block text-sm font-medium text-gray-300">
                          Seed Phrase (12 or 24 words)
                        </label>
                        <input
                          id="seedPhrase"
                          type="password"
                          placeholder="Enter your seed phrase..."
                          className="w-full bg-[#2a2a2a] border border-[#444] rounded-md p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              importFromSeedPhrase(e.target.value)
                            }
                          }}
                        />
                      </div>
                      <button
                        onClick={() => {
                          const input = document.getElementById("seedPhrase")
                          importFromSeedPhrase(input.value)
                        }}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
                      >
                        <svg
                          className="mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                        </svg>
                        Import with Seed Phrase
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Network Selector */}
            <div className="flex justify-end">
              <div className="relative inline-block">
                <button
                  onClick={() => document.getElementById("networkDropdown").classList.toggle("hidden")}
                  className="px-4 py-2 bg-[#2a2a2a] border border-[#444] rounded-md text-gray-200 hover:bg-[#333] hover:text-gray-100 flex items-center"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  {network.name}
                  <svg
                    className="ml-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                <div
                  id="networkDropdown"
                  className="absolute right-0 mt-2 w-56 bg-[#1e1e1e] border border-[#333] rounded-md shadow-lg z-10 hidden"
                >
                  {networks.map((net) => (
                    <button
                      key={net.chainId}
                      className={`w-full text-left px-4 py-2 flex items-center justify-between hover:bg-[#2a2a2a] ${
                        network.chainId === net.chainId ? "bg-[#2a2a2a]" : ""
                      }`}
                      onClick={() => {
                        setNetwork(net)
                        document.getElementById("networkDropdown").classList.add("hidden")
                      }}
                    >
                      <span className="flex items-center">
                        {net.name}
                        {net.testnet && (
                          <span className="ml-2 text-xs bg-yellow-900/30 text-yellow-400 px-1.5 py-0.5 rounded-full">
                            Testnet
                          </span>
                        )}
                      </span>
                      {network.chainId === net.chainId && (
                        <svg
                          className="h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Wallet Details */}
            <div className="bg-[#1e1e1e] border border-[#333] rounded-lg overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>
              <div className="p-6">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-gray-100">Wallet Details</h2>
                  <div className="text-sm font-medium text-gray-400">Network: {network.name}</div>
                </div>
                <p className="text-gray-400 mb-4">Your wallet information and current balance</p>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-400">Address</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-mono bg-[#2a2a2a] p-2 rounded-md overflow-hidden text-ellipsis text-gray-200">
                          {wallet.address}
                        </p>
                        <button
                          onClick={() => {
                            copyToClipboard(wallet.address)
                            document.getElementById("addressCopied").classList.remove("hidden")
                            setTimeout(() => {
                              document.getElementById("addressCopied").classList.add("hidden")
                            }, 2000)
                          }}
                          className="p-2 rounded-md hover:bg-[#333] text-gray-400 hover:text-gray-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        </button>
                      </div>
                      <p id="addressCopied" className="text-xs text-green-400 hidden">
                        Copied to clipboard!
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-400">Balance</p>
                      <div className="flex items-center">
                        <p className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 text-transparent bg-clip-text">
                          {wallet.balance} {network.currency}
                        </p>
                        <div className={`ml-2 h-2 w-2 rounded-full ${provider ? "bg-green-500" : "bg-red-500"}`}></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <button
                      onClick={() => {
                        document.getElementById("privateKeyDialog").classList.remove("hidden")
                      }}
                      className="px-4 py-2 bg-[#2a2a2a] border border-[#444] rounded-md text-gray-200 hover:bg-[#333] hover:text-gray-100"
                    >
                      Export Private Key
                    </button>

                    {wallet.mnemonic && (
                      <button
                        onClick={() => {
                          document.getElementById("seedPhraseDialog").classList.remove("hidden")
                        }}
                        className="px-4 py-2 bg-[#2a2a2a] border border-[#444] rounded-md text-gray-200 hover:bg-[#333] hover:text-gray-100"
                      >
                        Export Seed Phrase
                      </button>
                    )}

                    <button
                      onClick={() => {
                        window.open(`${network.explorer}/address/${wallet.address}`, "_blank")
                      }}
                      className="px-4 py-2 bg-[#2a2a2a] border border-[#444] rounded-md text-gray-200 hover:bg-[#333] hover:text-gray-100"
                    >
                      <span className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                        View on Explorer
                      </span>
                    </button>

                    <button
                      onClick={disconnectWallet}
                      className="px-4 py-2 bg-red-900 hover:bg-red-800 text-white rounded-md"
                    >
                      <span className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                          <polyline points="16 17 21 12 16 7"></polyline>
                          <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Disconnect
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Send Transaction */}
              <div className="bg-[#1e1e1e] border border-[#333] rounded-lg overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-100 mb-2">Send Transaction</h2>
                  <p className="text-gray-400 mb-4">Send {network.currency} to another address</p>

                  <div className="space-y-4">
                    <div
                      id="txError"
                      className="bg-red-900/20 border border-red-900 text-red-300 p-3 rounded-md hidden"
                    ></div>
                    <div
                      id="txSuccess"
                      className="bg-green-900/20 border border-green-900 text-green-300 p-3 rounded-md break-all hidden"
                    ></div>

                    <div className="space-y-2">
                      <label htmlFor="recipient" className="block text-sm font-medium text-gray-300">
                        Recipient Address
                      </label>
                      <input
                        id="recipient"
                        placeholder="0x..."
                        className="w-full bg-[#2a2a2a] border border-[#444] rounded-md p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-300">
                        Amount ({network.currency})
                      </label>
                      <input
                        id="amount"
                        type="number"
                        step="0.0001"
                        min="0"
                        placeholder="0.01"
                        className="w-full bg-[#2a2a2a] border border-[#444] rounded-md p-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <button
                      id="sendTxButton"
                      onClick={async () => {
                        const recipient = document.getElementById("recipient").value
                        const amount = document.getElementById("amount").value

                        // Hide previous messages
                        document.getElementById("txError").classList.add("hidden")
                        document.getElementById("txSuccess").classList.add("hidden")

                        // Disable button and show loading
                        const button = document.getElementById("sendTxButton")
                        const buttonText = button.innerHTML
                        button.disabled = true
                        button.innerHTML = `
                          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        `

                        try {
                          const txHash = await sendTransaction(recipient, amount)
                          document.getElementById("txSuccess").classList.remove("hidden")
                          document.getElementById("txSuccess").textContent = `Transaction sent! Hash: ${txHash}`

                          // Reset form
                          document.getElementById("recipient").value = ""
                          document.getElementById("amount").value = ""
                        } catch (err) {
                          document.getElementById("txError").classList.remove("hidden")
                          document.getElementById("txError").textContent = err.message || "Failed to send transaction"
                        } finally {
                          // Re-enable button and restore text
                          button.disabled = false
                          button.innerHTML = buttonText
                        }
                      }}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
                    >
                      <svg
                        className="mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                      Send Transaction
                    </button>
                  </div>
                </div>
              </div>

              {/* Transaction History */}
              <div className="bg-[#1e1e1e] border border-[#333] rounded-lg overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-orange-500"></div>
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-100 mb-2">Transaction History</h2>
                  <p className="text-gray-400 mb-4">Your recent transactions</p>

                  {transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                      <div className="w-16 h-16 rounded-full bg-[#2a2a2a] flex items-center justify-center mb-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path
                            d="M21 12C21 16.9706 16.9706 21 12 21"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <p>No transactions yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {transactions.map((tx, index) => (
                        <div key={index} className="border border-[#333] rounded-md p-3 text-sm bg-[#2a2a2a]">
                          <div className="flex justify-between items-start mb-2">
                            <div className="font-medium text-gray-200">{truncateHash(tx.hash)}</div>
                            <div
                              className={`px-2 py-1 rounded-full text-xs ${
                                tx.status === "confirmed" ? "bg-purple-600 text-white" : "bg-[#333] text-gray-300"
                              }`}
                            >
                              {tx.status}
                            </div>
                          </div>
                          <div className="text-gray-400">
                            <div className="flex justify-between">
                              <span>Amount:</span>
                              <span className="text-gray-200">
                                {tx.amount} {network.currency}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Time:</span>
                              <span className="text-gray-200">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                            </div>
                          </div>
                          <div className="mt-2">
                            <a
                              href={`${network.explorer}/tx/${tx.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs flex items-center text-purple-400 hover:text-purple-300"
                            >
                              View on Explorer
                              <svg
                                className="h-3 w-3 ml-1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                              </svg>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Private Key Dialog */}
      <div id="privateKeyDialog" className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 hidden">
        <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6 max-w-md w-full">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-100">Private Key</h3>
            <p className="text-gray-400 text-sm">
              Never share your private key with anyone. Anyone with your private key has full control of your wallet.
            </p>
          </div>

          <div className="bg-[#2a2a2a] border border-[#444] rounded-md p-3 mb-4">
            <div id="privateKeyContent" className="bg-[#333] h-8 rounded-md"></div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => {
                const content = document.getElementById("privateKeyContent")
                if (content.classList.contains("bg-[#333]")) {
                  content.classList.remove("bg-[#333]")
                  content.classList.add("break-all", "font-mono", "text-gray-200")
                  content.textContent = wallet.privateKey
                  document.getElementById("showPrivateKeyBtn").innerHTML = `
                    <svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                    Hide
                  `
                } else {
                  content.classList.add("bg-[#333]")
                  content.classList.remove("break-all", "font-mono", "text-gray-200")
                  content.textContent = ""
                  document.getElementById("showPrivateKeyBtn").innerHTML = `
                    <svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Show
                  `
                }
              }}
              id="showPrivateKeyBtn"
              className="px-4 py-2 bg-[#2a2a2a] border border-[#444] rounded-md text-gray-200 hover:bg-[#333] hover:text-gray-100"
            >
              <span className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                Show
              </span>
            </button>

            <button
              onClick={() => {
                copyToClipboard(wallet.privateKey)
                document.getElementById("copyPrivateKeyBtn").innerHTML = `
                  <svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copied!
                `
                setTimeout(() => {
                  document.getElementById("copyPrivateKeyBtn").innerHTML = `
                    <svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy
                  `
                }, 2000)
              }}
              id="copyPrivateKeyBtn"
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md"
            >
              <span className="flex items-center">
                <svg
                  className="mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                Copy
              </span>
            </button>
          </div>

          <div className="mt-4 text-right">
            <button
              onClick={() => {
                document.getElementById("privateKeyDialog").classList.add("hidden")
                document.getElementById("privateKeyContent").classList.add("bg-[#333]")
                document.getElementById("privateKeyContent").classList.remove("break-all", "font-mono", "text-gray-200")
                document.getElementById("privateKeyContent").textContent = ""
              }}
              className="px-4 py-2 bg-[#2a2a2a] border border-[#444] rounded-md text-gray-200 hover:bg-[#333] hover:text-gray-100"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Seed Phrase Dialog */}
      {wallet && wallet.mnemonic && (
        <div
          id="seedPhraseDialog"
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 hidden"
        >
          <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6 max-w-md w-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-100">Seed Phrase</h3>
              <p className="text-gray-400 text-sm">
                Never share your seed phrase with anyone. Anyone with your seed phrase has full control of your wallet.
              </p>
            </div>

            <div className="bg-[#2a2a2a] border border-[#444] rounded-md p-3 mb-4">
              <div id="seedPhraseContent" className="bg-[#333] h-8 rounded-md"></div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => {
                  const content = document.getElementById("seedPhraseContent")
                  if (content.classList.contains("bg-[#333]")) {
                    content.classList.remove("bg-[#333]")
                    content.classList.add("break-all", "font-mono", "text-gray-200")
                    content.textContent = wallet.mnemonic
                    document.getElementById("showSeedPhraseBtn").innerHTML = `
                      <svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                    Hide
                  `
                  } else {
                    content.classList.add("bg-[#333]")
                    content.classList.remove("break-all", "font-mono", "text-gray-200")
                    content.textContent = ""
                    document.getElementById("showSeedPhraseBtn").innerHTML = `
                    <svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    Show
                  `
                  }
                }}
                id="showSeedPhraseBtn"
                className="px-4 py-2 bg-[#2a2a2a] border border-[#444] rounded-md text-gray-200 hover:bg-[#333] hover:text-gray-100"
              >
                <span className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  Show
                </span>
              </button>

              <button
                onClick={() => {
                  copyToClipboard(wallet.mnemonic)
                  document.getElementById("copySeedPhraseBtn").innerHTML = `
                    <svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copied!
                  `
                  setTimeout(() => {
                    document.getElementById("copySeedPhraseBtn").innerHTML = `
                      <svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copy
                  `
                  }, 2000)
                }}
                id="copySeedPhraseBtn"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md"
              >
                <span className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copy
                </span>
              </button>
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={() => {
                  document.getElementById("seedPhraseDialog").classList.add("hidden")
                  document.getElementById("seedPhraseContent").classList.add("bg-[#333]")
                  document
                    .getElementById("seedPhraseContent")
                    .classList.remove("break-all", "font-mono", "text-gray-200")
                  document.getElementById("seedPhraseContent").textContent = ""
                }}
                className="px-4 py-2 bg-[#2a2a2a] border border-[#444] rounded-md text-gray-200 hover:bg-[#333] hover:text-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
