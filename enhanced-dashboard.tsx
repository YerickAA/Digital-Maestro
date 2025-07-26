import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Target,
  Zap,
  CheckCircle,
  ArrowRight,
  Calendar,
  Award
} from "lucide-react";
import { motion } from "framer-motion";

interface EnhancedDashboardProps {
  digitalData: any;
  streak: any;
  onQuickAction: (action: string) => void;
}

export default function EnhancedDashboard({ digitalData, streak, onQuickAction }: EnhancedDashboardProps) {
  const [todaysGoal, setTodaysGoal] = useState(0);
  const [completedActions, setCompletedActions] = useState(0);
  const [quickWins, setQuickWins] = useState<any[]>([]);

  useEffect(() => {
    generateDailyGoal();
    generateQuickWins();
  }, [digitalData]);

  const generateDailyGoal = () => {
    const healthScore = digitalData?.healthScore || 0;
    if (healthScore < 50) {
      setTodaysGoal(5); // 5 actions for low health
    } else if (healthScore < 80) {
      setTodaysGoal(3); // 3 actions for medium health
    } else {
      setTodaysGoal(1); // 1 action for high health
    }
  };

  const generateQuickWins = () => {
    const wins = [];
    
    if ((digitalData?.photosDuplicates || 0) > 0) {
      wins.push({
        id: 'remove-duplicates',
        title: 'Remove Photo Duplicates',
        description: `Delete ${digitalData.photosDuplicates} duplicate photos`,
        impact: '+15 health points',
        timeEstimate: '2 min',
        icon: <Sparkles className="w-4 h-4" />,
        color: 'bg-ios-orange'
      });
    }

    if ((digitalData?.appsUnused || 0) > 0) {
      wins.push({
        id: 'remove-apps',
        title: 'Delete Unused Apps',
        description: `Remove ${digitalData.appsUnused} unused apps`,
        impact: '+20 health points',
        timeEstimate: '3 min',
        icon: <Zap className="w-4 h-4" />,
        color: 'bg-ios-blue'
      });
    }

    if ((digitalData?.emailUnread || 0) > 50) {
      wins.push({
        id: 'clean-email',
        title: 'Clean Email Inbox',
        description: `Archive ${digitalData.emailUnread} unread emails`,
        impact: '+10 health points',
        timeEstimate: '5 min',
        icon: <Target className="w-4 h-4" />,
        color: 'bg-ios-green'
      });
    }

    setQuickWins(wins.slice(0, 3));
  };

  const handleQuickAction = (actionId: string) => {
    setCompletedActions(prev => prev + 1);
    onQuickAction(actionId);
  };

  const progressPercentage = todaysGoal > 0 ? (completedActions / todaysGoal) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Daily Goal Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 bg-gradient-to-r from-ios-blue to-ios-green text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Today's Goal</h3>
              <p className="text-white/80 text-sm">
                Complete {todaysGoal} cleanup actions
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-white/80" />
              <span className="text-sm text-white/80">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">
                {completedActions} of {todaysGoal} completed
              </span>
              <span className="text-sm font-medium">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              className="h-2 bg-white/20"
            />
          </div>

          {completedActions >= todaysGoal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4 p-3 bg-white/20 rounded-lg text-center"
            >
              <CheckCircle className="w-6 h-6 mx-auto mb-2" />
              <p className="font-medium">Goal Achieved!</p>
              <p className="text-sm text-white/80">Great job staying organized</p>
            </motion.div>
          )}
        </Card>
      </motion.div>

      {/* Quick Wins */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ios-dark dark:text-white">
            Quick Wins
          </h3>
          <Badge variant="outline" className="text-ios-blue border-ios-blue">
            <TrendingUp className="w-3 h-3 mr-1" />
            High Impact
          </Badge>
        </div>

        <div className="space-y-3">
          {quickWins.map((win, index) => (
            <motion.div
              key={win.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full ${win.color}/10 flex items-center justify-center`}>
                      <div className={`${win.color.replace('bg-', 'text-')}`}>
                        {win.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-ios-dark dark:text-white">
                        {win.title}
                      </h4>
                      <p className="text-sm text-ios-gray-3 dark:text-gray-400">
                        {win.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-ios-green">
                        {win.impact}
                      </div>
                      <div className="text-xs text-ios-gray-3 dark:text-gray-400 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {win.timeEstimate}
                      </div>
                    </div>
                    
                    <Button
                      size="sm"
                      onClick={() => handleQuickAction(win.id)}
                      className="bg-ios-blue hover:bg-ios-blue/90 text-white"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Streak Motivation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-ios-orange/10 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-ios-orange" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ios-dark dark:text-white">
                  Streak Progress
                </h3>
                <p className="text-sm text-ios-gray-3 dark:text-gray-400">
                  Keep your momentum going!
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-ios-orange">
                {streak?.currentStreak || 0}
              </div>
              <div className="text-sm text-ios-gray-3 dark:text-gray-400">
                day streak
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }, (_, i) => (
              <div key={i} className="text-center">
                <div className="text-xs text-ios-gray-3 dark:text-gray-400 mb-1">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  i < (streak?.currentStreak || 0) 
                    ? 'bg-ios-orange text-white' 
                    : 'bg-ios-gray-2 dark:bg-gray-700'
                }`}>
                  {i < (streak?.currentStreak || 0) && (
                    <CheckCircle className="w-4 h-4" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}