import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Shield, 
  HelpCircle, 
  Info, 
  LogOut,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Database,
  AlertCircle,
  Camera,
  Download,
  Share2,
  Vibrate,
  FileText
} from "lucide-react";
import { Link } from "wouter";
import TabBar from "@/components/tab-bar";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/components/theme-provider";

export default function Settings() {
  const [userId, setUserId] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState({
    notifications: true,
    autoClean: false,
    dailyTips: true,
    soundEffects: true,
    hapticFeedback: true,
  });
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
          const id = parseInt(storedUserId);
          setUserId(id);
          
          try {
            const res = await fetch(`/api/users/${id}`);
            if (res.ok) {
              const userData = await res.json();
              setUser(userData);
            }
          } catch (error) {
            console.error('Failed to fetch user data:', error);
          }
        }
      } catch (error) {
        console.error('Failed to initialize settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSettings();
  }, []);

  const handleSettingChange = (key: string, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast({
      title: "Setting Updated",
      description: `${key} has been ${value ? 'enabled' : 'disabled'}`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 px-4 py-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Customize your CleanSpace experience</p>
      </header>

      <div className="p-4 space-y-6 pb-24">
        {/* User Profile */}
        {user && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Installation Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="w-5 h-5 text-blue-500" />
              <span>Install CleanSpace App</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">📱 Install on Mobile</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>iPhone/iPad:</strong></p>
                  <p>1. Tap the Share button (□↗) in Safari</p>
                  <p>2. Scroll down and tap "Add to Home Screen"</p>
                  <p>3. Tap "Add" to install</p>
                  
                  <p className="mt-3"><strong>Android:</strong></p>
                  <p>1. Tap the menu (⋮) in Chrome</p>
                  <p>2. Tap "Add to Home screen"</p>
                  <p>3. Tap "Add" to install</p>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">💻 Install on Desktop</h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>1. Look for the install icon (⬇) in your browser's address bar</p>
                  <p>2. Click it and select "Install"</p>
                  <p>3. Or wait for the install prompt to appear</p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  💡 <strong>Tip:</strong> Installing the app gives you offline access, notifications, and a native app experience!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-blue-500" />
              <span>App Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-gray-500" />
                <Label htmlFor="notifications">Push Notifications</Label>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-gray-500" />
                <Label htmlFor="autoClean">Auto Clean Mode</Label>
              </div>
              <Switch
                id="autoClean"
                checked={settings.autoClean}
                onCheckedChange={(checked) => handleSettingChange('autoClean', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Info className="w-4 h-4 text-gray-500" />
                <Label htmlFor="dailyTips">Daily Tips</Label>
              </div>
              <Switch
                id="dailyTips"
                checked={settings.dailyTips}
                onCheckedChange={(checked) => handleSettingChange('dailyTips', checked)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Vibrate className="w-4 h-4 text-gray-500" />
                <Label htmlFor="hapticFeedback">Haptic Feedback</Label>
              </div>
              <Switch
                id="hapticFeedback"
                checked={settings.hapticFeedback}
                onCheckedChange={(checked) => handleSettingChange('hapticFeedback', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {theme === 'light' ? <Sun className="w-5 h-5 text-blue-500" /> : <Moon className="w-5 h-5 text-blue-500" />}
              <span>Appearance</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {theme === 'light' ? <Moon className="w-4 h-4 text-gray-500" /> : <Sun className="w-4 h-4 text-gray-500" />}
                <Label>Dark Mode</Label>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 12 12" className="text-white">
                  <path d="M2 3 L2 9 L10 9 L10 4 L6 4 L5 3 Z" fill="currentColor" opacity="0.8"/>
                  <path d="M3 5 L9 5 L9 8 L3 8 Z" fill="currentColor" opacity="0.6"/>
                  <path d="M4 6 L8 6 M4 7 L7 7" stroke="currentColor" strokeWidth="0.5" opacity="0.9"/>
                </svg>
              </div>
              <span>About</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>DigitalMaestro v1.0</strong>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your intelligent digital organization platform
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Need help? Contact us at{' '}
                <a 
                  href="mailto:digitalmaestro@myyahoo.com" 
                  className="text-blue-500 hover:text-blue-600 underline"
                >
                  digitalmaestro@myyahoo.com
                </a>
              </p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => window.open('mailto:digitalmaestro@myyahoo.com?subject=DigitalMaestro Support Request', '_blank')}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Support
              </Button>
              <Link href="/privacy">
                <Button variant="ghost" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Policy
                </Button>
              </Link>
              <Link href="/terms">
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Terms of Service
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="p-4">
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      <TabBar />
    </div>
  );
}