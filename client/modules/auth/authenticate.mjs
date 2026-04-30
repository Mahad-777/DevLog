/**
 * Every time the user wants to perform an action that requires authentication
 * contact the server and check the authentication state of the user.
 * This improves the user experience because
 */

// Variable to keep certain information about the user in memory
let currentUser = null;

const api = "http://localhost:9090/api/auth";

export const initAuth = async () => {
  try {
    const res = await fetch(api + "/me", {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      // User has valid session
      currentUser = await res.json();
    } else {
      currentUser = null;
    }
  } catch {
    //error message can be shown later
    currentUser = null;
  }
};

// function for fetching the current user
export function getUser() {
  return currentUser;
}

export function isauthenticated() {
  return currentUser != null;
}

export function clearUser() {
  currentUser = null;
}

export const login = async (email, password) => {
  try {
    const res = await fetch(api + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      //do something
      currentUser = await res.json();
      return { success: true };
    }
    return { success: false, message: "Invalid credentials." };
  } catch {
    // do something
    return { success: false, message: "Network error, try again." };
  }
};

export const signup = async (email, username, password) => {
  try {
    const res = await fetch(api + "/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    if (res.ok) {
      //do something
      return { success: true };
    }
    const data = await res.json();
    return { success: false, message: data.message || "Signup failed." };
  } catch {
    // do something
    return { success: false, message: "Network error, try again." };
  }
};
