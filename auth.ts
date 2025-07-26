export const clearAuthData = () => {
  try {
    localStorage.removeItem("userId");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
};

export const setAuthData = (userId: string, email: string) => {
  try {
    localStorage.setItem("userId", userId);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("isAuthenticated", "true");
  } catch (error) {
    console.error("Error setting localStorage:", error);
  }
};

export const getAuthData = () => {
  try {
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("userEmail");
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    
    return { userId, email, isAuthenticated };
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return { userId: null, email: null, isAuthenticated: false };
  }
};