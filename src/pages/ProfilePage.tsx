import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAppSelector } from "../store/hook";
import { emptyUserProgress, readUserPlan } from "../utils/userStorage";
import { readUserRole } from "../utils/workoutAdmin";

export default function Profile() {
  const user = auth.currentUser;
  const nav = useNavigate();
  const userId = user?.uid || "";
  const [plan, setPlan] = useState("free");
  const [planLoading, setPlanLoading] = useState(true);
  const [role, setRole] = useState<"admin" | "user">("user");
  const progress = useAppSelector((state) =>
    userId ? state.progress.byUser[userId] || emptyUserProgress() : emptyUserProgress()
  );

  useEffect(() => {
    let active = true;
    if (!userId) {
      setPlan("free");
      setPlanLoading(false);
      return;
    }
    setPlanLoading(true);
    void readUserPlan(userId).then((value) => {
      if (!active) return;
      setPlan(value);
      setPlanLoading(false);
    });
    return () => {
      active = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setRole("user");
      return;
    }
    void readUserRole(userId).then((nextRole) => setRole(nextRole));
  }, [userId]);

  const logout = async () => {
    await signOut(auth);
    nav("/login");
  };

  const joinedAt = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Unknown";

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 text-white">
      <div className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-8 mb-6">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <p className="text-white/50 text-sm">Account</p>
            <h1 className="font-display font-700 text-4xl mt-1">
              My <span className="text-[#4ade80]">Profile</span>
            </h1>
            <p className="text-white/50 mt-2">{user?.email || "No email available"}</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-[#4ade80]/15 text-[#4ade80] text-2xl font-bold flex items-center justify-center">
            {(user?.displayName || user?.email || "A").charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#161b22] border border-white/[0.08] rounded-xl p-5">
          <p className="text-white/40 text-sm mb-1">Current Plan</p>
          <p className="font-display font-700 text-2xl text-[#4ade80]">
            {planLoading ? "..." : plan.toUpperCase()}
          </p>
        </div>
        <div className="bg-[#161b22] border border-white/[0.08] rounded-xl p-5">
          <p className="text-white/40 text-sm mb-1">Workouts Done</p>
          <p className="font-display font-700 text-2xl">{progress.workoutsCompleted}</p>
        </div>
        <div className="bg-[#161b22] border border-white/[0.08] rounded-xl p-5">
          <p className="text-white/40 text-sm mb-1">Calories Burned</p>
          <p className="font-display font-700 text-2xl">{progress.caloriesBurned} kcal</p>
        </div>
      </div>

      <div className="bg-[#161b22] border border-white/[0.08] rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Account Details</h2>
        <div className="space-y-4">
          <div>
            <p className="text-white/50 text-sm">Joined</p>
            <p className="text-white">{joinedAt}</p>
          </div>
          <div>
            <p className="text-white/50 text-sm">User ID</p>
            <p className="text-sm break-all text-white/80">{user?.uid}</p>
          </div>
          <div>
            <p className="text-white/50 text-sm">Role</p>
            <p className="text-white uppercase">{role}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/pricing"
          className="px-5 py-3 bg-[#4ade80] text-[#090c10] font-bold rounded-xl hover:bg-[#22c55e] transition"
        >
          Manage Plan
        </Link>
        <Link
          to="/progress"
          className="px-5 py-3 border border-white/20 rounded-xl hover:bg-white/5 transition"
        >
          View Progress
        </Link>
        {role === "admin" && (
          <Link
            to="/admin/workouts"
            className="px-5 py-3 border border-white/20 rounded-xl hover:bg-white/5 transition"
          >
            Admin Workouts
          </Link>
        )}
        <button
          onClick={logout}
          className="px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl"
        >
          Sign Out
        </button>
      </div>
    </main>
  );
}