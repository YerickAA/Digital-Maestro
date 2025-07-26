import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Zap } from "lucide-react";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="w-24 h-24 mb-6 mx-auto">
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg relative overflow-hidden">
              {/* Digital pattern background */}
              <div className="absolute inset-0 opacity-20">
                <div className="grid grid-cols-8 gap-1 p-2 h-full">
                  {[...Array(40)].map((_, i) => (
                    <div key={i} className="bg-white rounded-sm opacity-30" style={{
                      height: Math.random() > 0.5 ? '4px' : '2px',
                      animationDelay: `${i * 0.1}s`
                    }}></div>
                  ))}
                </div>
              </div>
              {/* Main logo */}
              <div className="relative z-10 flex items-center justify-center">
                <svg width="48" height="48" viewBox="0 0 48 48" className="text-white">
                  {/* Stylized folder/organization icon */}
                  <path d="M8 12 L8 36 L40 36 L40 16 L24 16 L20 12 Z" fill="currentColor" opacity="0.8"/>
                  <path d="M12 20 L36 20 L36 32 L12 32 Z" fill="currentColor" opacity="0.6"/>
                  <path d="M16 24 L32 24 M16 28 L28 28" stroke="currentColor" strokeWidth="2" opacity="0.9"/>
                  {/* Digital sparkle elements */}
                  <circle cx="38" cy="14" r="2" fill="currentColor" opacity="0.7"/>
                  <circle cx="42" cy="18" r="1.5" fill="currentColor" opacity="0.5"/>
                  <circle cx="35" cy="10" r="1" fill="currentColor" opacity="0.8"/>
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to DigitalMaestro
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Your intelligent digital organization platform that masterfully manages photos, files, apps, and emails with precision.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Get Started</CardTitle>
            <CardDescription className="text-center">
              Choose how you'd like to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/register">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold">
                Create Account
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full py-3 rounded-lg font-semibold">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help? Contact us at{' '}
            <a 
              href="mailto:digitalmaestro@myyahoo.com" 
              className="text-blue-500 hover:text-blue-600 underline"
            >
              digitalmaestro@myyahoo.com
            </a>
          </p>
          
          <div className="flex justify-center gap-6 text-sm text-gray-400">
            <Link href="/privacy" className="hover:text-gray-600 dark:hover:text-gray-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-600 dark:hover:text-gray-300">
              Terms of Service
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}