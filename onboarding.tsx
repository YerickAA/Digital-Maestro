import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/theme-provider";
import { setAuthData } from "@/lib/auth";

interface OnboardingProps {
  onComplete: (user: any) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { showDarkModePromptDialog } = useTheme();

  const steps = [
    {
      title: "Welcome to CleanSpace",
      subtitle: "Your digital decluttering assistant that helps you organize photos, files, apps, and emails in one place.",
      icon: <Sparkles className="w-12 h-12 text-white" />,
    },
    {
      title: "Let's Get Started",
      subtitle: "Tell us a bit about yourself to personalize your experience.",
      icon: <ArrowRight className="w-12 h-12 text-white" />,
    },
    {
      title: "You're All Set!",
      subtitle: "Ready to start decluttering your digital life? Let's dive in!",
      icon: <Sparkles className="w-12 h-12 text-white" />,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      // Create new user
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const newUser = await response.json();
        
        // Store user authentication data
        setAuthData(newUser.id.toString(), newUser.email);
        
        onComplete({ ...newUser, onboardingCompleted: true });
        
        // Show dark mode prompt after successful onboarding
        setTimeout(() => {
          showDarkModePromptDialog();
        }, 1000);
      } else {
        const errorData = await response.json();
        alert(`Failed to create user: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert("Network error occurred. Please try again.");
    }
  };

  return (
    <div className="absolute inset-0 bg-white dark:bg-gray-900 z-50 flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-ios-blue rounded-full flex items-center justify-center mb-8">
              {steps[currentStep].icon}
            </div>
            
            <h1 className="text-3xl font-bold text-ios-dark mb-4">
              {steps[currentStep].title}
            </h1>
            
            <p className="text-ios-gray-3 text-center mb-8 leading-relaxed">
              {steps[currentStep].subtitle}
            </p>
            
            {currentStep === 1 && (
              <Card className="w-full max-w-sm mx-auto mb-8">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Create a password"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="flex space-x-2 mb-8">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? "w-8 bg-ios-blue"
                      : "w-2 bg-ios-gray-2"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="p-6 safe-area-inset-bottom">
        <Button
          onClick={currentStep === steps.length - 1 ? handleComplete : handleNext}
          className="w-full bg-ios-blue hover:bg-ios-blue/90 text-white py-4 rounded-xl font-semibold text-lg"
          disabled={currentStep === 1 && (!formData.name || !formData.email || !formData.password)}
        >
          {currentStep === steps.length - 1 ? "Get Started" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
