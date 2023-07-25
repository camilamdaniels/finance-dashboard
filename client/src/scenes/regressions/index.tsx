import React from 'react'
import DashboardBox from '@/components/DashboardBox'
import { Box, useMediaQuery, useTheme } from '@mui/material'

const gridTemplateLargeScreens = `
    "b b a"
    "b b a"
    "b b a"
    "b b c"
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
    "a"
    "a"
    "c"
    "c"
    "c"
`

const Regressions = () => {
    const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)")
    const { palette } = useTheme();

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

           </DashboardBox>

           <DashboardBox gridArea="a">

           </DashboardBox>

           <DashboardBox gridArea="c">
            
           </DashboardBox>
        </Box>
    )
}

export default Regressions