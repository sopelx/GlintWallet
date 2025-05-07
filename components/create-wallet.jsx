"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Copy, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react"
import { ethers } from "ethers"
import Confetti from "react-confetti"
import { useWindowSize } from "@/hooks/use-window-size"

export default function CreateWallet({ onBack, onCreateWallet }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [wallet, setWallet] = useState(null)
  const [showMnemonic, setShowMnemonic] = useState(false)
  const [mnemonicCopied, setMnemonicCopied] = useState(false)
  const [verificationComplete, setVerificationComplete] = useState(false)
  const [selectedWords, setSelectedWords] = useState([])
  const [wordOptions, setWordOptions] = useState([])
  const { width, height } = useWindowSize()

  const generateWallet = async () => {
    setLoading(true)

    try {
      // Generate a random wallet
      const newWallet = ethers.Wallet.createRandom()
      setWallet({
        address: newWallet.address,
        privateKey: newWallet.privateKey,
        mnemonic: newWallet.mnemonic.phrase,
      })

      // Prepare word verification
      const words = newWallet.mnemonic.phrase.split(" ")
      // Select 3 random words for verification
      const indices = []
      while (indices.length < 3) {
        const idx = Math.floor(Math.random() * words.length)
        if (!indices.includes(idx)) {
          indices.push(idx)
        }
      }

      // Create options with correct words and some decoys
      const options = indices.map((idx) => ({
        index: idx,
        word: words[idx],
        selected: false,
      }))

      // Add some decoy words
      const decoys = ["apple", "banana", "orange", "crypto", "wallet", "blockchain", "token", "secure"]
      while (options.length < 9) {
        const decoy = decoys[Math.floor(Math.random() * decoys.length)]
        if (!options.some((o) => o.word === decoy)) {
          options.push({
            index: -1,
            word: decoy,
            selected: false,
          })
        }
      }

      // Shuffle options
      setWordOptions(options.sort(() => Math.random() - 0.5))

      setStep(2)
    } catch (error) {
      console.error("Error creating wallet:", error)
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    setMnemonicCopied(true)
    setTimeout(() => setMnemonicCopied(false), 2000)
  }

  const handleWordSelection = (word) => {
    const updatedOptions = wordOptions.map((option) => {
      if (option.word === word.word) {
        return { ...option, selected: !option.selected }
      }
      return option
    })

    setWordOptions(updatedOptions)

    if (word.selected) {
      setSelectedWords(selectedWords.filter((w) => w.word !== word.word))
    } else {
      setSelectedWords([...selectedWords, word])
    }
  }

  const verifySelection = () => {
    // Check if all selected words are correct (have index >= 0)
    const allCorrect = selectedWords.every((word) => word.index >= 0)
    const allRequired = wordOptions
      .filter((word) => word.index >= 0)
      .every((word) => selectedWords.some((selected) => selected.word === word.word))

    if (allCorrect && allRequired) {
      setVerificationComplete(true)
      setTimeout(() => {
        setStep(3)
      }, 2000)
    } else {
      // Show error
      alert("Please select the correct seed phrase words")
    }
  }

  const finalizeWalletCreation = () => {
    onCreateWallet(wallet)
  }

  return (
    <motion.div
      className="bg-[#1E1E2D]/80 backdrop-blur-lg rounded-3xl p-6 border border-[#2A2A3C] shadow-xl"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -20, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-[#2A2A3C] transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <h2 className="text-xl font-semibold ml-2">Create New Wallet</h2>
      </div>

      {step === 1 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="bg-[#2A2A3C]/50 rounded-xl p-5 mb-6">
            <h3 className="text-lg font-medium mb-3 text-purple-300">Secure Your Wallet</h3>
            <p className="text-gray-300 text-sm mb-4">
              You're about to create a new wallet with a unique seed phrase. This phrase is the master key to your
              wallet.
            </p>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start">
                <span className="bg-purple-500/20 text-purple-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                  1
                </span>
                <span>Write down your seed phrase and store it in a secure location.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-500/20 text-purple-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                  2
                </span>
                <span>Never share your seed phrase or private key with anyone.</span>
              </li>
              <li className="flex items-start">
                <span className="bg-purple-500/20 text-purple-300 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                  3
                </span>
                <span>Glint never stores your keys. If you lose your seed phrase, you lose access to your wallet.</span>
              </li>
            </ul>
          </div>

          <button
            onClick={generateWallet}
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium flex items-center justify-center space-x-2 transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating Wallet...</span>
              </>
            ) : (
              <span>Generate My Wallet</span>
            )}
          </button>
        </motion.div>
      )}

      {step === 2 && wallet && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="bg-[#2A2A3C]/50 rounded-xl p-5 mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium text-purple-300">Your Seed Phrase</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowMnemonic(!showMnemonic)}
                  className="p-2 rounded-full hover:bg-[#3A3A4C] transition-colors"
                >
                  {showMnemonic ? (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(wallet.mnemonic)}
                  className="p-2 rounded-full hover:bg-[#3A3A4C] transition-colors"
                >
                  {mnemonicCopied ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {showMnemonic ? (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {wallet.mnemonic.split(" ").map((word, index) => (
                  <div key={index} className="bg-[#3A3A4C] rounded-lg p-2 text-center">
                    <span className="text-xs text-gray-500">{index + 1}</span>
                    <p className="text-sm font-medium text-white">{word}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#3A3A4C] rounded-lg p-4 mb-4 flex items-center justify-center">
                <p className="text-gray-400">●●●●● ●●●●● ●●●●●</p>
              </div>
            )}

            <div className="bg-yellow-500/10 rounded-lg p-3 mb-4">
              <p className="text-yellow-300 text-sm">
                <strong>Important:</strong> Write down your seed phrase and keep it in a safe place. You'll need to
                verify it in the next step.
              </p>
            </div>

            <h3 className="text-lg font-medium mb-3 text-purple-300">Verify Your Seed Phrase</h3>
            <p className="text-gray-300 text-sm mb-4">Select the correct words from your seed phrase:</p>

            <div className="grid grid-cols-3 gap-2 mb-6">
              {wordOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleWordSelection(option)}
                  className={`p-2 rounded-lg text-center transition-all ${
                    option.selected ? "bg-purple-600 text-white" : "bg-[#3A3A4C] text-gray-300 hover:bg-[#4A4A5C]"
                  }`}
                >
                  {option.word}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={verifySelection}
            disabled={selectedWords.length !== wordOptions.filter((w) => w.index >= 0).length}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium flex items-center justify-center space-x-2 transform transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span>Verify & Continue</span>
          </button>

          {verificationComplete && (
            <Confetti width={width} height={height} recycle={false} numberOfPieces={200} gravity={0.2} />
          )}
        </motion.div>
      )}

      {step === 3 && wallet && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Wallet Created!</h3>
            <p className="text-gray-300 text-sm">Your wallet has been successfully created and is ready to use.</p>
          </div>

          <div className="bg-[#2A2A3C]/50 rounded-xl p-5 mb-6">
            <h3 className="text-sm font-medium mb-2 text-gray-400">WALLET ADDRESS</h3>
            <div className="bg-[#3A3A4C] rounded-lg p-3 break-all text-sm text-white font-mono mb-4">
              {wallet.address}
            </div>

            <div className="bg-purple-500/10 rounded-lg p-3">
              <p className="text-purple-300 text-sm">
                <strong>Remember:</strong> Keep your seed phrase safe. It's the only way to recover your wallet if you
                lose access.
              </p>
            </div>
          </div>

          <button
            onClick={finalizeWalletCreation}
            className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium flex items-center justify-center space-x-2 transform transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Enter My Wallet</span>
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
