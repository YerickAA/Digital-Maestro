import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Crown, Calendar, CheckCircle, Clock } from "lucide-react";
import { Link } from "wouter";
import { useSubscription } from "@/hooks/use-subscription";

export default function SubscriptionStatus() {
  const subscription = useSubscription();
  
  const getStatusBadge = () => {
    if (subscription.isLifetime) {
      return <Badge className="bg-yellow-500 text-yellow-50">Lifetime</Badge>;
    }
    if (subscription.isTrial) {
      return <Badge className="bg-blue-500 text-blue-50">Free Trial</Badge>;
    }
    if (subscription.isActive) {
      return <Badge className="bg-green-500 text-green-50">Active</Badge>;
    }
    return <Badge variant="secondary">Free</Badge>;
  };

  const getStatusIcon = () => {
    if (subscription.isLifetime) {
      return <Crown className="h-5 w-5 text-yellow-500" />;
    }
    if (subscription.isTrial) {
      return <Clock className="h-5 w-5 text-blue-500" />;
    }
    if (subscription.isActive) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <Calendar className="h-5 w-5 text-gray-500" />;
  };

  const getStatusDescription = () => {
    if (subscription.isLifetime) {
      return "You have lifetime access to all DigitalMaestro Pro features.";
    }
    if (subscription.isTrial) {
      const trialEnd = subscription.trialEndsAt ? new Date(subscription.trialEndsAt) : null;
      const daysLeft = trialEnd ? Math.ceil((trialEnd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
      return `Your free trial ends in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}. Upgrade to continue using Pro features.`;
    }
    if (subscription.isActive) {
      return "You have active access to all DigitalMaestro Pro features.";
    }
    return "You're currently using the free version of DigitalMaestro.";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          Subscription Status
          {getStatusBadge()}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {getStatusDescription()}
        </p>
        
        {subscription.isFree && (
          <Link href="/subscribe">
            <Button className="w-full">
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </Button>
          </Link>
        )}
        
        {subscription.isTrial && (
          <Link href="/subscribe">
            <Button className="w-full">
              <Crown className="mr-2 h-4 w-4" />
              Continue with Pro
            </Button>
          </Link>
        )}
        
        {subscription.isActive && !subscription.isLifetime && (
          <Button variant="outline" className="w-full">
            <Calendar className="mr-2 h-4 w-4" />
            Manage Subscription
          </Button>
        )}
      </CardContent>
    </Card>
  );
}