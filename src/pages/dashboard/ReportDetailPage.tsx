import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
  Drawer,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  IconButton,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EditIcon from '@mui/icons-material/Edit'
import DownloadIcon from '@mui/icons-material/Download'
import ShareIcon from '@mui/icons-material/Share'
import RefreshIcon from '@mui/icons-material/Refresh'
import DescriptionIcon from '@mui/icons-material/Description'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import CloseIcon from '@mui/icons-material/Close'
import {
  sectors, stages, tools, audiences, featureCategories, weightModes,
  sampleReports, comparisonReports,
} from '../../lib/report-data'

export default function ReportDetailPage() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    sector: searchParams.get('sector') || 'manufacturing',
    stage: searchParams.get('stage') || 'rd',
    tool: searchParams.get('tool') || 'siemens-nx',
    audience: searchParams.get('audience') || 'board',
    featureCategory: searchParams.get('featureCategory') || 'strategic-market',
    weightMode: searchParams.get('weightMode') || 'static',
  })
  const [editFormData, setEditFormData] = useState(formData)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [comparisonTool, setComparisonTool] = useState('')
  const [showComparison, setShowComparison] = useState(false)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const currentReport = sampleReports[formData.tool] || sampleReports.default
  const currentComparison = comparisonReports[comparisonTool] || ''
  const selectedTool = tools.find((t) => t.value === formData.tool)
  const otherTools = tools.filter((t) => t.value !== formData.tool)

  useEffect(() => { setEditFormData(formData) }, [formData])

  const updateEdit = (field: string, value: string) =>
    setEditFormData((prev) => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    setIsRegenerating(true)
    setDrawerOpen(false)
    await new Promise((r) => setTimeout(r, 2000))
    setFormData(editFormData)
    setIsRegenerating(false)
  }

  const handleCompare = async () => {
    if (!comparisonTool) return
    setIsRegenerating(true)
    await new Promise((r) => setTimeout(r, 1500))
    setShowComparison(true)
    setIsRegenerating(false)
  }

  if (isRegenerating) {
    return (
      <Box sx={{ display: 'flex', minHeight: '60vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ position: 'relative', width: 72, height: 72, mb: 3 }}>
          <Box sx={{
            position: 'absolute', inset: 0, borderRadius: '50%', bgcolor: 'primary.main', opacity: 0.15,
            animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
            '@keyframes ping': { '0%': { transform: 'scale(1)', opacity: 0.2 }, '75%,100%': { transform: 'scale(1.6)', opacity: 0 } },
          }} />
          <Box sx={{
            position: 'absolute', inset: 10, borderRadius: '50%', bgcolor: 'primary.main',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <AutoAwesomeIcon sx={{ color: '#fff', fontSize: 22, animation: 'pulse 1.5s ease-in-out infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.5 } } }} />
          </Box>
        </Box>
        <Typography variant="h6" fontWeight={600} gutterBottom>Regenerating report...</Typography>
        <Typography color="text.secondary">This may take a moment</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100%', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', px: 3, py: 2 }}>
        <Box sx={{ maxWidth: 1100, mx: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => navigate('/reports')} size="small">
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {selectedTool?.label} Analysis Report
              </Typography>
              <Typography variant="caption" color="text.secondary">Report ID: {id}</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setDrawerOpen(true)} size="small">
              Edit Sections
            </Button>
            <Button variant="outlined" startIcon={<DownloadIcon />} size="small">Export</Button>
            <Button variant="outlined" startIcon={<ShareIcon />} size="small">Share</Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ maxWidth: 1100, mx: 'auto', p: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 280px' }, gap: 3 }}>
          {/* Main report */}
          <Box>
            <Card>
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'rgba(91,91,214,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DescriptionIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography fontWeight={600}>Generated Report</Typography>
                    <Typography variant="caption" color="text.secondary">{selectedTool?.company}</Typography>
                  </Box>
                </Box>
                <Box sx={{
                  p: 3,
                  '& h1,& h2,& h3': { color: 'text.primary', fontWeight: 700, mt: 2, mb: 1 },
                  '& h1': { fontSize: '1.5rem' },
                  '& h2': { fontSize: '1.2rem' },
                  '& h3': { fontSize: '1rem' },
                  '& p': { color: 'text.primary', lineHeight: 1.7, mb: 1.5 },
                  '& ul,& ol': { pl: 3, mb: 1.5 },
                  '& li': { mb: 0.5, color: 'text.primary' },
                  '& table': { width: '100%', borderCollapse: 'collapse', mb: 2 },
                  '& th,& td': { border: '1px solid', borderColor: 'divider', p: 1, textAlign: 'left', fontSize: '0.875rem' },
                  '& th': { bgcolor: 'rgba(0,0,0,0.03)', fontWeight: 600 },
                  '& code': { bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 1, px: 0.5, fontSize: '0.85em', fontFamily: 'monospace' },
                  '& pre': { bgcolor: 'rgba(0,0,0,0.05)', borderRadius: 2, p: 2, overflow: 'auto', mb: 2 },
                  '& pre code': { bgcolor: 'transparent', p: 0 },
                  '& hr': { my: 2, borderColor: 'divider' },
                  '& strong': { fontWeight: 700 },
                }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {currentReport}
                  </ReactMarkdown>
                </Box>
              </CardContent>
            </Card>

            {/* Comparison result */}
            {showComparison && currentComparison && (
              <Card sx={{ mt: 3 }}>
                <CardContent sx={{ p: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: 'rgba(91,91,214,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CompareArrowsIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    </Box>
                    <Typography fontWeight={600}>Tool Comparison</Typography>
                  </Box>
                  <Box sx={{ p: 3, '& table': { width: '100%', borderCollapse: 'collapse', mb: 2 }, '& th,& td': { border: '1px solid', borderColor: 'divider', p: 1, fontSize: '0.875rem' }, '& th': { bgcolor: 'rgba(0,0,0,0.03)', fontWeight: 600 }, '& h2,& h3': { fontWeight: 700, mt: 2, mb: 1 }, '& p': { mb: 1.5, lineHeight: 1.7 }, '& ul,& ol': { pl: 3, mb: 1.5 }, '& li': { mb: 0.5 }, '& strong': { fontWeight: 700 }, '& hr': { my: 2, borderColor: 'divider' } }}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {currentComparison}
                    </ReactMarkdown>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>

          {/* Right sidebar */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Report details */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="body2" fontWeight={600} gutterBottom>Report Details</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  {[
                    { label: 'Sector', value: sectors.find((s) => s.value === formData.sector)?.label },
                    { label: 'Stage', value: stages.find((s) => s.value === formData.stage)?.label },
                    { label: 'Audience', value: audiences.find((a) => a.value === formData.audience)?.label },
                    { label: 'Weight Mode', value: formData.weightMode.charAt(0).toUpperCase() + formData.weightMode.slice(1) },
                  ].map(({ label, value }) => (
                    <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                      <Typography variant="caption" color="text.secondary">{label}</Typography>
                      <Typography variant="caption" fontWeight={500} sx={{ textAlign: 'right' }}>{value}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* Comparison */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <CompareArrowsIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                  <Typography variant="body2" fontWeight={600}>Comparison Between Tools</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Select tool to compare</InputLabel>
                    <Select
                      value={comparisonTool}
                      label="Select tool to compare"
                      onChange={(e) => setComparisonTool(e.target.value)}
                    >
                      {otherTools.map((t) => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    fullWidth
                    disabled={!comparisonTool}
                    onClick={handleCompare}
                    size="small"
                  >
                    Compare {selectedTool?.label} vs {tools.find((t) => t.value === comparisonTool)?.label || 'Tool'}
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    Select a tool and click compare to see a detailed comparison
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>

      {/* Edit Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        PaperProps={{ sx: { width: { xs: '100%', sm: 460 } } }}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          {/* Drawer header */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box>
              <Typography fontWeight={600}>Edit Report Configuration</Typography>
              <Typography variant="caption" color="text.secondary">Modify parameters and regenerate</Typography>
            </Box>
            <IconButton onClick={() => setDrawerOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Drawer content */}
          <Box sx={{ flex: 1, overflowY: 'auto', px: 3, py: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Sector</InputLabel>
                <Select value={editFormData.sector} label="Sector" onChange={(e) => updateEdit('sector', e.target.value)}>
                  {sectors.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Stage</InputLabel>
                <Select value={editFormData.stage} label="Stage" onChange={(e) => updateEdit('stage', e.target.value)}>
                  {stages.map((s) => <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Tool to Analyze</InputLabel>
                <Select value={editFormData.tool} label="Tool to Analyze" onChange={(e) => updateEdit('tool', e.target.value)}>
                  {tools.map((t) => <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>)}
                </Select>
              </FormControl>

              <Divider />

              <FormControl fullWidth size="small">
                <InputLabel>Audience</InputLabel>
                <Select value={editFormData.audience} label="Audience" onChange={(e) => updateEdit('audience', e.target.value)}>
                  {audiences.map((a) => <MenuItem key={a.value} value={a.value}>{a.label}</MenuItem>)}
                </Select>
              </FormControl>
              <FormControl fullWidth size="small">
                <InputLabel>Feature Category</InputLabel>
                <Select value={editFormData.featureCategory} label="Feature Category" onChange={(e) => updateEdit('featureCategory', e.target.value)}>
                  {featureCategories.map((c) => <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>)}
                </Select>
              </FormControl>

              <Box>
                <Typography variant="body2" fontWeight={500} sx={{ mb: 1.5 }}>Weight Selection Mode</Typography>
                <RadioGroup value={editFormData.weightMode} onChange={(e) => updateEdit('weightMode', e.target.value)}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {weightModes.map((mode) => (
                      <Paper
                        key={mode.value}
                        variant="outlined"
                        onClick={() => updateEdit('weightMode', mode.value)}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          cursor: 'pointer',
                          borderColor: editFormData.weightMode === mode.value ? 'primary.main' : 'divider',
                          bgcolor: editFormData.weightMode === mode.value ? 'rgba(91,91,214,0.04)' : 'transparent',
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
          </Box>

          {/* Drawer footer */}
          <Box sx={{ px: 3, py: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 1.5 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSave}
              startIcon={<RefreshIcon />}
              sx={{ fontWeight: 600 }}
            >
              Regenerate Report
            </Button>
            <Button variant="outlined" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Drawer>
    </Box>
  )
}
