import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../lib/auth-context'
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Button,
  Menu,
  MenuItem,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
} from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import DashboardIcon from '@mui/icons-material/Dashboard'
import DescriptionIcon from '@mui/icons-material/Description'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import HistoryIcon from '@mui/icons-material/History'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LogoutIcon from '@mui/icons-material/Logout'

const SIDEBAR_WIDTH = 240

const mainNav = [
  { name: 'Dashboard', href: '/dashboard', Icon: DashboardIcon },
  { name: 'Reports', href: '/reports', Icon: DescriptionIcon },
  { name: 'New Report', href: '/generate', Icon: AddCircleOutlineIcon },
  { name: 'History', href: '/history', Icon: HistoryIcon },
]

const accountNav = [
  { name: 'Profile', href: '/profile', Icon: PersonIcon },
  { name: 'Settings', href: '/settings', Icon: SettingsIcon },
]

export function AppSidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null)

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'U'

  const isActive = (href: string) =>
    location.pathname === href || location.pathname.startsWith(href + '/')

  return (
    <Drawer
      variant="permanent"
      PaperProps={{
        sx: {
          width: SIDEBAR_WIDTH,
          bgcolor: '#111111',
          color: '#F2F2F2',
          borderRight: '1px solid #2a2a2a',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 3,
          py: 2,
          borderBottom: '1px solid #2a2a2a',
          minHeight: 64,
        }}
      >
        <Box
          sx={{
            bgcolor: '#5B5BD6',
            borderRadius: 2,
            p: 0.75,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AutoAwesomeIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Typography sx={{ fontWeight: 600, color: '#F2F2F2', fontSize: '1rem' }}>
          ResearchAI
        </Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5, py: 2 }}>
        {/* Main section */}
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            mb: 1,
            display: 'block',
            color: 'rgba(242,242,242,0.4)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 600,
            fontSize: '0.65rem',
          }}
        >
          Main
        </Typography>
        <List disablePadding sx={{ mb: 3 }}>
          {mainNav.map((item) => {
            const active = isActive(item.href)
            return (
              <ListItemButton
                key={item.name}
                component={Link}
                to={item.href}
                selected={active}
                sx={{
                  px: 1.5,
                  py: 1,
                  color: active ? '#5B5BD6' : 'rgba(242,242,242,0.7)',
                  mb: 0.5,
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                  <item.Icon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                />
              </ListItemButton>
            )
          })}
        </List>

        {/* Account section */}
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            mb: 1,
            display: 'block',
            color: 'rgba(242,242,242,0.4)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 600,
            fontSize: '0.65rem',
          }}
        >
          Account
        </Typography>
        <List disablePadding>
          {accountNav.map((item) => {
            const active = isActive(item.href)
            return (
              <ListItemButton
                key={item.name}
                component={Link}
                to={item.href}
                selected={active}
                sx={{
                  px: 1.5,
                  py: 1,
                  color: active ? '#5B5BD6' : 'rgba(242,242,242,0.7)',
                  mb: 0.5,
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: 'inherit' }}>
                  <item.Icon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary={item.name}
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 500 }}
                />
              </ListItemButton>
            )
          })}
        </List>
      </Box>

      {/* User footer */}
      <Box sx={{ borderTop: '1px solid #2a2a2a', p: 1.5 }}>
        <Button
          onClick={(e) => setUserMenuAnchor(e.currentTarget)}
          fullWidth
          sx={{
            justifyContent: 'flex-start',
            gap: 1.5,
            color: '#F2F2F2',
            px: 1.5,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' },
          }}
        >
          <Avatar sx={{ width: 36, height: 36, bgcolor: '#5B5BD6', fontSize: '0.875rem', flexShrink: 0 }}>
            {initials}
          </Avatar>
          <Box sx={{ textAlign: 'left', overflow: 'hidden' }}>
            <Typography
              sx={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#F2F2F2',
                lineHeight: 1.3,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.name || 'User'}
            </Typography>
            <Typography
              sx={{
                fontSize: '0.75rem',
                color: 'rgba(242,242,242,0.5)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.email}
            </Typography>
          </Box>
        </Button>

        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={() => setUserMenuAnchor(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          PaperProps={{ sx: { width: 200, mt: -1 } }}
        >
          <MenuItem
            component={Link}
            to="/profile"
            onClick={() => setUserMenuAnchor(null)}
          >
            <PersonIcon sx={{ fontSize: 16, mr: 1.5, color: 'text.secondary' }} />
            Profile
          </MenuItem>
          <MenuItem
            component={Link}
            to="/settings"
            onClick={() => setUserMenuAnchor(null)}
          >
            <SettingsIcon sx={{ fontSize: 16, mr: 1.5, color: 'text.secondary' }} />
            Settings
          </MenuItem>
          <Divider sx={{ my: 0.5 }} />
          <MenuItem
            onClick={() => { setUserMenuAnchor(null); logout() }}
            sx={{ color: 'error.main' }}
          >
            <LogoutIcon sx={{ fontSize: 16, mr: 1.5 }} />
            Log out
          </MenuItem>
        </Menu>
      </Box>
    </Drawer>
  )
}

export function TopBar() {
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null)

  const notifications = [
    {
      title: 'Report Generated',
      body: 'Your Manufacturing Analysis report is ready',
      time: '2 hours ago',
    },
    {
      title: 'New Feature Available',
      body: 'Try our new comparison tools',
      time: '1 day ago',
    },
    {
      title: 'Welcome to ResearchAI',
      body: 'Complete your profile to get started',
      time: '3 days ago',
    },
  ]

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ px: 3, minHeight: 64 }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', lineHeight: 1.3 }}>
            Welcome back
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            Generate powerful research reports with AI
          </Typography>
        </Box>
        <IconButton
          onClick={(e) => setNotifAnchor(e.currentTarget)}
          sx={{ color: 'text.secondary' }}
        >
          <Badge badgeContent={3} color="primary">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Menu
          anchorEl={notifAnchor}
          open={Boolean(notifAnchor)}
          onClose={() => setNotifAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{ sx: { width: 320, mt: 1 } }}
        >
          <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography fontWeight={600}>Notifications</Typography>
            <Typography variant="body2" color="text.secondary">
              You have 3 unread notifications
            </Typography>
          </Box>
          {notifications.map((n, i) => (
            <MenuItem
              key={i}
              onClick={() => setNotifAnchor(null)}
              sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1.5, gap: 0.25 }}
            >
              <Typography variant="body2" fontWeight={600}>{n.title}</Typography>
              <Typography variant="caption" color="text.secondary">{n.body}</Typography>
              <Typography variant="caption" sx={{ color: 'text.disabled', fontSize: '0.7rem' }}>{n.time}</Typography>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
