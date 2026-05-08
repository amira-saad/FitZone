// import { useEffect, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { auth } from '../firebase'
// import {
//   readUserRole,
//   getWorkoutTemplates,
//   createWorkoutTemplate,
//   assignWorkoutToUser,
//   type WorkoutTemplate,
//   getUserIdByEmail,
// } from '../utils/workoutAdmin'

// export default function AdminPage() {
//   const navigate = useNavigate()

//   // access control
//   const [role, setRole] = useState<'admin' | 'user' | null>(null)
//   const [loading, setLoading] = useState(true)

//   // workouts list
//   const [templates, setTemplates] = useState<WorkoutTemplate[]>([])

//   // new workout form
//   const [title, setTitle] = useState('')
//   const [level, setLevel] = useState('Beginner')
//   const [duration, setDuration] = useState('')
//   const [calories, setCalories] = useState('')
//   const [adding, setAdding] = useState(false)
//   const [successMsg, setSuccessMsg] = useState('')

//   // assign workout to user
//   const [assignEmail, setAssignEmail] = useState('')
//   const [assignTemplateId, setAssignTemplateId] = useState('')
//   const [assigning, setAssigning] = useState(false)
// const [exercises, setExercises] = useState<{name: string, sets: number, reps: number}[]>([]);
// const [exName, setExName] = useState('');
// const [exSets, setExSets] = useState('3');
// const [exReps, setExReps] = useState('12');

// const addExerciseToLocalList = () => {
//   if (!exName) return;
//   setExercises([...exercises, { name: exName, sets: Number(exSets), reps: Number(exReps) }]);
//   setExName('');
// };
//   useEffect(() => {
//   const init = async () => {
//     const user = auth.currentUser
    
//     // DEBUG
//     console.log('=== Admin Check ===')
//     console.log('currentUser:', user)
//     console.log('uid:', user?.uid)
    
//     if (!user) {
//       console.log('No user - redirecting to login')
//       navigate('/login')
//       return
//     }

//     const userRole = await readUserRole(user.uid)
//     console.log('userRole returned:', userRole)

//     setRole(userRole)

//     if (userRole !== 'admin') {
//       console.log('Not admin - redirecting to dashboard')
//       navigate('/dashboard')
//       return
//     }

//     console.log('IS ADMIN - loading templates')
//     const data = await getWorkoutTemplates()
//     setTemplates(data)
//     setLoading(false)
//   }

//   init()
// }, [])

//   const handleAddWorkout = async () => {
//     if (!title || !duration || !calories) {
//       alert('Please fill all fields')
//       return
//     }

//     setAdding(true)
//     try {
//       await createWorkoutTemplate({
//         title,
//         level,
//         duration,
//         calories: Number(calories),
//         exercises,
//       })

//       setSuccessMsg(`Workout "${title}" added successfully!`)
//       setTitle('')
//       setDuration('')
//       setCalories('')
//       setLevel('Beginner')

//       // refresh list
//       const updated = await getWorkoutTemplates()
//       setTemplates(updated)

//       setTimeout(() => setSuccessMsg(''), 3000)
//     } catch (err) {
//       alert('Failed to add workout')
//     }
//     setAdding(false)
//   }

//   const handleAssign = async () => {
//   if (!assignEmail || !assignTemplateId) {
//     alert('Please enter both User Email and select a workout')
//     return
//   }

//   setAssigning(true)
//   try {
//     const foundUserId = await getUserIdByEmail(assignEmail)
    
//     if (!foundUserId) {
//       alert(`No user found with email: ${assignEmail}`)
//       setAssigning(false)  // ← was missing!
//       return
//     }

//     await assignWorkoutToUser(foundUserId, assignTemplateId)
//     alert(`Workout assigned successfully!`)
//     setAssignEmail('')
//     setAssignTemplateId('')
//   } catch (err) {
//     alert('Failed to assign workout')
//   }
//   setAssigning(false)
// }

//   // loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[#090c10] flex items-center justify-center">
//         <div className="text-[#4ade80] text-xl animate-pulse">
//           Checking admin access...
//         </div>
//       </div>
//     )
//   }

//   // not admin
//   if (role !== 'admin') {
//     return (
//       <div className="min-h-screen bg-[#090c10] flex items-center justify-center text-white">
//         <div className="text-center">
//           <div className="text-6xl mb-4">🚫</div>
//           <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
//           <p className="text-white/50">You are not an admin.</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <main className="max-w-5xl mx-auto px-6 py-16">

//       {/* Header */}
//       <div className="mb-10">
//         <span className="text-[#4ade80] text-sm font-medium tracking-widest uppercase">
//           Admin Panel
//         </span>
//         <h1 className="font-display font-700 text-6xl text-white mt-2">
//           Manage <span className="text-[#4ade80]">Workouts</span>
//         </h1>
//         <p className="text-white/40 mt-2">
//           Add workout templates and assign them to users.
//         </p>
//       </div>

//       <div className="grid md:grid-cols-2 gap-8">

//         {/* LEFT — Add New Workout */}
//         <div className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-8">
//           <h2 className="font-display font-700 text-2xl text-white mb-6">
//             Add New Workout
//           </h2>

//           {/* Success message */}
//           {successMsg && (
//             <div className="mb-4 px-4 py-3 bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80] rounded-xl text-sm">
//               {successMsg}
//             </div>
//           )}

//           <div className="space-y-4">
//             {/* Title */}
//             <div>
//               <label className="text-white/50 text-sm mb-1 block">
//                 Workout Title
//               </label>
//               <input
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="e.g. Push Day"
//                 className="w-full px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-[#4ade80]/50"
//               />
//             </div>

//             {/* Level */}
//             <div>
//               <label className="text-white/50 text-sm mb-1 block">
//                 Difficulty Level
//               </label>
//               <select
//                 value={level}
//                 onChange={(e) => setLevel(e.target.value)}
//                 className="w-full px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#4ade80]/50"
//               >
//                 <option value="Beginner">Beginner</option>
//                 <option value="Intermediate">Intermediate</option>
//                 <option value="Advanced">Advanced</option>
//               </select>
//             </div>

//             {/* Duration */}
//             <div>
//               <label className="text-white/50 text-sm mb-1 block">
//                 Duration
//               </label>
//               <input
//                 value={duration}
//                 onChange={(e) => setDuration(e.target.value)}
//                 placeholder="e.g. 45 min"
//                 className="w-full px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-[#4ade80]/50"
//               />
//             </div>

//             {/* Calories */}
//             <div>
//               <label className="text-white/50 text-sm mb-1 block">
//                 Calories Burned
//               </label>
//               <input
//                 value={calories}
//                 onChange={(e) => setCalories(e.target.value)}
//                 type="number"
//                 placeholder="e.g. 320"
//                 className="w-full px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-[#4ade80]/50"
//               />
//             </div>

//             <button
//               onClick={handleAddWorkout}
//               disabled={adding}
//               className="w-full py-4 bg-[#4ade80] text-[#090c10] font-display font-700 text-lg rounded-xl hover:bg-[#22c55e] transition disabled:opacity-60"
//             >
//               {adding ? 'Adding...' : 'Add Workout'}
//             </button>
//           </div>
//         </div>

//         {/* RIGHT — Assign Workout to User */}
//         <div className="space-y-6">

//           {/* Assign form */}
//           <div className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-8">
//             <h2 className="font-display font-700 text-2xl text-white mb-6">
//               Assign to User
//             </h2>

//             <div className="space-y-4">
//               {/* User ID input */}
//               <div>
//                 <label className="text-white/50 text-sm mb-1 block">
//                    User Email
//                 </label>
//                 <input
//                   value={assignEmail}
//                   onChange={(e) => setAssignEmail(e.target.value)}
//                   placeholder="Enter user email"
//                   type='email'
//                   className="w-full px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-[#4ade80]/50 font-mono text-sm"
//                 />
//               </div>

//               {/* Workout select */}
//               <div>
//                 <label className="text-white/50 text-sm mb-1 block">
//                   Select Workout
//                 </label>
//                 <select
//                   value={assignTemplateId}
//                   onChange={(e) => setAssignTemplateId(e.target.value)}
//                   className="w-full px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#4ade80]/50"
//                 >
//                   <option value="">-- Choose a workout --</option>
//                   {templates.map((t) => (
//                     <option key={t.id} value={t.id}>
//                       {t.title} ({t.level})
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <button
//                 onClick={handleAssign}
//                 disabled={assigning}
//                 className="w-full py-4 border border-[#4ade80] text-[#4ade80] font-display font-700 text-lg rounded-xl hover:bg-[#4ade80]/10 transition disabled:opacity-60"
//               >
//                 {assigning ? 'Assigning...' : 'Assign Workout'}
//               </button>
//             </div>
//           </div>

//           {/* Your UID helper */}
//           <div className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-6">
//             <p className="text-white/40 text-sm mb-2">Your Admin UID</p>
//             <p className="text-[#4ade80] font-mono text-xs break-all">
//               {auth.currentUser?.uid}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* Workout Templates List */}
//       <div className="mt-10 bg-[#161b22] border border-white/[0.08] rounded-2xl p-8">
//         <h2 className="font-display font-700 text-2xl text-white mb-6">
//           All Workout Templates ({templates.length})
//         </h2>

//         {templates.length === 0 ? (
//           <p className="text-white/30 text-center py-8">
//             No templates yet. Add one above!
//           </p>
//         ) : (
//           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {templates.map((t) => (
//               <div
//                 key={t.id}
//                 className="bg-[#0f1117] border border-white/[0.05] rounded-xl p-5"
//               >
//                 <h3 className="font-display font-700 text-lg text-white mb-2">
//                   {t.title}
//                 </h3>
//                 <div className="flex flex-wrap gap-2 mb-3">
//                   <span className="text-xs px-2 py-1 rounded-full bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20">
//                     {t.level}
//                   </span>
//                   <span className="text-xs px-2 py-1 rounded-full border border-white/10 text-white/40">
//                     {t.duration}
//                   </span>
//                   <span className="text-xs px-2 py-1 rounded-full border border-white/10 text-white/40">
//                     {t.calories} kcal
//                   </span>
//                 </div>
//                 <p className="text-white/20 text-xs font-mono">
//                   ID: {t.id}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//     </main>
//   )
// }
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import {
  readUserRole,
  getWorkoutTemplates,
  createWorkoutTemplate,
  assignWorkoutToUser,
  type WorkoutTemplate,
  getUserIdByEmail,
} from '../utils/workoutAdmin'

export default function AdminPage() {
  const navigate = useNavigate()

  // access control
const [_role, setRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true)

  // workouts list
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([])

  // new workout form
  const [title, setTitle] = useState('')
  const [level, setLevel] = useState('Beginner')
  const [duration, setDuration] = useState('')
  const [calories, setCalories] = useState('')
  const [adding, setAdding] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  // Exercises sub-form state
  const [exercises, setExercises] = useState<{ name: string; sets: number; reps: number }[]>([])
  const [exName, setExName] = useState('')
  const [exSets, setExSets] = useState('3')
  const [exReps, setExReps] = useState('12')

  // assign workout to user
  const [assignEmail, setAssignEmail] = useState('')
  const [assignTemplateId, setAssignTemplateId] = useState('')
  const [assigning, setAssigning] = useState(false)

  useEffect(() => {
    const init = async () => {
      const user = auth.currentUser
      if (!user) {
        navigate('/login')
        return
      }

      const userRole = await readUserRole(user.uid)
      setRole(userRole)

      if (userRole !== 'admin') {
        navigate('/dashboard')
        return
      }

      const data = await getWorkoutTemplates()
      setTemplates(data)
      setLoading(false)
    }
    init()
  }, [navigate])

  const addExerciseToLocalList = () => {
    if (!exName.trim()) return
    setExercises([...exercises, { 
        name: exName.trim(), 
        sets: Number(exSets), 
        reps: Number(exReps) 
    }])
    setExName('') 
  }

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index))
  }

  const handleAddWorkout = async () => {
    if (!title || !duration || !calories) {
      alert('Please fill all main fields')
      return
    }
    if (exercises.length === 0) {
      alert('Please add at least one exercise')
      return
    }

    setAdding(true)
    try {
      await createWorkoutTemplate({
        title,
        level,
        duration,
        calories: Number(calories),
        exercises, 
      })

      setSuccessMsg(`Workout "${title}" added successfully!`)
      // Reset Form
      setTitle('')
      setDuration('')
      setCalories('')
      setLevel('Beginner')
      setExercises([])

      const updated = await getWorkoutTemplates()
      setTemplates(updated)
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      alert('Failed to add workout')
    }
    setAdding(false)
  }

  const handleAssign = async () => {
    if (!assignEmail || !assignTemplateId) {
      alert('Please enter both User Email and select a workout')
      return
    }
    setAssigning(true)
    try {
      const foundUserId = await getUserIdByEmail(assignEmail)
      if (!foundUserId) {
        alert(`No user found with email: ${assignEmail}`)
        setAssigning(false)
        return
      }
      await assignWorkoutToUser(foundUserId, assignTemplateId)
      alert(`Workout assigned successfully!`)
      setAssignEmail('')
      setAssignTemplateId('')
    } catch (err) {
      alert('Failed to assign workout')
    }
    setAssigning(false)
  }

  if (loading) return (
    <div className="min-h-screen bg-[#090c10] flex items-center justify-center">
      <div className="text-[#4ade80] text-xl animate-pulse">Checking admin access...</div>
    </div>
  )

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-10">
        <span className="text-[#4ade80] text-sm font-medium uppercase tracking-widest">Admin Panel</span>
        <h1 className="font-display font-700 text-6xl text-white mt-2">Manage <span className="text-[#4ade80]">Workouts</span></h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ADD WORKOUT FORM */}
        <div className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-8">
          <h2 className="font-display font-700 text-2xl text-white mb-6">Add New Workout</h2>
          
          {successMsg && <div className="mb-4 px-4 py-3 bg-[#4ade80]/10 border border-[#4ade80]/30 text-[#4ade80] rounded-xl text-sm">{successMsg}</div>}

          <div className="space-y-4">
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Workout Title" className="w-full px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl text-white" />
            
            <div className="grid grid-cols-2 gap-4">
               <select value={level} onChange={(e) => setLevel(e.target.value)} className="px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl text-white">
                 <option value="Beginner">Beginner</option>
                 <option value="Intermediate">Intermediate</option>
                 <option value="Advanced">Advanced</option>
               </select>
               <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Duration (e.g. 45 min)" className="px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl text-white" />
            </div>

            <input value={calories} onChange={(e) => setCalories(e.target.value)} type="number" placeholder="Calories Burned" className="w-full px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl text-white" />

            {/* EXERCISES SUB-SECTION */}
            <div className="pt-4 border-t border-white/5">
              <h3 className="text-white/70 text-sm font-bold mb-3 uppercase tracking-wider">Add Exercises</h3>
              
              <div className="space-y-2 mb-4">
                {exercises.map((ex, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-[#0f1117] p-3 rounded-lg border border-white/5">
                    <span className="text-white text-sm">{ex.name} — <span className="text-[#4ade80]">{ex.sets}x{ex.reps}</span></span>
                    <button onClick={() => removeExercise(idx)} className="text-red-500 text-xs hover:underline">Remove</button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input value={exName} onChange={(e) => setExName(e.target.value)} placeholder="Exercise Name" className="flex-1 px-3 py-2 bg-[#0f1117] border border-white/10 rounded-lg text-sm text-white" />
                <input value={exSets} onChange={(e) => setExSets(e.target.value)} type="number" className="w-16 px-3 py-2 bg-[#0f1117] border border-white/10 rounded-lg text-sm text-white" />
                <input value={exReps} onChange={(e) => setExReps(e.target.value)} type="number" className="w-16 px-3 py-2 bg-[#0f1117] border border-white/10 rounded-lg text-sm text-white" />
                <button onClick={addExerciseToLocalList} type="button" className="px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 text-sm">+</button>
              </div>
            </div>

            <button onClick={handleAddWorkout} disabled={adding} className="w-full py-4 bg-[#4ade80] text-[#090c10] font-display font-700 text-lg rounded-xl hover:bg-[#22c55e] transition disabled:opacity-60">
              {adding ? 'Adding...' : 'Add Workout Template'}
            </button>
          </div>
        </div>

        {/* ASSIGN SECTION */}
        <div className="space-y-6">
          <div className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-8">
            <h2 className="font-display font-700 text-2xl text-white mb-6">Assign to User</h2>
            <div className="space-y-4">
              <input value={assignEmail} onChange={(e) => setAssignEmail(e.target.value)} placeholder="User Email" type='email' className="w-full px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl text-white font-mono text-sm" />
              <select value={assignTemplateId} onChange={(e) => setAssignTemplateId(e.target.value)} className="w-full px-4 py-3 bg-[#0f1117] border border-white/10 rounded-xl text-white">
                <option value="">-- Choose a workout --</option>
                {templates.map((t) => <option key={t.id} value={t.id}>{t.title} ({t.level})</option>)}
              </select>
              <button onClick={handleAssign} disabled={assigning} className="w-full py-4 border border-[#4ade80] text-[#4ade80] font-display font-700 text-lg rounded-xl hover:bg-[#4ade80]/10 transition">
                {assigning ? 'Assigning...' : 'Assign Workout'}
              </button>
            </div>
          </div>
        </div>
        
      </div>
      {/* Workout Templates List */}
<div className="mt-10 bg-[#161b22] border border-white/[0.08] rounded-2xl p-8">
  <h2 className="font-display font-700 text-2xl text-white mb-6">
    All Workout Templates ({templates.length})
  </h2>

  {templates.length === 0 ? (
    <p className="text-white/30 text-center py-8">
      No templates yet. Add one above!
    </p>
  ) : (
    <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6">
      {templates.map((t) => (
        <div
          key={t.id}
          className="bg-[#0f1117] border border-white/[0.05] rounded-xl p-6 flex flex-col"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-display font-700 text-xl text-white">
                {t.title}
              </h3>
              <p className="text-white/20 text-xs font-mono">ID: {t.id}</p>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20">
              {t.level}
            </span>
          </div>

          <div className="flex gap-4 mb-4">
            <div className="text-white/40 text-sm">
              <span className="block text-white font-medium">{t.duration}</span>
              Duration
            </div>
            <div className="text-white/40 text-sm">
              <span className="block text-white font-medium">{t.calories} kcal</span>
              Burn
            </div>
          </div>

          {/* Display Exercises inside the card */}
          {t.exercises && t.exercises.length > 0 && (
            <div className="mt-2 pt-4 border-t border-white/5">
              <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2 font-bold">
                Exercises
              </p>
              <div className="space-y-1">
                {t.exercises.map((ex, i) => (
                  <div key={i} className="text-xs text-white/60 flex justify-between">
                    <span>{ex.name}</span>
                    <span className="text-[#4ade80]">{ex.sets}x{ex.reps}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )}
</div>
    </main>
  )
}