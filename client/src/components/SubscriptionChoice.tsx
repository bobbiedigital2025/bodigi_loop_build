import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Building } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import pricingConfig from "../../../pricing.json";

interface SubscriptionChoiceProps {
  onSubscriptionSelected: (planId: string) => void;
  currentUserId: string;
}

export function SubscriptionChoice({ onSubscriptionSelected, currentUserId }: SubscriptionChoiceProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const createSubscriptionMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await fetch('/api/subscriptions', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUserId,
          planId: planId
        })
      });
      if (!response.ok) throw new Error('Failed to create subscription');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/subscriptions'] });
      onSubscriptionSelected(data.planId);
    },
    onError: (error) => {
      console.error('Failed to create subscription:', error);
    }
  });

  const handleSelectPlan = async (planId: string) => {
    setSelectedPlan(planId);
    setIsLoading(true);
    
    try {
      if (planId === 'trial') {
        // For trial, we need card info but don't charge immediately
        await createSubscriptionMutation.mutateAsync(planId);
      } else {
        // For paid plans, redirect to Stripe checkout
        await createSubscriptionMutation.mutateAsync(planId);
      }
    } catch (error) {
      console.error('Plan selection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'trial': return <Zap className="h-6 w-6 text-yellow-500" />;
      case 'basic': return <Check className="h-6 w-6 text-green-500" />;
      case 'pro': return <Crown className="h-6 w-6 text-purple-500" />;
      case 'enterprise': return <Building className="h-6 w-6 text-blue-500" />;
      default: return null;
    }
  };

  const getFeatureList = (features: any) => {
    const featureItems = [];
    
    if (features.builds_per_month === -1) {
      featureItems.push("Unlimited builds");
    } else {
      featureItems.push(`${features.builds_per_month} builds per month`);
    }
    
    if (features.learn_earn_access) {
      featureItems.push("Learn & Earn rewards access");
    }
    
    featureItems.push(`${features.bonus_prize_unlocks} bonus prize unlocks/month`);
    
    if (features.priority_support) {
      featureItems.push("Priority support");
    }
    
    if (features.advanced_ai_features) {
      featureItems.push("Advanced AI features");
    }
    
    if (features.dedicated_support) {
      featureItems.push("Dedicated success support");
    }
    
    return featureItems;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your BoDiGi™ Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Start building your brand, MVP, and marketing systems with our gamified Learn & Earn platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(pricingConfig.plans).map(([planId, plan]: [string, any]) => (
            <Card 
              key={planId} 
              className={`relative transition-all duration-300 hover:shadow-lg ${
                planId === 'pro' 
                  ? 'border-purple-500 shadow-lg scale-105 bg-purple-50 dark:bg-purple-950/20' 
                  : 'hover:border-indigo-300'
              } ${selectedPlan === planId ? 'ring-2 ring-indigo-500' : ''}`}
            >
              {planId === 'pro' && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  {getPlanIcon(planId)}
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>
                  {planId === 'trial' ? (
                    <div>
                      <span className="text-3xl font-bold text-green-600">Free</span>
                      <span className="text-sm text-gray-500 block">7 days trial</span>
                      <span className="text-sm text-gray-500">Then ${plan.auto_upgrade_price}/month</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {getFeatureList(plan.features).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button 
                  onClick={() => handleSelectPlan(planId)}
                  disabled={isLoading && selectedPlan === planId}
                  className={`w-full ${
                    planId === 'pro' 
                      ? 'bg-purple-600 hover:bg-purple-700' 
                      : planId === 'trial'
                      ? 'bg-green-600 hover:bg-green-700'
                      : ''
                  }`}
                  variant={planId === 'pro' ? 'default' : planId === 'trial' ? 'default' : 'outline'}
                >
                  {isLoading && selectedPlan === planId ? (
                    "Processing..."
                  ) : planId === 'trial' ? (
                    "Start Free Trial"
                  ) : (
                    "Choose Plan"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-12 text-center text-sm text-gray-600 dark:text-gray-400">
          <p className="mb-2">✓ All plans include access to the Learn & Earn loop system</p>
          <p className="mb-2">✓ Cancel anytime • 30-day money-back guarantee</p>
          <p>✓ Secure payment processing via Stripe</p>
        </div>
      </div>
    </div>
  );
}