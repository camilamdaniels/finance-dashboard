import React, { useMemo, useState } from 'react'
import DashboardBox from '@/components/DashboardBox'
import { Box, useMediaQuery, useTheme, Button, Typography } from '@mui/material'
import FlexBetween from '@/components/FlexBetween'
import { useGetKpisQuery, useGetProductsQuery } from '@/state/api'
import {
    CartesianGrid,
    Label,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    ZAxis,
    Scatter,
    ScatterChart
} from 'recharts'
import regression, { DataPoint } from 'regression'
import BoxHeader from '@/components/BoxHeader'

const gridTemplateLargeScreens = `
    "b b ."
    "b b ."
    "b b ."
    "b b ."
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
    "c"
    "c"
    "c"
`

const Regressions = () => {
    const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)")
    const { palette } = useTheme();
    const [isPredictions, setIsPredictions] = useState(false)
    const { data: kpiData } = useGetKpisQuery()
    const { data: productData } = useGetProductsQuery()

    const productExpenseData = useMemo(() => {
        return (
          productData &&
          productData.map(({ _id, price, expense }) => {
            return {
              id: _id,
              price: price,
              expense: expense,
            };
          })
        );
      }, [productData]);

    const formattedDataLinear = useMemo(() => {
        if (!kpiData) return []
        const monthData = kpiData[0].monthlyData

        const formatted: Array<DataPoint> = monthData.map(
            ({ revenue }, i: number) => {
                return [i, revenue]
            }
        )

        const regressionLine = regression.linear(formatted)

        return monthData.map(({ month, revenue }, i: number) => {
            return {
                name: month,
                "Actual Revenue": revenue,
                "Regression Line": regressionLine.points[i][1],
                "Predicted Revenue": regressionLine.predict(i + 12)[1]
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
                    <XAxis stroke={palette.primary[100]} dataKey="name" tickLine={false} style={{ fontSize: "10px" }} />
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
                            stroke={palette.grey[100]}
                        />
                    )}
                </LineChart>
            </ResponsiveContainer>
           </DashboardBox>

           <DashboardBox gridArea="c">
            <BoxHeader title="Predicted Revenue vs Expenses" sideText="+4%" />
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                    margin={{
                        top: 20,
                        right: 25,
                        bottom: 40,
                        left: -10,
                    }}
                >
                    <CartesianGrid stroke={palette.grey[200]} />
                    <XAxis
                        type="number"
                        dataKey="price"
                        name="price"
                        stroke={palette.primary[100]}
                        axisLine={false}
                        tickLine={false}
                        style={{ fontSize: "10px" }}
                        tickFormatter={(v) => `$${v}`}
                    />
                    <YAxis
                        type="number"
                        dataKey="expense"
                        name="expense"
                        stroke={palette.primary[100]}
                        axisLine={false}
                        tickLine={false}
                        style={{ fontSize: "10px" }}
                        tickFormatter={(v) => `$${v}`}
                    />
                    <ZAxis type="number" range={[20]} />
                    <Tooltip formatter={(v) => `$${v}`} />
                    <Scatter
                        name="Product Expense Ratio"
                        data={productExpenseData}
                        fill={palette.primary[900]}
                    />
                </ScatterChart>
            </ResponsiveContainer>
           </DashboardBox>
        </Box>
    )
}

export default Regressions