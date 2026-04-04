import { useState } from 'react'
import { useAuth } from '../../lib/auth-context'
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  TextField,
  Avatar,
  Divider,
  Chip,
  Alert,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import DescriptionIcon from '@mui/icons-material/Description'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    city: user?.city || '',
    business: user?.business || '',
  })

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : user?.email?.substring(0, 2).toUpperCase() || 'U'

  const handleSave = () => {
    updateUser({ name: formData.name, city: formData.city, business: formData.business })
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>Profile</Typography>
        <Typography variant="body2" color="text.secondary">
          Manage your personal information and preferences
        </Typography>
      </Box>

      {saved && (
        <Alert
          icon={<CheckCircleIcon />}
          severity="success"
          sx={{ mb: 3, borderRadius: 2 }}
        >
          Profile updated successfully
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, gap: 3 }}>
        {/* Avatar card */}
        <Card>
          <CardContent sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                fontWeight: 700,
                mx: 'auto',
                mb: 2,
              }}
            >
              {initials}
            </Avatar>
            <Typography fontWeight={600} gutterBottom>{user?.name || 'User'}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{user?.email}</Typography>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, textAlign: 'left' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">Reports</Typography>
                <Chip label="6" size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'rgba(91,91,214,0.1)', color: 'primary.main', fontWeight: 600 }} />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">Member since</Typography>
                <Typography variant="caption" fontWeight={500}>Jan 2024</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" color="text.secondary">Status</Typography>
                <Chip label="Active" size="small" color="success" sx={{ height: 20, fontSize: '0.7rem' }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Info card */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography fontWeight={600}>Personal Information</Typography>
              {editing ? (
                <Button variant="contained" size="small" startIcon={<SaveIcon />} onClick={handleSave}>
                  Save Changes
                </Button>
              ) : (
                <Button variant="outlined" size="small" startIcon={<EditIcon />} onClick={() => setEditing(true)}>
                  Edit
                </Button>
              )}
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                disabled={!editing}
                sx={{ '& .MuiOutlinedInput-root': { height: 44 } }}
              />
              <TextField
                label="Email Address"
                value={formData.email}
                disabled
                helperText="Email cannot be changed"
                sx={{ '& .MuiOutlinedInput-root': { height: 44 } }}
              />
              <TextField
                label="City"
                value={formData.city}
                onChange={(e) => setFormData((p) => ({ ...p, city: e.target.value }))}
                disabled={!editing}
                placeholder="e.g. San Francisco"
                sx={{ '& .MuiOutlinedInput-root': { height: 44 } }}
              />
              <TextField
                label="Company / Business"
                value={formData.business}
                onChange={(e) => setFormData((p) => ({ ...p, business: e.target.value }))}
                disabled={!editing}
                placeholder="e.g. Acme Inc."
                sx={{ '& .MuiOutlinedInput-root': { height: 44 } }}
              />
            </Box>

            {editing && (
              <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                <Button variant="contained" onClick={handleSave} startIcon={<SaveIcon />} sx={{ fontWeight: 600 }}>
                  Save Changes
                </Button>
                <Button variant="outlined" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Quick actions */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mt: 3 }}>
        <Card sx={{ cursor: 'pointer', '&:hover': { borderColor: 'primary.main' }, transition: 'all 0.15s' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: '20px !important' }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'rgba(91,91,214,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DescriptionIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight={600}>View All Reports</Typography>
              <Typography variant="caption" color="text.secondary">Browse your generated reports</Typography>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ cursor: 'pointer', '&:hover': { borderColor: 'primary.main' }, transition: 'all 0.15s' }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: '20px !important' }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'rgba(91,91,214,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AutoAwesomeIcon sx={{ color: 'primary.main', fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="body2" fontWeight={600}>Generate New Report</Typography>
              <Typography variant="caption" color="text.secondary">Create a new analysis report</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
