import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  Zap, 
  Clock, 
  HardDrive, 
  Trash2, 
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Target
} from "lucide-react";

interface SmartSuggestion {
  id: string;
  type: "duplicate" | "large_file" | "unused_app" | "old_file" | "seasonal" | "storage_optimization";
  priority: "high" | "medium" | "low";
  confidence: number;
  title: string;
  description: string;
  impact: {
    storageFreed: string;
    timeToComplete: string;
    itemsAffected: number;
  };
  category: "photos" | "files" | "apps" | "email" | "general";
  action: string;
  items?: any[];
}

interface SmartSuggestionsProps {
  digitalData: any;
  onSuggestionAction: (suggestionId: string, action: string) => void;
}

export default function SmartSuggestions({ digitalData, onSuggestionAction }: SmartSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SmartSuggestion[]>([]);
  const [completedSuggestions, setCompletedSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (digitalData) {
      generateSmartSuggestions(digitalData);
    }
  }, [digitalData]);

  const generateSmartSuggestions = (data: any) => {
    const newSuggestions: SmartSuggestion[] = [];
    
    // Duplicate detection suggestion
    if (data.photosDuplicates > 0) {
      newSuggestions.push({
        id: "photo-duplicates",
        type: "duplicate",
        priority: "high",
        confidence: 95,
        title: "Remove Duplicate Photos",
        description: `Found ${data.photosDuplicates} duplicate photos taking up unnecessary space`,
        impact: {
          storageFreed: `${(data.photosDuplicates * 2.1).toFixed(1)} MB`,
          timeToComplete: "5 minutes",
          itemsAffected: data.photosDuplicates
        },
        category: "photos",
        action: "cleanup_duplicates"
      });
    }

    // Large files suggestion
    if (data.filesLarge > 5) {
      newSuggestions.push({
        id: "large-files",
        type: "large_file",
        priority: "medium",
        confidence: 88,
        title: "Archive Large Files",
        description: `${data.filesLarge} large files could be archived or moved to cloud storage`,
        impact: {
          storageFreed: `${(data.filesLarge * 45).toFixed(1)} MB`,
          timeToComplete: "10 minutes",
          itemsAffected: data.filesLarge
        },
        category: "files",
        action: "archive_large_files"
      });
    }

    // Unused apps suggestion
    if (data.appsUnused > 0) {
      newSuggestions.push({
        id: "unused-apps",
        type: "unused_app",
        priority: "high",
        confidence: 92,
        title: "Remove Unused Apps",
        description: `${data.appsUnused} apps haven't been used in over 3 months`,
        impact: {
          storageFreed: `${(data.appsUnused * 120).toFixed(1)} MB`,
          timeToComplete: "3 minutes",
          itemsAffected: data.appsUnused
        },
        category: "apps",
        action: "remove_unused_apps"
      });
    }

    // Email cleanup suggestion
    if (data.emailUnread > 100) {
      newSuggestions.push({
        id: "email-cleanup",
        type: "old_file",
        priority: "medium",
        confidence: 75,
        title: "Clean Up Old Emails",
        description: `${data.emailUnread} unread emails are cluttering your inbox`,
        impact: {
          storageFreed: `${(data.emailUnread * 0.5).toFixed(1)} MB`,
          timeToComplete: "15 minutes",
          itemsAffected: data.emailUnread
        },
        category: "email",
        action: "cleanup_emails"
      });
    }

    // Seasonal suggestion
    const currentMonth = new Date().getMonth();
    if (currentMonth === 0 || currentMonth === 2) { // January or March
      newSuggestions.push({
        id: "seasonal-cleanup",
        type: "seasonal",
        priority: "low",
        confidence: 70,
        title: "Spring Digital Cleaning",
        description: "Perfect time for a comprehensive digital declutter",
        impact: {
          storageFreed: "1.2 GB",
          timeToComplete: "30 minutes",
          itemsAffected: 150
        },
        category: "general",
        action: "spring_cleaning"
      });
    }

    // Storage optimization suggestion
    if (data.healthScore < 70) {
      newSuggestions.push({
        id: "storage-optimization",
        type: "storage_optimization",
        priority: "high",
        confidence: 85,
        title: "Optimize Storage Usage",
        description: "Your digital health score suggests room for improvement",
        impact: {
          storageFreed: "800 MB",
          timeToComplete: "20 minutes",
          itemsAffected: 75
        },
        category: "general",
        action: "optimize_storage"
      });
    }

    setSuggestions(newSuggestions);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-ios-red";
      case "medium": return "text-ios-orange";
      case "low": return "text-ios-blue";
      default: return "text-ios-gray-3";
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-ios-red";
      case "medium": return "bg-ios-orange";
      case "low": return "bg-ios-blue";
      default: return "bg-ios-gray-3";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "duplicate": return <Trash2 className="w-4 h-4" />;
      case "large_file": return <HardDrive className="w-4 h-4" />;
      case "unused_app": return <Clock className="w-4 h-4" />;
      case "old_file": return <Calendar className="w-4 h-4" />;
      case "seasonal": return <TrendingUp className="w-4 h-4" />;
      case "storage_optimization": return <Target className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const handleSuggestionAction = (suggestion: SmartSuggestion, action: "accept" | "dismiss") => {
    if (action === "accept") {
      setCompletedSuggestions(prev => [...prev, suggestion.id]);
      onSuggestionAction(suggestion.id, suggestion.action);
    } else {
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    }
  };

  const activeSuggestions = suggestions.filter(s => !completedSuggestions.includes(s.id));

  if (activeSuggestions.length === 0) {
    return (
      <Card className="p-6 text-center">
        <CheckCircle className="w-12 h-12 text-ios-green mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-ios-dark dark:text-white mb-2">
          All Caught Up!
        </h3>
        <p className="text-ios-gray-3 dark:text-gray-400">
          No immediate cleanup suggestions. Your digital space is well organized.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ios-dark dark:text-white">
          Smart Cleanup Suggestions
        </h3>
        <Badge variant="outline" className="text-ios-blue border-ios-blue">
          <Brain className="w-3 h-3 mr-1" />
          AI-Powered
        </Badge>
      </div>

      {activeSuggestions.map((suggestion) => (
        <Card key={suggestion.id} className="p-4 border border-ios-gray-2 dark:border-gray-700">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-full bg-ios-blue/10 flex items-center justify-center ${getPriorityColor(suggestion.priority)}`}>
                {getTypeIcon(suggestion.type)}
              </div>
              <div>
                <h4 className="font-semibold text-ios-dark dark:text-white">{suggestion.title}</h4>
                <p className="text-sm text-ios-gray-3 dark:text-gray-400">{suggestion.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getPriorityBadgeColor(suggestion.priority)}>
                {suggestion.priority}
              </Badge>
              <div className="text-right">
                <div className="text-sm font-medium text-ios-dark dark:text-white">
                  {suggestion.confidence}% confident
                </div>
                <Progress value={suggestion.confidence} className="w-16 h-1" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
            <div className="text-center p-2 bg-ios-gray dark:bg-gray-800 rounded-lg">
              <div className="font-medium text-ios-green">{suggestion.impact.storageFreed}</div>
              <div className="text-ios-gray-3 dark:text-gray-400">Storage freed</div>
            </div>
            <div className="text-center p-2 bg-ios-gray dark:bg-gray-800 rounded-lg">
              <div className="font-medium text-ios-blue">{suggestion.impact.timeToComplete}</div>
              <div className="text-ios-gray-3 dark:text-gray-400">Time needed</div>
            </div>
            <div className="text-center p-2 bg-ios-gray dark:bg-gray-800 rounded-lg">
              <div className="font-medium text-ios-orange">{suggestion.impact.itemsAffected}</div>
              <div className="text-ios-gray-3 dark:text-gray-400">Items affected</div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              size="sm"
              onClick={() => handleSuggestionAction(suggestion, "accept")}
              className="flex-1 bg-ios-blue hover:bg-ios-blue/90 text-white"
            >
              <Zap className="w-4 h-4 mr-1" />
              Apply Suggestion
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSuggestionAction(suggestion, "dismiss")}
              className="text-ios-gray-3 border-ios-gray-3 hover:bg-ios-gray"
            >
              Dismiss
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}