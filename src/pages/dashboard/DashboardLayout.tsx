import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { AppSidebar } from '../../components/AppSidebar'

const SIDEBAR_WIDTH = 240

export default function DashboardLayout() {
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AppSidebar />
      <Box
        component="main"
        sx={{
          flex: 1,
          overflow: 'auto',
          ml: `${SIDEBAR_WIDTH}px`,
          bgcolor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
