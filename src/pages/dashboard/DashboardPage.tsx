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
  Chip,
  Divider,
} from '@mui/material'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import SendIcon from '@mui/icons-material/Send'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import BarChartIcon from '@mui/icons-material/BarChart'
import PieChartIcon from '@mui/icons-material/PieChart'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import DescriptionIcon from '@mui/icons-material/Description'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

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
  {
    id: '1',
    title: 'Manufacturing R&D Analysis — Siemens NX',
    excerpt: 'Comprehensive evaluation of Siemens NX capabilities across design, simulation, and manufacturing workflows.',
    sector: 'Manufacturing',
    date: '2 hours ago',
  },
  {
    id: '2',
    title: 'CAD Software Tool Comparison',
    excerpt: 'Side-by-side analysis of leading CAD platforms for enterprise adoption and total cost of ownership.',
    sector: 'Technology',
    date: '1 day ago',
  },
  {
    id: '3',
    title: 'Strategic Assessment — Q1 2024',
    excerpt: 'Executive-level strategic overview of R&D investments and technology portfolio alignment.',
    sector: 'Strategy',
    date: '3 days ago',
  },
  {
    id: '4',
    title: 'Aerospace Component Design Tools',
    excerpt: 'Benchmarking advanced design tools for aerospace-grade precision and regulatory compliance.',
    sector: 'Aerospace',
    date: '5 days ago',
  },
  {
    id: '5',
    title: 'Digital Twin Platform Evaluation',
    excerpt: 'Analysis of digital twin platforms for predictive maintenance and real-time monitoring.',
    sector: 'Industrial IoT',
    date: '1 week ago',
  },
]

const SIDEBAR_WIDTH = 300

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
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>

      {/* ── Main content ── */}
      <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: { xs: 3, md: 5 } }}>
        <Box sx={{ width: '100%', maxWidth: 680 }}>

          {/* Hero */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Box
              sx={{
                mx: 'auto',
                mb: 3,
                width: 64,
                height: 64,
                borderRadius: 3,
                bgcolor: 'rgba(26,86,219,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SmartToyIcon sx={{ fontSize: 32, color: 'primary.main' }} />
            </Box>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
              What would you like to research?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Ask anything or choose from the examples below to get started
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
                  boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
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
                boxShadow: '0 4px 14px rgba(26,86,219,0.3)',
              }}
            >
              Generate Custom Report
            </Button>
          </Box>

          {/* Example prompts */}
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
                      boxShadow: '0 4px 16px rgba(26,86,219,0.1)',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, p: '16px !important' }}>
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: 2,
                        bgcolor: 'rgba(26,86,219,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <example.Icon sx={{ fontSize: 19, color: 'primary.main' }} />
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

      {/* ── Recent Reports sidebar ── */}
      <Box
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          borderLeft: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          bgcolor: '#ffffff',
        }}
      >
        {/* Header */}
        <Box sx={{ px: 2.5, pt: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ArticleOutlinedIcon sx={{ fontSize: 17, color: 'text.secondary' }} />
            <Typography variant="body2" fontWeight={700} sx={{ color: 'text.primary', letterSpacing: '-0.01em' }}>
              Recent Reports
            </Typography>
          </Box>
          <Button
            variant="text"
            size="small"
            onClick={() => navigate('/reports')}
            sx={{ color: 'primary.main', fontWeight: 600, fontSize: '0.75rem', minWidth: 0, p: 0.5 }}
          >
            View all
          </Button>
        </Box>

        <Divider />

        {/* Scrollable list */}
        <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {recentReports.map((report, index) => (
            <Box key={report.id}>
              <Box
                onClick={() => navigate(`/reports/${report.id}`)}
                sx={{
                  py: 2,
                  px: 1.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'background 0.12s',
                  '&:hover': { bgcolor: 'rgba(26,86,219,0.04)' },
                }}
              >
                {/* Sector chip + date */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                  <Chip
                    label={report.sector}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 600,
                      bgcolor: 'rgba(26,86,219,0.08)',
                      color: 'primary.main',
                      '& .MuiChip-label': { px: 1 },
                    }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                    <AccessTimeIcon sx={{ fontSize: 11, color: 'text.disabled' }} />
                    <Typography sx={{ fontSize: '0.68rem', color: 'text.disabled', fontWeight: 500 }}>
                      {report.date}
                    </Typography>
                  </Box>
                </Box>

                {/* Title */}
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{
                    lineHeight: 1.4,
                    color: 'text.primary',
                    mb: 0.75,
                    fontSize: '0.825rem',
                  }}
                >
                  {report.title}
                </Typography>

                {/* Excerpt */}
                <Typography
                  sx={{
                    fontSize: '0.75rem',
                    color: 'text.secondary',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {report.excerpt}
                </Typography>
              </Box>
              {index < recentReports.length - 1 && (
                <Divider sx={{ mx: 1.5 }} />
              )}
            </Box>
          ))}
        </Box>
      </Box>

    </Box>
  )
}
