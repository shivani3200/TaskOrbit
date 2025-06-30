import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth"; // Hook to get user authentication state
import "../cssFolder/Header.css";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  // useAuthState is a powerful hook from 'react-firebase-hooks'
  // It gives you:
  // 1. `user`: The current authenticated user object (or null if not logged in)
  // 2. `loading`: A boolean indicating if the auth state is still being loaded
  // 3. `error`: Any error that occurred while fetching the auth state
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  const displayName = user?.displayName
    ? user.displayName
    : user?.email
    ? user.email.split("@")[0].replace(/[^a-zA-Z0-9]/g, " ")
    : "User";

  const handleLogOut = async () => {
    try {
      await signOut(auth); // Call Firebase signOut function
      navigate("/signin"); // Redirect to the sign-in page after successful logout
      console.log("User logged out successfully.");
    } catch (logoutError) {
      console.error("Error logging out:", logoutError.message);
      // Optionally show a user-friendly error message
      alert("Failed to log out. Please try again.");
    }
  };
  if (loading) {
    return null;
  }
  if (error) {
    console.error("Authentication state error in Header:", error);
    return (
      <header>
        <header className="header">
          <div className="header-logo">TaskOrbit</div>
          <div className="header-error">Error loading user data</div>
        </header>
      </header>
    );
  }
  return (
    <header className="header">
      <div className="header-logo">
        <Link to={user ? "/dashboard" : "/"} className="header-link">
          TaskOrbit
        </Link>
      </div>

      <nav className="header-nav">
        {user ? (
          <div className="user-info">
            <FaUserCircle size={20} />
            <span className="user-name">{displayName}</span>
            <button onClick={handleLogOut} className="logout-button">
              logout
            </button>
          </div>
        ) : (
          <>
            <Link to={"/signin"} className="nav-link">
              {" "}
              sign in
            </Link>
            <Link to={"/signup"} className="nav-link">
              sign up
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
