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
    title: 'Welcome to roaar',
    body: 'Complete your profile to get started',
    time: '3 days ago',
  },
]

export function AppSidebar() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null)

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
            bgcolor: '#1A56DB',
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
          roaar
        </Typography>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5, py: 2 }}>
        <List disablePadding sx={{ mb: 1 }}>
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
                  color: active ? '#1A56DB' : 'rgba(242,242,242,0.7)',
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

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 1.5, mx: 1 }} />
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
                  color: active ? '#1A56DB' : 'rgba(242,242,242,0.7)',
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
      <Box sx={{ borderTop: '1px solid #2a2a2a', p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>

        {/* User chip */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 1.5,
            py: 1,
            borderRadius: '999px',
            bgcolor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Avatar sx={{ width: 28, height: 28, bgcolor: '#1A56DB', fontSize: '0.75rem', flexShrink: 0 }}>
            {initials}
          </Avatar>
          <Box sx={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.8rem', fontWeight: 500, color: '#F2F2F2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3 }}>
              {user?.name || 'User'}
            </Typography>
            <Typography sx={{ fontSize: '0.68rem', color: 'rgba(242,242,242,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>

        {/* Action buttons row */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            onClick={() => logout()}
            fullWidth
            startIcon={<LogoutIcon sx={{ fontSize: '16px !important' }} />}
            sx={{
              color: 'rgba(242,242,242,0.6)',
              bgcolor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 2,
              py: 0.75,
              fontSize: '0.75rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(220,38,38,0.15)', color: '#f87171', borderColor: 'rgba(220,38,38,0.3)' },
            }}
          >
            Logout
          </Button>
          <Button
            onClick={(e) => setNotifAnchor(e.currentTarget)}
            fullWidth
            startIcon={
              <Badge badgeContent={3} color="primary" sx={{ '& .MuiBadge-badge': { fontSize: '0.55rem', minWidth: 14, height: 14, top: -2, right: -2 } }}>
                <NotificationsIcon sx={{ fontSize: '16px !important' }} />
              </Badge>
            }
            sx={{
              color: 'rgba(242,242,242,0.6)',
              bgcolor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 2,
              py: 0.75,
              fontSize: '0.75rem',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', color: '#F2F2F2', borderColor: 'rgba(255,255,255,0.15)' },
            }}
          >
            Alerts
          </Button>
        </Box>
        {/* Notifications menu */}
        <Menu
          anchorEl={notifAnchor}
          open={Boolean(notifAnchor)}
          onClose={() => setNotifAnchor(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          PaperProps={{ sx: { width: 300, mt: -1 } }}
        >
          <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography fontWeight={600} fontSize="0.9rem">Notifications</Typography>
            <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
              3 unread
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
      </Box>
    </Drawer>
  )
}
