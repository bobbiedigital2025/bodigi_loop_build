import { Palette, Rocket, Megaphone, Trophy, Users, TrendingUp, Crown } from "lucide-react";

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
    <div className="bg-white rounded-2xl shadow-bodigi p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black">BoDiGi™ Builder Modules</h2>
          <p className="text-gray-600">Complete business automation in 4 simple steps</p>
        </div>
        <div className="bg-bodigi-gradient text-white px-4 py-2 rounded-lg">
          <span className="text-sm font-semibold">SPA's0 Active</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative p-4 rounded-xl transition-all duration-200 text-center hover-lift group
                ${isActive 
                  ? 'bg-bodigi-gradient text-white shadow-bodigi' 
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent hover:border-bodigi-gold'
                }
              `}
            >
              {/* Step Number */}
              {index < 4 && (
                <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${
                  isActive ? 'bg-bodigi-gold text-black' : 'bg-gray-300 text-gray-600'
                }`}>
                  {index + 1}
                </div>
              )}

              <Icon 
                size={24} 
                className={`mx-auto mb-2 ${isActive ? 'text-bodigi-gold' : 'text-gray-600'}`} 
              />
              
              <div className="text-sm font-semibold mb-1">
                {tab.label}
              </div>
              
              <div className={`text-xs opacity-80 ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                {tab.description}
              </div>

              {/* Progress Indicator for Main Steps */}
              {index < 4 && (
                <div className="mt-2">
                  <div className={`w-full h-1 rounded-full ${
                    isActive ? 'bg-bodigi-gold' : 'bg-gray-300'
                  }`}></div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Progress Flow for Main Steps */}
      <div className="mt-6 hidden md:flex items-center justify-center space-x-2">
        {tabs.slice(0, 4).map((tab, index) => {
          const isCompleted = false; // Would track actual completion state
          const isActive = activeTab === tab.id;
          
          return (
            <div key={tab.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                isActive 
                  ? 'bg-bodigi-gradient text-white' 
                  : isCompleted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              
              {index < 3 && (
                <div className={`w-12 h-1 mx-2 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-200'
                }`}></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
