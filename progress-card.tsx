import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

interface ProgressCardProps {
  healthScore: number;
  title?: string;
  subtitle?: string;
}

export default function ProgressCard({ 
  healthScore, 
  title = "Digital Health Score",
  subtitle = "Great progress! Keep up the good work."
}: ProgressCardProps) {
  const getHealthScoreGradient = (score: number) => {
    if (score >= 80) return "from-green-500 to-white dark:to-gray-900";
    if (score >= 60) return "from-yellow-500 to-white dark:to-gray-900";
    return "from-red-500 to-white dark:to-gray-900";
  };

  return (
    <div className="px-3 sm:px-4 py-3 sm:py-4 bg-white dark:bg-gray-900 progress-card">
      <Card className={`p-6 bg-gradient-to-r ${getHealthScoreGradient(healthScore)} shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="text-white/90 text-sm">
              {subtitle}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-white">
              {healthScore}
            </span>
            <div className="text-right text-sm text-white/90">
              out of 100
            </div>
          </div>
          <Progress 
            value={healthScore} 
            className="h-2 bg-white/30"
          />
        </div>
      </Card>
    </div>
  );
}
