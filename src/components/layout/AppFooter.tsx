export const AppFooter = () => {
  return (
    <footer className="text-center p-2 bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400 text-xs">
      Built by{' '}
      <a
        className="link hover:text-neutral-500 dark:hover:text-white underline hover:no-underline"
        href="https://github.com/complexlity"
        target="_blank"
        rel="noopener noreferrer"
      >
        Complexlity
      </a>{' '}
      on{' '}
      <a
        className="link hover:text-neutral-500 dark:hover:text-white underline hover:no-underline"
        href="https://solana.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        Solana
      </a>{' '}
      with{' '}
      <a
        className="link hover:text-neutral-500 dark:hover:text-white underline hover:no-underline"
        href="https://streamflow.finance"
        target="_blank"
        rel="noopener noreferrer"
      >
        Streamflow
      </a>
    </footer>
  )
}
