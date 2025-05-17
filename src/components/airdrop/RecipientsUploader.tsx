import type React from 'react'

import { Upload, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { AirdropRecipient } from '@/types/airdrop'
import { parseCsv } from '@/utils/csv'
import { toast } from 'sonner'

interface RecipientsUploaderProps {
  recipients: AirdropRecipient[]
  setRecipients: (recipients: AirdropRecipient[]) => void
  error: string | null
  setError: (error: string | null) => void
}

export const RecipientsUploader = ({ recipients, setRecipients, error, setError }: RecipientsUploaderProps) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    try {
      const parsedRecipients = await parseCsv(file)
      setRecipients(parsedRecipients)
      toast.success(`Successfully parsed ${parsedRecipients.length} recipients`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse CSV file'
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  return (
    <div className="space-y-2">
      <div className="border rounded-md p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Upload className="h-4 w-4 text-muted-foreground" />
          <span>Upload CSV with recipients (address, amount)</span>
        </div>

        <Input type="file" accept=".csv" onChange={handleFileChange} />

        {error && <p className="text-sm text-red-500">{error}</p>}

        {recipients.length > 0 && (
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{recipients.length} recipients loaded</span>
          </div>
        )}
      </div>
    </div>
  )
}
