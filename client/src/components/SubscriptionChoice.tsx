import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Zap, Building, Star } from "lucide-react";
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
        // For trial, we just navigate to the next step without creating a subscription yet
        onSubscriptionSelected(planId);
      } else {
        // For paid plans, create the subscription which will then trigger navigation
        await createSubscriptionMutation.mutateAsync(planId);
      }
    } catch (error) {
      console.error('Plan selection failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFeatureList = (features: any) => {
    const featureItems = [];
    
    if (features.builds_per_month) {
      featureItems.push(`${features.builds_per_month} builds per month`);
    }
    if (features.unlimited_builds) {
      featureItems.push("Unlimited builds");
    }
    if (features.learn_earn_access) {
      featureItems.push("Learn & Earn Loop access");
    }
    if (features.bonus_prize_unlocks) {
      featureItems.push(`${features.bonus_prize_unlocks} bonus prize unlocks`);
    }
    if (features.priority_support) {
      featureItems.push("Priority support");
    }
    if (features.advanced_ai_features) {
      featureItems.push("Advanced AI features");
    }
    if (features.dedicated_support) {
      featureItems.push("Dedicated support");
    }
    
    return featureItems;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-12 px-8 rounded-3xl shadow-2xl mb-8">
            <h1 className="text-5xl font-bold mb-4">
              Welcome to BoDiGi<span className="text-yellow-400">™</span>
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Build your brand, MVP, and marketing systems with our AI-powered Learn & Earn platform
            </p>
          </div>
          <p className="text-lg text-gray-600">All plans require card verification • Start building immediately</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(pricingConfig.plans).map(([planId, plan]: [string, any]) => (
            <Card 
              key={planId} 
              className={`relative transition-all duration-300 hover:shadow-2xl hover:scale-105 border-2 ${
                planId === 'pro' 
                  ? 'bg-gradient-to-b from-white to-yellow-50 border-yellow-500 shadow-2xl scale-105' 
                  : 'hover:border-gray-300 bg-white'
              } ${selectedPlan === planId ? 'ring-2 ring-yellow-500' : ''}`}
            >
              {planId === 'pro' && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-black font-bold">
                  🏆 Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {planId === 'trial' && <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"><Zap className="h-8 w-8 text-green-600" /></div>}
                  {planId === 'basic' && <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"><Check className="h-8 w-8 text-blue-600" /></div>}
                  {planId === 'pro' && <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center"><Crown className="h-8 w-8 text-yellow-600" /></div>}
                  {planId === 'enterprise' && <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center"><Building className="h-8 w-8 text-purple-600" /></div>}
                </div>
                <CardTitle className="text-2xl font-bold text-black">{plan.name}</CardTitle>
                <CardDescription className="text-lg">
                  {planId === 'trial' ? (
                    <div>
                      <span className="text-4xl font-bold text-green-600">Free</span>
                      <span className="text-sm text-gray-500 block">7 days trial</span>
                      <span className="text-sm text-gray-500">Then ${plan.auto_upgrade_price}/month</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-4xl font-bold text-black">${plan.price}</span>
                      <span className="text-gray-500">/month</span>
                    </div>
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {getFeatureList(plan.features).map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="p-6">
                <Button 
                  onClick={() => handleSelectPlan(planId)}
                  disabled={isLoading && selectedPlan === planId}
                  className={`w-full h-12 text-lg font-bold rounded-xl transition-all duration-200 ${
                    planId === 'pro' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-lg text-white' 
                      : planId === 'trial'
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-800 hover:bg-black text-white'
                  }`}
                >
                  {isLoading && selectedPlan === planId ? (
                    "🔄 Processing..."
                  ) : planId === 'trial' ? (
                    "🚀 Start Free Trial"
                  ) : planId === 'pro' ? (
                    "⭐ Choose Pro"
                  ) : (
                    "Select Plan"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Trust Signals */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-black mb-4">Why Choose BoDiGi™?</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">⚡</div>
              <h4 className="font-bold text-lg mb-2">Lightning Fast Setup</h4>
              <p className="text-gray-600">Complete business system in under 30 minutes</p>
            </div>
            <div>
              <div className="text-3xl mb-2">🎯</div>
              <h4 className="font-bold text-lg mb-2">AI-Powered Automation</h4>
              <p className="text-gray-600">MCP + A2A workflows for smart business logic</p>
            </div>
            <div>
              <div className="text-3xl mb-2">💰</div>
              <h4 className="font-bold text-lg mb-2">Learn & Earn Engagement</h4>
              <p className="text-gray-600">Gamified marketing loops that convert</p>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-600">
            <p className="mb-2">✅ All plans include full access to BoDiGi™ system</p>
            <p className="mb-2">✅ Card required for verification • Cancel anytime • 30-day guarantee</p>
            <p className="mb-2">✅ Secure payment processing via Stripe</p>
            <p className="font-semibold text-black">Created by Bobbie Jo Gray • Bobbie Digital™</p>
          </div>
        </div>
      </div>
    </div>
  );
}
