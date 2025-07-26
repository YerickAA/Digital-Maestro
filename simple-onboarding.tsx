import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Camera, Files, Mail, Smartphone, Target, Zap } from "lucide-react";
import { Link } from "wouter";

interface SimpleOnboardingProps {
  onComplete: (preferences: any) => void;
}

export default function SimpleOnboarding({ onComplete }: SimpleOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    primaryGoal: 'storage',
    dataTypes: ['photos', 'files'],
    notifications: true,
    autoClean: false,
  });
  const { toast } = useToast();

  const steps = [
    {
      title: "Welcome to CleanSpace",
      subtitle: "Your digital decluttering assistant that helps you organize photos, files, apps, and emails in one place.",
      content: (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center mb-8 mx-auto">
            <Zap className="w-12 h-12 text-white" />
          </div>
          
          <div className="space-y-4">
            <Link href="/register">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
                Create Account
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full py-3 rounded-lg font-semibold">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      )
    },
    {
      title: "What's your primary goal?",
      subtitle: "This helps us personalize your experience",
      content: (
        <RadioGroup
          value={preferences.primaryGoal}
          onValueChange={(value) => setPreferences(prev => ({ ...prev, primaryGoal: value }))}
          className="space-y-4"
        >
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <RadioGroupItem value="storage" id="storage" />
            <Label htmlFor="storage" className="flex items-center space-x-2 cursor-pointer">
              <Target className="w-5 h-5" />
              <span>Free up storage space</span>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <RadioGroupItem value="organize" id="organize" />
            <Label htmlFor="organize" className="flex items-center space-x-2 cursor-pointer">
              <Files className="w-5 h-5" />
              <span>Organize my files better</span>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <RadioGroupItem value="privacy" id="privacy" />
            <Label htmlFor="privacy" className="flex items-center space-x-2 cursor-pointer">
              <Smartphone className="w-5 h-5" />
              <span>Improve privacy & security</span>
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <RadioGroupItem value="productivity" id="productivity" />
            <Label htmlFor="productivity" className="flex items-center space-x-2 cursor-pointer">
              <Zap className="w-5 h-5" />
              <span>Boost productivity</span>
            </Label>
          </div>
        </RadioGroup>
      )
    },
    {
      title: "What would you like to clean up?",
      subtitle: "Select all that apply",
      content: (
        <div className="space-y-4">
          {[
            { id: 'photos', label: 'Photos & Screenshots', icon: Camera },
            { id: 'files', label: 'Files & Documents', icon: Files },
            { id: 'apps', label: 'Apps & Software', icon: Smartphone },
            { id: 'email', label: 'Email & Messages', icon: Mail },
          ].map(({ id, label, icon: Icon }) => (
            <div key={id} className="flex items-center space-x-3 p-3 border rounded-lg">
              <Checkbox
                id={id}
                checked={preferences.dataTypes.includes(id)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setPreferences(prev => ({ ...prev, dataTypes: [...prev.dataTypes, id] }));
                  } else {
                    setPreferences(prev => ({ ...prev, dataTypes: prev.dataTypes.filter(t => t !== id) }));
                  }
                }}
              />
              <Label htmlFor={id} className="flex items-center space-x-2 cursor-pointer">
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Label>
            </div>
          ))}
        </div>
      )
    },
    {
      title: "Notification Preferences",
      subtitle: "How would you like to stay updated?",
      content: (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <Checkbox
              id="notifications"
              checked={preferences.notifications}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, notifications: checked }))}
            />
            <Label htmlFor="notifications" className="cursor-pointer">
              Send me helpful tips and progress updates
            </Label>
          </div>
          <div className="flex items-center space-x-3 p-3 border rounded-lg">
            <Checkbox
              id="autoClean"
              checked={preferences.autoClean}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, autoClean: checked }))}
            />
            <Label htmlFor="autoClean" className="cursor-pointer">
              Enable automatic cleanup suggestions
            </Label>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    // Store preferences
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
    
    toast({
      title: "Preferences Saved",
      description: "Your CleanSpace experience has been personalized!",
    });
    
    onComplete(preferences);
  };

  // Skip onboarding if user is already authenticated
  if (currentStep === 0) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            {steps[currentStep].content}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {steps[currentStep].title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {steps[currentStep].subtitle}
            </p>
          </div>
          
          {steps[currentStep].content}
          
          <div className="flex space-x-2 mt-6 mb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? "w-8 bg-blue-500"
                    : "w-2 bg-gray-300 dark:bg-gray-600"
                }`}
              />
            ))}
          </div>
          
          <div className="flex space-x-3">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={currentStep === 2 && preferences.dataTypes.length === 0}
            >
              {currentStep === steps.length - 1 ? "Complete Setup" : "Continue"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}