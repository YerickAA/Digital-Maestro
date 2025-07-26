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
  Globe
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import EmailSignup from "@/components/EmailSignup";

const LandingPage = () => {
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
      window.location.href = '/welcome';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10" />
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Master Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                {" "}Digital Life
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Transform your digital chaos into organized perfection. Clean up photos, files, apps, and emails with AI-powered intelligence.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-300">
              Choose the plan that works best for you
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
      <div className="py-24 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Download DigitalMaestro and start organizing your digital life today
          </p>
          
          <div className="flex justify-center mb-8">
            <Button 
              variant="outline" 
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg rounded-xl"
              asChild
            >
              <Link href="/demo">
                <Play className="w-5 h-5 mr-2" />
                View Demo
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button variant="outline" className="px-6 py-4 rounded-xl" disabled>
              <Apple className="w-5 h-5 mr-2" />
              App Store
              <Badge className="ml-2 text-xs">Coming Soon</Badge>
            </Button>
            <Button variant="outline" className="px-6 py-4 rounded-xl" disabled>
              <Play className="w-5 h-5 mr-2" />
              Google Play
              <Badge className="ml-2 text-xs">Coming Soon</Badge>
            </Button>
          </div>
          
          <p className="text-sm text-gray-400">
            Free 3-day trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>

      {/* Email Signup Section */}
      <div className="py-16 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <EmailSignup 
            title="Get Notified When DigitalMaestro Launches"
            description="Be the first to know when our mobile app drops on iOS and Android. Get exclusive early access and special launch pricing."
            className="shadow-2xl"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-black py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            © 2025 DigitalMaestro. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;