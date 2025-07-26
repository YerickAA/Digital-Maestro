import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  Camera, 
  Mail, 
  Smartphone,
  Image,
  Trash2,
  Star,
  TrendingUp,
  Award,
  Zap,
  X,
  ArrowLeft
} from "lucide-react";
import { Link } from "wouter";

const DemoApp = () => {
  const [activeTab, setActiveTab] = useState("home");
  
  // Mock data for demo
  const demoData = {
    user: { name: "Demo User" },
    healthScore: 85,
    photos: { total: 2847, duplicates: 234, size: "3.2 GB" },
    files: { total: 1205, unused: 89, size: "1.8 GB" },
    emails: { total: 15420, unread: 1832, promotions: 3456 },
    apps: { total: 127, unused: 23, size: "2.1 GB" },
    currentStreak: 7,
    longestStreak: 14
  };

  const TabBar = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-50">
      <div className="flex justify-around items-center py-2">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex flex-col items-center py-2 px-4 ${
            activeTab === "home" ? "text-blue-400" : "text-gray-400"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          onClick={() => setActiveTab("organize")}
          className={`flex flex-col items-center py-2 px-4 ${
            activeTab === "organize" ? "text-blue-400" : "text-gray-400"
          }`}
        >
          <FolderOpen className="w-5 h-5" />
          <span className="text-xs mt-1">Organize</span>
        </button>
        <button
          onClick={() => setActiveTab("insights")}
          className={`flex flex-col items-center py-2 px-4 ${
            activeTab === "insights" ? "text-blue-400" : "text-gray-400"
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-xs mt-1">Insights</span>
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex flex-col items-center py-2 px-4 ${
            activeTab === "settings" ? "text-blue-400" : "text-gray-400"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs mt-1">Settings</span>
        </button>
      </div>
    </div>
  );

  const HomeTab = () => (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, {demoData.user.name}!
          </h1>
          <p className="text-gray-300">
            Your digital space is looking great
          </p>
        </div>
        <Link href="/showcase">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>
      </div>

      {/* Digital Health Score */}
      <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Digital Health Score</h3>
              <div className="text-3xl font-bold">{demoData.healthScore}/100</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Excellent</div>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">+5 this week</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gray-900 border-gray-700" onClick={() => setActiveTab("organize")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
                <Camera className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Photos</h3>
                <p className="text-sm text-gray-300">{demoData.photos.total} items</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Duplicates</span>
                <span className="text-orange-600">{demoData.photos.duplicates}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Storage</span>
                <span>{demoData.photos.size}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gray-900 border-gray-700" onClick={() => setActiveTab("organize")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-900 rounded-full flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Files</h3>
                <p className="text-sm text-gray-300">{demoData.files.total} items</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Unused</span>
                <span className="text-orange-600">{demoData.files.unused}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Storage</span>
                <span>{demoData.files.size}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gray-900 border-gray-700" onClick={() => setActiveTab("organize")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-900 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Emails</h3>
                <p className="text-sm text-gray-300">{demoData.emails.total} items</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Unread</span>
                <span className="text-orange-600">{demoData.emails.unread}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Promotions</span>
                <span>{demoData.emails.promotions}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow bg-gray-900 border-gray-700" onClick={() => setActiveTab("organize")}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-900 rounded-full flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Apps</h3>
                <p className="text-sm text-gray-300">{demoData.apps.total} items</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Unused</span>
                <span className="text-orange-600">{demoData.apps.unused}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Storage</span>
                <span>{demoData.apps.size}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Streak Card */}
      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-900 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-white">Cleanup Streak</h3>
              <p className="text-sm text-gray-300">
                {demoData.currentStreak} days • Best: {demoData.longestStreak} days
              </p>
            </div>
            <div className="text-2xl">🔥</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const OrganizeTab = () => (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          Organize
        </h1>
        <Badge variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">Demo Mode</Badge>
      </div>

      <Tabs defaultValue="photos" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800 border-gray-700">
          <TabsTrigger value="photos" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Photos</TabsTrigger>
          <TabsTrigger value="files" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Files</TabsTrigger>
          <TabsTrigger value="emails" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Emails</TabsTrigger>
          <TabsTrigger value="apps" className="data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-300">Apps</TabsTrigger>
        </TabsList>

        <TabsContent value="photos" className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="relative aspect-square bg-gray-700 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-75"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image className="w-8 h-8 text-white" />
                </div>
                {i < 3 && (
                  <div className="absolute top-1 right-1">
                    <Badge className="text-xs bg-red-500">Duplicate</Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Trash2 className="w-5 h-5 text-red-500" />
                <div>
                  <h3 className="font-semibold text-white">234 Duplicates Found</h3>
                  <p className="text-sm text-gray-300">Save 1.2 GB of storage</p>
                </div>
              </div>
              <Button className="w-full opacity-50 cursor-not-allowed bg-gray-700 text-gray-300 border-gray-600" disabled>
                <Trash2 className="w-4 h-4 mr-2" />
                Remove Duplicates (View Only)
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-4">
          <div className="space-y-3">
            {[
              { name: "document.pdf", size: "2.4 MB", type: "PDF", color: "red" },
              { name: "spreadsheet.xlsx", size: "1.8 MB", type: "Excel", color: "green" },
              { name: "presentation.pptx", size: "5.2 MB", type: "PPT", color: "orange" },
              { name: "image.jpg", size: "890 KB", type: "JPG", color: "blue" },
              { name: "video.mp4", size: "45 MB", type: "MP4", color: "purple" },
            ].map((file, i) => (
              <Card key={i} className="bg-gray-900 border-gray-700">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 bg-${file.color}-900 rounded flex items-center justify-center`}>
                      <span className={`text-xs font-bold text-${file.color}-600`}>{file.type}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{file.name}</div>
                      <div className="text-sm text-gray-300">{file.size}</div>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-50 cursor-not-allowed text-gray-400" disabled>
                      <Star className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="emails" className="space-y-4">
          <div className="space-y-3">
            {[
              { subject: "Newsletter - Daily Updates", from: "news@example.com", unread: true },
              { subject: "Promotion: 50% Off Sale", from: "store@shop.com", unread: true },
              { subject: "Meeting Reminder", from: "team@work.com", unread: false },
              { subject: "Welcome to our service", from: "hello@service.com", unread: false },
            ].map((email, i) => (
              <Card key={i} className="bg-gray-900 border-gray-700">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${email.unread ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
                    <div className="flex-1">
                      <div className={`font-medium ${email.unread ? 'text-white' : 'text-gray-400'}`}>
                        {email.subject}
                      </div>
                      <div className="text-sm text-gray-300">{email.from}</div>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-50 cursor-not-allowed text-gray-400" disabled>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="apps" className="space-y-4">
          <div className="space-y-3">
            {[
              { name: "Social Media App", size: "156 MB", lastUsed: "2 days ago", unused: false },
              { name: "Old Game", size: "245 MB", lastUsed: "3 months ago", unused: true },
              { name: "Productivity Tool", size: "89 MB", lastUsed: "1 hour ago", unused: false },
              { name: "Photo Editor", size: "312 MB", lastUsed: "2 weeks ago", unused: true },
            ].map((app, i) => (
              <Card key={i} className="bg-gray-900 border-gray-700">
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-white">{app.name}</div>
                      <div className="text-sm text-gray-300">
                        {app.size} • Last used: {app.lastUsed}
                      </div>
                    </div>
                    {app.unused && (
                      <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                        Unused
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const InsightsTab = () => (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          Insights
        </h1>
        <Badge variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">Demo Mode</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 text-white">Storage Saved</h3>
            <div className="text-2xl font-bold text-green-600">2.4 GB</div>
            <p className="text-sm text-gray-300">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-700">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 text-white">Items Organized</h3>
            <div className="text-2xl font-bold text-blue-600">1,247</div>
            <p className="text-sm text-gray-300">This month</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4 text-white">Weekly Progress</h3>
          <div className="space-y-3">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <div key={day} className="flex items-center gap-3">
                <div className="w-8 text-sm text-gray-300">{day}</div>
                <div className="flex-1">
                  <Progress value={[65, 80, 45, 90, 75, 40, 85][i]} className="h-2" />
                </div>
                <div className="text-sm text-gray-300">
                  {[65, 80, 45, 90, 75, 40, 85][i]}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4 text-white">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-300">Photos cleaned</span>
              <span className="font-semibold text-white">234</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Files organized</span>
              <span className="font-semibold text-white">89</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Emails processed</span>
              <span className="font-semibold text-white">1,432</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Apps optimized</span>
              <span className="font-semibold text-white">23</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          Settings
        </h1>
        <Badge variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">Demo Mode</Badge>
      </div>

      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4 text-white">Account</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-300">Name</span>
              <span className="text-gray-300">Demo User</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Email</span>
              <span className="text-gray-300">demo@example.com</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Plan</span>
              <Badge className="bg-gray-700 text-gray-300">Demo</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4 text-white">Preferences</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Auto-cleanup</span>
              <Button variant="outline" size="sm" className="opacity-50 cursor-not-allowed bg-gray-700 text-gray-300 border-gray-600" disabled>
                Disabled
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Notifications</span>
              <Button variant="outline" size="sm" className="opacity-50 cursor-not-allowed bg-gray-700 text-gray-300 border-gray-600" disabled>
                Enabled
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Dark mode</span>
              <Button variant="outline" size="sm" className="opacity-50 cursor-not-allowed bg-gray-700 text-gray-300 border-gray-600" disabled>
                Auto
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-700">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-4 text-white">Support</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start opacity-50 cursor-not-allowed bg-gray-700 text-gray-300 border-gray-600" disabled>
              Help Center
            </Button>
            <Button variant="outline" className="w-full justify-start opacity-50 cursor-not-allowed bg-gray-700 text-gray-300 border-gray-600" disabled>
              Contact Support
            </Button>
            <Button variant="outline" className="w-full justify-start opacity-50 cursor-not-allowed bg-gray-700 text-gray-300 border-gray-600" disabled>
              Privacy Policy
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="pt-4">
        <Link href="/showcase">
          <Button variant="outline" className="w-full bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Showcase
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-md mx-auto bg-gray-800 min-h-screen">
        {/* Demo Banner */}
        <div className="bg-blue-600 text-white px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">Demo Mode - View Only</span>
          </div>
          <p className="text-xs opacity-90">
            This is a simplified preview. The full app includes AI-powered features, real-time sync, and advanced organization tools.
          </p>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeTab === "home" && <HomeTab />}
          {activeTab === "organize" && <OrganizeTab />}
          {activeTab === "insights" && <InsightsTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>

        {/* Tab Bar */}
        <TabBar />
      </div>
    </div>
  );
};

export default DemoApp;