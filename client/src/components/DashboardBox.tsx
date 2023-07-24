import { Box } from '@mui/material'
import { styled } from '@mui/system'

const DashboardBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.primary[400],
    borderRadius: '1rem',
    boxShadow: '0.15rem 0.2rem 0.15rem 0.1rem rgba(238, 135, 166, .8)'
}))

export default DashboardBox;