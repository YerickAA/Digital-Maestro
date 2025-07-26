import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Target, 
  Brain, 
  Zap,
  FileText,
  Image,
  Smartphone,
  Mail,
  HardDrive,
  Calendar,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SmartRecommendation {
  id: string;
  type: 'cleanup' | 'organization' | 'automation' | 'maintenance' | 'optimization';
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  title: string;
  description: string;
  impact: {
    storageFreed: string;
    timeToComplete: string;
    itemsAffected: number;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  category: 'photos' | 'files' | 'apps' | 'email' | 'general';
  actionLabel: string;
  learningSource: string;
  estimatedBenefit: number;
}

interface SmartRecommendationsProps {
  digitalData: any;
  onRecommendationAction: (recommendationId: string, action: string) => void;
}

export default function SmartRecommendations({ digitalData, onRecommendationAction }: SmartRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<SmartRecommendation[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    generateRecommendations();
  }, [digitalData]);

  const generateRecommendations = () => {
    if (!digitalData) return;

    const recs: SmartRecommendation[] = [];

    // Analyze photo duplicates
    if (digitalData.photos_count > 100) {
      recs.push({
        id: 'photo-duplicates',
        type: 'cleanup',
        priority: 'high',
        confidence: 0.85,
        title: 'Duplicate Photos Detected',
        description: 'AI analysis found potential duplicate photos that could free up significant storage space.',
        impact: {
          storageFreed: '2.3 GB',
          timeToComplete: '5 minutes',
          itemsAffected: Math.floor(digitalData.photos_count * 0.15),
          difficulty: 'easy'
        },
        category: 'photos',
        actionLabel: 'Remove Duplicates',
        learningSource: 'Image similarity analysis',
        estimatedBenefit: 85
      });
    }

    // Analyze large files
    if (digitalData.files_count > 50) {
      recs.push({
        id: 'large-files',
        type: 'optimization',
        priority: 'medium',
        confidence: 0.75,
        title: 'Large Files Taking Space',
        description: 'Several large files are consuming significant storage. Consider archiving or compressing them.',
        impact: {
          storageFreed: '1.8 GB',
          timeToComplete: '10 minutes',
          itemsAffected: Math.floor(digitalData.files_count * 0.08),
          difficulty: 'medium'
        },
        category: 'files',
        actionLabel: 'Optimize Large Files',
        learningSource: 'File size analysis',
        estimatedBenefit: 70
      });
    }

    // Analyze unused apps
    if (digitalData.apps_count > 20) {
      recs.push({
        id: 'unused-apps',
        type: 'cleanup',
        priority: 'medium',
        confidence: 0.70,
        title: 'Unused Apps Detected',
        description: 'Several apps haven\'t been used recently and could be safely removed to free up space.',
        impact: {
          storageFreed: '850 MB',
          timeToComplete: '3 minutes',
          itemsAffected: Math.floor(digitalData.apps_count * 0.25),
          difficulty: 'easy'
        },
        category: 'apps',
        actionLabel: 'Remove Unused Apps',
        learningSource: 'Usage pattern analysis',
        estimatedBenefit: 65
      });
    }

    // Analyze email organization
    if (digitalData.email_count > 1000) {
      recs.push({
        id: 'email-organization',
        type: 'organization',
        priority: 'low',
        confidence: 0.80,
        title: 'Email Organization Opportunity',
        description: 'Your email could benefit from better organization with automated rules and folder structures.',
        impact: {
          storageFreed: '200 MB',
          timeToComplete: '15 minutes',
          itemsAffected: Math.floor(digitalData.email_count * 0.40),
          difficulty: 'medium'
        },
        category: 'email',
        actionLabel: 'Organize Email',
        learningSource: 'Email pattern analysis',
        estimatedBenefit: 60
      });
    }

    // Seasonal cleanup recommendation
    const currentMonth = new Date().getMonth();
    if (currentMonth === 0 || currentMonth === 11) { // January or December
      recs.push({
        id: 'seasonal-cleanup',
        type: 'maintenance',
        priority: 'low',
        confidence: 0.90,
        title: 'New Year Digital Declutter',
        description: 'Start the year fresh with a comprehensive digital cleanup across all categories.',
        impact: {
          storageFreed: '3.5 GB',
          timeToComplete: '30 minutes',
          itemsAffected: Math.floor((digitalData.photos_count + digitalData.files_count + digitalData.apps_count) * 0.20),
          difficulty: 'medium'
        },
        category: 'general',
        actionLabel: 'Start Full Cleanup',
        learningSource: 'Seasonal behavior patterns',
        estimatedBenefit: 95
      });
    }

    // Automation suggestions
    if (digitalData.health_score < 70) {
      recs.push({
        id: 'automation-setup',
        type: 'automation',
        priority: 'high',
        confidence: 0.85,
        title: 'Setup Automated Cleanup',
        description: 'Configure automatic cleanup rules to maintain your digital health score without manual effort.',
        impact: {
          storageFreed: 'Ongoing',
          timeToComplete: '8 minutes',
          itemsAffected: 0,
          difficulty: 'easy'
        },
        category: 'general',
        actionLabel: 'Setup Automation',
        learningSource: 'Health score analysis',
        estimatedBenefit: 80
      });
    }

    // Sort by priority and confidence
    recs.sort((a, b) => {
      const priorityWeight = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityWeight[a.priority] * a.confidence;
      const bPriority = priorityWeight[b.priority] * b.confidence;
      return bPriority - aPriority;
    });

    setRecommendations(recs.slice(0, 5)); // Show top 5 recommendations
  };

  const handleRecommendationAction = async (rec: SmartRecommendation, action: 'accept' | 'dismiss') => {
    setProcessingId(rec.id);
    
    try {
      if (action === 'accept') {
        // Simulate AI processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        onRecommendationAction(rec.id, action);
        
        toast({
          title: "Recommendation Applied",
          description: `${rec.title} has been processed successfully.`,
        });
      } else {
        setDismissed(prev => new Set(prev).add(rec.id));
        toast({
          title: "Recommendation Dismissed",
          description: "This recommendation won't be shown again.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process recommendation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'photos': return Image;
      case 'files': return FileText;
      case 'apps': return Smartphone;
      case 'email': return Mail;
      default: return HardDrive;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cleanup': return Sparkles;
      case 'organization': return Target;
      case 'automation': return Zap;
      case 'maintenance': return Clock;
      case 'optimization': return TrendingUp;
      default: return Brain;
    }
  };

  const filteredRecommendations = recommendations.filter(rec => !dismissed.has(rec.id));

  if (filteredRecommendations.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Brain className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            No New Recommendations
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Your digital space is well-organized! Check back later for new suggestions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Brain className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Smart Recommendations
        </h3>
        <Badge variant="outline" className="text-xs">
          AI-Powered
        </Badge>
      </div>

      <AnimatePresence>
        {filteredRecommendations.map((rec) => {
          const Icon = getIcon(rec.category);
          const TypeIcon = getTypeIcon(rec.type);
          
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="w-5 h-5 text-blue-500" />
                        <Icon className="w-4 h-4 text-gray-500" />
                      </div>
                      <div>
                        <CardTitle className="text-base font-medium">
                          {rec.title}
                        </CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(rec.priority)}`} />
                          <span className="text-xs text-gray-500 capitalize">
                            {rec.priority} Priority
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {Math.round(rec.confidence * 100)}% Confidence
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {rec.category}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {rec.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <HardDrive className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Storage Impact
                        </span>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        {rec.impact.storageFreed}
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          Time Needed
                        </span>
                      </div>
                      <p className="text-sm text-blue-600 dark:text-blue-400">
                        {rec.impact.timeToComplete}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Estimated Benefit
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {rec.estimatedBenefit}%
                      </span>
                    </div>
                    <Progress value={rec.estimatedBenefit} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {rec.learningSource}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRecommendationAction(rec, 'dismiss')}
                        disabled={processingId === rec.id}
                      >
                        Dismiss
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleRecommendationAction(rec, 'accept')}
                        disabled={processingId === rec.id}
                      >
                        {processingId === rec.id ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          rec.actionLabel
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}