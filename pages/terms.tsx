import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Scale, AlertTriangle, Crown, RefreshCw, Shield } from "lucide-react";
import { Link } from "wouter";
import { useEffect } from "react";

export default function TermsOfService() {
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
            <FileText className="h-8 w-8 text-blue-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Terms of Service
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
              <Scale className="h-5 w-5 text-blue-500" />
              Agreement to Terms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Welcome to DigitalMaestro! These Terms of Service ("Terms") constitute a legally binding agreement between you and DigitalMaestro ("we," "us," or "our") regarding your use of our digital organization platform and services.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              <strong>By accessing, downloading, or using DigitalMaestro, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.</strong> If you do not agree to these Terms, you may not use our services.
            </p>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              Our Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              DigitalMaestro is a digital organization platform that helps you manage and optimize your digital files, photos, apps, and emails. We offer:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
              <li>Intelligent file organization and duplicate detection</li>
              <li>Digital wellness insights and recommendations</li>
              <li>Progress tracking and gamification features</li>
              <li>Advanced filtering and batch operations</li>
              <li>Export and backup tools</li>
            </ul>
          </CardContent>
        </Card>

        {/* User Accounts */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-purple-500" />
              User Accounts & Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Account Creation & Eligibility</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                <li>You must be at least 13 years old (or 16 in EU) to use our service</li>
                <li>You must provide accurate, current, and complete information</li>
                <li>You are responsible for maintaining account security and password confidentiality</li>
                <li>One account per person; account sharing or transfer is prohibited</li>
                <li>You must promptly update account information if it changes</li>
                <li>You are liable for all activities under your account</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Acceptable Use Policy</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">You agree NOT to:</p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                <li>Use the service for any illegal purpose or in violation of applicable laws</li>
                <li>Attempt to hack, reverse engineer, or circumvent security measures</li>
                <li>Upload malicious code, viruses, or harmful content</li>
                <li>Violate others' privacy, intellectual property, or other rights</li>
                <li>Engage in spamming, phishing, or fraudulent activities</li>
                <li>Interfere with or disrupt our service or servers</li>
                <li>Use automated tools to access or scrape our service</li>
                <li>Impersonate others or provide false information</li>
                <li>Sell, rent, or transfer your account without permission</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Account Suspension & Termination</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We may suspend or terminate your account immediately for violations of these Terms, illegal activity, or abuse of our service. Upon termination, your right to use the service ceases, and we may delete your data as described in our Privacy Policy.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-500" />
              Intellectual Property Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Our Intellectual Property</h3>
              <p className="text-gray-700 dark:text-gray-300">
                DigitalMaestro, including all software, designs, text, graphics, logos, and other content, is owned by us and protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works without our written permission.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Your Content</h3>
              <p className="text-gray-700 dark:text-gray-300">
                You retain ownership of your files and data. By using our service, you grant us a limited, non-exclusive license to process your data solely to provide our services. We do not claim ownership of your content and will not use it for any other purpose without your consent.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Copyright Infringement</h3>
              <p className="text-gray-700 dark:text-gray-300">
                If you believe your copyrighted work has been infringed, please contact us at digitalmaestro@myyahoo.com with: (1) description of the copyrighted work, (2) location of the infringing material, (3) your contact information, (4) a statement of good faith belief that use is not authorized, and (5) a statement that the information is accurate and you are authorized to act on behalf of the copyright owner.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Terms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-orange-500" />
              Subscription & Payment Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Free Plan</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Our free plan provides basic digital organization features with usage limitations. Free accounts may be subject to data retention limits and reduced support availability.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Monthly Subscription ($6.99/month)</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                <li>Includes 3-day free trial for new users (credit card required)</li>
                <li>Automatically renews monthly unless cancelled at least 24 hours before renewal</li>
                <li>Cancel anytime through your account settings or by contacting support</li>
                <li>Refunds available within 30 days of initial purchase only</li>
                <li>No refunds for partial months or subsequent billing periods</li>
                <li>Price changes will be communicated 30 days in advance</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Yearly Subscription ($69.99/year)</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                <li>Includes 7-day free trial for new users (credit card required)</li>
                <li>Automatically renews annually unless cancelled at least 24 hours before renewal</li>
                <li>Cancel anytime through your account settings or by contacting support</li>
                <li>Refunds available within 30 days of initial purchase only</li>
                <li>No refunds for partial years or subsequent billing periods</li>
                <li>Significant savings compared to monthly billing</li>
                <li>Price changes will be communicated 30 days in advance</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Lifetime Access ($79.99)</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                <li>One-time payment for permanent access to current features</li>
                <li>No recurring charges or renewal required</li>
                <li>Subject to account good standing and compliance with Terms</li>
                <li>Non-transferable and non-refundable after 30 days</li>
                <li>Future premium features may require additional payment</li>
                <li>Service continuity depends on business viability and compliance with Terms</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Payment Processing & Billing</h3>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                <li>All payments processed securely through Stripe, Inc.</li>
                <li>By subscribing, you authorize automatic charges to your payment method</li>
                <li>Failed payments may result in service suspension after 7 days</li>
                <li>You are responsible for maintaining current payment information</li>
                <li>All prices are in USD and subject to applicable taxes</li>
                <li>Billing disputes must be reported within 60 days</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Data Handling & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Your Data</h3>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                  <li>You retain ownership of your data and files</li>
                  <li>We analyze file metadata only, never file contents</li>
                  <li>You can export or delete your data at any time</li>
                  <li>We implement security measures to protect your information</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Our Rights</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We may access your account data only to provide support, maintain security, 
                  or comply with legal requirements. See our Privacy Policy for details.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Limitations */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Warranties, Disclaimers & Limitations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Service Availability</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We strive for high availability but cannot guarantee uninterrupted service. 
                  Maintenance, updates, technical issues, or force majeure events may cause service disruptions. 
                  We are not liable for any losses resulting from service unavailability.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Disclaimer of Warranties</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, DIGITALMAESTRO IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Implied warranties of merchantability, fitness for a particular purpose, or non-infringement</li>
                  <li>Warranties that the service will be uninterrupted, secure, or error-free</li>
                  <li>Warranties regarding the accuracy, reliability, or completeness of content</li>
                  <li>Warranties that defects will be corrected or that the service is free of viruses</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Limitation of Liability</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-2">
                  <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL DIGITALMAESTRO BE LIABLE FOR:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                  <li>Indirect, incidental, special, consequential, or punitive damages</li>
                  <li>Loss of profits, data, use, goodwill, or other intangible losses</li>
                  <li>Damages resulting from unauthorized access to or alteration of your data</li>
                  <li>Damages resulting from third-party conduct or content</li>
                  <li>Any amount exceeding the fees you paid in the 12 months preceding the claim</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 mt-2">
                  Some jurisdictions do not allow limitations on implied warranties or exclusions of liability for incidental or consequential damages. In such jurisdictions, our liability is limited to the greatest extent permitted by law.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">User Responsibility & Indemnification</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  You are responsible for: (1) backing up your data regularly, (2) using our service in compliance with applicable laws, (3) maintaining the confidentiality of your account, and (4) indemnifying us against claims arising from your use of the service or violation of these Terms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Account Termination</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">By You</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  You may terminate your account at any time through your account settings. 
                  Upon termination, your data will be deleted according to our retention policy.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">By Us</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  We may terminate accounts for violations of these terms, illegal activity, 
                  or abuse of our service. We will provide reasonable notice when possible.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dispute Resolution */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-purple-500" />
              Dispute Resolution & Governing Law
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Governing Law</h3>
              <p className="text-gray-700 dark:text-gray-300">
                These Terms shall be governed by and construed in accordance with the laws of the State of New Jersey, without regard to its conflict of laws principles. Any legal action or proceeding arising under these Terms will be brought exclusively in the federal or state courts located in New Jersey.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Dispute Resolution Process</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                Before initiating any legal proceedings, you agree to attempt to resolve disputes through the following process:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                <li>Contact our support team at digitalmaestro@myyahoo.com with a detailed description of the dispute</li>
                <li>Allow us 30 days to investigate and respond to your concerns</li>
                <li>If unresolved, participate in good faith mediation through a mutually agreed mediator</li>
                <li>Only after exhausting these steps may formal legal action be pursued</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Class Action Waiver</h3>
              <p className="text-gray-700 dark:text-gray-300">
                You agree that any dispute resolution proceedings will be conducted only on an individual basis and not as part of a class, consolidated, or representative action. This waiver applies to the maximum extent permitted by law.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Severability</h3>
              <p className="text-gray-700 dark:text-gray-300">
                If any provision of these Terms is found to be unenforceable or invalid, the remaining provisions will remain in full force and effect. The unenforceable provision will be modified to the minimum extent necessary to make it enforceable.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Modifications to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We reserve the right to modify these Terms at any time. Material changes will be communicated through:
            </p>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1 mb-4">
              <li>Email notification to your registered email address</li>
              <li>In-app notification when you next access the service</li>
              <li>Posted notice on our website or app</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300">
              Changes will take effect 30 days after notification unless you terminate your account within that period. Continued use after the effective date constitutes acceptance of the modified Terms.
            </p>
          </CardContent>
        </Card>

        {/* Additional Legal Terms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              Additional Legal Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Entire Agreement</h3>
              <p className="text-gray-700 dark:text-gray-300">
                These Terms, together with our Privacy Policy, constitute the entire agreement between you and DigitalMaestro regarding your use of our service and supersede all prior agreements, understandings, and communications.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Force Majeure</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We shall not be liable for any failure to perform our obligations due to circumstances beyond our reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, strikes, government actions, or internet service provider failures.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Assignment</h3>
              <p className="text-gray-700 dark:text-gray-300">
                You may not assign or transfer these Terms or your account without our written consent. We may assign these Terms to any affiliate, successor, or acquirer without notice to you.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Waiver</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Our failure to enforce any provision of these Terms does not constitute a waiver of that provision or any other provision. Any waiver must be in writing and signed by us.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Survival</h3>
              <p className="text-gray-700 dark:text-gray-300">
                The following sections shall survive termination of these Terms: User Responsibilities, Intellectual Property Rights, Warranties and Disclaimers, Limitation of Liability, Indemnification, Dispute Resolution, and Governing Law.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Questions about these Terms of Service? Contact us:
            </p>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-gray-900 dark:text-white font-medium">
                Email: digitalmaestro@myyahoo.com
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Subject: Terms of Service Question
              </p>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Important:</strong> These Terms are governed by New Jersey law. By using our service, you agree to resolve any disputes through the process outlined above before pursuing legal action.
              </p>
            </div>
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