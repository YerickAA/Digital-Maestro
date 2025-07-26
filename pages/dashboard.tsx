import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Search, Zap, Images, Folder, Smartphone, Mail, Shield, Crown } from "lucide-react";
import TabBar from "@/components/tab-bar";
import CategoryCard from "@/components/category-card";
import ProgressCard from "@/components/progress-card";
import StreakCard from "@/components/streak-card";
import TipCard from "@/components/tip-card";
import EnhancedDashboard from "@/components/enhanced-dashboard";
import AnimatedStats from "@/components/animated-stats";
import TestCard from "@/components/test-card";
import RealDataScanner from "@/components/real-data-scanner";
import GuidedTour from "@/components/guided-tour";
import SmartRecommendations from "@/components/smart-recommendations";
import Paywall from "@/components/paywall";
import { DashboardSkeleton } from "@/components/skeleton-loading";
import { Skeleton } from "@/components/ui/skeleton";
import { useDigitalData, useStreak, useRandomTip, useScanDigitalData, useUpdateStreak } from "@/hooks/use-digital-data";
import { useSubscription } from "@/hooks/use-subscription";
import { motion, AnimatePresence } from "framer-motion";
import { nativeFeatures } from "@/lib/native-features";
import { getUserPreferences, getCategoryPriority, getPersonalizedInsights } from "@/lib/preferences";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Dashboard() {
  const [userId, setUserId] = useState<number | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [previousData, setPreviousData] = useState<any>(null);
  const [showEnhanced, setShowEnhanced] = useState(false);
  const [showRealDataScanner, setShowRealDataScanner] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [userPreferences, setUserPreferences] = useState(getUserPreferences());
  const subscription = useSubscription();
  const { toast } = useToast();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      const id = parseInt(storedUserId);
      if (!isNaN(id)) {
        setUserId(id);
        
        // Fetch user data
        fetch(`/api/users/${id}`)
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(user => {
            if (user && user.name) {
              setUserName(user.name);
            } else {
              setUserName("User");
            }
          })
          .catch(error => {
            console.error("Error fetching user data:", error);
            setUserName("User");
          });
        
        // Check if user should see tour
        try {
          const tourCompleted = localStorage.getItem('tourCompleted');
          if (!tourCompleted) {
            setTimeout(() => setShowTour(true), 1000);
          }
        } catch (error) {
          console.error("Error checking tour status:", error);
        }
      }
    }
  }, []);

  const { data: digitalData, isLoading: digitalDataLoading, error: digitalDataError } = useDigitalData(userId!);
  const { data: streak, isLoading: streakLoading, error: streakError } = useStreak(userId!);
  const { data: randomTip, isLoading: tipLoading } = useRandomTip();
  const scanMutation = useScanDigitalData();
  const updateStreakMutation = useUpdateStreak();

  // Store previous data for comparison
  useEffect(() => {
    if (digitalData && !previousData) {
      setPreviousData(digitalData);
    }
  }, [digitalData]);

  const handleQuickAction = (actionId: string) => {
    // Check if user has premium access
    if (!subscription.isActive && !subscription.isTrial) {
      toast({
        title: "Premium Feature",
        description: "Quick actions are available with DigitalMaestro Pro. Upgrade to start organizing your digital life!",
        variant: "destructive",
      });
      return;
    }
    
    // Add haptic feedback
    nativeFeatures.vibrate(50);
    
    // Store current data as previous before scanning
    setPreviousData(digitalData);
    
    if (userId) {
      scanMutation.mutate(userId);
      updateStreakMutation.mutate(userId);
    }
  };

  const handleQuickScan = () => {
    // Check if user has premium access
    if (!subscription.isActive && !subscription.isTrial) {
      toast({
        title: "Premium Feature",
        description: "File scanning is available with DigitalMaestro Pro. Upgrade to unlock full access!",
        variant: "destructive",
      });
      return;
    }
    
    nativeFeatures.vibrate(100);
    if (userId) {
      setPreviousData(digitalData);
      scanMutation.mutate(userId);
    }
  };

  const handleAutoClean = () => {
    if (userId) {
      updateStreakMutation.mutate(userId);
    }
  };

  const handleCategoryClick = (category: string) => {
    nativeFeatures.vibrate(30);
    // Navigate to specific category in organize page
    window.location.href = `/organize?tab=${category}`;
  };

  const handleRecommendationAction = (recommendationId: string, action: string) => {
    nativeFeatures.vibrate(action === 'accept' ? [100, 50, 100] : 50);
    // Process recommendation action
    if (userId && action === 'accept') {
      scanMutation.mutate(userId);
    }
  };

  if (!userId) {
    return <DashboardSkeleton />;
  }

  if (digitalDataLoading || streakLoading) {
    return <DashboardSkeleton />;
  }

  // Handle errors by showing skeleton for a moment then trying to render with fallback data
  if (digitalDataError || streakError) {
    console.error('Dashboard data error:', digitalDataError || streakError);
  }

  // Get personalized category order based on user preferences
  const categoryOrder = userPreferences ? getCategoryPriority(userPreferences) : ['photos', 'files', 'apps', 'email'];
  
  // Get personalized insights
  const personalizedInsights = userPreferences ? getPersonalizedInsights(userPreferences, digitalData) : [];

  return (
    <motion.div 
      className="min-h-screen min-h-[100dvh] w-full max-w-full overflow-x-hidden bg-ios-gray dark:bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.header 
        className="bg-white dark:bg-gray-900 px-3 sm:px-4 py-3 sm:py-4 border-b border-ios-gray-2 dark:border-gray-700"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <motion.h1 
              className="text-xl sm:text-2xl font-bold text-ios-dark dark:text-white"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              CleanSpace
            </motion.h1>
            <motion.p 
              className="text-ios-gray-3 dark:text-gray-400 text-xs sm:text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Good morning, {userName || "User"}
            </motion.p>
          </motion.div>
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowEnhanced(!showEnhanced)}
                className="p-2"
              >
                <motion.div
                  animate={{ rotate: showEnhanced ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Zap className={`w-5 h-5 ${showEnhanced ? 'text-ios-blue' : 'text-ios-gray-3'}`} />
                </motion.div>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setShowRealDataScanner(!showRealDataScanner)}
                className="p-2"
              >
                <Shield className={`w-5 h-5 ${showRealDataScanner ? 'text-ios-blue' : 'text-ios-gray-3'}`} />
              </Button>
            </motion.div>

            <motion.div 
              className="w-8 h-8 bg-ios-blue rounded-full flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
            >
              <User className="w-4 h-4 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </motion.header>

      {/* Premium Upgrade Banner for Non-Subscribers */}
      {!subscription.isActive && !subscription.isTrial && (
        <motion.div
          className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-4 text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="h-6 w-6 text-yellow-300" />
              <div>
                <h3 className="font-semibold text-sm">Premium Features Preview</h3>
                <p className="text-xs text-blue-100">Upgrade to access all organization tools</p>
              </div>
            </div>
            <Link href="/subscribe">
              <Button 
                size="sm" 
                className="bg-white text-blue-600 hover:bg-gray-100 font-medium"
              >
                Upgrade Now
              </Button>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div 
        className="px-4 py-4"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {digitalDataLoading ? (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Skeleton className="h-32 w-full rounded-2xl" />
              </motion.div>
            ))}
          </motion.div>
        ) : showRealDataScanner ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <RealDataScanner
              onScanComplete={(results) => {
                console.log('Real data scan complete:', results);
                // Here you would integrate with your API to store the results
                setShowRealDataScanner(false);
              }}
              onProgress={(progress) => {
                console.log('Scan progress:', progress);
              }}
            />
          </motion.div>
        ) : showEnhanced ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <EnhancedDashboard
              digitalData={digitalData}
              streak={streak}
              onQuickAction={handleQuickAction}
            />
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <ProgressCard 
                healthScore={digitalData?.healthScore || 0}
                title="Digital Health Score"
                subtitle="Great progress! Keep up the good work."
              />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <motion.h3 
                className="text-lg font-semibold text-ios-dark dark:text-white mb-4"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Declutter Categories
              </motion.h3>
              
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {/* Show personalized insights based on user's primary goal */}
                {personalizedInsights.length > 0 && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mb-6"
                  >
                    <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-800 dark:text-blue-200">
                            {userPreferences?.primaryGoal === 'storage' && 'Storage Focus'}
                            {userPreferences?.primaryGoal === 'organize' && 'Organization Focus'}
                            {userPreferences?.primaryGoal === 'privacy' && 'Privacy Focus'}
                            {userPreferences?.primaryGoal === 'productivity' && 'Productivity Focus'}
                          </h4>
                          <p className="text-sm text-blue-600 dark:text-blue-300">
                            {personalizedInsights[0]?.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                )}

                {/* Render categories in user's preferred order */}
                {categoryOrder.map((categoryId, index) => {
                  const categoryConfig = {
                    photos: {
                      title: "Photos",
                      icon: Images,
                      iconColor: "text-ios-orange",
                      iconBgColor: "bg-ios-orange/10",
                      count: `${digitalData?.photosCount || 0} photos`,
                      alertCount: digitalData?.photosDuplicates || 0,
                      alertLabel: "duplicates",
                      alertColor: "text-ios-red",
                      storage: `${digitalData?.photosStorage || 0} GB`,
                      storagePercent: 65,
                      progressColor: "bg-ios-orange"
                    },
                    files: {
                      title: "Files",
                      icon: Folder,
                      iconColor: "text-ios-blue",
                      iconBgColor: "bg-ios-blue/10",
                      count: `${digitalData?.filesCount || 0} files`,
                      alertCount: digitalData?.filesLarge || 0,
                      alertLabel: "large files",
                      alertColor: "text-ios-orange",
                      storage: `${digitalData?.filesStorage || 0} GB`,
                      storagePercent: 78,
                      progressColor: "bg-ios-blue"
                    },
                    apps: {
                      title: "Apps",
                      icon: Smartphone,
                      iconColor: "text-ios-green",
                      iconBgColor: "bg-ios-green/10",
                      count: `${digitalData?.appsCount || 0} apps`,
                      alertCount: digitalData?.appsUnused || 0,
                      alertLabel: "unused",
                      alertColor: "text-ios-yellow",
                      storage: `${digitalData?.appsStorage || 0} GB`,
                      storagePercent: 45,
                      progressColor: "bg-ios-green"
                    },
                    email: {
                      title: "Email",
                      icon: Mail,
                      iconColor: "text-ios-purple",
                      iconBgColor: "bg-ios-purple/10",
                      count: `${digitalData?.emailCount || 0} emails`,
                      alertCount: digitalData?.emailUnread || 0,
                      alertLabel: "unread",
                      alertColor: "text-ios-red",
                      storage: `${digitalData?.emailStorage || 0} GB`,
                      storagePercent: 52,
                      progressColor: "bg-ios-purple"
                    }
                  };

                  const config = categoryConfig[categoryId];
                  if (!config) return null;

                  return (
                    <motion.div
                      key={categoryId}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                    >
                      <CategoryCard
                        title={config.title}
                        icon={config.icon}
                        iconColor={config.iconColor}
                        iconBgColor={config.iconBgColor}
                        count={config.count}
                        alertCount={config.alertCount}
                        alertLabel={config.alertLabel}
                        alertColor={config.alertColor}
                        storage={config.storage}
                        storagePercent={config.storagePercent}
                        progressColor={config.progressColor}
                        onClick={() => handleCategoryClick(categoryId)}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="px-4 py-4 pb-24"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.h3 
          className="text-lg font-semibold text-ios-dark dark:text-white mb-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          Quick Actions
        </motion.h3>
        <motion.div 
          className="grid grid-cols-2 gap-3 quick-actions"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleQuickScan}
              disabled={scanMutation.isPending}
              className="bg-white dark:bg-gray-800 hover:bg-ios-gray dark:hover:bg-gray-700 text-ios-dark dark:text-white border border-ios-gray-2 dark:border-gray-600 p-4 h-auto flex flex-col items-center space-y-2 w-full"
              variant="outline"
            >
              <motion.div
                animate={{ rotate: scanMutation.isPending ? 360 : 0 }}
                transition={{ duration: 1, repeat: scanMutation.isPending ? Infinity : 0 }}
              >
                <Search className="w-6 h-6 text-ios-blue dark:text-blue-400" />
              </motion.div>
              <span className="text-sm font-medium">
                {scanMutation.isPending ? "Scanning..." : "Quick Scan"}
              </span>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleAutoClean}
              disabled={updateStreakMutation.isPending}
              className="bg-white dark:bg-gray-800 hover:bg-ios-gray dark:hover:bg-gray-700 text-ios-dark dark:text-white border border-ios-gray-2 dark:border-gray-600 p-4 h-auto flex flex-col items-center space-y-2 w-full"
              variant="outline"
            >
              <motion.div
                animate={{ 
                  scale: updateStreakMutation.isPending ? [1, 1.2, 1] : 1,
                  rotate: updateStreakMutation.isPending ? [0, 10, -10, 0] : 0
                }}
                transition={{ 
                  duration: 0.5, 
                  repeat: updateStreakMutation.isPending ? Infinity : 0 
                }}
              >
                <Zap className="w-6 h-6 text-ios-green dark:text-green-400" />
              </motion.div>
              <span className="text-sm font-medium">
                {updateStreakMutation.isPending ? "Cleaning..." : "Auto Clean"}
              </span>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Streak */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        {streakLoading ? (
          <div className="px-4 py-4">
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        ) : (
          <StreakCard
            currentStreak={streak?.currentStreak || 0}
            streakHistory={streak?.streakHistory || []}
          />
        )}
      </motion.div>

      {/* Tip of the Day */}
      <AnimatePresence>
        {!tipLoading && randomTip && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ delay: 1.0 }}
          >
            <TipCard
              title={randomTip.title}
              content={randomTip.content}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smart Recommendations */}
      {digitalData && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="px-4 pb-4"
        >
          <SmartRecommendations
            digitalData={digitalData}
            onRecommendationAction={handleRecommendationAction}
          />
        </motion.div>
      )}

      {/* Guided Tour */}
      <GuidedTour
        isActive={showTour}
        onComplete={() => setShowTour(false)}
      />

      <TabBar />
    </motion.div>
  );
}
