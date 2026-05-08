import { useEffect, useState } from "react";
import {
  assignWorkoutToUser,
  createWorkoutTemplate,
  getWorkoutTemplates,
  type WorkoutTemplate,
} from "../utils/workoutAdmin";

export default function AdminWorkoutsPage() {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [title, setTitle] = useState("");
  const [level, setLevel] = useState("Beginner");
  const [duration, setDuration] = useState("30 min");
  const [calories, setCalories] = useState("200");
  const [targetUserId, setTargetUserId] = useState("");
  const [targetTemplateId, setTargetTemplateId] = useState("");

  const loadTemplates = async () => {
    const list = await getWorkoutTemplates();
    setTemplates(list);
    if (!targetTemplateId && list.length > 0) setTargetTemplateId(list[0].id);
  };

  useEffect(() => {
    void loadTemplates();
  }, []);
  return (
    <main className="max-w-5xl mx-auto px-6 py-12 text-white">
      <h1 className="text-4xl font-bold mb-8">
        Admin <span className="text-[#4ade80]">Workouts</span>
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Create Template</h2>
          <div className="space-y-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Workout title"
              className="w-full p-3 rounded-lg bg-[#0f1117] border border-white/10"
            />
            <input
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              placeholder="Level"
              className="w-full p-3 rounded-lg bg-[#0f1117] border border-white/10"
            />
            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Duration (e.g. 30 min)"
              className="w-full p-3 rounded-lg bg-[#0f1117] border border-white/10"
            />
            <input
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="Calories"
              className="w-full p-3 rounded-lg bg-[#0f1117] border border-white/10"
            />
            <button
              onClick={async () => {
                if (!title.trim()) return;
                await createWorkoutTemplate({
                  title: title.trim(),
                  level: level.trim() || "Beginner",
                  duration: duration.trim() || "30 min",
                  calories: Number(calories || 200),
                });
                setTitle("");
                await loadTemplates();
              }}
              className="px-5 py-3 bg-[#4ade80] text-[#090c10] font-bold rounded-xl"
            >
              Add Template
            </button>
          </div>
        </section>

        <section className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Assign to User</h2>
          <div className="space-y-3">
            <input
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              placeholder="Target user uid"
              className="w-full p-3 rounded-lg bg-[#0f1117] border border-white/10"
            />
            <select
              value={targetTemplateId}
              onChange={(e) => setTargetTemplateId(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#0f1117] border border-white/10"
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
            <button
              onClick={async () => {
                if (!targetUserId || !targetTemplateId) return;
                await assignWorkoutToUser(targetUserId.trim(), targetTemplateId);
                alert("Workout assigned");
              }}
              className="px-5 py-3 bg-[#4ade80] text-[#090c10] font-bold rounded-xl"
            >
              Assign Workout
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
