import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography, useTheme } from '@mui/material'
import FlexBetween from '@/components/FlexBetween'
import AcUnitIcon from '@mui/icons-material/AcUnit'

type Props = {};

const Navbar = (props: Props) => {
  const { palette } = useTheme();
  const [selected, setSelected] = useState("dashboard")

  return (
    <FlexBetween 
      mb='0.25rem' 
      p='0.5rem 0rem' 
      color={palette.grey[100]}
    >
      {/* LEFT SIDE */}
      <FlexBetween
        gap='0.75rem'
      >
        <AcUnitIcon sx={{ fontSize: '28px' }}/>
        <Typography variant='h4' fontSize='16px' color={palette.grey[100]}>
          Finanseer
        </Typography>
      </FlexBetween>

      {/* RIGHT SIDE */}
      <FlexBetween gap='2rem'>
        <Box sx={{ '&:hover': { color: palette.primary[100] } }}>
          <Link
            to='/'
            onClick={() => setSelected("dashboard")}
            style={{
              color: selected === "dashboard" ? "inherit" : palette.primary[900],
              textDecoration: "inherit"
            }}
          >
            dashboard          
          </Link>
        </Box>
        <Box sx={{ '&:hover': { color: palette.primary[100] } }}>
          <Link
            to='/regressions'
            onClick={() => setSelected("regressions")}
            style={{
              color: selected === "regressions" ? "inherit" : palette.primary[900],
              textDecoration: "inherit"
            }}
          >
            regression          
          </Link>
        </Box>
      </FlexBetween>
    </FlexBetween>
  )
}

export default Navbar