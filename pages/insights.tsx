import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Calendar, Target, Award } from "lucide-react";
import TabBar from "@/components/tab-bar";
import { useDigitalData, useStreak } from "@/hooks/use-digital-data";
import SmartSuggestions from "@/components/smart-suggestions";
import ProgressVisualization from "@/components/progress-visualization";
import DigitalWellnessInsights from "@/components/digital-wellness-insights";
import ExportTools from "@/components/export-tools";
import Paywall from "@/components/paywall";
import { InsightsSkeleton } from "@/components/skeleton-loading";
import { nativeFeatures } from "@/lib/native-features";
import { useSubscription } from "@/hooks/use-subscription";

export default function Insights() {
  const [userId, setUserId] = useState<number | null>(null);
  const subscription = useSubscription();

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(parseInt(storedUserId));
    }
  }, []);

  const { data: digitalData, isLoading: digitalDataLoading } = useDigitalData(userId!);
  const { data: streak, isLoading: streakLoading } = useStreak(userId!);

  const handleSuggestionAction = (suggestionId: string, action: string) => {
    nativeFeatures.vibrate(action === 'accept' ? [100, 50, 100] : 50);
    // Process suggestion action
  };

  const handleExport = (exportType: string, options: any) => {
    nativeFeatures.vibrate(100);
    // Process export functionality
  };

  const mockInsights = {
    storageFreed: 2.4,
    itemsDeleted: 156,
    duplicatesRemoved: 89,
    weeklyProgress: [
      { day: "Mon", score: 65 },
      { day: "Tue", score: 68 },
      { day: "Wed", score: 72 },
      { day: "Thu", score: 74 },
      { day: "Fri", score: 77 },
      { day: "Sat", score: 75 },
      { day: "Sun", score: 78 },
    ],
    categories: [
      { name: "Photos", improvement: 12, trend: "up" },
      { name: "Files", improvement: 8, trend: "up" },
      { name: "Apps", improvement: -2, trend: "down" },
      { name: "Email", improvement: 15, trend: "up" },
    ],
    achievements: [
      { name: "First Cleanup", description: "Completed your first digital cleanup", earned: true },
      { name: "Week Warrior", description: "Maintained a 7-day streak", earned: true },
      { name: "Space Saver", description: "Freed up 1GB of storage", earned: true },
      { name: "Declutter Master", description: "Reached 80% health score", earned: false },
    ],
  };

  if (!userId || digitalDataLoading || streakLoading) {
    return <InsightsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-ios-gray dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 px-4 py-4 border-b border-ios-gray-2 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-ios-dark dark:text-white">Insights</h1>
        <p className="text-ios-gray-3 dark:text-gray-400 text-sm">Track your digital decluttering progress</p>
      </header>

      <div className="p-4 pb-24">
        {!subscription.isActive && !subscription.isTrial ? (
          <div className="space-y-4">
            <Paywall
              feature="Advanced Analytics & Insights"
              description="Get detailed insights into your digital habits, smart cleanup recommendations, and progress tracking. Upgrade to DigitalMaestro Pro to unlock powerful analytics tools."
              icon={TrendingUp}
            />
            <Paywall
              feature="Smart Suggestions"
              description="AI-powered recommendations to optimize your digital organization and improve your productivity."
              icon={Target}
            />
            <Paywall
              feature="Digital Wellness Tracking"
              description="Monitor your digital wellness metrics and get personalized recommendations for a healthier digital lifestyle."
              icon={Award}
            />
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="suggestions">Smart</TabsTrigger>
              <TabsTrigger value="wellness">Wellness</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

          <TabsContent value="overview" className="space-y-4">
        {/* Weekly Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-ios-green" />
              <span>Weekly Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2">
                {mockInsights.weeklyProgress.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-ios-gray-3 dark:text-gray-400 mb-1">{day.day}</div>
                    <div className="w-full bg-ios-gray-2 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-ios-blue h-2 rounded-full transition-all duration-300"
                        style={{ width: `${day.score}%` }}
                      />
                    </div>
                    <div className="text-xs text-ios-dark dark:text-white mt-1">{day.score}</div>
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-sm text-ios-gray-3 dark:text-gray-400">
                  Average health score: <span className="font-semibold text-ios-dark dark:text-white">72</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-ios-green mb-1">
                  {mockInsights.storageFreed} GB
                </div>
                <div className="text-sm text-ios-gray-3 dark:text-gray-400">Storage Freed</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-ios-blue mb-1">
                  {mockInsights.itemsDeleted}
                </div>
                <div className="text-sm text-ios-gray-3 dark:text-gray-400">Items Deleted</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Improvements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-ios-blue" />
              <span>Category Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockInsights.categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-ios-dark dark:text-white">{category.name}</span>
                    {category.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-ios-green" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-ios-red" />
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-sm font-medium ${
                        category.improvement > 0 ? "text-ios-green" : "text-ios-red"
                      }`}
                    >
                      {category.improvement > 0 ? "+" : ""}{category.improvement}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Streak Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-ios-orange" />
              <span>Streak Stats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-ios-orange mb-1">
                  {streak?.currentStreak || 0}
                </div>
                <div className="text-sm text-ios-gray-3">Current Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-ios-blue mb-1">
                  {streak?.longestStreak || 0}
                </div>
                <div className="text-sm text-ios-gray-3">Longest Streak</div>
              </div>
            </div>
          </CardContent>
        </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-ios-green" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockInsights.achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          achievement.earned ? "bg-ios-green" : "bg-ios-gray-2"
                        }`}
                      >
                        <Award
                          className={`w-4 h-4 ${
                            achievement.earned ? "text-white" : "text-ios-gray-3"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-ios-dark">{achievement.name}</p>
                        <p className="text-sm text-ios-gray-3">{achievement.description}</p>
                      </div>
                      {achievement.earned && (
                        <Badge className="bg-ios-green text-white">Earned</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Progress Visualization */}
            <ProgressVisualization digitalData={digitalData} streak={streak} />
          </TabsContent>

          <TabsContent value="suggestions" className="space-y-4">
            <SmartSuggestions digitalData={digitalData} onSuggestionAction={handleSuggestionAction} />
          </TabsContent>

          <TabsContent value="wellness" className="space-y-4">
            <DigitalWellnessInsights digitalData={digitalData} streak={streak} />
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <ExportTools digitalData={digitalData} streak={streak} onExport={handleExport} />
          </TabsContent>
        </Tabs>
        )}
      </div>

      <TabBar />
    </div>
  );
}
