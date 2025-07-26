import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Images, Folder, Smartphone, Mail, Trash2, Archive, Download, Filter, CheckSquare } from "lucide-react";
import TabBar from "@/components/tab-bar";
import QuickPreview from "@/components/quick-preview";
import BatchOperations from "@/components/batch-operations";
import AdvancedFiltering from "@/components/advanced-filtering";
import Paywall from "@/components/paywall";
import { useLongPress } from "@/hooks/use-long-press";
import { useHapticFeedback } from "@/hooks/use-haptic-feedback";
import { useSoundEffects } from "@/hooks/use-sound-effects";
import { useSubscription } from "@/hooks/use-subscription";

export default function Organize() {
  const [selectedCategory, setSelectedCategory] = useState("photos");
  
  // Initialize selectedCategory from URL parameters
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam && ['photos', 'files', 'apps', 'email'].includes(tabParam)) {
        setSelectedCategory(tabParam);
      }
    } catch (error) {
      console.error('Error parsing URL parameters:', error);
    }
  }, []);
  const [previewItem, setPreviewItem] = useState<any>(null);
  const [previewType, setPreviewType] = useState<"photo" | "file" | "app" | "email">("photo");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [showBatchOperations, setShowBatchOperations] = useState(false);
  const [showAdvancedFiltering, setShowAdvancedFiltering] = useState(false);
  const [filteredItems, setFilteredItems] = useState<any[]>([]);
  
  const haptic = useHapticFeedback();
  const sound = useSoundEffects();
  const subscription = useSubscription();

  const categories = [
    { id: "photos", label: "Photos", icon: Images, color: "text-ios-orange" },
    { id: "files", label: "Files", icon: Folder, color: "text-ios-blue" },
    { id: "apps", label: "Apps", icon: Smartphone, color: "text-ios-green" },
    { id: "email", label: "Email", icon: Mail, color: "text-ios-red" },
  ];

  const mockPhotos = [
    { id: 1, name: "IMG_001.jpg", size: "2.4 MB", isDuplicate: true, dateCreated: "2024-01-15", preview: "Vacation sunset photo" },
    { id: 2, name: "IMG_002.jpg", size: "1.8 MB", isDuplicate: false, dateCreated: "2024-01-16", preview: "Family dinner photo" },
    { id: 3, name: "IMG_003.jpg", size: "3.2 MB", isDuplicate: true, dateCreated: "2024-01-17", preview: "City skyline photo" },
    { id: 4, name: "IMG_004.jpg", size: "2.1 MB", isDuplicate: false, dateCreated: "2024-01-18", preview: "Pet playing in park" },
  ];

  const mockFiles = [
    { id: 1, name: "document.pdf", size: "45 MB", type: "PDF", isLarge: true, dateCreated: "2024-01-10", preview: "Annual report with financial data" },
    { id: 2, name: "presentation.pptx", size: "23 MB", type: "PPTX", isLarge: true, dateCreated: "2024-01-12", preview: "Q4 marketing presentation slides" },
    { id: 3, name: "spreadsheet.xlsx", size: "2.1 MB", type: "XLSX", isLarge: false, dateCreated: "2024-01-14", preview: "Monthly budget calculations" },
    { id: 4, name: "archive.zip", size: "156 MB", type: "ZIP", isLarge: true, dateCreated: "2024-01-16", preview: "Project backup files" },
  ];

  const mockApps = [
    { id: 1, name: "Game App", size: "245 MB", lastUsed: "3 months ago", isUnused: true, preview: "Puzzle game with multiplayer features" },
    { id: 2, name: "Photo Editor", size: "89 MB", lastUsed: "2 days ago", isUnused: false, preview: "Professional photo editing tools" },
    { id: 3, name: "Old Social App", size: "167 MB", lastUsed: "6 months ago", isUnused: true, preview: "Social networking platform" },
    { id: 4, name: "Productivity App", size: "34 MB", lastUsed: "1 hour ago", isUnused: false, preview: "Task management and notes" },
  ];

  const mockEmails = [
    { id: 1, subject: "Newsletter from Company", sender: "news@company.com", isUnread: true, isPromo: true, date: "2024-01-16", preview: "Monthly updates on company news, events, and product launches. Don't miss out on the latest developments!" },
    { id: 2, subject: "Important Meeting", sender: "boss@work.com", isUnread: false, isPromo: false, date: "2024-01-15", preview: "Team meeting scheduled for Thursday at 2 PM. Please review the agenda and prepare your quarterly reports." },
    { id: 3, subject: "Sale Alert!", sender: "deals@store.com", isUnread: true, isPromo: true, date: "2024-01-16", preview: "Flash sale! 50% off all electronics. Limited time offer - ends tonight at midnight. Shop now!" },
    { id: 4, subject: "Monthly Report", sender: "reports@company.com", isUnread: false, isPromo: false, date: "2024-01-14", preview: "Your monthly performance report is ready. Review your metrics and achievements for January." },
  ];

  const handlePreview = (item: any, type: "photo" | "file" | "app" | "email") => {
    setPreviewItem(item);
    setPreviewType(type);
    setIsPreviewOpen(true);
  };

  const handlePreviewAction = (action: string) => {
    console.log(`Action: ${action} on ${previewType}:`, previewItem);
    
    if (action === "delete") {
      haptic.heavy(); // Stronger haptic feedback for deletion
      sound.playDelete();
    } else if (action === "archive") {
      haptic.medium();
      sound.playSwipe();
    }
    
    // Here you would implement the actual action logic
  };

  const handleBatchAction = (action: string, items: any[]) => {
    console.log(`Batch action: ${action} on ${items.length} items:`, items);
    
    if (action === "delete") {
      haptic.error(); // Very strong haptic feedback for bulk deletion
      sound.playBulkDelete();
    } else if (action === "archive") {
      haptic.success();
      sound.playSwipe();
    }
    
    // Here you would implement the actual batch action logic
  };

  const handleDelete = (item: any, type: string) => {
    try {
      console.log(`Delete ${type}:`, item.name);
      haptic.heavy(); // Stronger haptic feedback for deletion
      sound.playDelete();
      
      // Here you would implement the actual deletion logic
    } catch (error) {
      console.error('Error in handleDelete:', error);
    }
  };

  const handleFilterChange = (filtered: any[]) => {
    setFilteredItems(filtered);
  };

  const getCurrentItems = () => {
    switch (selectedCategory) {
      case "photos": return mockPhotos;
      case "files": return mockFiles;
      case "apps": return mockApps;
      case "email": return mockEmails;
      default: return [];
    }
  };

  const getDisplayItems = () => {
    return filteredItems.length > 0 ? filteredItems : getCurrentItems();
  };

  const renderContent = () => {
    switch (selectedCategory) {
      case "photos":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-ios-dark dark:text-white">Photo Organization</h3>
              <p className="text-sm text-ios-gray-3 dark:text-gray-400">Find and remove duplicate photos</p>
            </div>
            
            <div className="space-y-3">
              {(filteredItems.length > 0 ? filteredItems : mockPhotos).map((photo) => {
                const longPressProps = useLongPress({
                  onLongPress: () => handlePreview(photo, "photo"),
                  onClick: () => console.log("Quick tap on photo:", photo.name),
                });

                return (
                  <Card 
                    key={photo.id} 
                    className="p-4 cursor-pointer select-none active:bg-ios-gray-2 dark:active:bg-gray-700 transition-colors"
                    {...longPressProps}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-ios-gray-2 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <Images className="w-6 h-6 text-ios-gray-3 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-ios-dark dark:text-white">{photo.name}</p>
                          <p className="text-sm text-ios-gray-3 dark:text-gray-400">{photo.size}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {photo.isDuplicate && (
                          <Badge variant="destructive" className="bg-ios-red">
                            Duplicate
                          </Badge>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-ios-red hover:bg-ios-red hover:text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(photo, "photo");
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      
      case "files":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-ios-dark dark:text-white">File Management</h3>
              <p className="text-sm text-ios-gray-3 dark:text-gray-400">Organize and clean up your files</p>
            </div>
            
            <div className="space-y-3">
              {(filteredItems.length > 0 ? filteredItems : mockFiles).map((file) => {
                const longPressProps = useLongPress({
                  onLongPress: () => handlePreview(file, "file"),
                  onClick: () => console.log("Quick tap on file:", file.name),
                });

                return (
                  <Card 
                    key={file.id} 
                    className="p-4 cursor-pointer select-none active:bg-ios-gray-2 dark:active:bg-gray-700 transition-colors"
                    {...longPressProps}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-ios-gray-2 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <Folder className="w-6 h-6 text-ios-gray-3 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-ios-dark dark:text-white">{file.name}</p>
                          <p className="text-sm text-ios-gray-3 dark:text-gray-400">{file.size} • {file.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {file.isLarge && (
                          <Badge variant="outline" className="text-ios-orange border-ios-orange">
                            Large
                          </Badge>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-ios-blue hover:bg-ios-blue hover:text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Archive file:", file.name);
                            haptic.medium();
                            sound.playSwipe();
                          }}
                        >
                          <Archive className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      
      case "apps":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-ios-dark dark:text-white">App Management</h3>
              <p className="text-sm text-ios-gray-3 dark:text-gray-400">Remove unused apps to free up space</p>
            </div>
            
            <div className="space-y-3">
              {(filteredItems.length > 0 ? filteredItems : mockApps).map((app) => {
                const longPressProps = useLongPress({
                  onLongPress: () => handlePreview(app, "app"),
                  onClick: () => console.log("Quick tap on app:", app.name),
                });

                return (
                  <Card 
                    key={app.id} 
                    className="p-4 cursor-pointer select-none active:bg-ios-gray-2 dark:active:bg-gray-700 transition-colors"
                    {...longPressProps}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-ios-gray-2 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                          <Smartphone className="w-6 h-6 text-ios-gray-3 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-ios-dark dark:text-white">{app.name}</p>
                          <p className="text-sm text-ios-gray-3 dark:text-gray-400">{app.size} • Last used: {app.lastUsed}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {app.isUnused && (
                          <Badge variant="outline" className="text-ios-gray-3 border-ios-gray-3">
                            Unused
                          </Badge>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-ios-red hover:bg-ios-red hover:text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(app, "app");
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      
      case "email":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-ios-dark dark:text-white">Email Cleanup</h3>
              <p className="text-sm text-ios-gray-3 dark:text-gray-400">Manage your inbox and subscriptions</p>
            </div>
            
            <div className="space-y-3">
              {(filteredItems.length > 0 ? filteredItems : mockEmails).map((email) => {
                const longPressProps = useLongPress({
                  onLongPress: () => handlePreview(email, "email"),
                  onClick: () => console.log("Quick tap on email:", email.subject),
                });

                return (
                  <Card 
                    key={email.id} 
                    className="p-4 cursor-pointer select-none active:bg-ios-gray-2 dark:active:bg-gray-700 transition-colors"
                    {...longPressProps}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-ios-gray-2 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Mail className="w-6 h-6 text-ios-gray-3 dark:text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-ios-dark dark:text-white truncate">{email.subject}</p>
                          <p className="text-sm text-ios-gray-3 dark:text-gray-400 truncate">{email.sender}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        {email.isUnread && (
                          <Badge variant="outline" className="text-ios-blue border-ios-blue text-xs px-2 py-1">
                            Unread
                          </Badge>
                        )}
                        {email.isPromo && (
                          <Badge variant="outline" className="text-ios-orange border-ios-orange text-xs px-2 py-1">
                            Promo
                          </Badge>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-ios-red hover:bg-ios-red hover:text-white transition-colors p-2 h-8 w-8 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(email, "email");
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-ios-gray dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 px-4 py-4 border-b border-ios-gray-2 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-ios-dark dark:text-white">Organize</h1>
        <p className="text-ios-gray-3 dark:text-gray-400 text-sm">Clean up your digital space</p>
      </header>

      {/* Category Tabs */}
      <div className="bg-white dark:bg-gray-900 px-4 py-3 border-b border-ios-gray-2 dark:border-gray-700">
        <div className="flex justify-between items-center gap-4">
          <div className="flex space-x-1 overflow-x-auto scrollbar-hide">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-1 px-2 py-1 text-xs min-w-0 flex-1 ${
                    selectedCategory === category.id
                      ? "bg-ios-blue text-white"
                      : "text-ios-gray-3 dark:text-gray-400 border-ios-gray-2 dark:border-gray-600"
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="truncate">{category.label}</span>
                </Button>
              );
            })}
          </div>
          
          <div className="flex space-x-2 flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowAdvancedFiltering(!showAdvancedFiltering)}
              className={showAdvancedFiltering ? "bg-ios-blue text-white" : ""}
            >
              <Filter className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowBatchOperations(!showBatchOperations)}
              className={showBatchOperations ? "bg-ios-blue text-white" : ""}
            >
              <CheckSquare className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        {!subscription.isActive && !subscription.isTrial ? (
          <div className="space-y-4">
            <Paywall
              feature="Photo Organization"
              description="Find and remove duplicate photos, organize your photo library, and free up storage space with advanced photo management tools."
              icon={Images}
            />
            <Paywall
              feature="File Management"
              description="Organize large files, clean up downloads, and manage your file system with intelligent sorting and cleanup tools."
              icon={Folder}
            />
            <Paywall
              feature="App Organization"
              description="Identify unused apps, manage app storage, and optimize your device performance with smart app management."
              icon={Smartphone}
            />
            <Paywall
              feature="Email Cleanup"
              description="Clean up your inbox, remove promotional emails, and organize your email with advanced filtering and batch operations."
              icon={Mail}
            />
          </div>
        ) : (
          <>
            {/* Advanced Filtering */}
            {showAdvancedFiltering && (
              <AdvancedFiltering
                items={getCurrentItems()}
                type={selectedCategory as "photo" | "file" | "app" | "email"}
                onFilterChange={handleFilterChange}
              />
            )}

            {/* Batch Operations */}
            {showBatchOperations && (
              <BatchOperations
                items={getDisplayItems()}
                type={selectedCategory as "photo" | "file" | "app" | "email"}
                onBatchAction={handleBatchAction}
              />
            )}

            {/* Main Content */}
            <div>
              {renderContent()}
            </div>
            
            {/* Hint about long press feature */}
            <div className="mt-6">
              <div className="bg-ios-blue/10 dark:bg-blue-900/20 rounded-xl p-3 text-center">
                <p className="text-sm text-ios-blue dark:text-blue-400">
                  💡 <strong>Pro Tip:</strong> Press and hold any item for a quick preview
                </p>
              </div>
            </div>
          </>
        )}
      </div>

      <TabBar />

      {/* Quick Preview Modal */}
      <QuickPreview
        item={previewItem}
        type={previewType}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onAction={handlePreviewAction}
      />
    </div>
  );
}
