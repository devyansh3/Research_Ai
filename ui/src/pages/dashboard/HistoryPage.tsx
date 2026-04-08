import { useNavigate } from 'react-router-dom'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
} from '@mui/material'
import DescriptionIcon from '@mui/icons-material/Description'
import EditIcon from '@mui/icons-material/Edit'
import CompareArrowsIcon from '@mui/icons-material/CompareArrows'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

const historyGroups = [
  {
    date: 'Today',
    items: [
      { id: '1', type: 'generated', title: 'Manufacturing R&D Analysis - Siemens NX', detail: 'Manufacturing · R&D · Board', time: '2 hours ago', reportId: '1' },
      { id: '2', type: 'compared', title: 'Compared Siemens NX vs Autodesk Fusion 360', detail: 'Manufacturing sector comparison', time: '3 hours ago', reportId: '1' },
    ],
  },
  {
    date: 'Yesterday',
    items: [
      { id: '3', type: 'generated', title: 'Tool Comparison - CAD Software', detail: 'Technology · Prototype · Technical Team', time: '1 day ago', reportId: '2' },
      { id: '4', type: 'edited', title: 'Updated Strategic Assessment parameters', detail: 'Changed audience to Executive Sponsor', time: '1 day ago', reportId: '3' },
    ],
  },
  {
    date: '3 days ago',
    items: [
      { id: '5', type: 'generated', title: 'Strategic Assessment - Q1 2024', detail: 'Manufacturing · Production · Executive Sponsor', time: '3 days ago', reportId: '3' },
    ],
  },
  {
    date: 'Last week',
    items: [
      { id: '6', type: 'generated', title: 'Healthcare Software Analysis', detail: 'Healthcare · Scaling · Operations Manager', time: '1 week ago', reportId: '4' },
      { id: '7', type: 'compared', title: 'Compared SolidWorks vs CATIA', detail: 'Healthcare sector comparison', time: '1 week ago', reportId: '4' },
    ],
  },
]

const typeConfig = {
  generated: { Icon: DescriptionIcon, color: '#5B5BD6', label: 'Generated', bgcolor: 'rgba(91,91,214,0.1)' },
  edited: { Icon: EditIcon, color: '#059669', label: 'Edited', bgcolor: 'rgba(5,150,105,0.1)' },
  compared: { Icon: CompareArrowsIcon, color: '#D97706', label: 'Compared', bgcolor: 'rgba(217,119,6,0.1)' },
}

export default function HistoryPage() {
  const navigate = useNavigate()

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>History</Typography>
        <Typography variant="body2" color="text.secondary">
          A timeline of all your research activity
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {historyGroups.map((group) => (
          <Box key={group.date}>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                mb: 2,
                color: 'text.secondary',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                fontWeight: 600,
                fontSize: '0.7rem',
              }}
            >
              {group.date}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {group.items.map((item) => {
                const config = typeConfig[item.type as keyof typeof typeConfig]
                return (
                  <Card
                    key={item.id}
                    onClick={() => navigate(`/reports/${item.reportId}`)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      '&:hover': { borderColor: 'primary.main', transform: 'translateX(2px)' },
                    }}
                  >
                    <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: '16px !important' }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: config.bgcolor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <config.Icon sx={{ fontSize: 18, color: config.color }} />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <Typography variant="body2" fontWeight={500} noWrap>
                            {item.title}
                          </Typography>
                          <Chip
                            label={config.label}
                            size="small"
                            sx={{ fontSize: '0.65rem', height: 18, bgcolor: config.bgcolor, color: config.color, fontWeight: 600, flexShrink: 0 }}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">{item.detail}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>
                        {item.time}
                      </Typography>
                    </CardContent>
                  </Card>
                )
              })}
            </Box>
          </Box>
        ))}
      </Box>

      {/* Empty state bottom */}
      <Box
        sx={{
          mt: 4,
          p: 3,
          borderRadius: 2,
          border: '1px dashed',
          borderColor: 'divider',
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(91,91,214,0.02)' },
          transition: 'all 0.15s',
        }}
        onClick={() => navigate('/generate')}
      >
        <AddCircleOutlineIcon sx={{ fontSize: 28, color: 'text.disabled', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Generate a new report to add to your history
        </Typography>
      </Box>
    </Box>
  )
}
