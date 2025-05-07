"use client"

export default function TransactionList({ transactions, network }) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
        <div className="w-16 h-16 rounded-full bg-[#2a2a2a] flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M21 12C21 16.9706 16.9706 21 12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path
              d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
        <p>No transactions yet</p>
      </div>
    )
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  const truncateHash = (hash) => {
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`
  }

  return (
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
              <span className="text-gray-200">{formatTime(tx.timestamp)}</span>
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
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}
