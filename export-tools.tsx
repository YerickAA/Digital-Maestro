import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  FileText, 
  Image, 
  Archive, 
  Database,
  Cloud,
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  HardDrive,
  Smartphone,
  Mail,
  FolderOpen
} from "lucide-react";

interface ExportOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  format: string;
  estimatedSize: string;
  category: "reports" | "backup" | "data";
  requiresAuth: boolean;
}

interface ExportToolsProps {
  digitalData: any;
  streak: any;
  onExport: (exportType: string, options: any) => void;
}

export default function ExportTools({ digitalData, streak, onExport }: ExportToolsProps) {
  const [exportHistory, setExportHistory] = useState<any[]>([]);
  const [activeExports, setActiveExports] = useState<string[]>([]);
  const [backupStatus, setBackupStatus] = useState<"idle" | "backing_up" | "complete" | "error">("idle");

  useEffect(() => {
    loadExportHistory();
  }, []);

  const loadExportHistory = () => {
    // Mock export history - in real app, this would come from API
    const history = [
      {
        id: "1",
        type: "cleanup_report",
        name: "Monthly Cleanup Report",
        date: "2024-01-15T10:30:00Z",
        size: "2.3 MB",
        status: "completed"
      },
      {
        id: "2",
        type: "photos_backup",
        name: "Photos Backup",
        date: "2024-01-14T15:45:00Z",
        size: "156 MB",
        status: "completed"
      },
      {
        id: "3",
        type: "data_export",
        name: "Full Data Export",
        date: "2024-01-13T09:15:00Z",
        size: "45 MB",
        status: "completed"
      }
    ];
    setExportHistory(history);
  };

  const exportOptions: ExportOption[] = [
    {
      id: "cleanup_report",
      name: "Cleanup Report",
      description: "Detailed PDF report of your digital organization progress",
      icon: <FileText className="w-5 h-5" />,
      format: "PDF",
      estimatedSize: "2-5 MB",
      category: "reports",
      requiresAuth: false
    },
    {
      id: "health_analytics",
      name: "Health Analytics",
      description: "Digital wellness metrics and trends over time",
      icon: <Database className="w-5 h-5" />,
      format: "CSV/JSON",
      estimatedSize: "< 1 MB",
      category: "reports",
      requiresAuth: false
    },
    {
      id: "photos_backup",
      name: "Photos Backup",
      description: "Secure backup of organized photo collections",
      icon: <Image className="w-5 h-5" />,
      format: "ZIP",
      estimatedSize: "100-500 MB",
      category: "backup",
      requiresAuth: true
    },
    {
      id: "files_archive",
      name: "Files Archive",
      description: "Compressed archive of important files",
      icon: <Archive className="w-5 h-5" />,
      format: "ZIP/TAR",
      estimatedSize: "50-200 MB",
      category: "backup",
      requiresAuth: true
    },
    {
      id: "app_list",
      name: "App Inventory",
      description: "Complete list of installed applications",
      icon: <Smartphone className="w-5 h-5" />,
      format: "JSON/CSV",
      estimatedSize: "< 1 MB",
      category: "data",
      requiresAuth: false
    },
    {
      id: "email_summary",
      name: "Email Summary",
      description: "Email organization statistics and insights",
      icon: <Mail className="w-5 h-5" />,
      format: "PDF/CSV",
      estimatedSize: "1-3 MB",
      category: "data",
      requiresAuth: true
    },
    {
      id: "full_export",
      name: "Complete Data Export",
      description: "Everything in a portable format",
      icon: <Database className="w-5 h-5" />,
      format: "Multiple",
      estimatedSize: "200-1000 MB",
      category: "data",
      requiresAuth: true
    }
  ];

  const handleExport = async (option: ExportOption) => {
    setActiveExports(prev => [...prev, option.id]);
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add to history
      const newExport = {
        id: Date.now().toString(),
        type: option.id,
        name: option.name,
        date: new Date().toISOString(),
        size: option.estimatedSize,
        status: "completed"
      };
      
      setExportHistory(prev => [newExport, ...prev]);
      onExport(option.id, { format: option.format, name: option.name });
      
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setActiveExports(prev => prev.filter(id => id !== option.id));
    }
  };

  const handleBackup = async () => {
    setBackupStatus("backing_up");
    
    try {
      // Simulate backup process
      await new Promise(resolve => setTimeout(resolve, 3000));
      setBackupStatus("complete");
      
      // Reset status after 3 seconds
      setTimeout(() => setBackupStatus("idle"), 3000);
    } catch (error) {
      setBackupStatus("error");
      setTimeout(() => setBackupStatus("idle"), 3000);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-ios-green";
      case "failed": return "text-ios-red";
      case "processing": return "text-ios-blue";
      default: return "text-ios-gray-3";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "reports": return "bg-ios-blue";
      case "backup": return "bg-ios-green";
      case "data": return "bg-ios-orange";
      default: return "bg-ios-gray-3";
    }
  };

  const getBackupStatusMessage = () => {
    switch (backupStatus) {
      case "backing_up": return "Creating secure backup...";
      case "complete": return "Backup completed successfully!";
      case "error": return "Backup failed. Please try again.";
      default: return "Ready to backup your data";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-ios-dark dark:text-white">
          Export & Backup Tools
        </h3>
        <Badge variant="outline" className="text-ios-blue border-ios-blue">
          <Download className="w-3 h-3 mr-1" />
          Export
        </Badge>
      </div>

      <Tabs defaultValue="export" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="space-y-4">
          <div className="grid gap-4">
            {exportOptions.map((option) => (
              <Card key={option.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full ${getCategoryColor(option.category)}/10 flex items-center justify-center`}>
                      <div className={`${getCategoryColor(option.category).replace('bg-', 'text-')}`}>
                        {option.icon}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-ios-dark dark:text-white">{option.name}</h4>
                      <p className="text-sm text-ios-gray-3 dark:text-gray-400">{option.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {option.format}
                    </Badge>
                    {option.requiresAuth && (
                      <Shield className="w-4 h-4 text-ios-orange" />
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-ios-gray-3 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <HardDrive className="w-4 h-4" />
                      <span>{option.estimatedSize}</span>
                    </div>
                    <Badge className={getCategoryColor(option.category)}>
                      {option.category}
                    </Badge>
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => handleExport(option)}
                    disabled={activeExports.includes(option.id)}
                    className="bg-ios-blue hover:bg-ios-blue/90 text-white"
                  >
                    {activeExports.includes(option.id) ? (
                      <>
                        <Clock className="w-4 h-4 mr-1 animate-spin" />
                        Exporting...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          {/* Backup Status */}
          <Card className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                backupStatus === "complete" ? "bg-ios-green/10" : 
                backupStatus === "error" ? "bg-ios-red/10" :
                backupStatus === "backing_up" ? "bg-ios-blue/10" : "bg-ios-gray-2"
              }`}>
                {backupStatus === "complete" ? (
                  <CheckCircle className="w-6 h-6 text-ios-green" />
                ) : backupStatus === "error" ? (
                  <AlertTriangle className="w-6 h-6 text-ios-red" />
                ) : backupStatus === "backing_up" ? (
                  <Clock className="w-6 h-6 text-ios-blue animate-spin" />
                ) : (
                  <Cloud className="w-6 h-6 text-ios-gray-3" />
                )}
              </div>
              <div>
                <h4 className="text-xl font-semibold text-ios-dark dark:text-white">
                  Secure Backup
                </h4>
                <p className="text-sm text-ios-gray-3 dark:text-gray-400">
                  {getBackupStatusMessage()}
                </p>
              </div>
            </div>

            {backupStatus === "backing_up" && (
              <div className="mb-4">
                <Progress value={Math.random() * 100} className="h-2" />
                <p className="text-xs text-ios-gray-3 dark:text-gray-400 mt-1">
                  Processing files and creating secure archive...
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-ios-gray dark:bg-gray-800 rounded-lg">
                <div className="text-lg font-semibold text-ios-dark dark:text-white">
                  {((digitalData?.photosCount || 0) + (digitalData?.filesCount || 0)).toLocaleString()}
                </div>
                <div className="text-sm text-ios-gray-3 dark:text-gray-400">Items to backup</div>
              </div>
              <div className="text-center p-3 bg-ios-gray dark:bg-gray-800 rounded-lg">
                <div className="text-lg font-semibold text-ios-dark dark:text-white">
                  ~{Math.floor(((digitalData?.photosCount || 0) * 2.1 + (digitalData?.filesCount || 0) * 5.2) / 1024 * 100) / 100} GB
                </div>
                <div className="text-sm text-ios-gray-3 dark:text-gray-400">Estimated size</div>
              </div>
            </div>

            <Button
              onClick={handleBackup}
              disabled={backupStatus === "backing_up"}
              className="w-full bg-ios-green hover:bg-ios-green/90 text-white"
            >
              {backupStatus === "backing_up" ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Creating Backup...
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4 mr-2" />
                  Start Secure Backup
                </>
              )}
            </Button>
          </Card>

          {/* Backup Options */}
          <Card className="p-4">
            <h4 className="font-semibold text-ios-dark dark:text-white mb-3">Backup Options</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-ios-gray dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Cloud className="w-5 h-5 text-ios-blue" />
                  <div>
                    <div className="font-medium text-ios-dark dark:text-white">Cloud Storage</div>
                    <div className="text-sm text-ios-gray-3 dark:text-gray-400">Automatic sync to cloud</div>
                  </div>
                </div>
                <Badge variant="outline" className="text-ios-blue border-ios-blue">
                  Recommended
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-ios-gray dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-3">
                  <HardDrive className="w-5 h-5 text-ios-green" />
                  <div>
                    <div className="font-medium text-ios-dark dark:text-white">Local Backup</div>
                    <div className="text-sm text-ios-gray-3 dark:text-gray-400">Download to device</div>
                  </div>
                </div>
                <Badge variant="outline">
                  Available
                </Badge>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="p-4">
            <h4 className="font-semibold text-ios-dark dark:text-white mb-4">Export History</h4>
            
            <div className="space-y-3">
              {exportHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-ios-gray dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-ios-blue/10 flex items-center justify-center">
                      <FolderOpen className="w-4 h-4 text-ios-blue" />
                    </div>
                    <div>
                      <div className="font-medium text-ios-dark dark:text-white">{item.name}</div>
                      <div className="text-sm text-ios-gray-3 dark:text-gray-400">
                        {new Date(item.date).toLocaleDateString()} • {item.size}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getStatusColor(item.status)} bg-transparent border`}>
                      {item.status}
                    </Badge>
                    <Button size="sm" variant="ghost" className="text-ios-blue hover:bg-ios-blue/10">
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}