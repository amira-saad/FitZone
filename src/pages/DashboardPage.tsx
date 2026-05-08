import { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { Link } from 'react-router-dom'
import { useAppSelector } from '../store/hook'
import { emptyUserProgress, readUserPlan } from '../utils/userStorage'

export default function DashboardPage() {
  const user = auth.currentUser
  const userId = user?.uid || ''
  const [plan, setPlan] = useState('free')
  const [planLoading, setPlanLoading] = useState(true)
  const progress = useAppSelector((state) =>
    userId ? state.progress.byUser[userId] || emptyUserProgress() : emptyUserProgress()
  )
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  useEffect(() => {
    let active = true
    if (!userId) {
      setPlan('free')
      setPlanLoading(false)
      return
    }
    setPlanLoading(true)
    void readUserPlan(userId).then((value) => {
      if (!active) return
      setPlan(value)
      setPlanLoading(false)
    })
    return () => {
      active = false
    }
  }, [userId])

  const name = user?.displayName || user?.email?.split('@')[0] || 'Athlete'

  return (
    <main className="max-w-7xl mx-auto px-6 py-12">

      {/* Welcome banner */}
      <div className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-8 mb-8">
        <p className="text-white/50 text-base mb-1">{greeting} 👋</p>
        <h1 className="font-display font-700 text-5xl text-white mb-2">
          Welcome back, <span className="text-[#4ade80]">{name}</span>
        </h1>
        <p className="text-white/40">Ready to crush today's workout?</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Current Plan', value: planLoading ? '...' : plan.toUpperCase(), color: 'text-[#4ade80]' },
          { label: 'Workouts Done', value: String(progress.workoutsCompleted), color: 'text-white' },
          { label: 'Day Streak', value: `${progress.workoutsCompleted} 🔥`, color: 'text-white' },
          { label: 'Calories Burned', value: `${progress.caloriesBurned} kcal`, color: 'text-white' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#161b22] border border-white/[0.08] rounded-xl p-5">
            <p className="text-white/40 text-sm mb-1">{label}</p>
            <p className={`font-display font-700 text-2xl ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid md:grid-cols-3 gap-5">
        <Link to="/workouts"
          className="bg-[#161b22] border border-white/[0.08] hover:border-[#4ade80]/30 rounded-2xl p-6 transition group">
          <div className="text-4xl mb-4">🏋️</div>
          <h3 className="font-display font-700 text-xl text-white group-hover:text-[#4ade80] transition mb-2">
            Browse Workouts
          </h3>
          <p className="text-white/40 text-sm">Find your next session</p>
        </Link>

        <Link to="/progress"
          className="bg-[#161b22] border border-white/[0.08] hover:border-[#4ade80]/30 rounded-2xl p-6 transition group">
          <div className="text-4xl mb-4">📈</div>
          <h3 className="font-display font-700 text-xl text-white group-hover:text-[#4ade80] transition mb-2">
            View Progress
          </h3>
          <p className="text-white/40 text-sm">Track your fitness journey</p>
        </Link>

        <Link to="/profile"
          className="bg-[#161b22] border border-white/[0.08] hover:border-[#4ade80]/30 rounded-2xl p-6 transition group">
          <div className="text-4xl mb-4">👤</div>
          <h3 className="font-display font-700 text-xl text-white group-hover:text-[#4ade80] transition mb-2">
            My Profile
          </h3>
          <p className="text-white/40 text-sm">Manage your account</p>
        </Link>
      </div>

      {/* Upgrade banner for free users */}
      {plan === 'free' && (
        <div className="mt-8 bg-[#4ade80]/5 border border-[#4ade80]/20 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h3 className="font-display font-700 text-xl text-white mb-1">
              Unlock the full FitZone experience 💪
            </h3>
            <p className="text-white/40 text-sm">
              Upgrade to Pro for unlimited workouts and AI plans
            </p>
          </div>
          <Link to="/pricing"
            className="px-6 py-3 bg-[#4ade80] text-[#090c10] font-bold rounded-xl hover:bg-[#22c55e] transition whitespace-nowrap">
            Upgrade Now
          </Link>
        </div>
      )}

    </main>
  )
}