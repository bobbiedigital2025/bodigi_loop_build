import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import AppHeader from "@/components/AppHeader";
import ModuleNavigation from "@/components/ModuleNavigation";
import BrandingBuilder from "@/components/BrandingBuilder";
import MVPBuilder from "@/components/MVPBuilder";
import MarketingBuilder from "@/components/MarketingBuilder";
import LearnEarnLoopBuilder from "@/components/LearnEarnLoopBuilder";
import ContactHub from "@/components/ContactHub";
import AdminDashboard from "@/components/AdminDashboard";
import { SubscriptionChoice } from "@/components/SubscriptionChoice";
import { UsageDashboard } from "@/components/UsageDashboard";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("subscription");
  const [hasSubscription, setHasSubscription] = useState(false);
  const [currentUserId] = useState("demo-user-id"); // In real app, get from auth context

  // Check for existing subscription
  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: ['/api/usage', currentUserId],
    queryFn: () => fetch(`/api/usage/${currentUserId}`).then(res => res.ok ? res.json() : null),
    retry: false
  });

  useEffect(() => {
    if (usage && !usageLoading) {
      setHasSubscription(true);
      if (activeTab === "subscription") {
        setActiveTab("branding"); // Switch to main functionality
      }
    }
  }, [usage, usageLoading, activeTab]);

  const handleSubscriptionSelected = (planId: string) => {
    setHasSubscription(true);
    setActiveTab("branding");
  };

  const renderActiveComponent = () => {
    // Show subscription choice if no subscription
    if (!hasSubscription && activeTab === "subscription") {
      return (
        <SubscriptionChoice 
          onSubscriptionSelected={handleSubscriptionSelected}
          currentUserId={currentUserId}
        />
      );
    }

    switch (activeTab) {
      case "branding":
        return <BrandingBuilder />;
      case "mvp":
        return <MVPBuilder />;
      case "marketing":
        return <MarketingBuilder />;
      case "quiz":
        return <LearnEarnLoopBuilder />;
      case "contacts":
        return <ContactHub />;
      case "admin":
        return <AdminDashboard />;
      case "usage":
        return <UsageDashboard userId={currentUserId} onUpgrade={() => setActiveTab("subscription")} />;
      default:
        return <BrandingBuilder />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ModuleNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-8">
          {renderActiveComponent()}
        </div>
      </div>
    </div>
  );
}
