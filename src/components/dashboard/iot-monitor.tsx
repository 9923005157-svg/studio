"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import type { IotDataPoint } from "@/lib/types"
import { Thermometer, Droplets, Gauge, Compass } from "lucide-react"

interface IotMonitorProps {
  iotData: IotDataPoint[]
}

const chartConfig: ChartConfig = {
  temperature: {
    label: "Temperature (°C)",
    color: "hsl(var(--chart-1))",
  },
  humidity: {
    label: "Humidity (%)",
    color: "hsl(var(--chart-2))",
  },
}

export function IotMonitor({ iotData }: IotMonitorProps) {
  const latestData = iotData[iotData.length - 1]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">IoT Sensor Monitor</CardTitle>
        <CardDescription>
          Live environmental data from the shipment container.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm mb-6">
            <div className="flex items-center gap-2">
                <Thermometer className="h-5 w-5 text-destructive" />
                <div>
                    <p className="text-muted-foreground">Temp.</p>
                    <p className="font-semibold">{latestData.temperature}°C</p>
                </div>
            </div>
             <div className="flex items-center gap-2">
                <Droplets className="h-5 w-5 text-blue-500" />
                <div>
                    <p className="text-muted-foreground">Humidity</p>
                    <p className="font-semibold">{latestData.humidity}%</p>
                </div>
            </div>
             <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-primary" />
                <div>-
                    <p className="text-muted-foreground">Pressure</p>
                    <p className="font-semibold">{latestData.pressure} hPa</p>
                </div>
            </div>
             <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-green-600" />
                <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-semibold">Boston, MA</p>
                </div>
            </div>
        </div>

        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <LineChart data={iotData} margin={{ left: -20, right: 10, top: 5, bottom: 5 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}°C`}
            />
             <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              yAxisId="left"
              dataKey="temperature"
              type="natural"
              stroke="var(--color-temperature)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              yAxisId="right"
              dataKey="humidity"
              type="natural"
              stroke="var(--color-humidity)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
