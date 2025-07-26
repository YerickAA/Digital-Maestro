import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Lock, Star } from "lucide-react";
import { Link } from "wouter";

interface PaywallProps {
  feature: string;
  description: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: React.ReactNode;
}

export default function Paywall({ 
  feature, 
  description, 
  icon: Icon = Crown,
  children 
}: PaywallProps) {
  return (
    <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <div className="relative">
            <Icon className="h-8 w-8 text-gray-400" />
            <Lock className="h-4 w-4 text-gray-500 absolute -top-1 -right-1" />
          </div>
        </div>
        <CardTitle className="text-lg text-gray-600 dark:text-gray-400">
          {feature}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="text-center space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
        
        {children && (
          <div className="opacity-50 pointer-events-none">
            {children}
          </div>
        )}
        
        <div className="space-y-2">
          <Link href="/subscribe">
            <Button className="w-full">
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </Button>
          </Link>
          
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Star className="h-3 w-3" />
            <span>30-day money-back guarantee</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook to check if user has premium access
export function usePremiumAccess() {
  // Import the subscription hook here to avoid circular dependencies
  const { useHasPremiumAccess } = require('@/hooks/use-subscription');
  return useHasPremiumAccess();
}

// Higher-order component to wrap premium features
export function withPremium<T extends object>(
  Component: React.ComponentType<T>,
  fallback: {
    feature: string;
    description: string;
    icon?: React.ComponentType<{ className?: string }>;
  }
) {
  return function PremiumComponent(props: T) {
    const hasPremium = usePremiumAccess();
    
    if (!hasPremium) {
      return (
        <Paywall 
          feature={fallback.feature}
          description={fallback.description}
          icon={fallback.icon}
        >
          <Component {...props} />
        </Paywall>
      );
    }
    
    return <Component {...props} />;
  };
}