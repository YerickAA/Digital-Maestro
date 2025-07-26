import { pgTable, text, serial, integer, boolean, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStatus: text("subscription_status").default("free"), // free, active, canceled, past_due, lifetime, trial
  trialEndsAt: timestamp("trial_ends_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Removed verification codes table - no longer using email verification

export const digitalData = pgTable("digital_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  healthScore: integer("health_score").default(0),
  
  // Photos data
  photosCount: integer("photos_count").default(0),
  photosDuplicates: integer("photos_duplicates").default(0),
  photosStorage: decimal("photos_storage").default("0"),
  
  // Files data
  filesCount: integer("files_count").default(0),
  filesLarge: integer("files_large").default(0),
  filesStorage: decimal("files_storage").default("0"),
  
  // Apps data
  appsCount: integer("apps_count").default(0),
  appsUnused: integer("apps_unused").default(0),
  appsStorage: decimal("apps_storage").default("0"),
  
  // Email data
  emailCount: integer("email_count").default(0),
  emailUnread: integer("email_unread").default(0),
  emailStorage: decimal("email_storage").default("0"),
  
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const streaks = pgTable("streaks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastActiveDate: timestamp("last_active_date"),
  streakHistory: text("streak_history").array().default([]),
});

export const tips = pgTable("tips", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  priority: integer("priority").default(1),
  isActive: boolean("is_active").default(true),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}).extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  onboardingCompleted: z.boolean().optional(),
});

// Removed verification code schema - no longer using email verification

export const insertDigitalDataSchema = createInsertSchema(digitalData).omit({
  id: true,
  updatedAt: true,
});

export const insertStreakSchema = createInsertSchema(streaks).omit({
  id: true,
});

export const insertTipSchema = createInsertSchema(tips).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDigitalData = z.infer<typeof insertDigitalDataSchema>;
export type DigitalData = typeof digitalData.$inferSelect;
export type InsertStreak = z.infer<typeof insertStreakSchema>;
export type Streak = typeof streaks.$inferSelect;
export type InsertTip = z.infer<typeof insertTipSchema>;
export type Tip = typeof tips.$inferSelect;
