export function Footer() {
  return (
    <footer className="bg-transparent px-4 py-3">
      <div className="flex items-center justify-between gap-4 text-xs sm:text-sm text-gray-600">
        <a
          href="https://www.linkedin.com/in/mahfouzer"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900 transition-colors font-semibold"
          aria-label="LinkedIn"
        >
          LinkedIn
        </a>
        <a
          href="https://www.buymeacoffee.com/mahfouzer"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-900 transition-colors font-semibold"
          aria-label="Buy me a coffee"
        >
          Buy me a coffee
        </a>
      </div>
    </footer>
  )
}

