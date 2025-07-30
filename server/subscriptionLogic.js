import pricingConfig from '../pricing.json' with { type: 'json' };

export class SubscriptionManager {
  constructor(storage) {
    this.storage = storage;
    this.pricing = pricingConfig;
  }

  // Check if user has active subscription
  async hasActiveSubscription(userId) {
    const subscription = await this.storage.getSubscriptionByUserId(userId);
    if (!subscription) return false;
    
    const now = new Date();
    return subscription.status === 'active' && new Date(subscription.currentPeriodEnd) > now;
  }

  // Get user's current plan
  async getUserPlan(userId) {
    const subscription = await this.storage.getSubscriptionByUserId(userId);
    if (!subscription || !this.hasActiveSubscription(userId)) {
      return null;
    }
    return subscription.planId;
  }

  // Check if user can perform a build
  async canPerformBuild(userId, buildType) {
    const subscription = await this.storage.getSubscriptionByUserId(userId);
    if (!subscription) return { allowed: false, reason: 'no_subscription' };

    const plan = this.pricing.plans[subscription.planId];
    if (!plan) return { allowed: false, reason: 'invalid_plan' };

    // Unlimited builds for enterprise
    if (plan.features.unlimited_builds) {
      return { allowed: true, remaining: -1 };
    }

    // Check current usage
    const currentPeriodStart = new Date(subscription.currentPeriodStart);
    const buildsThisMonth = await this.storage.getBuildCountSince(userId, currentPeriodStart);
    const limit = plan.features.builds_per_month;

    if (buildsThisMonth >= limit) {
      return { 
        allowed: false, 
        reason: 'limit_exceeded',
        used: buildsThisMonth,
        limit: limit
      };
    }

    return { 
      allowed: true, 
      remaining: limit - buildsThisMonth,
      used: buildsThisMonth,
      limit: limit
    };
  }

  // Record a build usage
  async recordBuild(userId, buildType) {
    const canBuild = await this.canPerformBuild(userId, buildType);
    if (!canBuild.allowed) {
      throw new Error(`Build not allowed: ${canBuild.reason}`);
    }

    // Record the build in usage tracking
    await this.storage.recordBuildUsage(userId, buildType);
    return true;
  }

  // Check if user is in trial period
  async isInTrial(userId) {
    const subscription = await this.storage.getSubscriptionByUserId(userId);
    if (!subscription) return false;
    
    return subscription.planId === 'trial' && 
           subscription.status === 'trialing' &&
           new Date(subscription.trialEnd) > new Date();
  }

  // Check if trial has expired and needs upgrade
  async shouldUpgradeFromTrial(userId) {
    const subscription = await this.storage.getSubscriptionByUserId(userId);
    if (!subscription || subscription.planId !== 'trial') return false;
    
    return new Date(subscription.trialEnd) <= new Date();
  }

  // Get usage statistics for user
  async getUsageStats(userId) {
    const subscription = await this.storage.getSubscriptionByUserId(userId);
    if (!subscription) return null;

    const plan = this.pricing.plans[subscription.planId];
    const currentPeriodStart = new Date(subscription.currentPeriodStart);
    const buildsUsed = await this.storage.getBuildCountSince(userId, currentPeriodStart);
    const bonusUnlocksUsed = await this.storage.getBonusUnlocksCountSince(userId, currentPeriodStart);

    return {
      planId: subscription.planId,
      planName: plan.name,
      buildsUsed: buildsUsed,
      buildsLimit: plan.features.builds_per_month,
      buildsRemaining: plan.features.unlimited_builds ? -1 : Math.max(0, plan.features.builds_per_month - buildsUsed),
      bonusUnlocksUsed: bonusUnlocksUsed,
      bonusUnlocksLimit: plan.features.bonus_prize_unlocks,
      bonusUnlocksRemaining: Math.max(0, plan.features.bonus_prize_unlocks - bonusUnlocksUsed),
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      status: subscription.status,
      isUnlimited: plan.features.unlimited_builds
    };
  }

  // Create trial subscription
  async createTrialSubscription(userId, stripeCustomerId) {
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 7); // 7 days trial

    const subscription = {
      userId: userId,
      stripeCustomerId: stripeCustomerId,
      planId: 'trial',
      status: 'trialing',
      currentPeriodStart: new Date().toISOString(),
      currentPeriodEnd: trialEnd.toISOString(),
      trialEnd: trialEnd.toISOString(),
      cancelAtPeriodEnd: false
    };

    return await this.storage.createSubscription(subscription);
  }

  // Upgrade subscription plan
  async upgradeSubscription(userId, newPlanId, stripeSubscriptionId) {
    const subscription = await this.storage.getSubscriptionByUserId(userId);
    if (!subscription) throw new Error('No subscription found');

    const newPlan = this.pricing.plans[newPlanId];
    if (!newPlan) throw new Error('Invalid plan');

    // Update subscription
    const updates = {
      planId: newPlanId,
      stripeSubscriptionId: stripeSubscriptionId,
      status: 'active',
      currentPeriodStart: new Date().toISOString(),
      trialEnd: null
    };

    // Set next billing date
    const nextBilling = new Date();
    nextBilling.setMonth(nextBilling.getMonth() + 1);
    updates.currentPeriodEnd = nextBilling.toISOString();

    return await this.storage.updateSubscription(subscription.id, updates);
  }
}