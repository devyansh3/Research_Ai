import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
} from '@mui/material'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import SendIcon from '@mui/icons-material/Send'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import BarChartIcon from '@mui/icons-material/BarChart'
import PieChartIcon from '@mui/icons-material/PieChart'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import DescriptionIcon from '@mui/icons-material/Description'
import FileOpenIcon from '@mui/icons-material/FileOpen'

const examplePrompts = [
  {
    Icon: BarChartIcon,
    title: 'Manufacturing Analysis',
    description: 'Analyze R&D tools for the manufacturing sector',
    prompt: 'Generate a report analyzing Siemens NX for manufacturing R&D',
  },
  {
    Icon: PieChartIcon,
    title: 'Market Comparison',
    description: 'Compare leading tools in the market',
    prompt: 'Compare Autodesk Fusion 360 vs Siemens NX for enterprise use',
  },
  {
    Icon: TrendingUpIcon,
    title: 'Strategic Alignment',
    description: 'Evaluate strategic fit for executive sponsors',
    prompt: 'Create a strategic alignment report for board presentation',
  },
  {
    Icon: DescriptionIcon,
    title: 'Technical Deep Dive',
    description: 'Detailed technical analysis report',
    prompt: 'Generate a technical evaluation of design software capabilities',
  },
]

const recentReports = [
  { id: '1', title: 'Manufacturing R&D Analysis - Siemens NX', date: '2 hours ago' },
  { id: '2', title: 'Tool Comparison - CAD Software', date: '1 day ago' },
  { id: '3', title: 'Strategic Assessment - Q1 2024', date: '3 days ago' },
]

export default function DashboardPage() {
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      navigate(`/generate?prompt=${encodeURIComponent(message)}`)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        <Box sx={{ width: '100%', maxWidth: 720 }}>
          {/* Hero */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Box
              sx={{
                mx: 'auto',
                mb: 3,
                width: 68,
                height: 68,
                borderRadius: 3,
                bgcolor: 'rgba(91,91,214,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SmartToyIcon sx={{ fontSize: 34, color: 'primary.main' }} />
            </Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              What would you like to research?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1rem' }}>
              Ask me anything or choose from the examples below to get started
            </Typography>
          </Box>

          {/* Chat input */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
            <TextField
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me to generate a research report..."
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  fontSize: '1rem',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                  bgcolor: 'background.paper',
                  pr: 0.75,
                  py: 0.5,
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      type="submit"
                      disabled={!message.trim()}
                      sx={{
                        bgcolor: message.trim() ? 'primary.main' : 'action.disabledBackground',
                        color: message.trim() ? '#fff' : 'text.disabled',
                        borderRadius: 2,
                        width: 40,
                        height: 40,
                        '&:hover': { bgcolor: 'primary.dark' },
                        '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'text.disabled' },
                      }}
                    >
                      <SendIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Generate button */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/generate')}
              startIcon={<AutoAwesomeIcon />}
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '0.95rem',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(91,91,214,0.35)',
              }}
            >
              Generate Custom Report
            </Button>
          </Box>

          {/* Examples */}
          <Box>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mb: 2,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            >
              Try these examples
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              {examplePrompts.map((example, i) => (
                <Card
                  key={i}
                  onClick={() => setMessage(example.prompt)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 4px 16px rgba(91,91,214,0.12)',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: '16px !important' }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 2,
                        bgcolor: 'rgba(91,91,214,0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <example.Icon sx={{ fontSize: 20, color: 'primary.main' }} />
                    </Box>
                    <Box>
                      <Typography variant="body2" fontWeight={600} gutterBottom sx={{ lineHeight: 1.3 }}>
                        {example.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {example.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Recent Reports */}
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider', bgcolor: 'rgba(0,0,0,0.02)', p: 3 }}>
        <Box sx={{ mx: 'auto', maxWidth: 720 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="body1" fontWeight={600}>Recent Reports</Typography>
            <Button
              variant="text"
              size="small"
              onClick={() => navigate('/reports')}
              sx={{ color: 'primary.main', fontWeight: 600 }}
            >
              View all
            </Button>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
            {recentReports.map((report) => (
              <Card
                key={report.id}
                onClick={() => navigate(`/reports/${report.id}`)}
                sx={{
                  minWidth: 280,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 16px rgba(91,91,214,0.12)',
                  },
                }}
              >
                <CardContent sx={{ p: '16px !important' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <FileOpenIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                    <Typography variant="caption" color="text.secondary">{report.date}</Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {report.title}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
