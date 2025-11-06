'use server';

/**
 * @fileOverview An AI-powered tool to analyze IoT and blockchain data and predict potential anomalies in the supply chain.
 *
 * - predictAnomalies - A function that handles the anomaly prediction process.
 * - PredictAnomaliesInput - The input type for the predictAnomalies function.
 * - PredictAnomaliesOutput - The return type for the predictAnomalies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictAnomaliesInputSchema = z.object({
  iotData: z
    .string()
    .describe(
      'IoT sensor data, including temperature, humidity, location, and pressure, formatted as a JSON string.'
    ),
  blockchainData: z
    .string()
    .describe(
      'Blockchain transaction data, including timestamps, locations, batch IDs, and user roles, formatted as a JSON string.'
    ),
});
export type PredictAnomaliesInput = z.infer<typeof PredictAnomaliesInputSchema>;

const PredictAnomaliesOutputSchema = z.object({
  anomalies: z
    .array(z.string())
    .describe(
      'A list of potential anomalies predicted by the AI, including descriptions of the anomalies and their potential impact.'
    ),
  riskAssessment: z
    .string()
    .describe(
      'An overall risk assessment based on the predicted anomalies, including recommendations for proactive measures.'
    ),
});
export type PredictAnomaliesOutput = z.infer<typeof PredictAnomaliesOutputSchema>;

export async function predictAnomalies(input: PredictAnomaliesInput): Promise<PredictAnomaliesOutput> {
  return predictAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictAnomaliesPrompt',
  input: {schema: PredictAnomaliesInputSchema},
  output: {schema: PredictAnomaliesOutputSchema},
  prompt: `You are an AI-powered tool that analyzes IoT and blockchain data to predict potential anomalies in the pharmaceutical supply chain.

  Your goal is to identify any risks or disruptions that may occur, so that the supply chain manager can proactively address them.

  Analyze the following IoT and blockchain data to identify potential anomalies and assess the overall risk.

  IoT Data: {{{iotData}}}
  Blockchain Data: {{{blockchainData}}}

  Provide a list of potential anomalies, including descriptions of the anomalies and their potential impact.
  Also, provide an overall risk assessment based on the predicted anomalies, including recommendations for proactive measures.

  Be concise and clear in your analysis.
  `,
});

const predictAnomaliesFlow = ai.defineFlow(
  {
    name: 'predictAnomaliesFlow',
    inputSchema: PredictAnomaliesInputSchema,
    outputSchema: PredictAnomaliesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
