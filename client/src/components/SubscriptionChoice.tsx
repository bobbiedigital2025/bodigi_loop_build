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
<<<<<<< HEAD
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
=======
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="bg-bodigi-gradient text-white py-12 px-8 rounded-3xl shadow-bodigi mb-8">
            <h1 className="text-5xl font-bold mb-4">
              Welcome to BoDiGi<span className="text-bodigi-gold">™</span>
            </h1>
            <h2 className="text-2xl font-semibold text-bodigi-gold mb-4">
              Smart Platform Autogenerator v0
            </h2>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              The world's first fully automated business launcher. Build your brand, create an MVP, 
              launch marketing campaigns, and generate leads - all powered by AI and gamified with our 
              Learn & Earn Engagement Loop™
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg hover-lift">
              <h3 className="font-bold text-lg mb-2">🎨 Brand Builder</h3>
              <p className="text-gray-600">AI-powered brand identity creation</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover-lift">
              <h3 className="font-bold text-lg mb-2">🚀 MVP Generator</h3>
              <p className="text-gray-600">Instant product creation & preview</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg hover-lift">
              <h3 className="font-bold text-lg mb-2">💎 Learn & Earn Loop™</h3>
              <p className="text-gray-600">Gamified marketing engagement</p>
            </div>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-black mb-4">Choose Your Launch Plan</h2>
          <p className="text-lg text-gray-600">All plans require card verification • Start building immediately</p>
>>>>>>> 277e19a (Clean up project files)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(pricingConfig.plans).map(([planId, plan]: [string, any]) => (
            <Card 
              key={planId} 
<<<<<<< HEAD
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
=======
              className={`relative transition-all duration-300 hover:shadow-bodigi hover-lift border-2 ${
                planId === 'pro' 
                  ? 'bg-gradient-to-b from-white to-yellow-50 border-bodigi-gold shadow-bodigi scale-105' 
                  : 'hover:border-gray-300 bg-white'
              } ${selectedPlan === planId ? 'ring-2 ring-bodigi-gold' : ''}`}
            >
              {planId === 'pro' && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-bodigi-gold text-black font-bold">
                  🏆 Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {planId === 'trial' && <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center"><Zap className="h-8 w-8 text-green-600" /></div>}
                  {planId === 'basic' && <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center"><Check className="h-8 w-8 text-blue-600" /></div>}
                  {planId === 'pro' && <div className="w-16 h-16 bg-bodigi-gold/20 rounded-full flex items-center justify-center"><Crown className="h-8 w-8 text-bodigi-gradient-start" /></div>}
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
>>>>>>> 277e19a (Clean up project files)
                    </div>
                  )}
                </CardDescription>
              </CardHeader>

<<<<<<< HEAD
              <CardContent className="flex-1 p-8 bg-white">
                <ul className="space-y-4">
                  {getFeatureList(planId, plan.features).map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 font-bold" />
                      <span className="text-gray-700 font-medium">{feature}</span>
=======
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {getFeatureList(plan.features).map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-700">{feature}</span>
>>>>>>> 277e19a (Clean up project files)
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="p-8 bg-white rounded-b-3xl">
                <Button 
                  onClick={() => handleSelectPlan(planId)}
                  disabled={isLoading && selectedPlan === planId}
<<<<<<< HEAD
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
=======
                  className={`w-full h-12 text-lg font-bold rounded-xl transition-all duration-200 ${
                    planId === 'pro' 
                      ? 'bg-bodigi-gradient hover:shadow-lg hover-lift text-white' 
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
>>>>>>> 277e19a (Clean up project files)
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

<<<<<<< HEAD
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
=======
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
            <p className="mb-2">✅ All plans include full access to SPA's0 system</p>
            <p className="mb-2">✅ Card required for verification • Cancel anytime • 30-day guarantee</p>
            <p className="mb-2">✅ Secure payment processing via Stripe</p>
            <p className="font-semibold text-black">Created by Bobbie Jo Gray • Bobbie Digital™</p>
>>>>>>> 277e19a (Clean up project files)
          </div>
        </div>
      </div>
    </div>
  );
}
