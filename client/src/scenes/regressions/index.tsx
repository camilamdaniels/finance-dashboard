import React, { useMemo, useState } from 'react'
import DashboardBox from '@/components/DashboardBox'
import { Box, useMediaQuery, useTheme, Button, Typography } from '@mui/material'
import FlexBetween from '@/components/FlexBetween'
import { useGetKpisQuery } from '@/state/api'
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Bar,
    BarChart
} from 'recharts'
import regression, { DataPoint } from 'regression'
import BoxHeader from '@/components/BoxHeader'

const gridTemplateLargeScreens = `
    "b b a"
    "b b a"
    "b b a"
    "b b a"
    "b b c"
    "b b c"
    "b b c"
    "b b c"
    "b b c"
`

const gridTemplateSmallScreens = `
    "b"
    "b"
    "b"
    "b"
    "b"
    "c"
    "c"
    "c"
    "c"
    "a"
    "a"
    "a"
    "a"
`

const Regressions = () => {
    const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)")
    const { palette } = useTheme();
    const [isPredictions, setIsPredictions] = useState(false)
    const { data: kpiData } = useGetKpisQuery()

    const formattedDataLinear = useMemo(() => {
        if (!kpiData) return []
        const monthData = kpiData[0].monthlyData

        const formatted: Array<DataPoint> = monthData.map(
            ({ revenue }, i: number) => {
                return [i, revenue]
            }
        )

        const formattedExpenses: Array<DataPoint> = monthData.map(
            ({ expenses }, i: number) => {
                return [i, expenses]
            }
        )

        const regressionLine = regression.linear(formatted)
        const regressionLineExpenses = regression.linear(formattedExpenses)

        return monthData.map(({ month, revenue, expenses }, i: number) => {
            // console.log('predicted revenue', regressionLine.predict(i+12)[1])
            // console.log('actual revenue', revenue)
            console.log('actual expenses', expenses)
            console.log('predicted expenses', regressionLineExpenses.predict(i+12)[1])
            return {
                name: month,
                "Actual Revenue": revenue,
                "Regression Line": regressionLine.points[i][1],
                "Predicted Revenue": regressionLine.predict(i + 12)[1],
                "Actual Expenses": expenses,
                "Predicted Expenses": regressionLineExpenses.predict(i + 12)[1]
            }
        })
    }, [kpiData])

    return (
        <Box
            color={palette.grey[100]}
            width='100%'
            height='100%'
            display='grid'
            gap='1.5rem'
            sx={
                isAboveMediumScreens ? {
                    gridTemplateColumns: "repeat(3, minmax(370px, 1fr))",
                    gridTemplateRows: "repeat(10, minmax(60px, 1fr))",
                    gridTemplateAreas: gridTemplateLargeScreens
                } : {
                    gridAutoColumns: "1fr",
                    gridAutoRows: "80px",
                    gridTemplateAreas: gridTemplateSmallScreens,
                }        
            }
        >
           <DashboardBox gridArea="b">
            <FlexBetween m="1rem 2.5rem" gap="1rem">
                <Box>
                    <Typography variant="h3">Revenue and Predictions</Typography>
                    <Typography variant="h6">
                        charted revenue and predicted revenue based on a simple linear
                        regression model
                    </Typography>
                </Box>
                <Button
                    onClick={() => setIsPredictions(!isPredictions)}
                    sx={{
                        color: palette.grey[100],
                        backgroundColor: palette.primary[600],
                        boxShadow: "0.1rem 0.1rem 0.1rem 0.1rem rgba(238,135,166,.4)",
                    }}
                >
                    Show Next Year
                </Button>
            </FlexBetween>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={formattedDataLinear}
                    margin={{
                        top: 20,
                        right: 75,
                        left: 20,
                        bottom: 80,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke={palette.grey[200]} />
                    <XAxis tick={false} stroke={palette.primary[100]} dataKey="name" tickLine={false} style={{ fontSize: "10px" }} />
                    <YAxis
                        domain={[12000, 26000]}
                        axisLine={{ strokeWidth: "0" }}
                        style={{ fontSize: "10px" }}
                        tickFormatter={(v) => `$${v}`}
                        stroke={palette.primary[100]}
                    />
                    <Tooltip />
                    <Legend verticalAlign="top" />
                    <Line
                        type="monotone"
                        dataKey="Actual Revenue"
                        stroke={palette.primary[800]}
                        strokeWidth={0}
                        dot={{ strokeWidth: 5 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="Regression Line"
                        stroke={palette.primary[600]}
                        dot={false}
                    />
                    {isPredictions && (
                        <Line
                            strokeDasharray="5 5"
                            dataKey="Predicted Revenue"
                            stroke={palette.primary[100]}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
           </DashboardBox>

           <DashboardBox gridArea="c">
            <BoxHeader
                title="Revenue Predictions"
                subtitle="actual vs predicted revenue"
                sideText="+10%"
            />
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    width={500}
                    height={300}
                    data={formattedDataLinear}
                    margin={{
                        top: 17,
                        right: 15,
                        left: -5,
                        bottom: 58,
                    }}
                >
                    <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="5%"
                                stopColor={palette.primary[500]}
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor={palette.primary[500]}
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke={palette.grey[200]} />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        stroke={palette.primary[100]}
                        style={{ fontSize: "10px" }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        stroke={palette.primary[100]}
                        style={{ fontSize: "10px" }}
                    />
                    <Tooltip />
                    <Bar dataKey="Actual Revenue" fill={palette.primary[700]} />
                    {isPredictions && (
                        <Bar dataKey="Predicted Revenue" fill={palette.primary[100]} />
                    )}
                </BarChart>
            </ResponsiveContainer>
           </DashboardBox>

           <DashboardBox gridArea='a'>
            <BoxHeader
                title="Actual vs Predicted Expenses"
                subtitle="top line represents predictions, bottom line represents actual expenses"
                sideText="+10%"
            />
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={400}
                    data={formattedDataLinear}
                    margin={{
                        top: 20,
                        right: 0,
                        left: -10,
                        bottom: 55,
                    }}
                >
                    <CartesianGrid vertical={false} stroke={palette.grey[200]} />
                    <XAxis
                        dataKey="name"
                        stroke={palette.primary[100]}
                        tickLine={false}
                        style={{ fontSize: "10px" }}
                    />
                    <YAxis
                        yAxisId="left"
                        stroke={palette.primary[100]}
                        tickLine={false}
                        axisLine={false}
                        style={{ fontSize: "10px" }}
                    />
                    <Tooltip />
                    <Legend
                        height={20}
                        wrapperStyle={{
                            margin: "0 0 10px 0",
                        }}
                    />
                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="Actual Expenses"
                        stroke={palette.primary[900]}
                    />
                    {isPredictions && (
                        <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="Predicted Expenses"
                            stroke={palette.primary[100]}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
           </DashboardBox>
        </Box>
    )
}

export default Regressions