import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  TrendingDown,
  Activity,
  HardDrive,
  Smartphone,
  Image,
  Mail,
  CheckCircle
} from "lucide-react";

interface AnimatedStatsProps {
  digitalData: any;
  previousData?: any;
}

export default function AnimatedStats({ digitalData, previousData }: AnimatedStatsProps) {
  const [animatedValues, setAnimatedValues] = useState({
    healthScore: 0,
    photosCount: 0,
    filesCount: 0,
    appsCount: 0,
    emailCount: 0
  });

  useEffect(() => {
    if (digitalData) {
      // Animate values to their targets
      const targets = {
        healthScore: digitalData.healthScore || 0,
        photosCount: digitalData.photosCount || 0,
        filesCount: digitalData.filesCount || 0,
        appsCount: digitalData.appsCount || 0,
        emailCount: digitalData.emailUnread || 0
      };

      Object.entries(targets).forEach(([key, target]) => {
        const start = animatedValues[key as keyof typeof animatedValues];
        const duration = 1000; // 1 second
        const startTime = Date.now();

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);
          
          // Easing function for smooth animation
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentValue = Math.round(start + (target - start) * easeOut);

          setAnimatedValues(prev => ({
            ...prev,
            [key]: currentValue
          }));

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      });
    }
  }, [digitalData]);

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return "text-ios-green";
    if (score >= 60) return "text-ios-orange";
    return "text-ios-red";
  };

  const getHealthScoreGradient = (score: number) => {
    if (score >= 80) return "from-ios-green to-ios-green/80";
    if (score >= 60) return "from-ios-orange to-ios-orange/80";
    return "from-ios-red to-ios-red/80";
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-ios-green" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-ios-red" />;
    return <Activity className="w-4 h-4 text-ios-gray-3" />;
  };

  const statsData = [
    {
      title: "Photos",
      value: animatedValues.photosCount,
      previous: previousData?.photosCount || 0,
      icon: <Image className="w-5 h-5" />,
      color: "text-ios-orange",
      bgColor: "bg-ios-orange/10"
    },
    {
      title: "Files",
      value: animatedValues.filesCount,
      previous: previousData?.filesCount || 0,
      icon: <HardDrive className="w-5 h-5" />,
      color: "text-ios-blue",
      bgColor: "bg-ios-blue/10"
    },
    {
      title: "Apps",
      value: animatedValues.appsCount,
      previous: previousData?.appsCount || 0,
      icon: <Smartphone className="w-5 h-5" />,
      color: "text-ios-green",
      bgColor: "bg-ios-green/10"
    },
    {
      title: "Emails",
      value: animatedValues.emailCount,
      previous: previousData?.emailCount || 0,
      icon: <Mail className="w-5 h-5" />,
      color: "text-ios-red",
      bgColor: "bg-ios-red/10"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Health Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`p-6 bg-gradient-to-r ${getHealthScoreGradient(animatedValues.healthScore)} text-white`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Digital Health Score</h3>
              <p className="text-white/80 text-sm">
                Overall system cleanliness
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-white/80" />
              {previousData && getTrendIcon(animatedValues.healthScore, previousData.healthScore || 0)}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <motion.span 
                className="text-3xl font-bold"
                key={animatedValues.healthScore}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {animatedValues.healthScore}%
              </motion.span>
              <div className="text-right text-sm text-white/80">
                {animatedValues.healthScore >= 80 ? "Excellent" : 
                 animatedValues.healthScore >= 60 ? "Good" : "Needs Work"}
              </div>
            </div>
            <Progress 
              value={animatedValues.healthScore} 
              className="h-2 bg-white/20"
            />
          </div>

          {animatedValues.healthScore >= 90 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 p-3 bg-white/20 rounded-lg text-center"
            >
              <p className="font-medium">🎉 Outstanding!</p>
              <p className="text-sm text-white/80">Your digital space is pristine</p>
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 gap-4">
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                  <div className={stat.color}>
                    {stat.icon}
                  </div>
                </div>
                {previousData && getTrendIcon(stat.value, stat.previous)}
              </div>
              
              <div className="space-y-1">
                <motion.div 
                  className="text-2xl font-bold text-ios-dark dark:text-white"
                  key={stat.value}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {stat.value.toLocaleString()}
                </motion.div>
                <div className="text-sm text-ios-gray-3 dark:text-gray-400">
                  {stat.title}
                </div>
                
                {previousData && (
                  <div className="text-xs text-ios-gray-3 dark:text-gray-400">
                    {stat.value > stat.previous ? "+" : ""}
                    {stat.value - stat.previous} from last scan
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}