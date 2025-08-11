import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, MessageCircle, FormInput, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import AuraChatWindow from "./AuraChatWindow";
import BrandInfoPanel from "./BrandInfoPanel";
import ManualBrandForm from "./ManualBrandForm";

interface BrandInfo {
  name?: string;
  mission?: string;
  colorPalette?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  logoIdea?: string;
  tagline?: string;
  niche?: string;
  targetAudience?: string;
}

export default function BrandingBuilder() {
  const { toast } = useToast();
  const [currentView, setCurrentView] = useState<'chat' | 'manual'>('chat');
  const [brandInfo, setBrandInfo] = useState<BrandInfo>({});
  const [isConversationComplete, setIsConversationComplete] = useState(false);

  const saveBrandMutation = useMutation({
    mutationFn: async (finalBrandData: any) => {
      return apiRequest("POST", "/api/brands", {
        userId: "demo-user-id",
        formData: finalBrandData,
        generatedBrand: finalBrandData,
        timestamp: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      toast({
        title: "🎯 Brand Saved Successfully!",
        description: "Your brand is now ready. Continue to MVP Builder to create your product.",
      });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "There was an error saving your brand.",
        variant: "destructive",
      });
    }
  });

  const handleBrandInfoUpdate = (updatedBrandInfo: BrandInfo) => {
    setBrandInfo(updatedBrandInfo);
  };

  const handleConversationComplete = (complete: boolean) => {
    setIsConversationComplete(complete);
  };

  const handleApprove = () => {
    // Convert brand info to the expected format
    const finalBrandData = {
      name: brandInfo.name || "Your Brand",
      slogan: brandInfo.tagline || "Your Brand Tagline",
      colorPalette: {
        primary: brandInfo.colorPalette?.primary || "#3b82f6",
        secondary: brandInfo.colorPalette?.secondary || "#8b5cf6",
        accent: brandInfo.colorPalette?.accent || "#06b6d4",
        neutral: "#1f2937",
        background: "#ffffff"
      },
      logoUrl: `/api/generate-logo/${brandInfo.name?.replace(/\s+/g, '-').toLowerCase() || 'brand'}`,
      typography: {
        primary: "Inter",
        secondary: "Georgia"
      },
      brandVoice: {
        tone: "Professional and approachable",
        personality: brandInfo.mission || "Innovative and trustworthy",
        messaging: [
          "We deliver exceptional value to our clients",
          "Innovation drives everything we do",
          "Your success is our primary focus"
        ]
      }
    };

    saveBrandMutation.mutate(finalBrandData);
  };

  const handleTryAgain = () => {
    setBrandInfo({});
    setIsConversationComplete(false);
    setCurrentView('chat');
    toast({
      title: "Starting Fresh",
      description: "Let's discover your brand again with Aura!",
    });
  };

  const handleManualEntry = () => {
    setCurrentView('manual');
  };

  const handleManualSave = (manualBrandData: any) => {
    setBrandInfo(manualBrandData);
    setIsConversationComplete(true);
    setCurrentView('chat');
    toast({
      title: "Brand Information Updated",
      description: "Your manual brand details have been processed!",
    });
  };

  const handleBackToChat = () => {
    setCurrentView('chat');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-2xl shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <Palette className="h-8 w-8 text-yellow-300" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">AI Brand Builder with Aura</h1>
            <p className="text-white/90 text-lg">
              Discover your perfect brand through intelligent conversation
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setCurrentView('chat')}
              variant={currentView === 'chat' ? 'default' : 'ghost'}
              className={currentView === 'chat' 
                ? 'bg-white text-purple-600 hover:bg-white/90' 
                : 'text-white border-white/20 hover:bg-white/10'
              }
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with Aura
            </Button>
            <Button
              onClick={() => setCurrentView('manual')}
              variant={currentView === 'manual' ? 'default' : 'ghost'}
              className={currentView === 'manual' 
                ? 'bg-white text-purple-600 hover:bg-white/90' 
                : 'text-white border-white/20 hover:bg-white/10'
              }
            >
              <FormInput className="h-4 w-4 mr-2" />
              Manual Entry
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              AI Conversation
            </h3>
            <p className="text-sm text-white/80">
              Chat with Aura to discover your brand through intelligent questions
            </p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Real-time Analysis
            </h3>
            <p className="text-sm text-white/80">
              Watch your brand identity emerge as you share your vision
            </p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <FormInput className="h-4 w-4" />
              Flexible Input
            </h3>
            <p className="text-sm text-white/80">
              Choose between AI chat or manual form with intelligent assistance
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {currentView === 'manual' ? (
        <ManualBrandForm
          onBack={handleBackToChat}
          onSave={handleManualSave}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chat Window */}
          <AuraChatWindow
            onBrandInfoUpdate={handleBrandInfoUpdate}
            onConversationComplete={handleConversationComplete}
          />

          {/* Brand Info Panel */}
          <BrandInfoPanel
            brandInfo={brandInfo}
            isConversationComplete={isConversationComplete}
            onApprove={handleApprove}
            onTryAgain={handleTryAgain}
            onManualEntry={handleManualEntry}
          />
        </div>
      )}
    </div>
  );
}
