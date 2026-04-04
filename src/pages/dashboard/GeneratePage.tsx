import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material'
import Settings2Icon from '@mui/icons-material/Tune'
import PeopleIcon from '@mui/icons-material/People'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { sectors, stages, tools, audiences, featureCategories, weightModes } from '../../lib/report-data'

export default function GeneratePage() {
  const navigate = useNavigate()
  const [isGenerating, setIsGenerating] = useState(false)
  const [formData, setFormData] = useState({
    sector: '',
    stage: '',
    tool: '',
    audience: '',
    featureCategory: '',
    weightMode: 'static',
  })

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const isFormValid = () =>
    !!(formData.sector && formData.stage && formData.tool && formData.audience && formData.featureCategory)

  const selectedTool = tools.find((t) => t.value === formData.tool)

  const handleGenerate = async () => {
    if (!isFormValid()) return
    setIsGenerating(true)
    await new Promise((r) => setTimeout(r, 3000))
    const reportId = Date.now().toString()
    const params = new URLSearchParams({ ...formData, id: reportId })
    navigate(`/reports/${reportId}?${params.toString()}`)
  }

  if (isGenerating) {
    return <GeneratingAnimation tool={selectedTool?.label || 'Tool'} />
  }

  return (
    <Box sx={{ mx: 'auto', maxWidth: 960, p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Generate New Report
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure your research parameters to generate a comprehensive analysis report
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 320px' }, gap: 3 }}>
        {/* Config card */}
        <Card>
          <CardContent sx={{ p: 3 }}>
            {/* Config section header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'rgba(91,91,214,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Settings2Icon sx={{ color: 'primary.main', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography fontWeight={600}>Configuration</Typography>
                <Typography variant="caption" color="text.secondary">Define your analysis parameters</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Sector</InputLabel>
                <Select value={formData.sector} label="Sector" onChange={(e) => update('sector', e.target.value)} sx={{ height: 44 }}>
                  {sectors.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Stage</InputLabel>
                <Select value={formData.stage} label="Stage" onChange={(e) => update('stage', e.target.value)} sx={{ height: 44 }}>
                  {stages.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Tool to Analyze</InputLabel>
                <Select value={formData.tool} label="Tool to Analyze" onChange={(e) => update('tool', e.target.value)} sx={{ height: 44 }}>
                  {tools.map((t) => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Audience section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'rgba(91,91,214,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PeopleIcon sx={{ color: 'primary.main', fontSize: 20 }} />
              </Box>
              <Box>
                <Typography fontWeight={600}>Report Audience</Typography>
                <Typography variant="caption" color="text.secondary">Customize the report for your target audience</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <FormControl fullWidth size="small">
                <InputLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    Tailor report for
                    <InfoOutlinedIcon sx={{ fontSize: 14 }} />
                  </Box>
                </InputLabel>
                <Select value={formData.audience} label="Tailor report for info" onChange={(e) => update('audience', e.target.value)} sx={{ height: 44 }}>
                  {audiences.map((a) => <MenuItem key={a.value} value={a.value}>{a.label}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Select Feature Category</InputLabel>
                <Select value={formData.featureCategory} label="Select Feature Category" onChange={(e) => update('featureCategory', e.target.value)} sx={{ height: 44 }}>
                  {featureCategories.map((c) => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
                </Select>
              </FormControl>

              {/* Weight mode */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
                  <Typography variant="body2" fontWeight={500} color="text.primary">Weight Selection Mode</Typography>
                  <InfoOutlinedIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                </Box>
                <RadioGroup
                  value={formData.weightMode}
                  onChange={(e) => update('weightMode', e.target.value)}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    {weightModes.map((mode) => (
                      <Paper
                        key={mode.value}
                        variant="outlined"
                        onClick={() => update('weightMode', mode.value)}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          cursor: 'pointer',
                          borderColor: formData.weightMode === mode.value ? 'primary.main' : 'divider',
                          bgcolor: formData.weightMode === mode.value ? 'rgba(91,91,214,0.04)' : 'transparent',
                          transition: 'all 0.15s',
                        }}
                      >
                        <FormControlLabel
                          value={mode.value}
                          control={<Radio size="small" sx={{ p: 0.5 }} />}
                          label={
                            <Box sx={{ ml: 0.5 }}>
                              <Typography variant="body2" fontWeight={500}>{mode.label}</Typography>
                              <Typography variant="caption" color="text.secondary">{mode.description}</Typography>
                            </Box>
                          }
                          sx={{ m: 0, alignItems: 'flex-start' }}
                        />
                      </Paper>
                    ))}
                  </Box>
                </RadioGroup>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Right column */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Summary card */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography fontWeight={600} gutterBottom>Report Summary</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
                {[
                  { label: 'Sector', value: sectors.find((s) => s.value === formData.sector)?.label },
                  { label: 'Stage', value: stages.find((s) => s.value === formData.stage)?.label },
                  { label: 'Tool', value: selectedTool?.label },
                  { label: 'Audience', value: audiences.find((a) => a.value === formData.audience)?.label },
                ].map(({ label, value }) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>{label}</Typography>
                    <Typography variant="caption" fontWeight={500} sx={{ textAlign: 'right' }}>
                      {value || <span style={{ color: '#aaa' }}>Not selected</span>}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {selectedTool && (
                <Box sx={{ bgcolor: 'rgba(0,0,0,0.03)', borderRadius: 2, p: 1.5 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Selected Tool</Typography>
                  <Typography variant="body2" fontWeight={600}>{selectedTool.label}</Typography>
                  <Typography variant="caption" color="text.secondary">{selectedTool.company}</Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleGenerate}
            disabled={!isFormValid()}
            startIcon={<AutoAwesomeIcon />}
            endIcon={<ChevronRightIcon />}
            sx={{ py: 1.75, fontWeight: 600, fontSize: '0.95rem', boxShadow: isFormValid() ? '0 4px 14px rgba(91,91,214,0.35)' : 'none' }}
          >
            Generate Report
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

function GeneratingAnimation({ tool }: { tool: string }) {
  const steps = [
    'Analyzing sector parameters...',
    'Gathering market intelligence...',
    'Processing technical specifications...',
    'Generating insights...',
    'Compiling report...',
  ]
  const [currentStep, setCurrentStep] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev))
    }, 600)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <Box sx={{ display: 'flex', minHeight: '70vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4 }}>
      <Box sx={{ textAlign: 'center' }}>
        {/* Pulsing animation */}
        <Box sx={{ position: 'relative', width: 96, height: 96, mx: 'auto', mb: 4 }}>
          <Box sx={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            bgcolor: 'primary.main', opacity: 0.15,
            animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
            '@keyframes ping': { '0%': { transform: 'scale(1)', opacity: 0.2 }, '75%,100%': { transform: 'scale(1.6)', opacity: 0 } },
          }} />
          <Box sx={{
            position: 'absolute', inset: 8, borderRadius: '50%',
            bgcolor: 'primary.main', opacity: 0.25,
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': { '0%,100%': { opacity: 0.25 }, '50%': { opacity: 0.5 } },
          }} />
          <Box sx={{
            position: 'absolute', inset: 16, borderRadius: '50%',
            bgcolor: 'primary.main',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AutoAwesomeIcon sx={{
              color: '#fff', fontSize: 28,
              animation: 'pulse 2s ease-in-out infinite',
            }} />
          </Box>
        </Box>

        <Typography variant="h5" fontWeight={700} gutterBottom>
          Generating Your Report
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Analyzing {tool} for your configured parameters
        </Typography>

        {/* Step list */}
        <Box sx={{ mx: 'auto', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {steps.map((step, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                borderRadius: 2,
                px: 2,
                py: 1.25,
                transition: 'all 0.3s',
                bgcolor: index === currentStep ? 'primary.main' : index < currentStep ? 'rgba(91,91,214,0.08)' : 'transparent',
              }}
            >
              <Box sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                flexShrink: 0,
                bgcolor: index === currentStep ? '#fff' : index < currentStep ? 'primary.main' : 'text.disabled',
                animation: index === currentStep ? 'pulse 1s ease-in-out infinite' : 'none',
              }} />
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{
                  color: index === currentStep ? '#fff' : index < currentStep ? 'primary.main' : 'text.disabled',
                }}
              >
                {step}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
