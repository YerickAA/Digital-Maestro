import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, Database, Mail, Smartphone } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";

export default function PrivacyPolicy() {
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Website
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-blue-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Privacy Policy
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Last updated: January 16, 2025
              </p>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              Your Privacy Matters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              At DigitalMaestro, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our digital organization platform.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-green-500" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Personal Information</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                <li>Name and email address when you create an account</li>
                <li>Password (securely hashed and encrypted)</li>
                <li>Payment information for premium subscriptions (processed securely through Stripe)</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Usage Data</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                <li>App usage patterns and feature interactions</li>
                <li>Digital organization metrics and progress tracking</li>
                <li>Device information and platform preferences</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">File Metadata Only</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We analyze file metadata (names, sizes, dates) to provide organization suggestions. 
                <strong> We never access or store your actual file contents.</strong>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-purple-500" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              <li>Provide and improve our digital organization services</li>
              <li>Authenticate your account and maintain security</li>
              <li>Process payments and manage subscriptions</li>
              <li>Send important updates and notifications</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Provide customer support and respond to inquiries</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              Data Security & Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Security Measures</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                <li>End-to-end encryption for all data transmission</li>
                <li>Secure password hashing using industry-standard bcrypt</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Secure cloud infrastructure with backup systems</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Data Retention</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We retain your data only as long as necessary to provide our services. 
                You can request data deletion at any time by contacting us.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Third-Party Services */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-orange-500" />
              Third-Party Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Payment Processing</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We use Stripe for secure payment processing. Your payment information is handled 
                  directly by Stripe and never stored on our servers.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Email Services</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We use Mailgun for sending essential emails like verification codes and 
                  important account notifications. We also use Mailerlite for managing 
                  email newsletter subscriptions and app launch notifications.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Analytics</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We use privacy-focused analytics to understand app usage and improve our services. 
                  No personal data is shared with third parties.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Your Privacy Rights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Under applicable privacy laws (including GDPR and CCPA), you have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
              <li>Access your personal data and download a copy</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Delete your account and associated data (right to erasure)</li>
              <li>Opt out of non-essential communications and marketing emails</li>
              <li>Request data portability to another service</li>
              <li>Object to certain data processing activities</li>
              <li>Restrict processing of your personal data in certain circumstances</li>
              <li>Withdraw consent for data processing where consent was the legal basis</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-500" />
              Contact Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you have any questions about this Privacy Policy or our data practices, 
              please contact us:
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-gray-900 dark:text-white font-medium">
                Email: digitalmaestro@myyahoo.com
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Subject: Privacy Policy Inquiry
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Policy Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">
              We may update this Privacy Policy from time to time. We will notify you of any 
              significant changes by email or through our app. Your continued use of DigitalMaestro 
              after any changes constitutes acceptance of the updated policy.
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <Link href="/">
            <Button>
              Return to Website
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}