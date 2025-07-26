import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Camera, 
  Vibrate, 
  Bell, 
  Share2, 
  Smartphone, 
  CheckCircle, 
  XCircle,
  Battery,
  Wifi,
  Image as ImageIcon
} from 'lucide-react';
import { capacitorFeatures } from '@/lib/capacitor-features';
import { useToast } from '@/hooks/use-toast';

export default function MobileDemo() {
  const [deviceInfo, setDeviceInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadDeviceInfo();
  }, []);

  const loadDeviceInfo = async () => {
    try {
      const info = await capacitorFeatures.getDeviceInfo();
      setDeviceInfo(info);
    } catch (error) {
      console.error('Failed to load device info:', error);
    }
  };

  const testHapticFeedback = async (type: 'light' | 'medium' | 'heavy') => {
    try {
      await capacitorFeatures.hapticFeedback(type);
      toast({
        title: "Haptic Feedback",
        description: `${type} vibration activated`,
      });
    } catch (error) {
      toast({
        title: "Haptic Error",
        description: "Failed to trigger haptic feedback",
        variant: "destructive"
      });
    }
  };

  const testCamera = async () => {
    try {
      setIsLoading(true);
      // For demo purposes, we'll just show that camera is available
      // In a real app, this would open the camera component
      if (deviceInfo?.supportsCamera) {
        toast({
          title: "Camera Available",
          description: "Native camera access ready",
        });
      } else {
        toast({
          title: "Camera Unavailable",
          description: "Camera not available on this device",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Camera Error",
        description: "Failed to access camera",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testNotification = async () => {
    try {
      const success = await capacitorFeatures.showNotification(
        "CleanSpace Notification",
        {
          body: "This is a test notification from your mobile app!",
          icon: "/icon-192.svg"
        }
      );
      
      if (success) {
        toast({
          title: "Notification Sent",
          description: "Check your notification panel",
        });
      } else {
        toast({
          title: "Notification Failed",
          description: "Unable to send notification",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Notification Error",
        description: "Failed to send notification",
        variant: "destructive"
      });
    }
  };

  const testShare = async () => {
    try {
      const success = await capacitorFeatures.share({
        title: "CleanSpace App",
        text: "Check out this amazing digital organization app!",
        url: "https://cleanspace.app"
      });
      
      if (success) {
        toast({
          title: "Share Dialog Opened",
          description: "Share functionality is working",
        });
      } else {
        toast({
          title: "Share Failed",
          description: "Unable to open share dialog",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Share Error",
        description: "Failed to share content",
        variant: "destructive"
      });
    }
  };

  const FeatureStatus = ({ supported, label }: { supported: boolean; label: string }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <span className="text-sm font-medium">{label}</span>
      {supported ? (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Supported
        </Badge>
      ) : (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Not Available
        </Badge>
      )}
    </div>
  );

  if (!deviceInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading device information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">CleanSpace Mobile App</h1>
          <p className="text-gray-600">Native mobile capabilities demonstration</p>
        </div>

        {/* Device Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              Device Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Platform</p>
                <p className="font-medium">{deviceInfo.platform}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium">
                  {deviceInfo.isNative ? 'Native App' : 'Web App'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">iOS</p>
                <p className="font-medium">{deviceInfo.isIOS ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Android</p>
                <p className="font-medium">{deviceInfo.isAndroid ? 'Yes' : 'No'}</p>
              </div>
            </div>
            
            {deviceInfo.battery && (
              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <Battery className="w-4 h-4 text-blue-600" />
                <span className="text-sm">
                  Battery: {Math.round(deviceInfo.battery.level * 100)}%
                  {deviceInfo.battery.charging && ' (Charging)'}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Feature Support */}
        <Card>
          <CardHeader>
            <CardTitle>Native Features Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <FeatureStatus supported={deviceInfo.supportsCamera} label="Camera Access" />
            <FeatureStatus supported={deviceInfo.supportsVibration} label="Haptic Feedback" />
            <FeatureStatus supported={deviceInfo.supportsNotifications} label="Local Notifications" />
            <FeatureStatus supported={deviceInfo.supportsShare} label="Native Sharing" />
            <FeatureStatus supported={deviceInfo.supportsFileSystem} label="File System Access" />
          </CardContent>
        </Card>

        {/* Feature Testing */}
        <Card>
          <CardHeader>
            <CardTitle>Test Native Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              
              {/* Haptic Feedback */}
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <Vibrate className="w-4 h-4" />
                  Haptic Feedback
                </h3>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => testHapticFeedback('light')}
                  >
                    Light
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => testHapticFeedback('medium')}
                  >
                    Medium
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => testHapticFeedback('heavy')}
                  >
                    Heavy
                  </Button>
                </div>
              </div>

              {/* Camera */}
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Camera
                </h3>
                <Button 
                  size="sm" 
                  onClick={testCamera}
                  disabled={isLoading || !deviceInfo.supportsCamera}
                >
                  {isLoading ? 'Testing...' : 'Test Camera'}
                </Button>
              </div>

              {/* Notifications */}
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </h3>
                <Button 
                  size="sm" 
                  onClick={testNotification}
                  disabled={!deviceInfo.supportsNotifications}
                >
                  Send Test Notification
                </Button>
              </div>

              {/* Share */}
              <div className="space-y-2">
                <h3 className="font-medium flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </h3>
                <Button 
                  size="sm" 
                  onClick={testShare}
                  disabled={!deviceInfo.supportsShare}
                >
                  Test Share
                </Button>
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Deployment Status */}
        <Card>
          <CardHeader>
            <CardTitle>Mobile App Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">Native App Ready</p>
                  <p className="text-sm text-green-600">
                    Your CleanSpace app is ready for mobile deployment
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800">Android</p>
                  <p className="text-blue-600">Ready for Google Play Store</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="font-medium text-purple-800">iOS</p>
                  <p className="text-purple-600">Ready for App Store</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>1. Build for production: <code className="bg-gray-100 px-2 py-1 rounded">npm run build</code></p>
              <p>2. Sync with platforms: <code className="bg-gray-100 px-2 py-1 rounded">npx cap sync</code></p>
              <p>3. Open in Android Studio: <code className="bg-gray-100 px-2 py-1 rounded">npx cap open android</code></p>
              <p>4. Open in Xcode: <code className="bg-gray-100 px-2 py-1 rounded">npx cap open ios</code></p>
              <p>5. Build signed APK/IPA for distribution</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}