import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Images, 
  Folder, 
  Smartphone, 
  Mail, 
  Calendar, 
  FileText, 
  Download, 
  Trash2,
  Archive,
  Star,
  Clock
} from "lucide-react";

interface QuickPreviewProps {
  item: any;
  type: "photo" | "file" | "app" | "email";
  isOpen: boolean;
  onClose: () => void;
  onAction?: (action: string) => void;
}

export default function QuickPreview({ 
  item, 
  type, 
  isOpen, 
  onClose, 
  onAction 
}: QuickPreviewProps) {
  const [previewContent, setPreviewContent] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && item) {
      // Simulate loading preview content
      const timer = setTimeout(() => {
        switch (type) {
          case "photo":
            setPreviewContent(`Photo taken on ${new Date(item.dateCreated || Date.now()).toLocaleDateString()}`);
            break;
          case "file":
            setPreviewContent(`File created on ${new Date(item.dateCreated || Date.now()).toLocaleDateString()}`);
            break;
          case "app":
            setPreviewContent(`App size: ${item.size} • Last used: ${item.lastUsed}`);
            break;
          case "email":
            setPreviewContent(item.preview || "Email preview not available");
            break;
        }
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, item, type]);

  const handleAction = (action: string) => {
    onAction?.(action);
    onClose();
  };

  const getTypeIcon = () => {
    switch (type) {
      case "photo": return <Images className="w-6 h-6 text-ios-orange" />;
      case "file": return <Folder className="w-6 h-6 text-ios-blue" />;
      case "app": return <Smartphone className="w-6 h-6 text-ios-green" />;
      case "email": return <Mail className="w-6 h-6 text-ios-red" />;
      default: return <FileText className="w-6 h-6 text-ios-gray-3" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case "photo": return "bg-ios-orange/10";
      case "file": return "bg-ios-blue/10";
      case "app": return "bg-ios-green/10";
      case "email": return "bg-ios-red/10";
      default: return "bg-ios-gray-2";
    }
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="mx-4 rounded-2xl bg-white dark:bg-gray-900 border-ios-gray-2 dark:border-gray-700">
        <DialogHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 ${getTypeColor()} rounded-xl flex items-center justify-center`}>
              {getTypeIcon()}
            </div>
            <div className="flex-1">
              <DialogTitle className="text-lg font-semibold text-ios-dark dark:text-white">
                {item.name || item.subject || `${type.charAt(0).toUpperCase() + type.slice(1)} Preview`}
              </DialogTitle>
              <p className="text-sm text-ios-gray-3 dark:text-gray-400 mt-1">
                {type === "email" ? item.sender : item.size}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview Content */}
          <div className="bg-ios-gray dark:bg-gray-800 rounded-xl p-4">
            {type === "photo" && (
              <div className="aspect-video bg-gradient-to-br from-ios-gray-2 to-ios-gray-3 dark:from-gray-700 dark:to-gray-600 rounded-lg flex items-center justify-center">
                <Images className="w-12 h-12 text-ios-gray-3 dark:text-gray-400" />
                <span className="ml-2 text-ios-gray-3 dark:text-gray-400">Photo Preview</span>
              </div>
            )}
            
            {type === "file" && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5 text-ios-blue" />
                  <span className="text-sm text-ios-dark dark:text-white">
                    {item.type || "Document"}
                  </span>
                </div>
                <div className="text-sm text-ios-gray-3 dark:text-gray-400">
                  {previewContent}
                </div>
              </div>
            )}
            
            {type === "app" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-ios-gray-3" />
                    <span className="text-sm text-ios-gray-3 dark:text-gray-400">
                      Last used: {item.lastUsed}
                    </span>
                  </div>
                  {item.isUnused && (
                    <Badge variant="outline" className="text-ios-gray-3 border-ios-gray-3">
                      Unused
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-ios-dark dark:text-white">
                  Storage: {item.size}
                </div>
              </div>
            )}
            
            {type === "email" && (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-ios-gray-3" />
                  <span className="text-sm text-ios-gray-3 dark:text-gray-400">
                    {new Date(item.date || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-sm text-ios-dark dark:text-white">
                  {previewContent}
                </div>
                <div className="flex space-x-2">
                  {item.isUnread && (
                    <Badge variant="outline" className="text-ios-blue border-ios-blue">
                      Unread
                    </Badge>
                  )}
                  {item.isPromo && (
                    <Badge variant="outline" className="text-ios-orange border-ios-orange">
                      Promo
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            {type === "photo" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction("star")}
                  className="flex-1 text-ios-blue border-ios-blue hover:bg-ios-blue/10"
                >
                  <Star className="w-4 h-4 mr-1" />
                  Star
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction("delete")}
                  className="flex-1 text-ios-red border-ios-red hover:bg-ios-red/10"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </>
            )}
            
            {type === "file" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction("download")}
                  className="flex-1 text-ios-blue border-ios-blue hover:bg-ios-blue/10"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction("archive")}
                  className="flex-1 text-ios-green border-ios-green hover:bg-ios-green/10"
                >
                  <Archive className="w-4 h-4 mr-1" />
                  Archive
                </Button>
              </>
            )}
            
            {type === "app" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction("open")}
                  className="flex-1 text-ios-blue border-ios-blue hover:bg-ios-blue/10"
                >
                  Open
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction("uninstall")}
                  className="flex-1 text-ios-red border-ios-red hover:bg-ios-red/10"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Uninstall
                </Button>
              </>
            )}
            
            {type === "email" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction("read")}
                  className="flex-1 text-ios-blue border-ios-blue hover:bg-ios-blue/10"
                >
                  Read
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAction("delete")}
                  className="flex-1 text-ios-red border-ios-red hover:bg-ios-red/10"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}