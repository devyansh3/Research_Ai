import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../lib/auth-context'
import {
  Box,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  OutlinedInput,
  Checkbox,
  FormControlLabel,
  Chip,
  Divider,
} from '@mui/material'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#1b1b23">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  )
}

const BLUE = '#1A56DB'
const BLUE_LIGHT = '#2563EB'

const inputSx = {
  width: '100%',
  bgcolor: '#ffffff',
  borderRadius: '12px',
  fontSize: '0.95rem',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(180,205,235,0.5)' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(180,205,235,0.9)' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: BLUE, borderWidth: '2px' },
  '& input': { py: 1.5, px: 2 },
  '& input::placeholder': { color: 'rgba(30,30,50,0.3)', opacity: 1 },
}

const gradientBtnSx = {
  background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_LIGHT} 100%)`,
  color: '#fff',
  py: 1.75,
  borderRadius: '12px',
  fontWeight: 700,
  fontSize: '1rem',
  letterSpacing: '0.01em',
  boxShadow: '0 8px 24px -6px rgba(26,86,219,0.3)',
  '&:hover': {
    opacity: 0.9,
    boxShadow: '0 12px 28px -6px rgba(26,86,219,0.4)',
    background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_LIGHT} 100%)`,
  },
  '&.Mui-disabled': { background: 'rgba(26,86,219,0.2)', color: 'rgba(255,255,255,0.6)' },
}

export default function SignupPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { signup } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (!agreedToTerms) {
      setError('Please agree to the Terms & Conditions to continue')
      return
    }
    setIsLoading(true)
    try {
      await signup(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = !!(fullName && email && password && agreedToTerms)

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f5f8ff' }}>
      {/* Navbar */}
      <Box
        component="nav"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: { xs: 3, md: 5 },
          height: 72,
          bgcolor: '#f5f8ff',
        }}
      >
        <Typography sx={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: '1.375rem', color: '#111111' }}>
          roaar
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Link to="/login" style={{ color: 'rgba(20,20,40,0.6)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
            Sign In
          </Link>
          <Button component={Link} to="/signup" sx={{ ...gradientBtnSx, py: 1, px: 3, fontSize: '0.875rem' }}>
            Sign Up
          </Button>
        </Box>
      </Box>

      {/* Main */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <Box sx={{ position: 'absolute', top: '-10%', right: '-5%', width: 384, height: 384, bgcolor: 'rgba(26,86,219,0.06)', borderRadius: '50%', filter: 'blur(64px)', pointerEvents: 'none' }} />
        <Box sx={{ position: 'absolute', bottom: '-10%', left: '-5%', width: 320, height: 320, bgcolor: 'rgba(26,86,219,0.03)', borderRadius: '50%', filter: 'blur(64px)', pointerEvents: 'none' }} />

        <Box sx={{ width: '100%', maxWidth: 520, position: 'relative', zIndex: 1 }}>
          {/* Glass card */}
          <Box
            sx={{
              background: 'rgba(240,247,255,0.9)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(180,210,240,0.3)',
              borderRadius: '16px',
              boxShadow: '0 12px 32px -8px rgba(26,86,219,0.08)',
              p: { xs: 4, md: 6 },
            }}
          >
            {/* Headline */}
            <Box sx={{ mb: 5 }}>
              <Typography
                sx={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 700,
                  fontSize: { xs: '1.75rem', md: '2.25rem' },
                  color: '#111111',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  mb: 1.5,
                }}
              >
                Join the future of research.
              </Typography>
              <Typography sx={{ color: 'rgba(30,30,60,0.65)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Start curating intelligence with your personal AI research assistant today.
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2, fontSize: '0.875rem' }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {/* Full Name */}
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.75, ml: 0.5, color: '#111111', fontSize: '0.875rem' }}>
                  Full Name
                </Typography>
                <OutlinedInput
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Rivers"
                  required
                  fullWidth
                  sx={inputSx}
                />
              </Box>

              {/* Work Email */}
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.75, ml: 0.5, color: '#111111', fontSize: '0.875rem' }}>
                  Work Email
                </Typography>
                <OutlinedInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  required
                  fullWidth
                  sx={inputSx}
                />
              </Box>

              {/* Password */}
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ mb: 0.75, ml: 0.5, color: '#111111', fontSize: '0.875rem' }}>
                  Password
                </Typography>
                <OutlinedInput
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  fullWidth
                  sx={inputSx}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ mr: 0.5, color: 'rgba(30,30,80,0.5)' }}>
                        {showPassword ? <VisibilityOffIcon sx={{ fontSize: 18 }} /> : <VisibilityIcon sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <Typography sx={{ fontSize: '0.72rem', color: 'rgba(30,30,60,0.5)', mt: 0.75, ml: 0.5 }}>
                  Must be at least 8 characters with a mix of letters and symbols.
                </Typography>
              </Box>

              {/* Terms */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    size="small"
                    sx={{ color: 'rgba(180,205,235,0.8)', '&.Mui-checked': { color: BLUE }, mt: '-2px' }}
                  />
                }
                label={
                  <Typography sx={{ fontSize: '0.875rem', color: 'rgba(30,30,60,0.8)', lineHeight: 1.5 }}>
                    I agree to the{' '}
                    <span style={{ color: BLUE, fontWeight: 600, cursor: 'pointer' }}>Terms & Conditions</span>
                    {' '}and{' '}
                    <span style={{ color: BLUE, fontWeight: 600, cursor: 'pointer' }}>Privacy Policy</span>.
                  </Typography>
                }
                sx={{ alignItems: 'flex-start', mt: 0.5 }}
              />

              {/* Submit */}
              <Button
                type="submit"
                fullWidth
                disabled={isLoading || !isFormValid}
                sx={{ ...gradientBtnSx, mt: 0.5 }}
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </Box>

            {/* Divider */}
            <Box sx={{ position: 'relative', my: 4 }}>
              <Divider sx={{ borderColor: 'rgba(180,210,240,0.3)' }} />
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', bgcolor: 'rgba(240,247,255,0.95)', px: 2 }}>
                <Typography sx={{ fontSize: '0.7rem', color: 'rgba(30,30,60,0.5)', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Or sign up with
                </Typography>
              </Box>
            </Box>

            {/* Social buttons */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
              {[
                { label: 'Google', Icon: GoogleIcon },
                { label: 'GitHub', Icon: GitHubIcon },
              ].map(({ label, Icon }) => (
                <Button
                  key={label}
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: 'rgba(180,205,235,0.5)',
                    bgcolor: '#ffffff',
                    color: '#111111',
                    borderRadius: '12px',
                    py: 1.25,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    gap: 1.5,
                    '&:hover': { bgcolor: '#f0f7ff', borderColor: `rgba(26,86,219,0.3)`, boxShadow: 'none' },
                    boxShadow: 'none',
                  }}
                  startIcon={<Icon />}
                >
                  {label}
                </Button>
              ))}
            </Box>

            {/* Sign in link */}
            <Typography sx={{ mt: 4, textAlign: 'center', color: 'rgba(30,30,60,0.7)', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: BLUE, fontWeight: 700, textDecoration: 'none' }}>
                Sign In
              </Link>
            </Typography>
          </Box>

          {/* Badge */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Chip
              icon={<AutoAwesomeIcon sx={{ fontSize: '14px !important', color: '#1444B0 !important' }} />}
              label="Join 15,000+ researchers globally"
              sx={{
                bgcolor: '#dbeafe',
                color: '#1e3a8a',
                fontWeight: 600,
                fontSize: '0.75rem',
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                '& .MuiChip-label': { px: 1.5 },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: { xs: 4, md: 5 },
          px: { xs: 3, md: 5 },
          bgcolor: '#f5f8ff',
          borderTop: '1px solid rgba(180,210,240,0.2)',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontFamily: 'Manrope, sans-serif', fontWeight: 700, color: '#111111', fontSize: '1rem' }}>
            roaar
          </Typography>
          <Typography sx={{ color: 'rgba(20,20,40,0.45)', fontSize: '0.875rem' }}>
            © 2024 roaar.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 4 }}>
          {['Privacy', 'Terms', 'Support'].map((link) => (
            <Typography
              key={link}
              component="a"
              href="#"
              sx={{ color: 'rgba(20,20,40,0.45)', fontSize: '0.875rem', textDecoration: 'none', '&:hover': { color: BLUE }, transition: 'color 0.15s' }}
            >
              {link}
            </Typography>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
