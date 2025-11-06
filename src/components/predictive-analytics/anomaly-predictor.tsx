"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { handlePredictAnomalies } from "@/app/actions"
import {
  sampleIotDataForPrediction,
  sampleBlockchainDataForPrediction,
} from "@/lib/data"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { BrainCircuit, Loader2, Sparkles, AlertTriangle } from "lucide-react"
import type { PredictAnomaliesOutput } from "@/ai/flows/predictive-anomaly-detection"

const formSchema = z.object({
  iotData: z.string().min(1, "IoT data cannot be empty."),
  blockchainData: z.string().min(1, "Blockchain data cannot be empty."),
})

export function AnomalyPredictor() {
  const [result, setResult] = useState<PredictAnomaliesOutput | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      iotData: sampleIotDataForPrediction,
      blockchainData: sampleBlockchainDataForPrediction,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setResult(null)
    setError(null)
    try {
      const response = await handlePredictAnomalies(values)
      if (response) {
        setResult(response)
      } else {
        setError("Failed to get a valid response from the AI.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <BrainCircuit className="text-primary" />
            <span>Predictive Anomaly Detection</span>
          </CardTitle>
          <CardDescription>
            Use AI to analyze supply chain data and predict potential anomalies and risks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="iotData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IoT Sensor Data (JSON)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste IoT data here..."
                          className="h-64 font-code text-xs"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="blockchainData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blockchain Transaction Data (JSON)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste blockchain data here..."
                          className="h-64 font-code text-xs"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles />
                    Predict Anomalies
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
                <AlertTriangle />
                Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Predicted Anomalies</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc space-y-2 pl-5">
                {result.anomalies.map((anomaly, index) => (
                  <li key={index}>{anomaly}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Overall Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{result.riskAssessment}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
