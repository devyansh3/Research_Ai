import { useState } from 'react'
import { useAuth } from '../../lib/auth-context'
import {
  Alert,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  LinearProgress,
} from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import PersonIcon from '@mui/icons-material/Person'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import BusinessIcon from '@mui/icons-material/Business'
import CampaignIcon from '@mui/icons-material/Campaign'
import CheckIcon from '@mui/icons-material/Check'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const steps = [
  { id: 1, title: 'Personal Information', description: 'Tell us a bit about yourself', Icon: PersonIcon },
  { id: 2, title: 'Location', description: 'Where are you based?', Icon: LocationOnIcon },
  { id: 3, title: 'Business Details', description: 'Tell us about your work', Icon: BusinessIcon },
  { id: 4, title: 'How did you find us?', description: 'Help us improve our reach', Icon: CampaignIcon },
]

const cities = ['New York','Los Angeles','Chicago','Houston','Phoenix','San Francisco','Seattle','Boston','Miami','Denver','Other']
const industries = ['Technology','Manufacturing','Healthcare','Finance','Retail','Education','Energy','Consulting','Real Estate','Other']
const companyTypes = ['Startup','SMB','Mid size enterprises','Enterprises']
const companySizes = ['1-10 employees','11-50 employees','51-200 employees','201-500 employees','500+ employees']
const referralSources = ['Google Search','LinkedIn','Twitter/X','Friend or Colleague','Industry Conference','Blog Post','Newsletter','Other']

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', jobTitle: '',
    city: '', country: '',
    industry: '', companyName: '', companyType: '', companySize: '',
    referralSource: '', referralDetail: '',
  })
  const { completeOnboarding } = useAuth()

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return !!(formData.firstName && formData.lastName)
      case 2: return !!formData.city
      case 3: return !!(formData.industry && formData.companyName && formData.companyType)
      case 4: return !!formData.referralSource
      default: return false
    }
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const progress = (currentStep / steps.length) * 100

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Dark left sidebar */}
      <Box
        sx={{
          width: 300,
          flexShrink: 0,
          bgcolor: '#111111',
          p: 4,
          display: { xs: 'none', lg: 'flex' },
          flexDirection: 'column',
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 8 }}>
          <Box sx={{ bgcolor: '#5B5BD6', borderRadius: 2, p: 0.75, display: 'flex' }}>
            <AutoAwesomeIcon sx={{ color: '#fff', fontSize: 20 }} />
          </Box>
          <Typography sx={{ fontWeight: 700, color: '#F2F2F2', fontSize: '1.1rem' }}>Raar</Typography>
        </Box>

        {/* Step list */}
        <Box sx={{ flex: 1 }}>
          <Typography
            variant="caption"
            sx={{ color: 'rgba(242,242,242,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, fontSize: '0.65rem', mb: 2, display: 'block' }}
          >
            Setup Progress
          </Typography>

          {steps.map((step, index) => {
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id
            const Icon = step.Icon

            return (
              <Box key={step.id}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    borderRadius: 2,
                    p: 1.5,
                    bgcolor: isActive ? 'rgba(91,91,214,0.15)' : 'transparent',
                    opacity: !isActive && !isCompleted ? 0.5 : 1,
                    transition: 'all 0.2s',
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      bgcolor: isCompleted || isActive ? '#5B5BD6' : 'transparent',
                      border: !isCompleted && !isActive ? '1px solid rgba(242,242,242,0.2)' : 'none',
                    }}
                  >
                    {isCompleted ? (
                      <CheckIcon sx={{ color: '#fff', fontSize: 18 }} />
                    ) : (
                      <Icon sx={{ color: isActive ? '#fff' : 'rgba(242,242,242,0.6)', fontSize: 18 }} />
                    )}
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: isActive || isCompleted ? '#F2F2F2' : 'rgba(242,242,242,0.6)',
                      }}
                    >
                      {step.title}
                    </Typography>
                    <Typography sx={{ fontSize: '0.75rem', color: 'rgba(242,242,242,0.4)' }}>
                      {step.description}
                    </Typography>
                  </Box>
                </Box>
                {index < steps.length - 1 && (
                  <Box sx={{ ml: '28px', my: 0.5, width: 2, height: 20, bgcolor: 'rgba(242,242,242,0.1)', borderRadius: 1 }} />
                )}
              </Box>
            )
          })}
        </Box>

        {/* Progress bar */}
        <Box sx={{ bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, p: 2, mt: 4 }}>
          <Typography sx={{ fontSize: '0.8rem', color: 'rgba(242,242,242,0.7)', mb: 1 }}>
            Step {currentStep} of {steps.length}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': { bgcolor: '#5B5BD6', borderRadius: 3 },
            }}
          />
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Box sx={{ width: '100%', maxWidth: 520 }}>
          {/* Mobile progress */}
          <Box sx={{ display: { xs: 'block', lg: 'none' }, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" color="text.secondary">Step {currentStep} of {steps.length}</Typography>
              <Typography variant="caption" color="text.secondary">{Math.round(progress)}% complete</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 6, borderRadius: 3, '& .MuiLinearProgress-bar': { borderRadius: 3 } }}
            />
          </Box>

          <Card elevation={0} sx={{ boxShadow: '0 8px 40px rgba(0,0,0,0.1)' }}>
            <CardContent sx={{ p: 4 }}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Onboarding persistence is temporarily disabled in this phase. You can continue to dashboard after setup.
              </Alert>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                {steps[currentStep - 1].title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                {steps[currentStep - 1].description}
              </Typography>

              <Box sx={{ minHeight: 260 }}>
                {currentStep === 1 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <TextField
                        label="First Name"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={(e) => update('firstName', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { height: 44 } }}
                      />
                      <TextField
                        label="Last Name"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => update('lastName', e.target.value)}
                        sx={{ '& .MuiOutlinedInput-root': { height: 44 } }}
                      />
                    </Box>
                    <TextField
                      label="Job Title (Optional)"
                      placeholder="Product Manager"
                      value={formData.jobTitle}
                      onChange={(e) => update('jobTitle', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { height: 44 } }}
                    />
                  </Box>
                )}

                {currentStep === 2 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>City</InputLabel>
                      <Select
                        value={formData.city}
                        label="City"
                        onChange={(e) => update('city', e.target.value)}
                        sx={{ height: 44 }}
                      >
                        {cities.map((c) => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Country (Optional)"
                      placeholder="United States"
                      value={formData.country}
                      onChange={(e) => update('country', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { height: 44 } }}
                    />
                  </Box>
                )}

                {currentStep === 3 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Industry</InputLabel>
                      <Select
                        value={formData.industry}
                        label="Industry"
                        onChange={(e) => update('industry', e.target.value)}
                        sx={{ height: 44 }}
                      >
                        {industries.map((i) => <MenuItem key={i} value={i}>{i}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Company Name"
                      placeholder="Acme Inc."
                      value={formData.companyName}
                      onChange={(e) => update('companyName', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { height: 44 } }}
                    />
                    <FormControl fullWidth size="small">
                      <InputLabel>Company Type</InputLabel>
                      <Select
                        value={formData.companyType}
                        label="Company Type"
                        onChange={(e) => update('companyType', e.target.value)}
                        sx={{ height: 44 }}
                      >
                        {companyTypes.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth size="small">
                      <InputLabel>Company Size (Optional)</InputLabel>
                      <Select
                        value={formData.companySize}
                        label="Company Size (Optional)"
                        onChange={(e) => update('companySize', e.target.value)}
                        sx={{ height: 44 }}
                      >
                        {companySizes.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                      </Select>
                    </FormControl>
                  </Box>
                )}

                {currentStep === 4 && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>How did you hear about us?</InputLabel>
                      <Select
                        value={formData.referralSource}
                        label="How did you hear about us?"
                        onChange={(e) => update('referralSource', e.target.value)}
                        sx={{ height: 44 }}
                      >
                        {referralSources.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Any additional details? (Optional)"
                      placeholder="Tell us more..."
                      value={formData.referralDetail}
                      onChange={(e) => update('referralDetail', e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { height: 44 } }}
                    />
                  </Box>
                )}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
                <Button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={currentStep === 1}
                  startIcon={<ArrowBackIcon />}
                  sx={{ color: 'text.secondary' }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ px: 3, py: 1, fontWeight: 600 }}
                >
                  {currentStep === 4 ? 'Complete Setup' : 'Continue'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  )
}
