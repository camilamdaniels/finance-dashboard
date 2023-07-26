import { useMemo } from 'react'
import DashboardBox from '@/components/DashboardBox'
import { useGetKpisQuery } from '@/state/api'
import { 
  ResponsiveContainer, 
  AreaChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Area,
  Line,
  LineChart,
  Legend,
  Bar,
  BarChart
} from 'recharts'
import { useTheme } from '@mui/material'
import BoxHeader from '@/components/BoxHeader'


const Row1 = () => {
  const { palette } = useTheme();
  const { data } = useGetKpisQuery();
  console.log('data', data)

  const revenue = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue }) => {
        return {
          name: month.substring(0,3),
          revenue: revenue
        }
      })
    )
  }, [data])

  const revenueExpenses = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue, expenses }) => {
        return {
          name: month.substring(0, 3),
          revenue: revenue,
          expenses: expenses
        }
      })
    )
  }, [data])

  const revenueProfit = useMemo(() => {
    return (
      data &&
      data[0].monthlyData.map(({ month, revenue, expenses }) => {
        return {
          name: month.substring(0, 3),
          revenue: revenue,
          profit: (revenue - expenses).toFixed(2)
        }
      })
    )
  }, [data])

  return (
    <>
        <DashboardBox gridArea='a'>
          <BoxHeader 
            title="Revenue and Expenses"
            subtitle="top line represents revenue, bottom line represents expenses"
            sideText="+4%"
          />
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              width={500}
              height={400}
              data={revenueExpenses}
              margin={{
                top: 15,
                right: 25,
                left: -10,
                bottom: 60,
              }}
            >
              <defs>
                <linearGradient
                  id="colorRevenue"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop 
                    offset="5%" 
                    stopColor={palette.primary[600]} 
                    stopOpacity={0.5}
                  />
                  <stop 
                    offset="95%" 
                    stopColor={palette.primary[600]} 
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient
                  id="colorExpenses"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop 
                    offset="5%" 
                    stopColor={palette.primary[600]} 
                    stopOpacity={0.5}
                  />
                  <stop 
                    offset="95%" 
                    stopColor={palette.primary[600]} 
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                stroke={palette.primary[100]} 
                tickLine={false}
                style={{ fontSize: "10px" }}
              />
              <YAxis 
                stroke={palette.primary[100]}
                tickLine={false}
                style={{ fontSize: "10px" }}
                axisLine={{ strokeWidth: "0" }}
                domain={[8000, 23000]}
              />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                dot={true}
                stroke={palette.primary[600]} 
                fillOpacity={1}
                fill="url(#colorRevenue)" 
              />
              <Area 
                type="monotone" 
                dataKey="expenses" 
                dot={true}
                stroke={palette.primary[600]} 
                fillOpacity={1}
                fill="url(#colorExpenses)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </DashboardBox>
        <DashboardBox gridArea='b'>
          <BoxHeader
            title="Profit and Revenue"
            subtitle="top line represents revenue, bottom line represents expenses"
            sideText="+4%"
          />
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={400}
              data={revenueProfit}
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
              <YAxis
                yAxisId="right"
                orientation="right"
                tickLine={false}
                axisLine={false}
                style={{ fontSize: "10px" }}
                stroke={palette.primary[100]}
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
                dataKey="profit"
                stroke={palette.primary[900]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                stroke={palette.primary[600]}
              />
            </LineChart>
          </ResponsiveContainer>
        </DashboardBox>
        <DashboardBox gridArea='c'>
          <BoxHeader
            title="Revenue Month by Month"
            subtitle="graph representing monthly revenue"
            sideText="+4%"
          />
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={revenue}
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
              <Bar dataKey="revenue" fill="url(#colorRevenue)" />
            </BarChart>
          </ResponsiveContainer>
        </DashboardBox>
    </>
  )
}

export default Row1