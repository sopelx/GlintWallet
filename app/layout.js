import "./globals.css"

export const metadata = {
  title: "Glint - Minimalist Web3 Wallet",
  description: "A browser-based Web3 wallet with no installs, no tracking, just fast access to your crypto.",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
