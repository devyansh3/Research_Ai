import { useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Alert,
} from '@mui/material'

import NotificationsIcon from '@mui/icons-material/Notifications'
import PaletteIcon from '@mui/icons-material/Palette'
import LanguageIcon from '@mui/icons-material/Language'
import SecurityIcon from '@mui/icons-material/Security'
import StorageIcon from '@mui/icons-material/Storage'
import SaveIcon from '@mui/icons-material/Save'

export default function SettingsPage() {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    emailNotifications: true,
    reportReadyAlerts: true,
    weeklyDigest: false,
    newFeatureUpdates: true,
    darkMode: false,
    language: 'en',
    timezone: 'UTC-5',
    twoFactor: false,
  })

  const toggle = (key: keyof typeof settings) =>
    setSettings((p) => ({ ...p, [key]: !p[key] }))

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>Settings</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your account preferences and configuration
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          sx={{ fontWeight: 600, px: 3, flexShrink: 0 }}
        >
          Save Changes
        </Button>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          Settings saved successfully
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Notifications */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'rgba(91,91,214,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <NotificationsIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography fontWeight={600}>Notifications</Typography>
                <Typography variant="caption" color="text.secondary">Control how you receive alerts</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                { key: 'reportReadyAlerts', label: 'Report Ready Alerts', desc: 'Get notified when reports are generated' },
                { key: 'weeklyDigest', label: 'Weekly Digest', desc: 'Weekly summary of your activity' },
                { key: 'newFeatureUpdates', label: 'New Feature Updates', desc: 'Learn about new roaar features' },
              ].map(({ key, label, desc }) => (
                <Box key={key} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'divider', '&:last-child': { borderBottom: 'none' } }}>
                  <Box>
                    <Typography variant="body2" fontWeight={500}>{label}</Typography>
                    <Typography variant="caption" color="text.secondary">{desc}</Typography>
                  </Box>
                  <Switch
                    checked={settings[key as keyof typeof settings] as boolean}
                    onChange={() => toggle(key as keyof typeof settings)}
                    size="small"
                  />
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'rgba(91,91,214,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PaletteIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography fontWeight={600}>Appearance</Typography>
                <Typography variant="caption" color="text.secondary">Customize the look of your dashboard</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="body2" fontWeight={500}>Dark Mode</Typography>
                <Typography variant="caption" color="text.secondary">Toggle dark theme (coming soon)</Typography>
              </Box>
              <Switch
                checked={settings.darkMode}
                onChange={() => toggle('darkMode')}
                size="small"
                disabled
              />
            </Box>
          </CardContent>
        </Card>

        {/* Localization */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'rgba(91,91,214,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LanguageIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography fontWeight={600}>Localization</Typography>
                <Typography variant="caption" color="text.secondary">Language and regional settings</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Language</InputLabel>
                <Select value={settings.language} label="Language" onChange={(e) => setSettings((p) => ({ ...p, language: e.target.value }))}>
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                  <MenuItem value="de">German</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Timezone</InputLabel>
                <Select value={settings.timezone} label="Timezone" onChange={(e) => setSettings((p) => ({ ...p, timezone: e.target.value }))}>
                  <MenuItem value="UTC-8">Pacific Time (UTC-8)</MenuItem>
                  <MenuItem value="UTC-5">Eastern Time (UTC-5)</MenuItem>
                  <MenuItem value="UTC+0">GMT (UTC+0)</MenuItem>
                  <MenuItem value="UTC+1">CET (UTC+1)</MenuItem>
                  <MenuItem value="UTC+5:30">IST (UTC+5:30)</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'rgba(91,91,214,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <SecurityIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography fontWeight={600}>Security</Typography>
                <Typography variant="caption" color="text.secondary">Protect your account</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>Two-Factor Authentication</Typography>
                  <Typography variant="caption" color="text.secondary">Add an extra layer of security</Typography>
                </Box>
                <Switch
                  checked={settings.twoFactor}
                  onChange={() => toggle('twoFactor')}
                  size="small"
                />
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>Change Password</Typography>
                  <Typography variant="caption" color="text.secondary">Update your account password</Typography>
                </Box>
                <Button variant="outlined" size="small">Change</Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Data */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'rgba(91,91,214,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <StorageIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography fontWeight={600}>Data Management</Typography>
                <Typography variant="caption" color="text.secondary">Export or delete your data</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>Export All Data</Typography>
                  <Typography variant="caption" color="text.secondary">Download all your reports and activity</Typography>
                </Box>
                <Button variant="outlined" size="small">Export</Button>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="body2" fontWeight={500} color="error.main">Delete Account</Typography>
                  <Typography variant="caption" color="text.secondary">Permanently delete your account and data</Typography>
                </Box>
                <Button variant="outlined" size="small" color="error">Delete</Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

      </Box>
    </Box>
  )
}
