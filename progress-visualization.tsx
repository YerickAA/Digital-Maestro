import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Calendar, 
  Award, 
  BarChart3,
  Target,
  Zap,
  Clock,
  HardDrive,
  CheckCircle,
  Trophy,
  Star,
  Medal
} from "lucide-react";

interface ProgressData {
  date: string;
  healthScore: number;
  storageUsed: number;
  itemsProcessed: number;
  category: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  progress: number;
  maxProgress: number;
  type: "bronze" | "silver" | "gold" | "platinum";
}

interface ProgressVisualizationProps {
  digitalData: any;
  streak: any;
}

export default function ProgressVisualization({ digitalData, streak }: ProgressVisualizationProps) {
  const [progressHistory, setProgressHistory] = useState<ProgressData[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    generateProgressHistory();
    generateAchievements();
  }, [digitalData, streak]);

  const generateProgressHistory = () => {
    const history: ProgressData[] = [];
    const today = new Date();
    
    // Generate 30 days of mock progress data
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const baseScore = digitalData?.healthScore || 0;
      const variation = Math.random() * 20 - 10; // ±10 variation
      const score = Math.max(0, Math.min(100, baseScore + variation));
      
      history.push({
        date: date.toISOString().split('T')[0],
        healthScore: Math.round(score),
        storageUsed: Math.round(15 + Math.random() * 10), // GB
        itemsProcessed: Math.round(Math.random() * 50),
        category: ["photos", "files", "apps", "email"][Math.floor(Math.random() * 4)]
      });
    }
    
    setProgressHistory(history);
  };

  const generateAchievements = () => {
    const baseAchievements: Achievement[] = [
      {
        id: "first-cleanup",
        title: "First Steps",
        description: "Complete your first digital cleanup",
        icon: "🎯",
        unlockedAt: "2024-01-15",
        progress: 1,
        maxProgress: 1,
        type: "bronze"
      },
      {
        id: "streak-master",
        title: "Streak Master",
        description: "Maintain a 7-day cleanup streak",
        icon: "🔥",
        unlockedAt: streak?.currentStreak >= 7 ? "2024-01-16" : "",
        progress: streak?.currentStreak || 0,
        maxProgress: 7,
        type: "silver"
      },
      {
        id: "storage-saver",
        title: "Storage Saver",
        description: "Free up 1GB of storage space",
        icon: "💾",
        unlockedAt: "2024-01-17",
        progress: 1024,
        maxProgress: 1024,
        type: "gold"
      },
      {
        id: "perfectionist",
        title: "Digital Perfectionist",
        description: "Achieve 100% health score",
        icon: "⭐",
        unlockedAt: digitalData?.healthScore >= 100 ? "2024-01-18" : "",
        progress: digitalData?.healthScore || 0,
        maxProgress: 100,
        type: "platinum"
      },
      {
        id: "duplicate-hunter",
        title: "Duplicate Hunter",
        description: "Remove 50 duplicate photos",
        icon: "🔍",
        unlockedAt: "",
        progress: 23,
        maxProgress: 50,
        type: "bronze"
      },
      {
        id: "app-cleaner",
        title: "App Cleaner",
        description: "Remove 10 unused apps",
        icon: "📱",
        unlockedAt: "",
        progress: 6,
        maxProgress: 10,
        type: "silver"
      }
    ];

    setAchievements(baseAchievements);
  };

  const getAchievementColor = (type: string) => {
    switch (type) {
      case "bronze": return "text-amber-600";
      case "silver": return "text-gray-500";
      case "gold": return "text-yellow-500";
      case "platinum": return "text-purple-500";
      default: return "text-ios-gray-3";
    }
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case "bronze": return <Medal className="w-5 h-5" />;
      case "silver": return <Award className="w-5 h-5" />;
      case "gold": return <Trophy className="w-5 h-5" />;
      case "platinum": return <Star className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  const currentHealthScore = digitalData?.healthScore || 0;
  const previousHealthScore = progressHistory[progressHistory.length - 7]?.healthScore || 0;
  const healthTrend = currentHealthScore - previousHealthScore;

  const totalStorageFreed = progressHistory.reduce((sum, day) => sum + (day.itemsProcessed * 2.5), 0);
  const totalItemsProcessed = progressHistory.reduce((sum, day) => sum + day.itemsProcessed, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ios-dark dark:text-white">
          Progress Visualization
        </h3>
        <Badge variant="outline" className="text-ios-blue border-ios-blue">
          <TrendingUp className="w-3 h-3 mr-1" />
          Analytics
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-ios-blue" />
                  <span className="text-sm font-medium text-ios-dark dark:text-white">Health Score</span>
                </div>
                <div className={`text-sm ${healthTrend >= 0 ? 'text-ios-green' : 'text-ios-red'}`}>
                  {healthTrend >= 0 ? '+' : ''}{healthTrend}
                </div>
              </div>
              <div className="text-2xl font-bold text-ios-dark dark:text-white mb-2">
                {currentHealthScore}%
              </div>
              <Progress value={currentHealthScore} className="h-2" />
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-ios-orange" />
                <span className="text-sm font-medium text-ios-dark dark:text-white">Current Streak</span>
              </div>
              <div className="text-2xl font-bold text-ios-dark dark:text-white mb-2">
                {streak?.currentStreak || 0} days
              </div>
              <div className="text-sm text-ios-gray-3 dark:text-gray-400">
                Longest: {streak?.longestStreak || 0} days
              </div>
            </Card>
          </div>

          {/* Storage & Items */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <HardDrive className="w-5 h-5 text-ios-green" />
                <span className="text-sm font-medium text-ios-dark dark:text-white">Storage Freed</span>
              </div>
              <div className="text-2xl font-bold text-ios-dark dark:text-white">
                {totalStorageFreed.toFixed(1)} MB
              </div>
              <div className="text-sm text-ios-gray-3 dark:text-gray-400">
                Last 30 days
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="w-5 h-5 text-ios-red" />
                <span className="text-sm font-medium text-ios-dark dark:text-white">Items Processed</span>
              </div>
              <div className="text-2xl font-bold text-ios-dark dark:text-white">
                {totalItemsProcessed}
              </div>
              <div className="text-sm text-ios-gray-3 dark:text-gray-400">
                Total items cleaned
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-ios-dark dark:text-white">30-Day Progress</h4>
              <Calendar className="w-5 h-5 text-ios-gray-3" />
            </div>
            
            <div className="space-y-3">
              {progressHistory.slice(-7).reverse().map((day, index) => (
                <div key={day.date} className="flex items-center justify-between p-3 bg-ios-gray dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-ios-blue rounded-full"></div>
                    <div>
                      <div className="text-sm font-medium text-ios-dark dark:text-white">
                        {new Date(day.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-ios-gray-3 dark:text-gray-400">
                        {day.itemsProcessed} items • {day.category}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-ios-dark dark:text-white">
                      {day.healthScore}%
                    </div>
                    <div className="text-xs text-ios-gray-3 dark:text-gray-400">
                      {day.storageUsed} GB
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`p-4 ${achievement.unlockedAt ? 'border-ios-blue' : 'border-ios-gray-2 dark:border-gray-700'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full ${achievement.unlockedAt ? 'bg-ios-blue/10' : 'bg-ios-gray-2 dark:bg-gray-700'} flex items-center justify-center`}>
                      {achievement.unlockedAt ? (
                        <span className="text-lg">{achievement.icon}</span>
                      ) : (
                        <div className={`${getAchievementColor(achievement.type)}`}>
                          {getAchievementIcon(achievement.type)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className={`font-semibold ${achievement.unlockedAt ? 'text-ios-dark dark:text-white' : 'text-ios-gray-3 dark:text-gray-400'}`}>
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-ios-gray-3 dark:text-gray-400">
                        {achievement.description}
                      </p>
                      {achievement.unlockedAt && (
                        <div className="text-xs text-ios-blue mt-1">
                          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {achievement.unlockedAt ? (
                      <Badge className="bg-ios-green text-white">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Unlocked
                      </Badge>
                    ) : (
                      <div className="space-y-1">
                        <div className="text-sm text-ios-gray-3 dark:text-gray-400">
                          {achievement.progress}/{achievement.maxProgress}
                        </div>
                        <Progress 
                          value={(achievement.progress / achievement.maxProgress) * 100} 
                          className="w-20 h-2"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}