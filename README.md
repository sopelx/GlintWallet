# Glint - Minimalist Browser-Based Web3 Wallet

![Glint Banner](https://github.com/sopelx/glint-wallet/raw/main/public/banner.png)

Glint is a minimalist browser-based Web3 wallet. No installs. No tracking. Just fast access to your Ethereum, Solana, and any EVM-compatible chain — right from your browser tab.

## Features

- 🧩 Import or generate seed phrase
- 🔐 Client-side encryption (localStorage only)
- 🔄 Multi-chain support (Ethereum, Solana, Polygon, etc.)
- 🚀 Send, receive, and sign transactions
- 🧱 Open-source, no backend — 100% browser-based

## Demo

Try it out: [https://glint-wallet.vercel.app](https://glint-wallet.vercel.app)

## Screenshots

![Glint Screenshot](https://github.com/sopelx/glint-wallet/raw/main/public/screenshot.png)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
\`\`\`bash
git clone https://github.com/sopelx/glint-wallet.git
cd glint-wallet
\`\`\`

2. Install dependencies
\`\`\`bash
npm install
# or
yarn install
\`\`\`

3. Run the development server
\`\`\`bash
npm run dev
# or
yarn dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Security

Glint is designed with security in mind:

- All cryptographic operations happen in your browser
- Private keys and seed phrases are never sent to any server
- Data is only stored in your browser's localStorage with encryption
- No tracking, no analytics, no backend

## Supported Networks

- Ethereum Mainnet
- Polygon
- Optimism
- Arbitrum
- Sepolia Testnet
- More coming soon!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [ethers.js](https://docs.ethers.org/) for Ethereum interactions
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) for UI components

---

Made with ❤️ by [sopelx](https://github.com/sopelx)
