import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertDigitalDataSchema, insertStreakSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import Stripe from "stripe";

// Initialize Stripe
let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  console.log('✅ Stripe payment service initialized');
} else {
  console.log('💳 Stripe not configured - payment features disabled');
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }
      
      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Mark user as having completed onboarding
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        onboardingCompleted: true
      });
      
      // Initialize digital data for new user
      await storage.createDigitalData({
        userId: user.id,
        healthScore: 0,
        photosCount: 0,
        photosDuplicates: 0,
        photosStorage: "0",
        filesCount: 0,
        filesLarge: 0,
        filesStorage: "0",
        appsCount: 0,
        appsUnused: 0,
        appsStorage: "0",
        emailCount: 0,
        emailUnread: 0,
        emailStorage: "0",
      });
      
      // Initialize streak for new user
      await storage.createStreak({
        userId: user.id,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
        streakHistory: [],
      });
      
      res.json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Validation failed", details: error.errors });
      } else {
        res.status(400).json({ error: "Invalid user data", details: String(error) });
      }
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
      }
      
      const user = await storage.validatePassword(email, password);
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      
      res.json({ user, message: "Login successful" });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Removed forgot password functionality - no longer using email verification

  app.post("/api/users/check-email", async (req, res) => {
    try {
      const { email } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to check email" });
    }
  });

  app.patch("/api/users/:id/onboarding", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.updateUser(userId, { onboardingCompleted: true });
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Digital data routes
  app.get("/api/digital-data/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const data = await storage.getDigitalData(userId);
      
      if (!data) {
        return res.status(404).json({ error: "Digital data not found" });
      }
      
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to get digital data" });
    }
  });

  app.post("/api/digital-data/:userId/scan", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Simulate scanning digital data
      const mockData = {
        healthScore: Math.floor(Math.random() * 40) + 60, // 60-100
        photosCount: Math.floor(Math.random() * 3000) + 1000,
        photosDuplicates: Math.floor(Math.random() * 200) + 50,
        photosStorage: (Math.random() * 10 + 5).toFixed(1),
        filesCount: Math.floor(Math.random() * 1500) + 500,
        filesLarge: Math.floor(Math.random() * 50) + 10,
        filesStorage: (Math.random() * 20 + 10).toFixed(1),
        appsCount: Math.floor(Math.random() * 100) + 50,
        appsUnused: Math.floor(Math.random() * 30) + 5,
        appsStorage: (Math.random() * 8 + 3).toFixed(1),
        emailCount: Math.floor(Math.random() * 15000) + 5000,
        emailUnread: Math.floor(Math.random() * 3000) + 500,
        emailStorage: (Math.random() * 5 + 1).toFixed(1),
      };
      
      const updatedData = await storage.updateDigitalData(userId, mockData);
      
      if (!updatedData) {
        return res.status(404).json({ error: "Digital data not found" });
      }
      
      res.json(updatedData);
    } catch (error) {
      res.status(500).json({ error: "Failed to scan digital data" });
    }
  });

  app.patch("/api/digital-data/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const updates = req.body;
      
      const updatedData = await storage.updateDigitalData(userId, updates);
      
      if (!updatedData) {
        return res.status(404).json({ error: "Digital data not found" });
      }
      
      res.json(updatedData);
    } catch (error) {
      res.status(500).json({ error: "Failed to update digital data" });
    }
  });

  // Streak routes
  app.get("/api/streaks/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const streak = await storage.getStreak(userId);
      
      if (!streak) {
        return res.status(404).json({ error: "Streak not found" });
      }
      
      res.json(streak);
    } catch (error) {
      res.status(500).json({ error: "Failed to get streak" });
    }
  });

  app.post("/api/streaks/:userId/update", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const currentStreak = await storage.getStreak(userId);
      
      if (!currentStreak) {
        return res.status(404).json({ error: "Streak not found" });
      }
      
      const today = new Date().toISOString().split('T')[0];
      const lastActiveDate = currentStreak.lastActiveDate ? 
        new Date(currentStreak.lastActiveDate).toISOString().split('T')[0] : null;
      
      let newStreak = currentStreak.currentStreak || 0;
      let newHistory = [...(currentStreak.streakHistory || [])];
      
      if (lastActiveDate !== today) {
        newStreak += 1;
        newHistory.push(today);
        
        // Keep only last 30 days
        if (newHistory.length > 30) {
          newHistory = newHistory.slice(-30);
        }
      }
      
      const updatedStreak = await storage.updateStreak(userId, {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, currentStreak.longestStreak || 0),
        lastActiveDate: new Date(),
        streakHistory: newHistory,
      });
      
      res.json(updatedStreak);
    } catch (error) {
      res.status(500).json({ error: "Failed to update streak" });
    }
  });

  // Tips routes
  app.get("/api/tips", async (req, res) => {
    try {
      const tips = await storage.getAllTips();
      res.json(tips);
    } catch (error) {
      res.status(500).json({ error: "Failed to get tips" });
    }
  });

  app.get("/api/tips/random", async (req, res) => {
    try {
      const tip = await storage.getRandomTip();
      
      if (!tip) {
        return res.status(404).json({ error: "No tips available" });
      }
      
      res.json(tip);
    } catch (error) {
      res.status(500).json({ error: "Failed to get random tip" });
    }
  });

  app.get("/api/tips/category/:category", async (req, res) => {
    try {
      const category = req.params.category;
      const tips = await storage.getTipsByCategory(category);
      res.json(tips);
    } catch (error) {
      res.status(500).json({ error: "Failed to get tips by category" });
    }
  });

  // Real data access endpoints
  app.post("/api/real-data/scan", async (req, res) => {
    try {
      const { userId, files, photos, apps, email } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }
      
      // Calculate health score based on real data
      const healthScore = calculateHealthScore(files || [], photos || [], apps || [], email);
      
      // Update digital data with real scan results
      const digitalData = {
        healthScore,
        photosCount: photos?.length || 0,
        photosDuplicates: photos?.filter((p: any) => p.isDuplicate).length || 0,
        photosStorage: formatStorage(photos?.reduce((sum: number, p: any) => sum + (p.size || 0), 0) || 0),
        filesCount: files?.length || 0,
        filesLarge: files?.filter((f: any) => f.size > 100 * 1024 * 1024).length || 0,
        filesStorage: formatStorage(files?.reduce((sum: number, f: any) => sum + (f.size || 0), 0) || 0),
        appsCount: apps?.length || 0,
        appsUnused: apps?.filter((a: any) => a.unused).length || 0,
        appsStorage: formatStorage(apps?.reduce((sum: number, a: any) => sum + (a.size || 0), 0) || 0),
        emailCount: email?.total || 0,
        emailUnread: email?.unread || 0,
        emailStorage: formatStorage(email?.storage || 0),
      };
      
      const updatedData = await storage.updateDigitalData(userId, digitalData);
      
      if (!updatedData) {
        return res.status(404).json({ error: "Digital data not found" });
      }
      
      res.json(updatedData);
    } catch (error) {
      console.error("Failed to save real data scan results:", error);
      res.status(500).json({ error: "Failed to save scan results" });
    }
  });

  app.post("/api/email/connect-imap", async (req, res) => {
    try {
      const { host, port, secure, email, password } = req.body;
      
      // This would need proper IMAP library implementation
      // For now, return a mock response
      res.json({
        success: true,
        message: "IMAP connection would be established server-side",
        account: {
          id: email,
          email: email,
          provider: 'imap',
          isConnected: true
        }
      });
    } catch (error) {
      res.status(500).json({ error: "IMAP connection failed" });
    }
  });

  app.post("/api/email/oauth/gmail", async (req, res) => {
    try {
      const { code } = req.body;
      
      // This would handle Gmail OAuth token exchange
      res.json({
        success: true,
        message: "Gmail OAuth would be handled server-side",
        tokens: {
          accessToken: "mock-access-token",
          refreshToken: "mock-refresh-token"
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Gmail OAuth failed" });
    }
  });

  app.post("/api/email/oauth/outlook", async (req, res) => {
    try {
      const { code } = req.body;
      
      // This would handle Outlook OAuth token exchange
      res.json({
        success: true,
        message: "Outlook OAuth would be handled server-side",
        tokens: {
          accessToken: "mock-access-token",
          refreshToken: "mock-refresh-token"
        }
      });
    } catch (error) {
      res.status(500).json({ error: "Outlook OAuth failed" });
    }
  });

  // Email Signup Route (Mailerlite Integration)
  app.post("/api/email-signup", async (req, res) => {
    try {
      const { email, source, tags } = req.body;
      
      if (!email || !email.includes("@")) {
        return res.status(400).json({ error: "Valid email address is required" });
      }

      // Mailerlite API integration
      const mailerliteApiKey = process.env.MAILERLITE_API_KEY;
      const mailerliteGroupId = process.env.MAILERLITE_GROUP_ID || 'app_launch';
      
      if (!mailerliteApiKey) {
        console.log('⚠️  Mailerlite API key not configured - email signup disabled');
        return res.status(500).json({ error: "Email signup service not configured" });
      }

      // Check if subscriber already exists
      const checkResponse = await fetch(`https://connect.mailerlite.com/api/subscribers/${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${mailerliteApiKey}`,
          'Accept': 'application/json',
        },
      });

      if (checkResponse.ok) {
        // Subscriber already exists
        return res.status(400).json({
          error: "We know you want it, but good things come to those who wait! 😉"
        });
      }

      // Add subscriber to Mailerlite
      const mailerliteResponse = await fetch('https://connect.mailerlite.com/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mailerliteApiKey}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          groups: [mailerliteGroupId],
          fields: {
            source: source || 'website',
            signup_date: new Date().toISOString(),
          },
          tags: tags || ['app_launch_notification'],
        }),
      });

      if (mailerliteResponse.ok) {
        const result = await mailerliteResponse.json();
        
        // Check if this is an existing subscriber by comparing creation and update dates
        const subscriber = result.data;
        const createdAt = new Date(subscriber.created_at);
        const updatedAt = new Date(subscriber.updated_at);
        const timeDiff = Math.abs(updatedAt.getTime() - createdAt.getTime());
        
        // If subscriber was updated significantly after creation, it's a duplicate signup
        if (timeDiff > 10 * 1000) { // More than 10 seconds difference indicates update of existing subscriber
          console.log(`⚠️ Duplicate email signup attempt: ${email}`);
          return res.status(400).json({
            error: "We know you want it, but good things come to those who wait! 😉"
          });
        }
        
        console.log(`✅ Email signup successful: ${email}`);
        
        res.json({
          success: true,
          message: "Successfully signed up for notifications!",
          subscriber: result.data,
        });
      } else {
        const error = await mailerliteResponse.json();
        console.error('Mailerlite API error:', error);
        
        // Handle duplicate email case
        if (error.message && error.message.includes('already exists')) {
          res.status(400).json({
            error: "We know you want it, but good things come to those who wait! 😉"
          });
        } else {
          res.status(400).json({ 
            error: "Failed to subscribe to notifications. Please try again." 
          });
        }
      }
    } catch (error) {
      console.error('Email signup error:', error);
      res.status(500).json({ 
        error: "Unable to process signup request. Please try again later." 
      });
    }
  });

  // Stripe Payment Routes
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe not configured" });
    }

    try {
      const { amount } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Valid amount is required" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  });

  app.post("/api/create-subscription", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe not configured" });
    }

    try {
      const { userId, planType } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (!user.email) {
        return res.status(400).json({ error: "User email is required" });
      }

      // Check if user already has lifetime access
      if (user.subscriptionStatus === 'lifetime') {
        return res.json({
          status: 'lifetime',
          message: 'User already has lifetime access',
        });
      }

      // Create or retrieve Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
        });
        customerId = customer.id;
        await storage.updateStripeCustomerId(userId, customerId);
      }

      if (planType === 'lifetime') {
        // Create one-time payment for lifetime access
        const paymentIntent = await stripe.paymentIntents.create({
          amount: 7999, // $79.99 in cents
          currency: 'usd',
          customer: customerId,
          metadata: {
            userId: userId.toString(),
            planType: 'lifetime',
          },
        });

        res.json({
          clientSecret: paymentIntent.client_secret,
          planType: 'lifetime',
          amount: 79.99,
        });
      } else if (planType === 'yearly') {
        // Check if user is already in trial or has active subscription
        if (user.subscriptionStatus === 'trial') {
          // User is in trial, create yearly subscription without trial
          const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{
              price: process.env.STRIPE_YEARLY_PRICE_ID, // $69.99/year price ID
            }],
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
          });

          await storage.updateUserStripeInfo(userId, customerId, subscription.id);

          res.json({
            subscriptionId: subscription.id,
            status: subscription.status,
            clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
          });
        } else {
          // Start 7-day free trial for yearly subscription
          const trialEnd = new Date();
          trialEnd.setDate(trialEnd.getDate() + 7);

          const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{
              price: process.env.STRIPE_YEARLY_PRICE_ID, // $69.99/year price ID
            }],
            trial_end: Math.floor(trialEnd.getTime() / 1000),
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
          });

          // Update user with trial status
          await storage.updateUserStripeInfo(userId, customerId, subscription.id);
          await storage.updateSubscriptionStatus(userId, 'trial');

          res.json({
            subscriptionId: subscription.id,
            status: 'trial',
            trialEnd: trialEnd.toISOString(),
            clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
          });
        }
      } else if (planType === 'monthly') {
        // Check if user is already in trial
        if (user.subscriptionStatus === 'trial') {
          // User is in trial, create subscription without trial
          const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{
              price: process.env.STRIPE_MONTHLY_PRICE_ID, // $7/month price ID
            }],
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
          });

          await storage.updateUserStripeInfo(userId, customerId, subscription.id);

          res.json({
            subscriptionId: subscription.id,
            status: subscription.status,
            clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
          });
        } else {
          // Start 3-day free trial
          const trialEnd = new Date();
          trialEnd.setDate(trialEnd.getDate() + 3);

          const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [{
              price: process.env.STRIPE_MONTHLY_PRICE_ID, // $7/month price ID
            }],
            trial_end: Math.floor(trialEnd.getTime() / 1000),
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
          });

          // Update user with trial status
          await storage.updateUserStripeInfo(userId, customerId, subscription.id);
          await storage.updateSubscriptionStatus(userId, 'trial');

          res.json({
            subscriptionId: subscription.id,
            status: 'trial',
            trialEnd: trialEnd.toISOString(),
            clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
          });
        }
      } else {
        return res.status(400).json({ error: "Invalid plan type" });
      }
    } catch (error: any) {
      console.error("Error creating subscription:", error);
      console.error("Error details:", {
        message: error.message,
        type: error.type,
        code: error.code,
        planType: planType,
        userId: userId,
        hasMonthlyPriceId: !!process.env.STRIPE_MONTHLY_PRICE_ID,
        hasYearlyPriceId: !!process.env.STRIPE_YEARLY_PRICE_ID
      });
      res.status(500).json({ 
        error: "Failed to create subscription",
        details: error.message 
      });
    }
  });

  app.post("/api/cancel-subscription", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe not configured" });
    }

    try {
      const { userId } = req.body;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const user = await storage.getUser(userId);
      if (!user || !user.stripeSubscriptionId) {
        return res.status(404).json({ error: "No active subscription found" });
      }

      const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true,
      });

      await storage.updateSubscriptionStatus(userId, 'canceled');

      res.json({
        subscriptionId: subscription.id,
        status: subscription.status,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      });
    } catch (error: any) {
      console.error("Error canceling subscription:", error);
      res.status(500).json({ error: "Failed to cancel subscription" });
    }
  });

  app.post("/api/stripe-webhook", async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe not configured" });
    }

    const sig = req.headers['stripe-signature'] as string;
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle subscription status changes
    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object as Stripe.Subscription;
      
      // Find user by Stripe customer ID (simplified lookup)
      console.log('Subscription webhook received:', subscription.id, subscription.status);
    }

    // Handle successful lifetime payments
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      if (paymentIntent.metadata?.planType === 'lifetime') {
        const userId = parseInt(paymentIntent.metadata.userId);
        if (userId) {
          await storage.updateSubscriptionStatus(userId, 'lifetime');
          console.log('Lifetime subscription activated for user:', userId);
        }
      }
    }

    res.json({ received: true });
  });

  // Helper functions
  function calculateHealthScore(files: any[], photos: any[], apps: any[], email: any): number {
    let score = 100;
    
    // Deduct points for duplicates
    if (photos) {
      const duplicateRatio = photos.filter(p => p.isDuplicate).length / photos.length;
      score -= duplicateRatio * 20;
    }
    
    // Deduct points for large files
    if (files) {
      const largeFileRatio = files.filter(f => f.isLarge).length / files.length;
      score -= largeFileRatio * 15;
    }
    
    // Deduct points for unused apps
    if (apps) {
      const unusedAppRatio = apps.filter(a => !a.isInstalled).length / apps.length;
      score -= unusedAppRatio * 10;
    }
    
    // Deduct points for unread emails
    if (email && email.total > 0) {
      const unreadRatio = email.unread / email.total;
      score -= unreadRatio * 25;
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  function formatStorage(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  const httpServer = createServer(app);
  return httpServer;
}
