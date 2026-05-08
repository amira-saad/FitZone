import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { saveUserEmail } from "../utils/userStorage";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();
const login = async () => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    await saveUserEmail(result.user.uid, email)
    nav('/dashboard')
  } catch (err) {
    if (err instanceof Error) alert(err.message)
  }
}

 const googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    // save email to Firestore
    await saveUserEmail(user.uid, user.email || '')
    nav('/dashboard')
  } catch (err) {
    if (err instanceof Error) alert(err.message)
  }
}

  return (
    <div className="min-h-screen bg-[#090c10] flex items-center justify-center text-white">
      <div className="w-full max-w-md p-6 border border-white/10 rounded-xl">

        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <input
          className="w-full p-3 mb-3 text-black"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-3 mb-4 text-black"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={login} className="w-full bg-[#4ade80] p-3 mb-2">
          Login
        </button>

        <button onClick={googleLogin} className="w-full bg-white text-black p-3">
          Google Login
        </button>

        <p className="text-center mt-4 text-white/60">
          No account?{" "}
          <Link to="/signup" className="text-[#4ade80]">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}