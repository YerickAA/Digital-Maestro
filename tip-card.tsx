import { Card } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface TipCardProps {
  title: string;
  content: string;
}

export default function TipCard({ title, content }: TipCardProps) {
  return (
    <div className="px-4 py-4">
      <Card className="bg-gradient-to-r from-ios-blue/10 to-ios-green/10 dark:from-blue-900/20 dark:to-green-900/20 border border-ios-blue/20 dark:border-blue-700/50 p-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-ios-blue rounded-full flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-ios-dark dark:text-white mb-1">{title}</h4>
            <p className="text-sm text-ios-gray-3 dark:text-gray-400">{content}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
