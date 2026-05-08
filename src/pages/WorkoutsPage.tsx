import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { getUserWorkouts, type WorkoutTemplate } from '../utils/workoutAdmin'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { completeWorkout } from '../store/Slices/progressSlice'
import { saveUserProgress, emptyUserProgress } from '../utils/userStorage'

const difficultyColor: Record<string, string> = {
  Beginner: 'text-green-400 bg-green-900/30 border-green-700/40',
  Intermediate: 'text-yellow-400 bg-yellow-900/30 border-yellow-700/40',
  Advanced: 'text-red-400 bg-red-900/30 border-red-700/40',
}

const emojiMap: Record<string, string> = {
  Beginner: '🚶',
  Intermediate: '🏋️',
  Advanced: '🔥',
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<WorkoutTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')
  const [completing, setCompleting] = useState<string | null>(null)

  const filters = ['All', 'Beginner', 'Intermediate', 'Advanced']
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const userId = auth.currentUser?.uid || ''
  const progress = useAppSelector((state) =>
    userId
      ? state.progress.byUser[userId] || emptyUserProgress()
      : emptyUserProgress()
  )

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const uid = user?.uid || ''
      getUserWorkouts(uid).then((data) => {
        setWorkouts(data)
        setLoading(false)
      })
    })
    return () => unsubscribe()
  }, [])

  const isCompleted = (workoutId: string) =>
    progress.history.some(
      (item) => String(item.workoutId) === String(workoutId)
    )

  const handleComplete = async (workout: WorkoutTemplate) => {
    const user = auth.currentUser
    if (!user) {
      alert('Please login first')
      navigate('/login')
      return
    }

    if (isCompleted(workout.id)) {
      alert('You already completed this workout!')
      return
    }

    setCompleting(workout.id)

    // update Redux
    dispatch(completeWorkout({
      id: workout.id,
      calories: workout.calories,
      userId: user.uid,
    }))

    // build updated progress
    const updatedProgress = {
      workoutsCompleted: progress.workoutsCompleted + 1,
      caloriesBurned: progress.caloriesBurned + workout.calories,
      history: [
        ...progress.history,
        {
          workoutId: workout.id,
          calories: workout.calories,
          userId: user.uid,
          date: new Date().toISOString(),
        },
      ],
    }

    // save to Firestore + localStorage
    try {
      await saveUserProgress(user.uid, updatedProgress)
    } catch (err) {
      console.error('Save failed:', err)
    }

    setCompleting(null)
  }

  const filtered = filter === 'All'
    ? workouts
    : workouts.filter(w => w.level === filter)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[#4ade80] text-xl animate-pulse">
          Loading workouts...
        </div>
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">

      {/* Header */}
      <div className="mb-12">
        <span className="text-[#4ade80] text-sm font-medium tracking-widest uppercase">
          Training Library
        </span>
        <h1 className="font-display font-700 text-6xl text-white mt-2 mb-4">
          Your <span className="text-[#4ade80]">Workouts</span>
        </h1>
        <p className="text-white/50 text-lg">
          {auth.currentUser
            ? 'Your assigned workout programs'
            : 'Browse all workout programs'}
        </p>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-3 flex-wrap mb-10">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
              filter === f
                ? 'bg-[#4ade80] text-[#090c10] border-[#4ade80]'
                : 'border-white/10 text-white/50 hover:text-white hover:border-white/30'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Workout Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">😅</div>
          <p className="text-white/30 text-lg">No workouts found.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(workout => {
            const done = isCompleted(workout.id)
            const isBeingCompleted = completing === workout.id

            return (
              <div
                key={workout.id}
                className={`group bg-[#161b22] border rounded-2xl overflow-hidden transition-all ${
                  done
                    ? 'border-[#4ade80]/40'
                    : 'border-white/[0.08] hover:border-[#4ade80]/30 hover:-translate-y-1'
                }`}
              >
                {/* Card top */}
                <div className="h-32 bg-[#0f1117] flex items-center justify-center text-6xl relative">
                  {emojiMap[workout.level] || '💪'}
                  {/* completed badge */}
                  {done && (
                    <div className="absolute top-3 right-3 bg-[#4ade80] text-[#090c10] text-xs font-bold px-2 py-1 rounded-full">
                      ✅ Done
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-5">
                  <h3 className={`font-display font-700 text-xl mb-3 transition-colors ${
                    done ? 'text-[#4ade80]' : 'text-white group-hover:text-[#4ade80]'
                  }`}>
                    {workout.title}
                  </h3>

                  {/* Pills */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${
                      difficultyColor[workout.level] || 'text-white/50 border-white/10'
                    }`}>
                      {workout.level}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-white/50">
                      {workout.duration}
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-white/50">
                      🔥 {workout.calories} kcal
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    {/* View Details */}
                    <Link
                      to={`/workouts/${workout.id}`}
                      className="flex-1 text-center py-2.5 border border-white/10 text-white/60 hover:text-white hover:border-white/30 rounded-xl text-sm font-medium transition"
                    >
                      View Details
                    </Link>

                    {/* Mark Complete */}
                    <button
                      onClick={() => handleComplete(workout)}
                      disabled={done || isBeingCompleted}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition ${
                        done
                          ? 'bg-[#4ade80]/10 text-[#4ade80] cursor-default'
                          : isBeingCompleted
                          ? 'bg-[#4ade80]/50 text-[#090c10] cursor-wait'
                          : 'bg-[#4ade80] text-[#090c10] hover:bg-[#22c55e]'
                      }`}
                    >
                      {done ? '✅ Done' : isBeingCompleted ? 'Saving...' : 'Complete'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

    </main>
  )
}