import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "v0 Glint Wallet - Next Generation Web3 Wallet",
  description: "v0 - A browser-based Web3 wallet with no installs, no tracking, just fast access to your crypto.",
  keywords: "crypto wallet, web3, ethereum, blockchain, defi, nft, cryptocurrency",
  authors: [{ name: "sopelx" }],
  creator: "sopelx",
  publisher: "sopelx",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#0F0F19",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
