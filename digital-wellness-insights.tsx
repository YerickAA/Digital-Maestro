import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  Brain, 
  Heart, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Shield,
  Target,
  Zap
} from "lucide-react";

interface WellnessMetric {
  name: string;
  value: number;
  trend: "up" | "down" | "stable";
  status: "good" | "warning" | "critical";
  description: string;
  recommendation: string;
}

interface DigitalWellnessInsightsProps {
  digitalData: any;
  streak: any;
}

export default function DigitalWellnessInsights({ digitalData, streak }: DigitalWellnessInsightsProps) {
  const [wellnessMetrics, setWellnessMetrics] = useState<WellnessMetric[]>([]);
  const [overallWellnessScore, setOverallWellnessScore] = useState(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    calculateWellnessMetrics();
    generateRecommendations();
  }, [digitalData, streak]);

  const calculateWellnessMetrics = () => {
    const metrics: WellnessMetric[] = [
      {
        name: "Digital Clutter",
        value: 100 - (digitalData?.healthScore || 0),
        trend: digitalData?.healthScore > 75 ? "down" : "up",
        status: digitalData?.healthScore > 75 ? "good" : digitalData?.healthScore > 50 ? "warning" : "critical",
        description: "Level of digital disorganization affecting mental clarity",
        recommendation: "Focus on organizing files and removing duplicates"
      },
      {
        name: "Storage Stress",
        value: Math.min(100, ((digitalData?.photosCount || 0) + (digitalData?.filesCount || 0)) / 100),
        trend: "stable",
        status: "warning",
        description: "Storage pressure impacting device performance",
        recommendation: "Archive old files and optimize storage usage"
      },
      {
        name: "App Overwhelm",
        value: Math.min(100, (digitalData?.appsCount || 0) / 2),
        trend: "up",
        status: (digitalData?.appsUnused || 0) > 5 ? "warning" : "good",
        description: "Cognitive load from too many installed applications",
        recommendation: "Remove unused apps to reduce mental clutter"
      },
      {
        name: "Email Anxiety",
        value: Math.min(100, (digitalData?.emailUnread || 0) / 5),
        trend: "up",
        status: (digitalData?.emailUnread || 0) > 50 ? "critical" : "warning",
        description: "Stress from unmanaged email communications",
        recommendation: "Set up email filters and unsubscribe from unwanted lists"
      },
      {
        name: "Maintenance Consistency",
        value: (streak?.currentStreak || 0) * 10,
        trend: (streak?.currentStreak || 0) > 3 ? "up" : "down",
        status: (streak?.currentStreak || 0) > 5 ? "good" : "warning",
        description: "Regularity of digital organization habits",
        recommendation: "Maintain daily cleanup habits for lasting benefits"
      }
    ];

    setWellnessMetrics(metrics);
    
    // Calculate overall wellness score
    const avgScore = metrics.reduce((sum, metric) => sum + (100 - metric.value), 0) / metrics.length;
    setOverallWellnessScore(Math.round(avgScore));
  };

  const generateRecommendations = () => {
    const recs: string[] = [];
    
    if ((digitalData?.healthScore || 0) < 70) {
      recs.push("Schedule 15 minutes daily for digital organization");
    }
    
    if ((digitalData?.appsUnused || 0) > 5) {
      recs.push("Consider a monthly app audit to remove unused applications");
    }
    
    if ((digitalData?.emailUnread || 0) > 50) {
      recs.push("Implement the 'Inbox Zero' methodology for email management");
    }
    
    if ((digitalData?.photosCount || 0) > 1000) {
      recs.push("Create photo albums and delete duplicates to reduce cognitive load");
    }
    
    if ((streak?.currentStreak || 0) < 3) {
      recs.push("Set up daily reminders to maintain consistent digital hygiene");
    }
    
    recs.push("Take regular breaks from device usage to prevent digital fatigue");
    
    setRecommendations(recs);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "good": return "text-ios-green";
      case "warning": return "text-ios-orange";
      case "critical": return "text-ios-red";
      default: return "text-ios-gray-3";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "good": return "bg-ios-green";
      case "warning": return "bg-ios-orange";
      case "critical": return "bg-ios-red";
      default: return "bg-ios-gray-3";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="w-4 h-4 text-ios-red" />;
      case "down": return <TrendingDown className="w-4 h-4 text-ios-green" />;
      default: return <Activity className="w-4 h-4 text-ios-gray-3" />;
    }
  };

  const getOverallWellnessStatus = () => {
    if (overallWellnessScore >= 80) return { status: "good", message: "Excellent digital wellness!" };
    if (overallWellnessScore >= 60) return { status: "warning", message: "Good digital wellness with room for improvement" };
    return { status: "critical", message: "Digital wellness needs attention" };
  };

  const wellnessStatus = getOverallWellnessStatus();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ios-dark dark:text-white">
          Digital Wellness Insights
        </h3>
        <Badge variant="outline" className="text-ios-blue border-ios-blue">
          <Brain className="w-3 h-3 mr-1" />
          Wellness
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="recommendations">Tips</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Overall Wellness Score */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-full ${getStatusBadgeColor(wellnessStatus.status)}/10 flex items-center justify-center`}>
                  <Heart className={`w-6 h-6 ${getStatusColor(wellnessStatus.status)}`} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-ios-dark dark:text-white">
                    {overallWellnessScore}%
                  </h4>
                  <p className="text-sm text-ios-gray-3 dark:text-gray-400">
                    Overall Digital Wellness
                  </p>
                </div>
              </div>
              <Badge className={getStatusBadgeColor(wellnessStatus.status)}>
                {wellnessStatus.status === "good" ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertTriangle className="w-3 h-3 mr-1" />}
                {wellnessStatus.status}
              </Badge>
            </div>
            
            <Progress value={overallWellnessScore} className="h-3 mb-3" />
            <p className="text-sm text-ios-gray-3 dark:text-gray-400">
              {wellnessStatus.message}
            </p>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Smartphone className="w-5 h-5 text-ios-blue" />
                <span className="text-sm font-medium text-ios-dark dark:text-white">Digital Load</span>
              </div>
              <div className="text-2xl font-bold text-ios-dark dark:text-white mb-1">
                {((digitalData?.photosCount || 0) + (digitalData?.filesCount || 0) + (digitalData?.appsCount || 0)).toLocaleString()}
              </div>
              <div className="text-xs text-ios-gray-3 dark:text-gray-400">
                Total digital items
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-ios-orange" />
                <span className="text-sm font-medium text-ios-dark dark:text-white">Maintenance</span>
              </div>
              <div className="text-2xl font-bold text-ios-dark dark:text-white mb-1">
                {streak?.currentStreak || 0}
              </div>
              <div className="text-xs text-ios-gray-3 dark:text-gray-400">
                Day cleanup streak
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          {wellnessMetrics.map((metric, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full ${getStatusBadgeColor(metric.status)}/10 flex items-center justify-center`}>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-ios-dark dark:text-white">{metric.name}</h4>
                    <p className="text-sm text-ios-gray-3 dark:text-gray-400">{metric.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getStatusColor(metric.status)}`}>
                    {metric.value.toFixed(0)}%
                  </div>
                  <Badge size="sm" className={getStatusBadgeColor(metric.status)}>
                    {metric.status}
                  </Badge>
                </div>
              </div>
              
              <Progress value={metric.value} className="h-2 mb-2" />
              <p className="text-sm text-ios-gray-3 dark:text-gray-400">
                💡 {metric.recommendation}
              </p>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Lightbulb className="w-5 h-5 text-ios-orange" />
              <h4 className="font-semibold text-ios-dark dark:text-white">Personalized Recommendations</h4>
            </div>
            
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-ios-gray dark:bg-gray-800 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-ios-blue/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-ios-blue">{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-sm text-ios-dark dark:text-white">{rec}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Wellness Tips */}
          <Card className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="w-5 h-5 text-ios-green" />
              <h4 className="font-semibold text-ios-dark dark:text-white">Digital Wellness Tips</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-ios-green/5 rounded-lg">
                <Target className="w-5 h-5 text-ios-green mt-0.5" />
                <div>
                  <h5 className="font-medium text-ios-dark dark:text-white">Set Digital Boundaries</h5>
                  <p className="text-sm text-ios-gray-3 dark:text-gray-400">
                    Designate specific times for email checking and file organization
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-ios-blue/5 rounded-lg">
                <Zap className="w-5 h-5 text-ios-blue mt-0.5" />
                <div>
                  <h5 className="font-medium text-ios-dark dark:text-white">Practice Digital Minimalism</h5>
                  <p className="text-sm text-ios-gray-3 dark:text-gray-400">
                    Keep only what you need and use regularly
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-3 bg-ios-orange/5 rounded-lg">
                <Clock className="w-5 h-5 text-ios-orange mt-0.5" />
                <div>
                  <h5 className="font-medium text-ios-dark dark:text-white">Regular Digital Detox</h5>
                  <p className="text-sm text-ios-gray-3 dark:text-gray-400">
                    Take breaks from screens to maintain mental clarity
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}