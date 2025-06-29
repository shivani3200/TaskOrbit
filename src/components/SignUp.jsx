import React, { useState } from "react";
import "./SignUp.css";
import { MdOutlineDriveFileRenameOutline, MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";

// Import your auth instance and necessary Firebase Auth functions
import { auth } from "../firebase";
import { updateProfile, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

const isSignIn = false;

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // submit handle
  const handleSubmit = async (e) => {
    e.preventDefault(); //Prevents full page reload
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Send verification email
    await sendEmailVerification(user);

    setSuccessMessage('Account created successfully! A verification email has been sent to your inbox. Please verify your email to log in.');
    setEmail('');
    setPassword('');

    console.log("Form submitted with:", { email, password });

    setError({ name: "", email: "", password: "" });
    setIsLoading(true);

    // Basic client-side validation
    if (!email || !name || !password) {
      setError({
        name: !name ? "Full name is required." : "",
        email: !email ? "Email is required." : "",
        password: !password ? "Password is required." : "",
      });
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError((prev) => ({
        ...prev,
        password: "use at least 6 characters.",
      }));

      setIsLoading(false);
      console.log("Error set: Password too short."); // <--- ADD THIS LOG

      return;
    }
    if (name.length < 3) {
      setError((prev) => ({
        ...prev,
        name: "use at least 3 characters.",
      }));
      setIsLoading(false);
      console.log("Error set: name too short."); // <--- ADD THIS LOG

      return;
    }

    try {
      // Firebase: Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Firebase: Update the user's profile with their display name (optional but good for UX)
      await updateProfile(user, { displayName: name });
      console.log("User registered successfully:", user);
      // Redirect to the login page after successful registration
      navigate("/dashboard");
    } catch (firebaseError) {
      console.error(
        "Firebase SignUp Error:",
        firebaseError.code,
        firebaseError.message
      );
      if (firebaseError.code === "auth/email-already-in-use") {
        setError((prev) => ({
          ...prev,
          email: "This email is already in use.",
        }));
      } else if (firebaseError.code === "auth/invalid-email") {
        setError((prev) => ({
          ...prev,
          email: "The email address is not valid.",
        }));
      } else if (firebaseError.code === "auth/weak-password") {
        setError((prev) => ({
          ...prev,
          password: "Password should be at least 6 characters.",
        }));
      } else {
        setError((prev) => ({
          ...prev,
          email: "An unexpected error occurred. Please try again later.",
        }));
      }
    } finally {
      setIsLoading(false); // Stop loading regardless of success or error
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
            {/* Full Name */}
            <label className="inputs" htmlFor="fullname">
              <MdOutlineDriveFileRenameOutline />
              <input
                id="fullname"
                className="input-style"
                type="text"
                name="fullname"
                placeholder="Full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            {error.name && <p className="errors-alert">{error.name}</p>}
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
            {error.email && (
              <p className="errors-alert">{error.email}</p>
            )}
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
            {error.password && (
              <p className="errors-alert">{error.password}</p>
            )}
            .
          </div>

          {/* Sign Up Button */}
          <div className={isSignIn ? "btn purple" : "btn brown"}>
            <button type="submit" disabled={isLoading}>Sign up</button>
          </div>
        </form>

        {/* Redirect to Sign In */}
        <div className="signin-redirect">
          <p className="already-text">Already have an account?</p>
          <div className="signin-link">
            <Link to="/signin">sign in</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignUp;
