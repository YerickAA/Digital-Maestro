import { useQuery } from '@tanstack/react-query';
import { useAuthData } from './use-auth';

export interface SubscriptionStatus {
  isActive: boolean;
  isLifetime: boolean;
  isTrial: boolean;
  isFree: boolean;
  status: string;
  trialEndsAt?: string;
}

export function useSubscription(): SubscriptionStatus {
  const authData = useAuthData();
  
  const { data: user } = useQuery({
    queryKey: ['/api/users', authData?.user?.id],
    enabled: !!authData?.user?.id,
  });

  const subscriptionStatus = user?.subscriptionStatus || 'free';
  
  return {
    isActive: subscriptionStatus === 'active' || subscriptionStatus === 'lifetime',
    isLifetime: subscriptionStatus === 'lifetime',
    isTrial: subscriptionStatus === 'trial',
    isFree: subscriptionStatus === 'free',
    status: subscriptionStatus,
    trialEndsAt: user?.trialEndsAt,
  };
}

export function useHasPremiumAccess(): boolean {
  const subscription = useSubscription();
  return subscription.isActive || subscription.isTrial;
}