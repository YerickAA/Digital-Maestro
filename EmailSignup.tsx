import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Bell, CheckCircle, AlertCircle } from "lucide-react";

interface EmailSignupProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  className?: string;
}

const EmailSignup = ({ 
  title = "Get Notified When DigitalMaestro Launches",
  description = "Be the first to know when our mobile app drops. Get exclusive early access and special launch pricing.",
  placeholder = "Enter your email address",
  buttonText = "Notify Me",
  className = ""
}: EmailSignupProps) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setMessage("Please enter a valid email address");
      return;
    }

    setStatus("loading");
    
    try {
      // Mailerlite API integration
      const response = await fetch('/api/email-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          source: 'landing_page',
          tags: ['app_launch_notification', 'early_access']
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setStatus("success");
        setMessage("Thanks! You'll be notified when DigitalMaestro launches.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Network error. Please check your connection and try again.");
    }
  };

  if (status === "success") {
    return (
      <Card className={`border-2 border-green-500 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-green-800 dark:text-green-400 mb-2">
            You're All Set!
          </h3>
          <p className="text-green-700 dark:text-green-300">
            {message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-2 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 ${className}`}>
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Bell className="w-8 h-8 text-blue-600" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {title}
        </CardTitle>
        <p className="text-gray-600 dark:text-gray-300">
          {description}
        </p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="email"
                placeholder={placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800"
                disabled={status === "loading"}
              />
            </div>
            <Button 
              type="submit" 
              disabled={status === "loading" || !email}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 whitespace-nowrap"
            >
              {status === "loading" ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Signing Up...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  {buttonText}
                </>
              )}
            </Button>
          </div>
          
          {status === "error" && (
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
              <AlertCircle className="w-4 h-4" />
              {message}
            </div>
          )}
        </form>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Join 1,000+ users waiting for launch. No spam, unsubscribe anytime.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailSignup;