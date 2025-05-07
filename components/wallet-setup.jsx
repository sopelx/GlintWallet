"use client"

import { useState } from "react"
import CreateWallet from "./create-wallet"
import ImportWallet from "./import-wallet"

export default function WalletSetup({ setWallet }) {
  const [activeTab, setActiveTab] = useState("create")

  return (
    <div className="space-y-4">
      <div className="flex border-b border-[#333]">
        <button
          className={`px-4 py-2 ${
            activeTab === "create" ? "border-b-2 border-purple-500 text-white" : "text-gray-400 hover:text-gray-200"
          }`}
          onClick={() => setActiveTab("create")}
        >
          Create Wallet
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "import" ? "border-b-2 border-purple-500 text-white" : "text-gray-400 hover:text-gray-200"
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
            <CreateWallet setWallet={setWallet} />
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-2 text-gray-100">Import Existing Wallet</h2>
            <p className="text-gray-400 mb-6">Import your wallet using a private key or seed phrase</p>
            <ImportWallet setWallet={setWallet} />
          </div>
        )}
      </div>
    </div>
  )
}
