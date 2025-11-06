"use server";

import { predictAnomalies } from "@/ai/flows/predictive-anomaly-detection";
import { z } from "zod";

const formSchema = z.object({
  iotData: z.string(),
  blockchainData: z.string(),
});

export async function handlePredictAnomalies(input: z.infer<typeof formSchema>) {
  const validatedInput = formSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error("Invalid input.");
  }
  
  try {
    const result = await predictAnomalies(validatedInput.data);
    return result;
  } catch (error) {
    console.error("Error in predictAnomalies flow:", error);
    throw new Error("Failed to get prediction from AI.");
  }
}
