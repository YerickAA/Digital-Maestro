import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  FolderOpen, 
  Camera, 
  Smartphone, 
  Mail, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  Shield,
  HardDrive,
  Image,
  Settings
} from 'lucide-react';
import { dataAccessManager, type FileMetadata, type PhotoMetadata, type AppInfo, type EmailData } from '@/lib/data-access';
import { useToast } from '@/hooks/use-toast';
import { offlineStorage } from '@/lib/offline-storage';
import { nativeFeatures } from '@/lib/native-features';

interface ScanProgress {
  files: number;
  photos: number;
  apps: number;
  email: number;
  total: number;
}

interface ScanResults {
  files: FileMetadata[];
  photos: PhotoMetadata[];
  apps: AppInfo[];
  email: EmailData | null;
  permissions: {
    files: boolean;
    photos: boolean;
    apps: boolean;
    email: boolean;
    notifications: boolean;
  };
}

interface RealDataScannerProps {
  onScanComplete: (results: ScanResults) => void;
  onProgress: (progress: ScanProgress) => void;
}

export default function RealDataScanner({ onScanComplete, onProgress }: RealDataScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStage, setScanStage] = useState<'permissions' | 'files' | 'photos' | 'apps' | 'email' | 'complete'>('permissions');
  const [progress, setProgress] = useState<ScanProgress>({ files: 0, photos: 0, apps: 0, email: 0, total: 0 });
  const [permissions, setPermissions] = useState<ScanResults['permissions']>({
    files: false,
    photos: false,
    apps: false,
    email: false,
    notifications: false
  });
  const [results, setResults] = useState<Partial<ScanResults>>({});
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const perms = await dataAccessManager.checkPermissions();
      setPermissions(perms);
    } catch (err) {
      setError('Failed to check permissions');
      console.error('Permission check failed:', err);
    }
  };

  const requestPermissions = async () => {
    try {
      const perms = await dataAccessManager.checkPermissions();
      setPermissions(perms);
      
      if (perms.notifications) {
        await dataAccessManager.showNotification(
          'CleanSpace Ready',
          'Your digital scan is ready to begin!'
        );
      }
    } catch (err) {
      setError('Failed to request permissions');
      console.error('Permission request failed:', err);
    }
  };

  const startScan = async () => {
    setIsScanning(true);
    setError(null);
    setScanStage('files');
    
    try {
      const scanResults: Partial<ScanResults> = {
        files: [],
        photos: [],
        apps: [],
        email: null,
        permissions
      };

      // Scan files
      setScanStage('files');
      try {
        let files: any[] = [];
        
        if (permissions.files) {
          // Try File System Access API first
          const dirHandle = await dataAccessManager.requestFileAccess();
          if (dirHandle) {
            files = await dataAccessManager.scanFiles(dirHandle);
            toast({
              title: "Directory Scanned",
              description: `Found ${files.length} files in selected directory`,
            });
          }
        }
        
        // If File System Access API not available or no files found, use file input
        if (files.length === 0) {
          files = await dataAccessManager.scanFilesWithInput();
          if (files.length > 0) {
            toast({
              title: "Files Analyzed",
              description: `Analyzed ${files.length} selected files`,
            });
          }
        }
        
        scanResults.files = files;
        setProgress(prev => ({ ...prev, files: files.length }));
        onProgress({ ...progress, files: files.length });
        
      } catch (error) {
        console.error('File scan error:', error);
        toast({
          title: "File Scan Issue",
          description: "Unable to scan files. Browser may not support this feature.",
          variant: "destructive",
        });
      }

      // Scan photos
      if (permissions.photos) {
        setScanStage('photos');
        const photos = await dataAccessManager.scanPhotos();
        
        // Find duplicates
        const duplicates = await dataAccessManager.findDuplicatePhotos(photos);
        
        scanResults.photos = photos;
        setProgress(prev => ({ ...prev, photos: photos.length }));
        onProgress({ ...progress, photos: photos.length });
        
        toast({
          title: "Photos Analyzed",
          description: `Found ${photos.length} photos, ${duplicates.length} duplicates`,
        });
      }

      // Detect apps
      setScanStage('apps');
      const apps = await dataAccessManager.detectApps();
      scanResults.apps = apps;
      
      setProgress(prev => ({ ...prev, apps: apps.length }));
      onProgress({ ...progress, apps: apps.length });

      // Email integration would require OAuth setup
      setScanStage('email');
      setProgress(prev => ({ ...prev, email: 0 }));

      // Send results to backend
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          await apiRequest('POST', '/api/real-data/scan', {
            userId: parseInt(userId),
            files: scanResults.files,
            photos: scanResults.photos,
            apps: scanResults.apps,
            email: scanResults.email
          });
        } catch (error) {
          console.error('Failed to save scan results:', error);
        }
      }

      setScanStage('complete');
      setResults(scanResults);
      onScanComplete(scanResults as ScanResults);
      
      // Store results offline for app functionality
      if (userId) {
        await offlineStorage.saveDigitalData(parseInt(userId), scanResults);
      }
      
      // Show native notification
      nativeFeatures.showNotification("Scan Complete", {
        body: "Your digital life has been analyzed and saved!",
        tag: "scan-complete",
        requireInteraction: true
      });
      
      // Vibrate for feedback
      nativeFeatures.vibrate([200, 100, 200]);
      
      toast({
        title: "Scan Complete",
        description: "Your digital life has been analyzed and saved!",
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed');
      toast({
        title: "Scan Failed",
        description: err instanceof Error ? err.message : 'Unknown error occurred',
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'permissions': return Shield;
      case 'files': return FolderOpen;
      case 'photos': return Camera;
      case 'apps': return Smartphone;
      case 'email': return Mail;
      default: return CheckCircle;
    }
  };

  const getStageTitle = (stage: string) => {
    switch (stage) {
      case 'permissions': return 'Checking Permissions';
      case 'files': return 'Scanning Files';
      case 'photos': return 'Analyzing Photos';
      case 'apps': return 'Detecting Apps';
      case 'email': return 'Connecting Email';
      default: return 'Scan Complete';
    }
  };

  const calculateTotalProgress = () => {
    const stages = ['permissions', 'files', 'photos', 'apps', 'email'];
    const currentIndex = stages.indexOf(scanStage);
    return ((currentIndex + 1) / stages.length) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Permission Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4" />
                <span className="text-sm">Files</span>
              </div>
              <Badge variant={permissions.files ? "default" : "secondary"}>
                {permissions.files ? "Available" : "Limited"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image className="h-4 w-4" />
                <span className="text-sm">Photos</span>
              </div>
              <Badge variant={permissions.photos ? "default" : "secondary"}>
                {permissions.photos ? "Available" : "Limited"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="text-sm">Apps</span>
              </div>
              <Badge variant={permissions.apps ? "default" : "secondary"}>
                {permissions.apps ? "Available" : "Web Limited"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">Email</span>
              </div>
              <Badge variant={permissions.email ? "default" : "secondary"}>
                {permissions.email ? "Connected" : "Not Connected"}
              </Badge>
            </div>
          </div>
          
          <Button 
            onClick={requestPermissions}
            className="w-full mt-4"
            variant="outline"
          >
            Request Permissions
          </Button>
        </CardContent>
      </Card>

      {/* Scan Progress */}
      {isScanning && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                {getStageTitle(scanStage)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={calculateTotalProgress()} className="mb-4" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>Files: {progress.files}</div>
                <div>Photos: {progress.photos}</div>
                <div>Apps: {progress.apps}</div>
                <div>Email: {progress.email}</div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Scan Results */}
      {results.files && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Scan Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {results.files?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Files Found</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {results.photos?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Photos Analyzed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {results.apps?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Apps Detected</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {results.photos?.filter(p => p.isDuplicate).length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Duplicates Found</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Scan Button */}
      <Button
        onClick={startScan}
        disabled={isScanning}
        className="w-full"
        size="lg"
      >
        {isScanning ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Scanning...
          </>
        ) : (
          <>
            <HardDrive className="mr-2 h-4 w-4" />
            Start Real Data Scan
          </>
        )}
      </Button>

      {/* Platform Limitations Notice */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>How it works:</strong> Click "Start Real Data Scan" to select files and photos to analyze. 
          The scanner will prompt you to choose files from your computer. For email integration, OAuth setup is required.
          <br /><br />
          <strong>Browser Limitations:</strong> Full system scanning requires desktop/mobile apps due to web security restrictions.
        </AlertDescription>
      </Alert>
    </div>
  );
}