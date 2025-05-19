import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router"
import { useWallet } from "@solana/wallet-adapter-react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCreateAirdrop } from "@/hooks/airdrop/useCreateAirdrop"
import type { AirdropFormData, AirdropRecipient } from "@/types/airdrop"
import { validateAirdropForm } from "@/utils/validation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { TokenSelector } from "@/components/airdrop/TokenSelector"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock } from "lucide-react"
import { RecipientsUploader } from "./RecipientsUploader"
import { toast } from "sonner"
import { handleApiError } from "@/utils/errors"
import { useTransactionToast } from "@/hooks/useTransactionToast"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

export const CreateAirdropForm = () => {
  const navigate = useNavigate()
  const { connected, wallet, publicKey } = useWallet()
  const showTransactionToast = useTransactionToast()

  const { mutate: createAirdrop, isPending: isCreating } = useCreateAirdrop(wallet, publicKey, {
    onSuccess: (data) => {
      if (data?.txId) {
        showTransactionToast(data.txId)
      }
      if (data?.address) {
        navigate(`/airdrop/${data.address}`)
      }
    },
    onError: (error) => {
      handleApiError(error, "Failed to create airdrop")
    },
  })

  const [formData, setFormData] = useState<AirdropFormData>({
    name: "",
    type: "instant",
    mint: "",
    startImmediately: true,
    startDate: "",
    startTime: "",
    isCancellable: false,
    singleClaim: true,
    endDate: "",
    endTime: "",
    unlockInterval: "daily",
  })

  const [recipients, setRecipients] = useState<AirdropRecipient[]>([])
  const [csvError, setCsvError] = useState<string | null>(null)

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateAirdropForm(formData, recipients)
    if (validationError) {
      toast.error(validationError)
      return
    }

    createAirdrop({
      formData,
      recipients,
    })
  }

  if (!connected) {
    return (
      <div className="space-y-6">
        <Header />
        <div className="flex flex-col items-center justify-center">
          <p className="text-red-500 mb-4">Please connect your wallet to create an airdrop.</p>
          <WalletMultiButton>Connect Wallet</WalletMultiButton>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Header />

      <form onSubmit={handleSubmit} className="space-y-6">
        <BasicInfoSection
          formData={formData}
          onInputChange={handleInputChange}
          recipients={recipients}
          setRecipients={setRecipients}
          csvError={csvError}
          setCsvError={setCsvError}
        />

        <AirdropSettingsSection formData={formData} onInputChange={handleInputChange} />

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={isCreating || !connected || recipients.length === 0}
            className="w-full md:w-auto"
          >
            {isCreating ? "Creating..." : "Create Airdrop"}
          </Button>
        </div>
      </form>
    </div>
  )
}

function Header() {
  const navigate = useNavigate()
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={() => navigate("/")}>
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <h1 className="text-2xl font-bold">Create Airdrop</h1>
    </div>
  )
}

interface BasicInfoSectionProps {
  formData: AirdropFormData
  onInputChange: (name: string, value: string | boolean) => void
  recipients: AirdropRecipient[]
  setRecipients: (recipients: AirdropRecipient[]) => void
  csvError: string | null
  setCsvError: (error: string | null) => void
}

function BasicInfoSection({
  formData,
  onInputChange,
  recipients,
  setRecipients,
  csvError,
  setCsvError,
}: BasicInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>Enter the basic details for your airdrop</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Airdrop Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter airdrop name"
              value={formData.name}
              onChange={(e) => onInputChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Airdrop Type</Label>
            <RadioGroup
              value={formData.type}
              onValueChange={(value) => onInputChange("type", value)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="instant" id="instant" />
                <Label htmlFor="instant">Instant</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="vested" id="vested" />
                <Label htmlFor="vested">Vested</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <TokenSelector value={formData.mint} onChange={(value) => onInputChange("mint", value)} />

        <RecipientsUploader
          recipients={recipients}
          setRecipients={setRecipients}
          error={csvError}
          setError={setCsvError}
        />
      </CardContent>
    </Card>
  )
}

interface AirdropSettingsSectionProps {
  formData: AirdropFormData
  onInputChange: (name: string, value: string | boolean) => void
}


function AirdropSettingsSection({ formData, onInputChange }: AirdropSettingsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Airdrop Settings</CardTitle>
        <CardDescription>Configure the settings for your airdrop</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Start Immediately</Label>
            <p className="text-sm text-muted-foreground">Start the airdrop as soon as it's created</p>
          </div>
          <Switch
            checked={formData.startImmediately}
            onCheckedChange={(checked) => onInputChange("startImmediately", checked)}
          />
        </div>

        {!formData.startImmediately && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => onInputChange("startDate", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => onInputChange("startTime", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Cancellable</Label>
            <p className="text-sm text-muted-foreground">Allow the airdrop to be cancelled by admin</p>
          </div>
          <Switch
            checked={formData.isCancellable}
            onCheckedChange={(checked) => onInputChange("isCancellable", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Single Claim</Label>
            <p className="text-sm text-muted-foreground">Users can only claim once</p>
          </div>
          <Switch checked={formData.singleClaim} onCheckedChange={(checked) => onInputChange("singleClaim", checked)} />
        </div>

        {formData.type === "vested" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endDate">Distribution End Date</Label>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => onInputChange("endDate", e.target.value)}
                    required={formData.type === "vested"}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => onInputChange("endTime", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unlockInterval">Unlock Interval</Label>
              <Select value={formData.unlockInterval} onValueChange={(value) => onInputChange("unlockInterval", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unlock interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
