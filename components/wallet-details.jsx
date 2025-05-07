"use client"

import { useState } from "react"

export default function WalletDetails({ wallet, setWallet, provider, network }) {
  const [showPrivateKey, setShowPrivateKey] = useState(false)
  const [showSeedPhrase, setShowSeedPhrase] = useState(false)
  const [copied, setCopied] = useState(null)
  const [showExportDialog, setShowExportDialog] = useState(null)

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const disconnectWallet = () => {
    setWallet(null)
  }

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  const viewOnExplorer = () => {
    window.open(`${network.explorer}/address/${wallet.address}`, "_blank")
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-400">Address</p>
          <div className="flex items-center space-x-2">
            <p className="text-sm font-mono bg-[#2a2a2a] p-2 rounded-md overflow-hidden text-ellipsis text-gray-200">
              {wallet.address}
            </p>
            <button
              onClick={() => copyToClipboard(wallet.address, "address")}
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
          {copied === "address" && <p className="text-xs text-green-400">Copied to clipboard!</p>}
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
          onClick={() => setShowExportDialog("privateKey")}
          className="px-4 py-2 bg-[#2a2a2a] border border-[#444] rounded-md text-gray-200 hover:bg-[#333] hover:text-gray-100"
        >
          Export Private Key
        </button>

        {wallet.mnemonic && (
          <button
            onClick={() => setShowExportDialog("seedPhrase")}
            className="px-4 py-2 bg-[#2a2a2a] border border-[#444] rounded-md text-gray-200 hover:bg-[#333] hover:text-gray-100"
          >
            Export Seed Phrase
          </button>
        )}

        <button
          onClick={viewOnExplorer}
          className="px-4 py-2 bg-[#2a2a2a] border border-[#444] rounded-md text-gray-200 hover:bg-[#333] hover:text-gray-100"
        >
          <span className="flex items-center">
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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

        <button onClick={disconnectWallet} className="px-4 py-2 bg-red-900 hover:bg-red-800 text-white rounded-md">
          <span className="flex items-center">
            <svg
              className="mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
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

      {showExportDialog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-6 max-w-md w-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-100">
                {showExportDialog === "privateKey" ? "Private Key" : "Seed Phrase"}
              </h3>
              <p className="text-gray-400 text-sm">
                Never share your {showExportDialog === "privateKey" ? "private key" : "seed phrase"} with anyone. Anyone
                with your {showExportDialog === "privateKey" ? "private key" : "seed phrase"} has full control of your
                wallet.
              </p>
            </div>

            <div className="bg-[#2a2a2a] border border-[#444] rounded-md p-3 mb-4">
              {showExportDialog === "privateKey" ? (
                showPrivateKey ? (
                  <div className="break-all font-mono text-gray-200">{wallet.privateKey}</div>
                ) : (
                  <div className="bg-[#333] h-8 rounded-md"></div>
                )
              ) : showSeedPhrase ? (
                <div className="break-all font-mono text-gray-200">{wallet.mnemonic}</div>
              ) : (
                <div className="bg-[#333] h-8 rounded-md"></div>
              )}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => {
                  if (showExportDialog === "privateKey") {
                    setShowPrivateKey(!showPrivateKey)
                  } else {
                    setShowSeedPhrase(!showSeedPhrase)
                  }
                }}
                className="px-4 py-2 bg-[#2a2a2a] border border-[#444] rounded-md text-gray-200 hover:bg-[#333] hover:text-gray-100"
              >
                <span className="flex items-center">
                  {(showExportDialog === "privateKey" && showPrivateKey) ||
                  (showExportDialog === "seedPhrase" && showSeedPhrase) ? (
                    <>
                      <svg
                        className="mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                      Hide
                    </>
                  ) : (
                    <>
                      <svg
                        className="mr-2 h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
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
                    </>
                  )}
                </span>
              </button>

              <button
                onClick={() => {
                  if (showExportDialog === "privateKey") {
                    copyToClipboard(wallet.privateKey, "privateKey")
                  } else {
                    copyToClipboard(wallet.mnemonic, "seedPhrase")
                  }
                }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-md"
              >
                <span className="flex items-center">
                  <svg
                    className="mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
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
                  {copied === (showExportDialog === "privateKey" ? "privateKey" : "seedPhrase") ? "Copied!" : "Copy"}
                </span>
              </button>
            </div>

            <div className="mt-4 text-right">
              <button
                onClick={() => {
                  setShowExportDialog(null)
                  setShowPrivateKey(false)
                  setShowSeedPhrase(false)
                }}
                className="px-4 py-2 bg-[#2a2a2a] border border-[#444] rounded-md text-gray-200 hover:bg-[#333] hover:text-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
