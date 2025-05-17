export const AppFooter = () => {
  return (
    <footer className="text-center p-2 bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400 text-xs">
      <a
        className="link hover:text-neutral-500 dark:hover:text-white"
        href="https://github.com/solana-developers"
        target="_blank"
        rel="noopener noreferrer"
      >
        Streamflow Airdropper
      </a>
      {' • '}
      <span>Built with Solana</span>
    </footer>
  )
}
