import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { AppSidebar, TopBar } from '../../components/AppSidebar'

const SIDEBAR_WIDTH = 240

export default function DashboardLayout() {
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <AppSidebar />
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          ml: `${SIDEBAR_WIDTH}px`,
        }}
      >
        <TopBar />
        <Box
          component="main"
          sx={{
            flex: 1,
            overflow: 'auto',
            bgcolor: 'background.default',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
