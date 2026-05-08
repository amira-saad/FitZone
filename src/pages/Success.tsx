import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth } from "../firebase";
import { saveUserPlan } from "../utils/userStorage";

export default function Success() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    const plan = params.get("plan");
    const userId = auth.currentUser?.uid;

    if (userId && plan) {
      void saveUserPlan(userId, plan);
    }

    
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  }, [navigate, params]);

  return (
    <div className="min-h-screen bg-[#090c10] text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-[#4ade80]">
        Payment Successful 🎉
      </h1>

      <p className="text-white/60 mt-3">
        Setting up your account...
      </p>
    </div>
  );
}