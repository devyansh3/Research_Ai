import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Chip,
  IconButton,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import DescriptionIcon from '@mui/icons-material/Description'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import DownloadIcon from '@mui/icons-material/Download'
import ShareIcon from '@mui/icons-material/Share'
import DeleteIcon from '@mui/icons-material/Delete'

const sampleReports = [
  { id: '1', title: 'Manufacturing R&D Analysis - Siemens NX', tool: 'Siemens NX', sector: 'Manufacturing', stage: 'R&D', date: '2 hours ago', status: 'completed' },
  { id: '2', title: 'Tool Comparison - CAD Software', tool: 'Autodesk Fusion 360', sector: 'Technology', stage: 'Prototype', date: '1 day ago', status: 'completed' },
  { id: '3', title: 'Strategic Assessment - Q1 2024', tool: 'CATIA', sector: 'Aerospace', stage: 'Production', date: '3 days ago', status: 'completed' },
  { id: '4', title: 'Healthcare Software Analysis', tool: 'SolidWorks', sector: 'Healthcare', stage: 'Scaling', date: '1 week ago', status: 'completed' },
  { id: '5', title: 'Finance Tool Evaluation', tool: 'Creo', sector: 'Finance', stage: 'Maintenance', date: '2 weeks ago', status: 'completed' },
  { id: '6', title: 'Retail Operations Platform', tool: 'Inventor', sector: 'Retail', stage: 'R&D', date: '1 month ago', status: 'completed' },
]

export default function ReportsPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)
  const [activeReport, setActiveReport] = useState<string | null>(null)

  const filtered = sampleReports.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tool.toLowerCase().includes(search.toLowerCase()) ||
      r.sector.toLowerCase().includes(search.toLowerCase())
  )

  const openMenu = (e: React.MouseEvent<HTMLElement>, id: string) => {
    e.stopPropagation()
    setMenuAnchor(e.currentTarget)
    setActiveReport(id)
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1100, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} gutterBottom>Reports</Typography>
          <Typography variant="body2" color="text.secondary">
            All your generated research reports
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => navigate('/generate')}
          sx={{ fontWeight: 600 }}
        >
          New Report
        </Button>
      </Box>

      {/* Search + filter */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search reports..."
          sx={{ maxWidth: 400 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
        />
        <Button variant="outlined" startIcon={<FilterListIcon />} sx={{ flexShrink: 0 }}>
          Filters
        </Button>
      </Box>

      {/* Reports grid */}
      {filtered.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <DescriptionIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
          <Typography color="text.secondary">No reports found</Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2 }}>
          {filtered.map((report) => (
            <Card
              key={report.id}
              onClick={() => navigate(`/reports/${report.id}`)}
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
              <CardContent sx={{ p: '20px !important' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      bgcolor: 'rgba(91,91,214,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <DescriptionIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => openMenu(e, report.id)}
                    sx={{ color: 'text.secondary' }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Typography
                  variant="body2"
                  fontWeight={600}
                  gutterBottom
                  sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}
                >
                  {report.title}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1.5, mb: 1.5 }}>
                  <Chip label={report.tool} size="small" sx={{ fontSize: '0.7rem', height: 22, bgcolor: 'rgba(91,91,214,0.08)', color: 'primary.main', fontWeight: 500 }} />
                  <Chip label={report.sector} size="small" sx={{ fontSize: '0.7rem', height: 22 }} variant="outlined" />
                  <Chip label={report.stage} size="small" sx={{ fontSize: '0.7rem', height: 22 }} variant="outlined" />
                </Box>

                <Typography variant="caption" color="text.secondary">{report.date}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        onClick={() => setMenuAnchor(null)}
      >
        <MenuItem onClick={() => activeReport && navigate(`/reports/${activeReport}`)}>
          <DescriptionIcon sx={{ fontSize: 16, mr: 1.5, color: 'text.secondary' }} />
          View Report
        </MenuItem>
        <MenuItem>
          <DownloadIcon sx={{ fontSize: 16, mr: 1.5, color: 'text.secondary' }} />
          Download
        </MenuItem>
        <MenuItem>
          <ShareIcon sx={{ fontSize: 16, mr: 1.5, color: 'text.secondary' }} />
          Share
        </MenuItem>
        <MenuItem sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ fontSize: 16, mr: 1.5 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  )
}
