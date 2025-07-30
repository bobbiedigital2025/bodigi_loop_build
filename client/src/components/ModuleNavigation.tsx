import { Palette, Rocket, Megaphone, Trophy, Users, TrendingUp, Crown, Bot } from "lucide-react";

interface ModuleNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function ModuleNavigation({ activeTab, onTabChange }: ModuleNavigationProps) {
  const tabs = [
    { id: "branding", label: "Branding Builder", icon: Palette },
    { id: "mvp", label: "MVP Builder", icon: Rocket },
    { id: "marketing", label: "Marketing Builder", icon: Megaphone },
    { id: "quiz", label: "Learn & Earn Loop", icon: Trophy },
    { id: "contacts", label: "Contact Hub", icon: Users },
    { id: "usage", label: "Usage & Billing", icon: Crown },
    { id: "admin", label: "Admin Dashboard", icon: TrendingUp },
  ];

  return (
    <nav className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              tab-button px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
              ${isActive 
                ? 'active bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
              }
            `}
          >
            <Icon size={16} className="mr-2 inline-block" />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
