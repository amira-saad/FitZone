import { useNavigate } from "react-router-dom";
import { clsx } from "clsx";
import { auth } from "../firebase";
import { saveUserPlan } from "../utils/userStorage";

const plans = [
  {
    name: "Basic",
    price: "$0",
    desc: "For beginners starting their journey",
    features: ["Access to basic workouts", "Limited progress tracking"],
    link: null,
  },
  {
    name: "Pro",
    price: "400 EGP/mo",
    popular: true,
    link: import.meta.env.VITE_STRIPE_PRO_LINK,
    desc: "Best for consistent training",
    features: [
      "All workouts access",
      "Progress tracking",
      "Workout plans",
    ],
  },
  {
    name: "Premium",
    price: "700 EGP/mo",
    link: import.meta.env.VITE_STRIPE_PREMIUM_LINK,
    desc: "Advanced features & coaching",
    features: [
      "Everything in Pro",
      "Personal coach",
      "Custom workout plans",
    ],
  },
]

export default function PricingPage() {
  const navigate = useNavigate();

  const applyPlan = (planName: string) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return false;
    void saveUserPlan(userId, planName.toLowerCase());
    return true;
  };

  return (
    <div className="bg-[#090c10] min-h-screen text-white px-6 py-12">

      {/* Title */}
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold">
          Simple <span className="text-[#4ade80]">Pricing</span>
        </h1>
        <p className="text-white/60 mt-3">
          Choose the plan that fits your fitness goals
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={clsx(
              "rounded-2xl p-6 border transition relative",
              plan.popular
                ? "border-[#4ade80] bg-[#4ade80]/5"
                : "border-white/[0.08] bg-white/[0.03]"
            )}
          >
            {/* Popular badge */}
            {plan.popular && (
              <span className="absolute top-4 right-4 text-xs bg-[#4ade80] text-[#090c10] px-3 py-1 rounded-full font-bold">
                Most Popular
              </span>
            )}

            <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
            <p className="text-white/60 text-sm mb-4">{plan.desc}</p>

            <p className="text-3xl font-bold mb-6">{plan.price}</p>

            {/* Features */}
            <ul className="space-y-2 mb-6">
              {plan.features.map((f, i) => (
                <li key={i} className="text-white/70 text-sm">
                  ✔ {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => {
                const saved = applyPlan(plan.name);
                if (!saved) {
                  alert("Please login first to choose your plan.");
                  navigate("/login");
                  return;
                }
                if (plan.link) {
                  window.location.href = plan.link;
                } else {
                  alert("This plan is free 🎉");
                }
              }}
              className={clsx(
                "block text-center py-3 rounded-xl font-bold transition",
                plan.popular
                  ? "bg-[#4ade80] text-[#090c10] hover:bg-[#22c55e]"
                  : "border border-white/20 hover:bg-white/10"
              )}
            >
              {plan.name === "Basic" ? "Start Free" : "Get Started"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}