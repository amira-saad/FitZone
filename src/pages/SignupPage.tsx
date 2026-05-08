import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { saveUserEmail } from "../utils/userStorage";
export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const nav = useNavigate();

  const signup = async () => {
    try {
      setLoading(true);

     
      if (!email || !password) {
        alert("Please fill all fields");
        return;
      }

      if (password.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      //  Firebase signup
      await createUserWithEmailAndPassword(auth, email, password);
const result= await createUserWithEmailAndPassword(auth, email, password)
await saveUserEmail(result.user.uid, email) // Save email to Firestore
      alert("Account created 🎉 Please login");
      nav("/login");

    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090c10] flex items-center justify-center text-white">
      <div className="w-full max-w-md p-6 border border-white/10 rounded-xl">

        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>

        {/* Email */}
        <input
          className="w-full p-3 mb-3 text-black"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          className="w-full p-3 mb-4 text-black"
          type="password"
          placeholder="Password (min 6 chars)"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Button */}
        <button
          onClick={signup}
          disabled={loading}
          className="w-full bg-[#4ade80] p-3 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center mt-4 text-white/60">
          Already have an account?{" "}
          <Link to="/login" className="text-[#4ade80]">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}