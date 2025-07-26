import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  CheckCircle, 
  Crown,
  Zap,
  Play,
  Apple,
  Smartphone,
  TrendingUp,
  Shield,
  Globe,
  Camera,
  Mail,
  FolderOpen,
  Star
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import EmailSignup from "@/components/EmailSignup";
const ShowcasePage = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setCanInstall(false);
      }
    }
  };

  const handleGetStarted = () => {
    if (canInstall) {
      handleInstall();
    } else {
      window.location.href = '/app';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-page-load">
      {/* Welcome Section */}
      <div className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10 animate-pulse" />
        
        <div className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-in-top">
              Welcome to 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600 animate-gradient animate-scale-in">
                {" "}DigitalMaestro
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto animate-scale-in-delay">
              Master your digital life with AI-powered organization and cleanup tools.
            </p>
          </div>
        </div>
      </div>

      {/* Email Signup Section */}
      <div className="py-16 bg-gradient-to-r from-blue-900/20 to-green-900/20 border-y border-gray-700">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmailSignup 
            title="Get Notified When DigitalMaestro Launches"
            description="Be the first to know when our mobile app drops on iOS and Android. Get exclusive early access and special launch pricing."
            className="shadow-2xl border border-gray-600"
          />
        </div>
      </div>

      {/* What We Do Section */}
      <div className="py-20 bg-gray-800 min-h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              What We Do
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 animate-fade-in-delay">
              AI-powered digital organization made simple
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-rotate-1 text-center bg-gray-900 border-gray-700 animate-slide-up">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:rotate-12">
                  <Camera className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Photo Cleanup</h3>
                <p className="text-gray-300">
                  Remove duplicates, organize by date, and free up storage space automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:rotate-1 text-center bg-gray-900 border-gray-700 animate-slide-up-delay">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:rotate-12">
                  <FolderOpen className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">File Organization</h3>
                <p className="text-gray-300">
                  Smart categorization of downloads, documents, and files for easy access.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-rotate-1 text-center bg-gray-900 border-gray-700 animate-slide-up-delay-2">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:rotate-12">
                  <Mail className="w-10 h-10 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Email Management</h3>
                <p className="text-gray-300">
                  Clean up your inbox with smart filters and bulk actions for productivity.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:rotate-1 text-center bg-gray-900 border-gray-700 animate-slide-up-delay-3">
              <CardContent className="p-8">
                <div className="w-20 h-20 bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform duration-300 hover:rotate-12">
                  <Smartphone className="w-10 h-10 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">App Optimization</h3>
                <p className="text-gray-300">
                  Identify unused apps and optimize your device's performance and storage.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-blue-900/20 to-green-900/20 rounded-2xl p-6 sm:p-8 md:p-12 max-w-4xl mx-auto border border-gray-700 animate-fade-in-up transition-all duration-500 hover:border-blue-500/50">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                <TrendingUp className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 animate-bounce" />
                <h3 className="text-2xl sm:text-3xl font-bold text-white text-center">Track Your Progress</h3>
              </div>
              <p className="text-gray-300 mb-8 text-base sm:text-lg text-center">
                Get a personalized Digital Health Score, track your cleanup streaks, and see your storage savings in real-time.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm sm:text-base text-gray-300">
                <div className="flex items-center gap-3 hover:text-white transition-colors">
                  <Star className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  <span>Health Score Tracking</span>
                </div>
                <div className="flex items-center gap-3 hover:text-white transition-colors">
                  <Zap className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <span>Cleanup Streaks</span>
                </div>
                <div className="flex items-center gap-3 hover:text-white transition-colors">
                  <Shield className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Storage Analytics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen flex items-center">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
              Choose Your Plan
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 animate-fade-in-delay">
              Simple pricing that grows with you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Monthly Plan */}
            <Card className="border-2 border-gray-700 bg-gray-900">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-white">Monthly</CardTitle>
                <div className="space-y-1">
                  <div className="text-2xl text-gray-400 line-through">$6.99</div>
                  <div className="text-4xl font-bold text-blue-400">$3.50</div>
                  <div className="text-sm text-green-400 font-semibold">Email Signup Discount!</div>
                </div>
                <p className="text-gray-300">per month</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-300">AI-powered organization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-300">Unlimited photo cleanup</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-300">Smart email management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-300">Progress tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-300">3-day free trial</span>
                  </div>
                </div>
                <div className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-center text-sm opacity-50">
                  Choose Monthly
                </div>
              </CardContent>
            </Card>

            {/* Yearly Plan */}
            <Card className="border-2 border-purple-500 bg-gray-900 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-sm font-semibold">
                Popular
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-white">Yearly</CardTitle>
                <div className="space-y-1">
                  <div className="text-2xl text-gray-400 line-through">$69.99</div>
                  <div className="text-4xl font-bold text-purple-400">$34.99</div>
                  <div className="text-sm text-green-400 font-semibold">Email Signup Discount!</div>
                </div>
                <p className="text-gray-300">per year</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-300">AI-powered organization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-300">Unlimited photo cleanup</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-300">Smart email management</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-300">Progress tracking</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-300">50% savings vs monthly</span>
                  </div>
                </div>
                <div className="w-full bg-purple-600 text-white py-2 px-4 rounded-md text-center text-sm opacity-50">
                  Choose Yearly
                </div>
              </CardContent>
            </Card>

            {/* Lifetime Plan */}
            <Card className="border-2 border-green-500 bg-gray-900 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-sm font-semibold">
                Best Value
              </div>
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-white">Lifetime</CardTitle>
                <div className="space-y-1">
                  <div className="text-2xl text-gray-400 line-through">$79.99</div>
                  <div className="text-4xl font-bold text-green-400">$44.99</div>
                  <div className="text-sm text-green-400 font-semibold">Email Signup Discount!</div>
                </div>
                <p className="text-gray-300">one-time payment</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-300">Everything in Monthly</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-300">Lifetime access</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-300">No recurring fees</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-300">Future updates included</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Crown className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    <span className="text-gray-300">Premium support</span>
                  </div>
                </div>
                <div className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-md text-center text-sm opacity-50 flex items-center justify-center gap-2">
                  <Crown className="w-4 h-4" />
                  Get Lifetime Access
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="py-24 bg-gray-800 min-h-screen flex items-center">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
            Download DigitalMaestro
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 animate-fade-in-delay">
            Get started with our mobile app or try the web version
          </p>
          
          <div className="flex flex-col items-center mb-12 animate-fade-in-up">
            <Button 
              variant="outline" 
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 px-10 py-8 text-xl rounded-xl mb-6 transform hover:scale-105 shadow-lg hover:shadow-xl"
              asChild
            >
              <Link href="/demo">
                <Play className="w-6 h-6 mr-3" />
                View Demo
              </Link>
            </Button>
            <p className="text-base text-gray-400 text-center max-w-lg">
              Note: This is a simplified demo. The full app includes advanced AI features, real-time sync, and comprehensive organization tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12 animate-slide-up">
            <Button 
              variant="outline" 
              className="px-6 py-4 rounded-xl border-2 border-gray-600 text-gray-300 hover:border-gray-500 h-auto transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl min-h-[80px]" 
              disabled
            >
              <div className="flex items-center justify-between w-full min-w-0">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Apple className="w-5 h-5 flex-shrink-0" />
                  <span className="text-base font-medium truncate">Download for iOS</span>
                </div>
                <Badge className="text-xs bg-gray-700 text-gray-300 flex-shrink-0 ml-2">Soon</Badge>
              </div>
            </Button>
            <Button 
              variant="outline" 
              className="px-6 py-4 rounded-xl border-2 border-gray-600 text-gray-300 hover:border-gray-500 h-auto transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl min-h-[80px]" 
              disabled
            >
              <div className="flex items-center justify-between w-full min-w-0">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.523 15.3414c-.5511 0-.9993-.4683-.9993-1.0194s.4482-1.0194.9993-1.0194c.5511 0 .9993.4683.9993 1.0194s-.4482 1.0194-.9993 1.0194m-11.046 0c-.5511 0-.9993-.4683-.9993-1.0194s.4482-1.0194.9993-1.0194c.5511 0 .9993.4683.9993 1.0194s-.4482 1.0194-.9993 1.0194m11.4045-6.02l1.9973-3.466a.416.416 0 00-.1518-.5972.416.416 0 00-.5972.1518l-2.0223 3.5075c-1.2045-.5426-2.5886-.8406-4.0305-.8406-1.4419 0-2.826.298-4.0305.8406L6.1075 5.4676a.416.416 0 00-.5972-.1518.416.416 0 00-.1518.5972l1.9973 3.466C2.61 11.2106-.316 15.2256-.316 19.8094h24.632c0-4.5838-2.926-8.5988-7.3688-10.4718"/>
                  </svg>
                  <span className="text-base font-medium truncate">Download for Android</span>
                </div>
                <Badge className="text-xs bg-gray-700 text-gray-300 flex-shrink-0 ml-2">Soon</Badge>
              </div>
            </Button>
          </div>
          
          <p className="text-sm text-gray-400">
            Free 3-day trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-white font-bold text-xl mb-4 md:mb-0">
              DigitalMaestro
            </div>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
              <a href="mailto:digitalmaestro@myyahoo.com" className="hover:text-white transition-colors">
                Support
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 text-center text-gray-400 text-sm">
            © 2025 DigitalMaestro. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowcasePage;