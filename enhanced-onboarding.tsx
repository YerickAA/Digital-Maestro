import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Image, 
  FileText, 
  Smartphone, 
  Mail,
  Shield,
  Zap,
  Brain,
  Users
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { nativeFeatures } from "@/lib/native-features";
import { useToast } from "@/hooks/use-toast";

interface EnhancedOnboardingProps {
  onComplete: (user: any) => void;
}

export default function EnhancedOnboarding({ onComplete }: EnhancedOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    preferences: {
      notifications: true,
      autoClean: false,
      primaryGoal: "",
      dataTypes: [] as string[]
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const { showDarkModePromptDialog } = useTheme();
  const { toast } = useToast();

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to CleanSpace',
      subtitle: 'Your AI-powered digital decluttering assistant',
      description: 'Transform your digital chaos into organized bliss with smart automation and insights.',
      icon: <Sparkles className="w-16 h-16 text-white" />,
      color: 'from-blue-500 to-purple-600',
      features: [
        'AI-powered recommendations',
        'Real-time digital health tracking',
        'Automated cleanup suggestions',
        'Cross-platform organization'
      ]
    },
    {
      id: 'account',
      title: 'Create Your Account',
      subtitle: 'Let\'s get you set up',
      description: 'Your information is encrypted and secure. We\'ll use this to personalize your experience.',
      icon: <Users className="w-16 h-16 text-white" />,
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'preferences',
      title: 'Customize Your Experience',
      subtitle: 'Tell us what matters most to you',
      description: 'Help us understand your digital habits so we can provide better recommendations.',
      icon: <Brain className="w-16 h-16 text-white" />,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'permissions',
      title: 'Grant Permissions',
      subtitle: 'Enable powerful features',
      description: 'Allow CleanSpace to access your digital content for analysis and organization.',
      icon: <Shield className="w-16 h-16 text-white" />,
      color: 'from-orange-500 to-red-600'
    },
    {
      id: 'complete',
      title: 'You\'re All Set!',
      subtitle: 'Ready to transform your digital life',
      description: 'Your personalized digital assistant is ready. Let\'s start with a quick scan of your content.',
      icon: <CheckCircle className="w-16 h-16 text-white" />,
      color: 'from-green-500 to-blue-600'
    }
  ];

  const dataTypes = [
    { id: 'photos', label: 'Photos & Images', icon: Image, description: 'Organize and deduplicate your photo library' },
    { id: 'files', label: 'Files & Documents', icon: FileText, description: 'Manage downloads, documents, and archives' },
    { id: 'apps', label: 'Apps & Software', icon: Smartphone, description: 'Clean up unused applications' },
    { id: 'email', label: 'Email & Messages', icon: Mail, description: 'Organize your inbox and subscriptions' }
  ];

  const goals = [
    { id: 'storage', label: 'Free Up Storage Space', description: 'Remove duplicates and large files' },
    { id: 'organize', label: 'Better Organization', description: 'Create structure and find things easily' },
    { id: 'privacy', label: 'Improve Privacy', description: 'Remove sensitive data and old accounts' },
    { id: 'productivity', label: 'Boost Productivity', description: 'Reduce digital distractions and clutter' }
  ];

  useEffect(() => {
    // Add haptic feedback for better mobile experience
    if (currentStep > 0) {
      nativeFeatures.vibrate(50);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePermissions = async () => {
    try {
      // Request basic permissions
      if ('Notification' in window) {
        await Notification.requestPermission();
      }
      
      // Test vibration
      nativeFeatures.vibrate(100);
      
      // Show completion animation
      await new Promise(resolve => setTimeout(resolve, 1000));
      handleNext();
    } catch (error) {
      // Continue even if permissions fail
      handleNext();
    }
  };

  const handleComplete = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      nativeFeatures.vibrate([100, 50, 100]); // Error vibration
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Create new user with preferences
      const userPayload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
      

      
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });

      if (response.ok) {
        const newUser = await response.json();
        
        // Store user preferences and mark as authenticated
        localStorage.setItem("userId", newUser.id.toString());
        localStorage.setItem("userEmail", newUser.email);
        localStorage.setItem("userPreferences", JSON.stringify(formData.preferences));
        localStorage.setItem("isAuthenticated", "true");
        
        // Success vibration
        nativeFeatures.vibrate([100, 50, 100, 50, 200]);
        
        toast({
          title: "Account Created",
          description: "Welcome to CleanSpace! Your digital journey begins now.",
        });
        
        onComplete({ ...newUser, onboardingCompleted: true });
        
        // Show dark mode prompt after successful onboarding
        setTimeout(() => {
          showDarkModePromptDialog();
        }, 1000);
      } else {
        const errorData = await response.json();

        throw new Error(errorData.error || 'Failed to create user');
      }
    } catch (error: any) {
      // Error vibration
      nativeFeatures.vibrate([200, 100, 200]);
      

      
      let errorMessage = "Something went wrong. Please try again.";
      let showLoginButton = false;
      
      // Check for specific error messages
      const errorText = error.message || "";
      
      if (errorText.includes('already exists') || errorText.includes('User with this email already exists')) {
        errorMessage = "An account with this email already exists. Please sign in instead or use a different email.";
        showLoginButton = true;
      } else if (errorText.includes('Validation failed')) {
        errorMessage = "Please check that all fields are filled correctly.";
      } else if (errorText) {
        errorMessage = errorText;
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
        action: showLoginButton ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.href = '/login'}
            className="text-xs"
          >
            Sign In
          </Button>
        ) : undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <Badge variant="outline" className="text-xs">
              {Math.round(progress)}%
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden">
              {/* Header with gradient */}
              <div className={`bg-gradient-to-r ${currentStepData.color} p-6 text-center`}>
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {currentStepData.icon}
                </motion.div>
                <motion.h2 
                  className="text-2xl font-bold text-white mt-4 mb-2"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {currentStepData.title}
                </motion.h2>
                <motion.p 
                  className="text-white/90 text-sm"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {currentStepData.subtitle}
                </motion.p>
              </div>

              <CardContent className="p-6">
                <motion.p 
                  className="text-gray-600 dark:text-gray-400 text-sm mb-6 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {currentStepData.description}
                </motion.p>

                {/* Step-specific content */}
                {currentStep === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-3"
                  >
                    {currentStepData.features?.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </motion.div>
                )}

                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password" className="text-sm font-medium mb-2 block">
                        Password
                      </Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a secure password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        className="w-full"
                      />
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-6"
                  >
                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        What's your primary goal?
                      </Label>
                      <div className="grid grid-cols-1 gap-2">
                        {goals.map((goal) => (
                          <Button
                            key={goal.id}
                            variant={formData.preferences.primaryGoal === goal.id ? "default" : "outline"}
                            className="justify-start h-auto p-3"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              preferences: { ...prev.preferences, primaryGoal: goal.id }
                            }))}
                          >
                            <div className="text-left">
                              <div className="font-medium">{goal.label}</div>
                              <div className="text-xs text-gray-500">{goal.description}</div>
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-3 block">
                        Which data types do you want to organize?
                      </Label>
                      <div className="grid grid-cols-2 gap-2">
                        {dataTypes.map((type) => {
                          const Icon = type.icon;
                          const isSelected = formData.preferences.dataTypes.includes(type.id);
                          
                          return (
                            <Button
                              key={type.id}
                              variant={isSelected ? "default" : "outline"}
                              className="h-auto p-3 flex-col space-y-1"
                              onClick={() => setFormData(prev => ({
                                ...prev,
                                preferences: {
                                  ...prev.preferences,
                                  dataTypes: isSelected
                                    ? prev.preferences.dataTypes.filter(id => id !== type.id)
                                    : [...prev.preferences.dataTypes, type.id]
                                }
                              }))}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="text-xs font-medium">{type.label}</span>
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-4"
                  >
                    <div className="text-center">
                      <Zap className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                        Grant permissions to unlock the full potential of CleanSpace. Don't worry - your data stays secure and private.
                      </p>
                      <Button
                        onClick={handlePermissions}
                        className="w-full"
                        size="lg"
                      >
                        <Shield className="w-5 h-5 mr-2" />
                        Grant Permissions
                      </Button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-center"
                  >
                    <div className="bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-lg mb-6">
                      <h3 className="font-semibold text-lg mb-2">Welcome to CleanSpace!</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Your personalized digital assistant is ready to help you organize and optimize your digital life.
                      </p>
                    </div>
                    <Button
                      onClick={handleComplete}
                      disabled={isLoading}
                      className="w-full"
                      size="lg"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Setting up your account...</span>
                        </div>
                      ) : (
                        <>
                          <span>Start My Digital Journey</span>
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8">
                  <div>
                    {currentStep > 0 && currentStep < steps.length - 1 && (
                      <Button
                        variant="ghost"
                        onClick={handlePrevious}
                        className="flex items-center space-x-1"
                      >
                        <span>Back</span>
                      </Button>
                    )}
                  </div>
                  
                  <div>
                    {currentStep < steps.length - 2 && (
                      <Button
                        onClick={handleNext}
                        className="flex items-center space-x-1"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}