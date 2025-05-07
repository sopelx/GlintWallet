"use client"

import { motion } from "framer-motion"

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#0F0F19] to-[#1A1A2E] flex items-center justify-center z-50">
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative w-32 h-32">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 opacity-75"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 0.2, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute inset-4 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 opacity-85"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.85, 0.5, 0.85],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />

          <motion.div
            className="absolute inset-8 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 opacity-90 flex items-center justify-center"
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.9, 0.7, 0.9],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: 0.6,
            }}
          >
            <span className="text-white font-bold text-xl">G</span>
          </motion.div>
        </div>
      </motion.div>

      <motion.h1
        className="absolute mt-40 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        GLINT
      </motion.h1>
    </div>
  )
}
