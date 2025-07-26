import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { 
  Navigation, 
  ArrowRight, 
  ArrowLeft, 
  X, 
  Sparkles, 
  Target, 
  Zap,
  Eye,
  Hand,
  MapPin
} from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  element: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
  action?: 'click' | 'hover' | 'scroll';
  highlight?: boolean;
}

interface GuidedTourProps {
  isActive: boolean;
  onComplete: () => void;
}

export default function GuidedTour({ isActive, onComplete }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null);

  const tourSteps: TourStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to CleanSpace!',
      description: 'Let me show you the main navigation tabs at the bottom of your screen.',
      element: 'body',
      position: 'center',
      highlight: false
    },
    {
      id: 'home-tab',
      title: 'Home Tab',
      description: 'Your dashboard shows your digital health score and category overview for photos, files, apps, and emails.',
      element: 'body',
      position: 'center',
      highlight: false
    },
    {
      id: 'organize-tab',
      title: 'Organize Tab',
      description: 'Here you can manage your digital items with smart filters and batch operations.',
      element: 'body',
      position: 'center',
      highlight: false
    },
    {
      id: 'insights-tab',
      title: 'Insights Tab',
      description: 'Track your cleanup progress and view detailed analytics about your digital wellness.',
      element: 'body',
      position: 'center',
      highlight: false
    },
    {
      id: 'settings-tab',
      title: 'Settings Tab',
      description: 'Customize your experience and manage your account preferences.',
      element: 'body',
      position: 'center',
      highlight: false
    }
  ];

  useEffect(() => {
    if (isActive && currentStep < tourSteps.length) {
      // Clear any existing highlights since we're not using them anymore
      clearHighlight();
      setHighlightedElement(null);
    }
  }, [currentStep, isActive]);

  useEffect(() => {
    // Only add event listeners if the tour is actually active
    if (!isActive) return;

    const handleClickOutside = (e: Event) => {
      const target = e.target as HTMLElement;
      const isInsideTourModal = target.closest('.tour-modal');
      const isTabBarButton = target.closest('.tab-bar');
      
      if (!isInsideTourModal && !isTabBarButton) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      document.body.style.overflow = 'unset';
    };
  }, [isActive]);

  const clearHighlight = () => {
    const highlighted = document.querySelectorAll('.tour-highlight');
    highlighted.forEach(el => el.classList.remove('tour-highlight'));
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    clearHighlight();
    onComplete();
    localStorage.setItem('tourCompleted', 'true');
  };



  const getStepPosition = (step: TourStep) => {
    switch (step.position) {
      case 'top':
        return 'top-4 left-0 right-0';
      case 'bottom':
        return 'bottom-4 left-0 right-0';
      case 'left':
        return 'left-0 top-1/2 transform -translate-y-1/2';
      case 'right':
        return 'right-0 top-1/2 transform -translate-y-1/2';
      case 'center':
      default:
        return 'top-1/2 left-0 right-0 transform -translate-y-1/2';
    }
  };

  if (!isActive) return null;

  const currentTourStep = tourSteps[currentStep];

  return (
    <>
      {/* Overlay - Block all interactions */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 pointer-events-auto" onClick={(e) => e.stopPropagation()} />
      
      {/* Tour Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className={`fixed ${getStepPosition(currentTourStep)} z-50 pointer-events-auto mx-4`}
          style={{
            maxWidth: 'calc(100vw - 32px)',
            width: '100%'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-center">
            <Card className="shadow-2xl border-2 border-blue-500 max-w-sm w-full tour-modal">
              <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {currentStep + 1}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    Step {currentStep + 1} of {tourSteps.length}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); handleComplete(); }}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                  {currentTourStep.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {currentTourStep.description}
                </p>
              </div>
              

              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); prevStep(); }}
                      className="flex items-center space-x-1 h-8 px-2"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span className="text-xs">Back</span>
                    </Button>
                  )}
                </div>
                
                <Button
                  onClick={(e) => { e.stopPropagation(); nextStep(); }}
                  size="sm"
                  className="flex items-center space-x-1 h-8 px-3"
                >
                  <span className="text-xs">
                    {currentStep === tourSteps.length - 1 ? 'Finish' : 'Next'}
                  </span>
                  {currentStep === tourSteps.length - 1 ? (
                    <Sparkles className="w-3 h-3" />
                  ) : (
                    <ArrowRight className="w-3 h-3" />
                  )}
                </Button>
              </div>
              
              {/* Progress indicator */}
              <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / tourSteps.length) * 100}%` }}
                />
              </div>
            </CardContent>
            </Card>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Spotlight effect for highlighted elements */}
      {highlightedElement && (
        <style jsx global>{`
          .tour-highlight {
            position: relative;
            z-index: 51;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3);
            border-radius: 8px;
            animation: pulse-highlight 2s infinite;
          }
          
          @keyframes pulse-highlight {
            0%, 100% {
              box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5), 0 0 20px rgba(59, 130, 246, 0.3);
            }
            50% {
              box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.3), 0 0 30px rgba(59, 130, 246, 0.5);
            }
          }
        `}</style>
      )}
    </>
  );
}