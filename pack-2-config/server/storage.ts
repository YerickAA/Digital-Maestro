import { users, digitalData, streaks, tips, type User, type InsertUser, type DigitalData, type InsertDigitalData, type Streak, type InsertStreak, type Tip, type InsertTip } from "@shared/schema";
import { db } from "./db";
import { eq, and, gt, sql } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  
  // Digital Data
  getDigitalData(userId: number): Promise<DigitalData | undefined>;
  createDigitalData(data: InsertDigitalData): Promise<DigitalData>;
  updateDigitalData(userId: number, data: Partial<DigitalData>): Promise<DigitalData | undefined>;
  
  // Streaks
  getStreak(userId: number): Promise<Streak | undefined>;
  createStreak(streak: InsertStreak): Promise<Streak>;
  updateStreak(userId: number, streak: Partial<Streak>): Promise<Streak | undefined>;
  
  // Tips
  getAllTips(): Promise<Tip[]>;
  getTipsByCategory(category: string): Promise<Tip[]>;
  getRandomTip(): Promise<Tip | undefined>;
  createTip(tip: InsertTip): Promise<Tip>;
  
  // Authentication
  validatePassword(email: string, password: string): Promise<User | undefined>;
  
  // Stripe Subscriptions
  updateStripeCustomerId(userId: number, customerId: string): Promise<User | undefined>;
  updateUserStripeInfo(userId: number, customerId: string, subscriptionId: string): Promise<User | undefined>;
  updateSubscriptionStatus(userId: number, status: string): Promise<User | undefined>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize with default tips on startup
    this.initializeTips();
  }

  private async initializeTips() {
    const defaultTips = [
      {
        category: "photos",
        title: "Delete Duplicate Photos",
        content: "Start with your Photos app - deleting duplicates can free up significant storage space instantly.",
        priority: 1,
        isActive: true,
      },
      {
        category: "files",
        title: "Archive Old Downloads",
        content: "Check your Downloads folder for files you no longer need. Many can be safely deleted.",
        priority: 2,
        isActive: true,
      },
      {
        category: "apps",
        title: "Remove Unused Apps",
        content: "Delete apps you haven't used in the last 3 months to free up space and reduce clutter.",
        priority: 1,
        isActive: true,
      },
      {
        category: "email",
        title: "Unsubscribe from Newsletters",
        content: "Reduce email clutter by unsubscribing from newsletters you no longer read.",
        priority: 2,
        isActive: true,
      },
      {
        category: "general",
        title: "Daily 5-minute cleanup",
        content: "Spend just 5 minutes daily organizing one category to maintain a clean digital space.",
        priority: 1,
        isActive: true,
      },
    ];

    try {
      // Check if tips already exist
      const existingTips = await db.select().from(tips).limit(1);
      if (existingTips.length === 0) {
        // Insert default tips if none exist
        await db.insert(tips).values(defaultTips);
      }
    } catch (error) {
      console.error("Error initializing tips:", error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getDigitalData(userId: number): Promise<DigitalData | undefined> {
    const [data] = await db.select().from(digitalData).where(eq(digitalData.userId, userId));
    return data || undefined;
  }

  async createDigitalData(data: InsertDigitalData): Promise<DigitalData> {
    const [digitalDataEntry] = await db
      .insert(digitalData)
      .values(data)
      .returning();
    return digitalDataEntry;
  }

  async updateDigitalData(userId: number, updates: Partial<DigitalData>): Promise<DigitalData | undefined> {
    const [data] = await db
      .update(digitalData)
      .set(updates)
      .where(eq(digitalData.userId, userId))
      .returning();
    return data || undefined;
  }

  async getStreak(userId: number): Promise<Streak | undefined> {
    const [streak] = await db.select().from(streaks).where(eq(streaks.userId, userId));
    return streak || undefined;
  }

  async createStreak(streak: InsertStreak): Promise<Streak> {
    const [streakEntry] = await db
      .insert(streaks)
      .values(streak)
      .returning();
    return streakEntry;
  }

  async updateStreak(userId: number, updates: Partial<Streak>): Promise<Streak | undefined> {
    const [streak] = await db
      .update(streaks)
      .set(updates)
      .where(eq(streaks.userId, userId))
      .returning();
    return streak || undefined;
  }

  async getAllTips(): Promise<Tip[]> {
    return await db.select().from(tips).where(eq(tips.isActive, true));
  }

  async getTipsByCategory(category: string): Promise<Tip[]> {
    return await db.select().from(tips).where(eq(tips.category, category));
  }

  async getRandomTip(): Promise<Tip | undefined> {
    const activeTips = await db.select().from(tips).where(eq(tips.isActive, true));
    if (activeTips.length === 0) return undefined;
    
    const randomIndex = Math.floor(Math.random() * activeTips.length);
    return activeTips[randomIndex];
  }

  async createTip(tip: InsertTip): Promise<Tip> {
    const [tipEntry] = await db
      .insert(tips)
      .values(tip)
      .returning();
    return tipEntry;
  }

  // Removed verification code methods - no longer using email verification

  async validatePassword(email: string, password: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));
    
    if (!user || !user.password) {
      return undefined;
    }
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    return isValidPassword ? user : undefined;
  }

  // Removed password update method - no longer using email verification for password reset

  async updateStripeCustomerId(userId: number, customerId: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ stripeCustomerId: customerId })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }

  async updateUserStripeInfo(userId: number, customerId: string, subscriptionId: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        subscriptionStatus: 'active'
      })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }

  async updateSubscriptionStatus(userId: number, status: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ subscriptionStatus: status })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }

  async updateTrialStatus(userId: number, status: string, trialEndsAt?: Date): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        subscriptionStatus: status,
        trialEndsAt: trialEndsAt || null
      })
      .where(eq(users.id, userId))
      .returning();
    return user || undefined;
  }
}

export const storage = new DatabaseStorage();
