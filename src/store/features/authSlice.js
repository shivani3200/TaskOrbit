import { createSlice } from "@reduxjs/toolkit";

// This is what the 'auth' part of our global Redux state will look like when the app first starts.
const initialState = {
  isAuthenticated: false, // Boolean: true if a user is logged in, false otherwise.
  user: null,             // Stores the Firebase User object when logged in. Null if no user.
  loading: true,          // Boolean: true when we are actively checking the user's auth status (e.g., on app load). 
                          //  This helps in showing a loading spinner or placeholder.
  error: null,            // Stores any error messages related to authentication (e.g., "Invalid credentials").
}

const authSlice = createSlice({
  name:'auth',
  initialState,
  reducers :{
    setUser:(state, action) =>{
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

    },
    clearUser:(state, action) =>{
      state.user = null,
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    setLoading:(state, action) =>{
      state.loading = action.payload;
    },
    setError:(state, action) =>{
      state.error = action.payload;
      state.loading = false;
    },
  }
});
export const { setUser, clearUser, setLoading, setError } = authSlice.actions;

export default authSlice.reducer;