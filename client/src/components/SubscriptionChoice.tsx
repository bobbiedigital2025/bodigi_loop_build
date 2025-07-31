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
      case 'trial': return <Zap className="h-8 w-8 text-yellow-500" />;
      case 'basic': return <Star className="h-8 w-8 text-yellow-500" />;
      case 'pro': return <Crown className="h-8 w-8 text-yellow-500" />;
      case 'enterprise': return <Building className="h-8 w-8 text-yellow-500" />;
      default: return null;
    }
  };

  const getFeatureList = (planId: string, features: any) => {
    const featureItems = [];
    
    if (planId === 'trial') {
      featureItems.push("$0 for 7 days");
      featureItems.push("Card required at signup");
      featureItems.push("Auto-charge $9.99 on day 7");
      featureItems.push("4 builds per month");
      featureItems.push("Access to all builders");
      featureItems.push("Learn & Earn reward system included");
    } else if (planId === 'basic') {
      featureItems.push("4 builds per month");
      featureItems.push("2 bonus features per build");
      featureItems.push("Contact Hub access");
    } else if (planId === 'pro') {
      featureItems.push("20 builds per month");
      featureItems.push("5 bonus features per build");
      featureItems.push("Marketing Builder + Contact Hub included");
      featureItems.push("Priority bot support");
    } else if (planId === 'enterprise') {
      featureItems.push("Unlimited builds");
      featureItems.push("10 bonus features per build");
      featureItems.push("White-label loop builder");
      featureItems.push("Dedicated BoDiGi launch specialist");
    }
    
    return featureItems;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-950 flex items-center justify-center p-8" style={{
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 40%, #4a1a2a 100%)'
    }}>
      <div className="max-w-7xl w-full">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Choose Your BoDiGi™ Plan
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Start building your brand, MVP, and marketing systems with our gamified Learn & Earn platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(pricingConfig.plans).map(([planId, plan]: [string, any]) => (
            <Card 
              key={planId} 
              className={`relative transition-all duration-500 hover:scale-105 bg-white rounded-3xl border-2 shadow-2xl overflow-hidden group hover:shadow-yellow-500/20 hover:shadow-3xl ${
                planId === 'pro' 
                  ? 'border-yellow-500 ring-4 ring-yellow-500/30 transform scale-105' 
                  : 'border-gray-200 hover:border-yellow-500'
              } ${selectedPlan === planId ? 'ring-4 ring-yellow-500' : ''}`}
              style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #fef3c7 100%)'
              }}
            >
              {planId === 'pro' && (
                <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold text-sm px-6 py-2 rounded-full shadow-lg">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center text-white pt-8 pb-6 rounded-t-3xl" style={{
                background: 'linear-gradient(135deg, #722f37 0%, #8b3a62 100%)'
              }}>
                <div className="flex justify-center mb-4">
                  {getPlanIcon(planId)}
                </div>
                <CardTitle className="text-2xl font-bold text-yellow-300 mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-white">
                  {planId === 'trial' ? (
                    <div>
                      <span className="text-4xl font-bold text-yellow-300">Free</span>
                      <span className="text-lg text-gray-200 block">7 days trial</span>
                      <span className="text-sm text-gray-300">Then ${plan.auto_upgrade_price}/month</span>
                    </div>
                  ) : (
                    <div>
                      <span className="text-4xl font-bold text-yellow-300">${plan.price}</span>
                      <span className="text-gray-200 text-lg">/month</span>
                    </div>
                  )}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 p-8 bg-white">
                <ul className="space-y-4">
                  {getFeatureList(planId, plan.features).map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 font-bold" />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="p-8 bg-white rounded-b-3xl">
                <Button 
                  onClick={() => handleSelectPlan(planId)}
                  disabled={isLoading && selectedPlan === planId}
                  className={`w-full h-14 text-lg font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl ${
                    planId === 'pro'
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black'
                      : 'text-white'
                  }`}
                  style={planId !== 'pro' ? {
                    background: 'linear-gradient(135deg, #722f37 0%, #8b3a62 100%)',
                  } : {}}
                >
                  {isLoading && selectedPlan === planId ? (
                    "Processing..."
                  ) : (
                    "Choose This Plan"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Footer Information */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-300 font-medium mb-8">
            All plans include branding, MVP, and Learn & Earn Loop access.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-400 max-w-4xl mx-auto">
            <p className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4 text-green-400" />
              Cancel anytime
            </p>
            <p className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4 text-green-400" />
              30-day money-back guarantee
            </p>
            <p className="flex items-center justify-center gap-2">
              <Check className="h-4 w-4 text-green-400" />
              Secure payment via Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
