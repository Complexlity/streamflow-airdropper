import { Check, Copy } from "lucide-react"
import { Button } from "./button"
import { useState } from "react"

export function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] =
        useState(false)

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full" onClick={handleCopy} title="Copy address">
            {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
        </Button>
    )
}