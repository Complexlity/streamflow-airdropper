import { toast } from 'sonner'
import { GetExplorerLinkArgs, getExplorerLink } from 'gill'

export function useTransactionToast() {
  return (signature: string) => {
    toast.success('Transaction sent', {
      description: <ExplorerLink transaction={signature} label="View Transaction" />,
    })
  }
}


export function ExplorerLink({
  className,
  label = '',
  ...link
}: GetExplorerLinkArgs & {
  className?: string
  label: string
}) {
  return (
    <a
      href={getExplorerLink(link)}
      target="_blank"
      rel="noopener noreferrer"
      className={className ? className : `link font-mono`}
    >
      {label}
    </a>
  )
}