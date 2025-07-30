import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building, Palette, Megaphone, Gift, Crown, AlertTriangle, TrendingUp } from "lucide-react";

interface UsageDashboardProps {
  userId: string;
  onUpgrade?: () => void;
}

export function UsageDashboard({ userId, onUpgrade }: UsageDashboardProps) {
  const { data: usage, isLoading } = useQuery({
    queryKey: ['/api/usage', userId],
    queryFn: () => fetch(`/api/usage/${userId}`).then(res => res.json())
  });

  if (isLoading) {
    return <div className="animate-pulse">Loading usage data...</div>;
  }

  if (!usage) {
    return <div>No subscription found</div>;
  }

  const getBuildProgress = () => {
    if (usage.isUnlimited) return 100;
    return usage.buildsLimit > 0 ? (usage.buildsUsed / usage.buildsLimit) * 100 : 0;
  };

  const getBonusProgress = () => {
    return usage.bonusUnlocksLimit > 0 ? (usage.bonusUnlocksUsed / usage.bonusUnlocksLimit) * 100 : 0;
  };

  const getBuildIcon = (type: string) => {
    switch (type) {
      case 'mvp': return <Building className="h-4 w-4" />;
      case 'branding': return <Palette className="h-4 w-4" />;
      case 'marketing': return <Megaphone className="h-4 w-4" />;
      default: return null;
    }
  };

  const isNearLimit = () => {
    return !usage.isUnlimited && usage.buildsRemaining <= 1;
  };

  const planBadgeColor = (planId: string) => {
    switch (planId) {
      case 'trial': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'basic': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pro': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'enterprise': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Plan Status */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Current Plan</CardTitle>
          <Badge className={planBadgeColor(usage.planId)}>
            <Crown className="w-3 h-3 mr-1" />
            {usage.planName}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Status: <span className="font-medium text-green-600">{usage.status}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Billing period: {new Date(usage.currentPeriodStart).toLocaleDateString()} - {new Date(usage.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>
            {isNearLimit() && onUpgrade && (
              <Button onClick={onUpgrade} size="sm" className="bg-purple-600 hover:bg-purple-700">
                <TrendingUp className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Build Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Build Usage
          </CardTitle>
          <CardDescription>
            Track your monthly builds across MVP, branding, and marketing
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="font-medium">
                  {usage.isUnlimited ? 'Unlimited' : `${usage.buildsUsed} / ${usage.buildsLimit}`}
                </span>
                {isNearLimit() && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Low remaining
                  </Badge>
                )}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {usage.isUnlimited ? 'Unlimited builds' : `${usage.buildsRemaining} remaining`}
              </span>
            </div>
            
            {!usage.isUnlimited && (
              <Progress 
                value={getBuildProgress()} 
                className="w-full h-2"
                indicatorClassName={isNearLimit() ? "bg-red-500" : "bg-blue-500"}
              />
            )}

            <div className="grid grid-cols-3 gap-4 pt-4">
              {['MVP', 'Branding', 'Marketing'].map((type, index) => (
                <div key={type} className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    {getBuildIcon(type.toLowerCase())}
                  </div>
                  <div className="text-sm font-medium">{type}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Available</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bonus Unlocks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-yellow-500" />
            Bonus Prize Unlocks
          </CardTitle>
          <CardDescription>
            Unlock bonus features through Learn & Earn rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {usage.bonusUnlocksUsed} / {usage.bonusUnlocksLimit}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {usage.bonusUnlocksRemaining} remaining
              </span>
            </div>
            
            <Progress 
              value={getBonusProgress()} 
              className="w-full h-2"
              indicatorClassName="bg-yellow-500"
            />

            <div className="text-sm text-gray-600 dark:text-gray-400">
              Complete quiz sets to earn bonus feature unlocks
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              className="w-full"
              disabled={!usage.isUnlimited && usage.buildsRemaining <= 0}
            >
              <Building className="w-4 h-4 mr-2" />
              Create MVP
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              disabled={!usage.isUnlimited && usage.buildsRemaining <= 0}
            >
              <Palette className="w-4 h-4 mr-2" />
              Build Brand
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              disabled={!usage.isUnlimited && usage.buildsRemaining <= 0}
            >
              <Megaphone className="w-4 h-4 mr-2" />
              Create Marketing
            </Button>
          </div>
          
          {!usage.isUnlimited && usage.buildsRemaining <= 0 && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                You've reached your build limit for this month. Upgrade your plan to continue building.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}