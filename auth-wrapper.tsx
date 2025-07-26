import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { clearAuthData, getAuthData } from "@/hooks/use-auth";
import { useSubscription } from "@/hooks/use-subscription";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [location] = useLocation();
  const subscription = useSubscription();

  useEffect(() => {
    const checkAuth = async () => {
      const { userId, isAuthenticated: isAuthenticatedFlag } = getAuthData();
      
      // Allow access to auth pages, legal pages, showcase, and subscription page without authentication
      const publicPages = ['/', '/welcome', '/login', '/register', '/forgot-password', '/terms', '/privacy', '/subscribe', '/showcase', '/mobile-demo'];
      if (publicPages.includes(location)) {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }
      
      // If user is authenticated and has valid userId, verify with server
      if (isAuthenticatedFlag && userId) {
        try {
          const response = await fetch(`/api/users/${userId}`);
          if (response.ok) {
            const userData = await response.json();
            console.log('User verified:', userData.email);
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          } else if (response.status === 404) {
            // User doesn't exist, clear invalid auth data
            console.log('User not found in database, clearing auth data');
            clearAuthData();
            setIsAuthenticated(false);
            setIsLoading(false);
            window.location.href = "/welcome";
            return;
          } else {
            // Other error, but don't clear auth data - might be temporary
            console.log('Error validating user, but keeping auth data');
            setIsAuthenticated(true);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          // Network error - keep user logged in and allow access
          console.log('Network error validating user, allowing access');
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
      }
      
      // If no authentication, redirect to welcome
      if (!publicPages.includes(location)) {
        window.location.href = "/welcome";
      }
      setIsAuthenticated(false);
      setIsLoading(false);
    };
    
    checkAuth();
  }, [location]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}