import { Crown, Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppHeader() {
  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logout clicked");
  };

  return (
    <header className="bg-bodigi-gradient border-b shadow-bodigi">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* BoDiGi Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-xl shadow-lg">
              <Crown className="h-8 w-8 text-bodigi-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                BoDiGi<span className="text-bodigi-gold">™</span>
              </h1>
              <p className="text-sm text-white/80">Smart Platform Autogenerator</p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg">
              <Sparkles className="h-4 w-4 text-bodigi-gold" />
              <span className="text-white text-sm font-medium">
                SPA's0 Active
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-2 text-sm text-white/90">
              <span>owner@bodigi.com</span>
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">BD</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="bg-white text-black hover:bg-bodigi-gold hover:text-black border-white"
            >
              Export Project
            </Button>
            
            <button 
              onClick={handleLogout}
              className="text-white/80 hover:text-white transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
