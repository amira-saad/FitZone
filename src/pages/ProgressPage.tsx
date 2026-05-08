import { useAppSelector } from '../store/hook'
import { useAppDispatch } from '../store/hook'
import { removeWorkoutFromHistory, resetProgress } from '../store/Slices/progressSlice'
import { Link } from 'react-router-dom'
import { auth } from '../firebase'
import { emptyUserProgress } from '../utils/userStorage'

export default function ProgressPage() {
  const currentUserId = auth.currentUser?.uid
  const userProgress = useAppSelector((state) => {
    if (!currentUserId) return emptyUserProgress()
    return state.progress.byUser[currentUserId] || emptyUserProgress()
  })
  const { workoutsCompleted, caloriesBurned, history } = userProgress
  const dispatch = useAppDispatch()

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">

      {/* Header */}
      <div className="mb-10">
        <span className="text-[#4ade80] text-sm font-medium tracking-widest uppercase">
          Your Journey
        </span>
        <h1 className="font-display font-700 text-6xl text-white mt-2">
          Progress <span className="text-[#4ade80]">Tracker</span>
        </h1>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-10">
        <div className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-6">
          <p className="text-white/40 text-sm mb-2">Workouts Done</p>
          <p className="font-display font-700 text-5xl text-[#4ade80]">
            {workoutsCompleted}
          </p>
        </div>

        <div className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-6">
          <p className="text-white/40 text-sm mb-2">Calories Burned</p>
          <p className="font-display font-700 text-5xl text-[#4ade80]">
            {caloriesBurned}
          </p>
          <p className="text-white/30 text-xs mt-1">kcal</p>
        </div>

        <div className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-6">
          <p className="text-white/40 text-sm mb-2">Day Streak</p>
          <p className="font-display font-700 text-5xl text-white">
            {workoutsCompleted > 0 ? `${workoutsCompleted} 🔥` : '0'}
          </p>
        </div>
      </div>

      {/* History */}
      <div className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-8 mb-6">
        <h2 className="font-display font-700 text-2xl text-white mb-6">
          Workout History
        </h2>

        {history.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🏋️</div>
            <p className="text-white/30 text-lg">No workouts yet.</p>
            <Link
              to="/workouts"
              className="inline-block mt-4 px-6 py-3 bg-[#4ade80] text-[#090c10] font-bold rounded-xl hover:bg-[#22c55e] transition"
            >
              Start Your First Workout
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item, i) => (
              <div
                key={`${item.date}-${i}`}
                className="flex items-center justify-between py-4 px-5 bg-[#0f1117] rounded-xl border border-white/[0.05]"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">🏋️</span>
                  <div>
                    <p className="text-white font-medium">
                      Workout #{item.workoutId}
                    </p>
                    <p className="text-white/30 text-xs">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#4ade80] font-medium text-sm">
                    🔥 {item.calories} kcal
                  </span>
                  <button
                    onClick={() =>
                      dispatch(removeWorkoutFromHistory({ userId: currentUserId, index: i }))
                    }
                    className="px-3 py-1 text-xs border border-red-500/40 text-red-300 rounded-lg hover:bg-red-500/10 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reset button */}
      {history.length > 0 && (
        <button
          onClick={() => dispatch(resetProgress({ userId: currentUserId }))}
          className="px-6 py-3 border border-red-500/30 text-red-400 rounded-xl hover:bg-red-500/10 transition text-sm"
        >
          Reset Progress
        </button>
      )}

    </main>
  )
}