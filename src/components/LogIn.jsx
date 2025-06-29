import React, { useState } from "react";
import "./SignUp.css";
import { MdOutlineDriveFileRenameOutline, MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";

const isSignIn = true;

const LogIn = () => {
  // State to hold input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // State for loading and error messages (good for UX)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Hook for programmatic navigation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setIsLoading(true); // Indicate loading state

    // Basic Client-Side Validation
    if (!email || !password) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return;
    }
    // --- IMPORTANT: API Call Section ---
    try {
      // Firebase: Sign in user with email and password
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;
      console.log("User signed in:", user);
      // Firebase automatically manages the user's session (tokens are handled internally).
      // You typically don't need to manually store tokens in localStorage here.
      // Redirect to a protected route (e.g., a dashboard page) after successful login
      navigate('/dashboard'); // <--- IMPORTANT: Create this '/dashboard' route in App.jsx
    } catch (firebaseError) {
      console.error(
        "Firebase LogIn Error:",
        firebaseError.code,
        firebaseError.message
      );
      if (
        firebaseError.code === "auth/user-not-found" ||
        firebaseError.code === "auth/wrong-password"
      ) {
        setError("Invalid email or password. Please check your credentials.");
      } else if (firebaseError.code === "auth/invalid-email") {
        setError("The email address is not valid.");
      } else if (firebaseError.code === "auth/too-many-requests") {
        setError(
          "Access to this account has been temporarily disabled due to many failed login attempts. Try again later."
        );
      } else {
        setError("An error occurred during sign in. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <main className="sign-up-container">
      <section className="sign-up-card border">
        <video
          className="video-style"
          autoPlay
          loop
          muted
          preload="auto"
          playsInline
        >
          <source src="/onboarding.mp4" type="video/mp4" />
        </video>
        <form onSubmit={handleSubmit}>
          {/* Input Fields */}
          <div className="input-container">
            {/* Email */}
            <label className="inputs" htmlFor="email">
              <MdEmail />
              <input
                id="email"
                className="input-style"
                type="email"
                name="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
                    {error && <p className="text-red-600 text-xs">{error}</p>}


            {/* Password */}
            <label className="inputs" htmlFor="password">
              <RiLockPasswordFill />
              <input
                id="password"
                className="input-style"
                type="password"
                name="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
                    {error && <p className="text-red-600 text-xs">{error}</p>}

          </div>

          {/* Sign Up Button */}
          <div className={isSignIn ? "btn purple" : "btn brown"}>
            <button type="submit" disabled={isLoading}>
              Sign in
            </button>
            
          </div>
          
        </form>

        {/* Redirect to Sign In */}
        <div className="signin-redirect">
          <p className="already-text"> don't have an account?</p>
          <div className="signin-link">
            <Link to="/">sign up</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LogIn;
