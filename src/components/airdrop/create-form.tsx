"use client"

import type React from "react"

import { useState } from "react"
import { useNavigate } from "react-router"
import { createAirdropMock, fetchTokensInWalletMock, parseCSVMock } from "./mock-data"
import type { Recipient, Token } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect } from "react"
import { toast } from "sonner"
import { ArrowLeft, Calendar, Clock, Upload, Users } from "lucide-react"

export function CreateAirdropForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [tokens, setTokens] = useState<Token[]>([])

  const [formData, setFormData] = useState({
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
    hasCliff: false,
    cliffAmount: "",
    cliffPercentage: "",
    unlockInterval: "daily",
  })

  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvError, setCsvError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTokens = async () => {
      setLoading(true)
      try {
        const result = await fetchTokensInWalletMock()
        setTokens(result)
      } catch (error) {
        console.error("Error fetching tokens:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTokens()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCsvFile(file)
    setCsvError(null)

    try {
      const parsedRecipients = await parseCSVMock(file)
      setRecipients(parsedRecipients)
      toast.success(`Successfully parsed ${parsedRecipients.length} recipients`)
    } catch (error) {
      setCsvError("Failed to parse CSV file. Please check the format.")
      toast.error("Failed to parse CSV file")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      toast.error("Please enter a name for the airdrop")
      return
    }

    if (!formData.mint) {
      toast.error("Please select a token")
      return
    }

    if (recipients.length === 0) {
      toast.error("Please upload recipients")
      return
    }

    if (formData.type === "vested" && !formData.endDate) {
      toast.error("Please set an end date for vested airdrop")
      return
    }

    setSubmitting(true)

    try {
      // Prepare the data for submission
      const startTimestamp = formData.startImmediately
        ? Math.floor(Date.now() / 1000)
        : Math.floor(new Date(`${formData.startDate}T${formData.startTime || "00:00"}`).getTime() / 1000)

      const endTimestamp =
        formData.type === "vested"
          ? Math.floor(new Date(`${formData.endDate}T${formData.endTime || "23:59"}`).getTime() / 1000)
          : startTimestamp + 86400 * 30 // Default to 30 days for instant airdrops

      const unlockPeriod =
        formData.unlockInterval === "daily" ? 86400 : formData.unlockInterval === "weekly" ? 604800 : 2592000 // monthly

      const totalAmount = recipients.reduce((sum, recipient) => sum + BigInt(recipient.amount), BigInt(0)).toString()

      const createParams = {
        name: formData.name,
        mint: formData.mint,
        version: 1,
        root: [1, 2, 3, 4], // Mock Merkle root
        maxTotalClaim: totalAmount,
        maxNumNodes: recipients.length.toString(),
        unlockPeriod,
        startVestingTs: startTimestamp,
        endVestingTs: endTimestamp,
        clawbackStartTs: formData.isCancellable ? endTimestamp + 86400 : 0,
        claimsClosableByAdmin: formData.isCancellable,
        claimsClosableByClaimant: false,
        claimsLimit: formData.singleClaim ? 1 : 0,
      }

      const result = await createAirdropMock(createParams)

      if (result.success) {
        toast.success("Airdrop created successfully!")
        navigate(`/airdrop/${result.airdropId}`)
      } else {
        toast.error("Failed to create airdrop")
      }
    } catch (error) {
      console.error("Error creating airdrop:", error)
      toast.error("An error occurred while creating the airdrop")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Create Airdrop</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Airdrop Type</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
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

            <div className="space-y-2">
              <Label htmlFor="token">Select Token</Label>
              <Select value={formData.mint} onValueChange={(value) => handleSelectChange("mint", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a token" />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem key={token.address} value={token.address}>
                      <div className="flex items-center gap-2">
                        <img
                          src={token.logoURI || "/placeholder.svg"}
                          alt={token.symbol}
                          className="w-4 h-4 rounded-full"
                        />
                        <span>
                          {token.symbol} - Balance: {Number.parseFloat(token.balance) / 10 ** token.decimals}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Recipients</Label>
              <div className="border rounded-md p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Upload className="h-4 w-4 text-muted-foreground" />
                  <span>Upload CSV with recipients (address, amount)</span>
                </div>

                <Input type="file" accept=".csv" onChange={handleFileChange} />

                {csvError && <p className="text-sm text-red-500">{csvError}</p>}

                {recipients.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{recipients.length} recipients loaded</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

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
                onCheckedChange={(checked) => handleSwitchChange("startImmediately", checked)}
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
                      onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                onCheckedChange={(checked) => handleSwitchChange("isCancellable", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Single Claim</Label>
                <p className="text-sm text-muted-foreground">Users can only claim once</p>
              </div>
              <Switch
                checked={formData.singleClaim}
                onCheckedChange={(checked) => handleSwitchChange("singleClaim", checked)}
              />
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Cliff</Label>
                      <p className="text-sm text-muted-foreground">Amount unlocked immediately when vesting starts</p>
                    </div>
                    <Switch
                      checked={formData.hasCliff}
                      onCheckedChange={(checked) => handleSwitchChange("hasCliff", checked)}
                    />
                  </div>

                  {formData.hasCliff && (
                    <Tabs defaultValue="percentage" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="percentage">Percentage</TabsTrigger>
                        <TabsTrigger value="amount">Amount</TabsTrigger>
                      </TabsList>

                      <TabsContent value="percentage" className="mt-2">
                        <div className="space-y-2">
                          <Label htmlFor="cliffPercentage">Cliff Percentage</Label>
                          <Input
                            id="cliffPercentage"
                            name="cliffPercentage"
                            type="number"
                            min="0"
                            max="100"
                            placeholder="e.g. 10"
                            value={formData.cliffPercentage}
                            onChange={handleInputChange}
                          />
                        </div>
                      </TabsContent>

                      <TabsContent value="amount" className="mt-2">
                        <div className="space-y-2">
                          <Label htmlFor="cliffAmount">Cliff Amount</Label>
                          <Input
                            id="cliffAmount"
                            name="cliffAmount"
                            type="text"
                            placeholder="e.g. 1000"
                            value={formData.cliffAmount}
                            onChange={handleInputChange}
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unlockInterval">Unlock Interval</Label>
                  <Select
                    value={formData.unlockInterval}
                    onValueChange={(value) => handleSelectChange("unlockInterval", value)}
                  >
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

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={submitting || loading || recipients.length === 0}
            className="w-full md:w-auto"
          >
            {submitting ? "Creating..." : "Create Airdrop"}
          </Button>
        </div>
      </form>
    </div>
  )
}
