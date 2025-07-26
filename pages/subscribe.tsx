import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Check, X, Loader2 } from "lucide-react";
import { useAuthData } from "@/hooks/use-auth";
import { Link } from "wouter";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = import.meta.env.VITE_STRIPE_PUBLIC_KEY 
  ? loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
  : Promise.resolve(null);

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success!",
          description: "Welcome to DigitalMaestro Pro! You're now subscribed.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <PaymentElement />
      </div>
      
      <Button 
        type="submit" 
        className="w-full" 
        disabled={!stripe || isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Crown className="mr-2 h-4 w-4" />
            Subscribe to DigitalMaestro Pro
          </>
        )}
      </Button>
    </form>
  );
};

const PricingCard = ({ 
  title, 
  price, 
  features, 
  isPopular, 
  buttonText, 
  onSelect 
}: {
  title: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
  onSelect: () => void;
}) => (
  <Card className={`relative ${isPopular ? 'border-blue-500 shadow-lg' : ''}`}>
    {isPopular && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
        <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
          Most Popular
        </span>
      </div>
    )}
    
    <CardHeader className="text-center">
      <CardTitle className="text-xl">{title}</CardTitle>
      <div className="text-3xl font-bold text-blue-600">{price}</div>
    </CardHeader>
    
    <CardContent className="space-y-4">
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        onClick={onSelect}
        className="w-full"
        variant={isPopular ? "default" : "outline"}
      >
        {buttonText}
      </Button>
    </CardContent>
  </Card>
);

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const authData = useAuthData();

  const handlePlanSelect = async (planType: 'monthly' | 'yearly' | 'lifetime') => {
    if (!authData?.user?.id) {
      // Show a toast instead of redirect to avoid loops
      toast({
        title: "Login Required",
        description: "Please log in or create an account to subscribe.",
        variant: "destructive",
      });
      // Navigate to register/login without redirect loop
      setTimeout(() => {
        window.location.href = `/register?returnTo=${encodeURIComponent('/subscribe')}`;
      }, 1000);
      return;
    }

    if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
      toast({
        title: "Payment System Not Configured",
        description: "Payment processing is currently being set up. Please check back soon!",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/create-subscription", { 
        userId: authData.user.id,
        planType 
      });
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.status === 'lifetime') {
          toast({
            title: "Already have lifetime access",
            description: "You already have lifetime access to DigitalMaestro Pro!",
          });
          return;
        }
        
        setClientSecret(data.clientSecret);
        setShowPayment(true);
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.error || "Failed to create subscription",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showPayment && clientSecret) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <Crown className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Complete Your Subscription
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              You're just one step away from DigitalMaestro Pro
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <SubscribeForm />
              </Elements>
            </CardContent>
          </Card>

          <div className="text-center mt-4">
            <Button 
              variant="ghost" 
              onClick={() => setShowPayment(false)}
            >
              ← Back to Plans
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Crown className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upgrade to DigitalMaestro Pro
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Take your digital organization to the next level
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <PricingCard
            title="Monthly Pro"
            price="$6.99/month"
            features={[
              "3-day free trial",
              "Unlimited file scanning & cleanup",
              "Advanced duplicate detection",
              "Smart recommendations & insights",
              "Export & backup tools",
              "Advanced analytics dashboard",
              "Batch operations & automation",
              "Priority email support"
            ]}
            buttonText={isLoading ? "Loading..." : "Start Free Trial"}
            onSelect={() => handlePlanSelect('monthly')}
          />
          
          <PricingCard
            title="Yearly Pro"
            price="$69.99/year"
            features={[
              "7-day free trial",
              "Everything in Monthly Pro",
              "50% savings vs monthly",
              "Extended data history",
              "Advanced automation features",
              "Priority feature requests",
              "Premium support & updates",
              "Early access to new features"
            ]}
            isPopular
            buttonText={isLoading ? "Loading..." : "Start Free Trial"}
            onSelect={() => handlePlanSelect('yearly')}
          />
          
          <PricingCard
            title="Lifetime Pro"
            price="$79.99 once"
            features={[
              "Everything in Yearly Pro",
              "Pay once, use forever",
              "No recurring charges",
              "Lifetime updates",
              "Ultimate data history",
              "Full automation suite",
              "VIP support & priority",
              "Beta features access"
            ]}
            buttonText={isLoading ? "Loading..." : "Get Lifetime Access"}
            onSelect={() => handlePlanSelect('lifetime')}
          />
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <Check className="h-4 w-4 text-green-500" />
            <span>30-day money-back guarantee</span>
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Check className="h-4 w-4 text-green-500" />
            <span>Cancel anytime</span>
          </div>
        </div>

        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Questions? Contact us at{' '}
            <a 
              href="mailto:digitalmaestro@myyahoo.com?subject=Subscription Question" 
              className="text-blue-500 hover:text-blue-600 underline"
            >
              digitalmaestro@myyahoo.com
            </a>
          </p>
          
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-gray-600 dark:hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-600 dark:hover:text-gray-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}