import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from '../../firebase'
import { clsx } from 'clsx'

const links = [
  { to: '/workouts', label: 'Workouts' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/progress', label: 'Progress' },
]

interface NavbarProps {
  user: User | null
  userRole: 'admin' | 'user'  
}

export default function Navbar({ user, userRole }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const logout = async () => {
    await signOut(auth)
    navigate('/login')
  }

  const navLinks = user
    ? [{ to: '/dashboard', label: 'Dashboard' }, ...links]
    : links

  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#090c10]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#4ade80] rounded-lg flex items-center justify-center text-[#090c10] font-bold text-lg">
              ⚡
            </div>
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif' }}
              className="font-bold text-2xl tracking-tight text-white">
              Fit<span className="text-[#4ade80]">Zone</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map(({ to, label }) => (
              <Link key={to} to={to}
                className={clsx(
                  'px-5 py-2.5 rounded-lg text-base font-medium transition-colors',
                  pathname === to
                    ? 'text-[#4ade80] bg-[#4ade80]/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}>
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* ── ADMIN PANEL LINK (Moved out of dropdown) ── */}
            {user && userRole === 'admin' && (
              <Link 
                to="/admin" 
                className={clsx(
                  "px-4 py-2 rounded-xl text-sm font-bold border transition-all",
                  pathname === '/admin' 
                    ? "bg-[#4ade80] text-[#090c10] border-[#4ade80]" 
                    : "border-white/10 text-[#4ade80] hover:bg-[#4ade80]/10"
                )}
              >
                ⚙️ Admin Panel
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-[#4ade80] flex items-center justify-center text-[#090c10] font-bold text-sm">
                    {user.photoURL
                      ? <img src={user.photoURL} className="w-8 h-8 rounded-full" />
                      : user.email?.charAt(0).toUpperCase()
                    }
                  </div>
                  <span className="text-white/80 text-sm max-w-[120px] truncate">
                    {user.displayName || user.email}
                  </span>
                  <span className="text-white/40 text-xs">▾</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#161b22] border border-white/10 rounded-xl overflow-hidden shadow-xl">
                    <Link to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block px-4 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition">
                      👤 Profile
                    </Link>
                    <hr className="border-white/10" />
                    <button onClick={logout}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition">
                      🚪 Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login"
                  className="px-5 py-2.5 text-base font-medium text-white/60 hover:text-white transition-colors">
                  Sign in
                </Link>
                <Link to="/pricing"
                  className="px-6 py-2.5 bg-[#4ade80] text-[#090c10] text-base font-bold rounded-xl hover:bg-[#22c55e] transition-all"
                  style={{ fontFamily: 'Barlow Condensed, sans-serif' }}>
                  Join Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-white/60 hover:text-white text-2xl p-2"
            onClick={() => setOpen(!open)}>
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#090c10] px-6 pb-6 pt-3">
          {userRole === 'admin' && (
             <Link to="/admin" onClick={() => setOpen(false)}
             className="block px-4 py-3 text-[#4ade80] font-bold mb-2 border-b border-white/5">
             ⚙️ Admin Panel
           </Link>
          )}

          {navLinks.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setOpen(false)}
              className={clsx(
                'block px-4 py-3 rounded-lg text-base font-medium mb-1 transition-colors',
                pathname === to ? 'text-[#4ade80] bg-[#4ade80]/10' : 'text-white/60 hover:text-white'
              )}>
              {label}
            </Link>
          ))}

          {user ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)}
                className="block px-4 py-3 text-white/60 hover:text-white">
                👤 Profile
              </Link>
              <button onClick={logout}
                className="w-full text-left px-4 py-3 text-red-400 mt-2">
                🚪 Sign Out
              </button>
            </>
          ) : (
            <div className="flex gap-3 mt-4">
              <Link to="/login" onClick={() => setOpen(false)}
                className="flex-1 text-center py-3 border border-white/20 text-white rounded-xl text-base font-medium">
                Sign in
              </Link>
              <Link to="/pricing" onClick={() => setOpen(false)}
                className="flex-1 text-center py-3 bg-[#4ade80] text-[#090c10] rounded-xl text-base font-bold">
                Join Now
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}