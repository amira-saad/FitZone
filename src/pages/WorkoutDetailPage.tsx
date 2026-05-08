import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hook'
import { completeWorkout } from '../store/Slices/progressSlice'
import { saveUserProgress, emptyUserProgress } from '../utils/userStorage'
import { getSingleWorkout, type WorkoutTemplate } from '../utils/workoutAdmin'
import { auth } from '../firebase'

const difficultyColor: Record<string, string> = {
  Beginner: 'text-green-400 bg-green-900/30 border-green-700/40',
  Intermediate: 'text-yellow-400 bg-yellow-900/30 border-yellow-700/40',
  Advanced: 'text-red-400 bg-red-900/30 border-red-700/40',
}

export default function WorkoutDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  
  const [workout, setWorkout] = useState<WorkoutTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)

  const userId = auth.currentUser?.uid || ''
  const progress = useAppSelector((state) =>
    userId ? state.progress.byUser[userId] || emptyUserProgress() : emptyUserProgress()
  )

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      
      // DIRECT FETCH from Firestore using the ID in the URL
      const data = await getSingleWorkout(id);
      
      if (data) {
        setWorkout(data);
        const already = progress.history.some(item => String(item.workoutId) === String(data.id));
        if (already) setDone(true);
      }
      setLoading(false);
    }
    load()
  }, [id, progress.history])

  const handleComplete = async () => {
    if (done || saving || !workout) return
    const user = auth.currentUser
    if (!user) return navigate('/login')

    setSaving(true)
    dispatch(completeWorkout({ id: workout.id, calories: workout.calories, userId: user.uid }))

    const updatedProgress = {
      workoutsCompleted: progress.workoutsCompleted + 1,
      caloriesBurned: progress.caloriesBurned + workout.calories,
      history: [
        ...progress.history,
        { workoutId: workout.id, calories: workout.calories, userId: user.uid, date: new Date().toISOString() },
      ],
    }

    try {
      await saveUserProgress(user.uid, updatedProgress)
      setDone(true)
      setTimeout(() => navigate('/progress'), 1500)
    } catch (err) {
      console.error('Save failed:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#090c10] flex items-center justify-center">
      <div className="text-[#4ade80] animate-pulse text-xl">Loading workout details...</div>
    </div>
  )

  if (!workout) return (
    <div className="min-h-screen bg-[#090c10] flex items-center justify-center text-white p-6">
      <div className="text-center">
        <p className="text-xl text-white/50 mb-4">Workout not found</p>
        <button onClick={() => navigate('/workouts')} className="px-6 py-2 bg-[#4ade80] text-black rounded-lg">Go Back</button>
      </div>
    </div>
  )

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <button onClick={() => navigate('/workouts')} className="text-white/40 hover:text-white text-sm mb-8 flex items-center gap-2">
        ← Back to Workouts
      </button>

      <div className="bg-[#161b22] border border-white/[0.08] rounded-3xl p-8 mb-6">
        <h1 className="font-display font-700 text-5xl text-white mb-4">{workout.title}</h1>
        <div className="flex flex-wrap gap-3">
          <span className={`text-sm px-3 py-1 rounded-full border ${difficultyColor[workout.level] || 'border-white/10'}`}>
            {workout.level}
          </span>
          <span className="text-sm px-3 py-1 rounded-full border border-white/10 text-white/50">⏱️ {workout.duration}</span>
          <span className="text-sm px-3 py-1 rounded-full border border-white/10 text-white/50">🔥 {workout.calories} kcal</span>
        </div>
      </div>

      <div className="bg-[#161b22] border border-white/[0.08] rounded-3xl p-8 mb-8">
        <h2 className="font-display font-700 text-2xl text-white mb-6">Workout Plan</h2>
        <div className="space-y-4">
          {workout.exercises && workout.exercises.length > 0 ? (
            workout.exercises.map((ex, i) => (
              <div key={i} className="flex items-center justify-between py-4 px-6 bg-[#0f1117] rounded-2xl border border-white/[0.03]">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-[#4ade80]/10 text-[#4ade80] flex items-center justify-center font-bold">{i + 1}</span>
                  <span className="text-white text-lg">{ex.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-[#4ade80] font-bold block">{ex.sets} sets</span>
                  <span className="text-white/40 text-sm">{ex.reps} reps</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-white/30 italic">No specific exercises listed for this workout.</p>
          )}
        </div>
      </div>

      {!done ? (
        <button onClick={handleComplete} disabled={saving} className="w-full py-5 bg-[#4ade80] text-black font-bold text-xl rounded-2xl hover:bg-[#22c55e] transition-all disabled:opacity-50">
          {saving ? 'Saving...' : 'Finish Workout'}
        </button>
      ) : (
        <div className="w-full py-5 bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80] font-bold text-xl rounded-2xl text-center">
          ✓ Workout Complete!
        </div>
      )}
    </main>
  )
}