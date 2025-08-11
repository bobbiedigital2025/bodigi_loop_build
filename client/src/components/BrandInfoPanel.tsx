import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, CheckCircle, RefreshCw, Palette, Target, MessageSquare, Crown } from "lucide-react";

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

interface BrandInfoPanelProps {
  brandInfo: BrandInfo;
  isConversationComplete: boolean;
  onApprove: () => void;
  onTryAgain: () => void;
  onManualEntry: () => void;
}

export default function BrandInfoPanel({ 
  brandInfo, 
  isConversationComplete, 
  onApprove, 
  onTryAgain, 
  onManualEntry 
}: BrandInfoPanelProps) {
  const [showStyleGuide, setShowStyleGuide] = useState(false);

  // Calculate completion percentage
  const totalFields = 7;
  const completedFields = Object.values(brandInfo).filter(value => 
    value !== undefined && value !== null && value !== ''
  ).length;
  const completionPercentage = Math.round((completedFields / totalFields) * 100);

  // Generate brand name if not provided
  const brandName = brandInfo.name || generateBrandName(brandInfo);

  // Enhanced brand information with AI-generated content
  const enhancedBrandInfo = {
    ...brandInfo,
    name: brandName,
    mission: brandInfo.mission || "To empower and transform lives through innovative solutions",
    tagline: brandInfo.tagline || "Innovation That Inspires",
    logoIdea: brandInfo.logoIdea || "Modern, clean logo with geometric elements representing growth and connection"
  };

  function generateBrandName(info: BrandInfo): string {
    const nicheNames = {
      ecommerce: ["ShopFlow Pro", "Commerce Elite", "Retail Boost", "MarketMaster"],
      saas: ["TechFlow", "CloudBoost Pro", "DataSync Elite", "AutoFlow"],
      health: ["WellnessFlow", "HealthBoost Pro", "VitalSync", "WellStream"],
      education: ["LearnFlow Pro", "EduBoost", "KnowledgeSync", "StudyStream"],
      finance: ["FinanceFlow", "WealthBoost", "MoneySync Pro", "InvestStream"],
      consulting: ["ConsultFlow", "ExpertBoost", "AdviseSync", "StrategyStream"]
    };

    const names = nicheNames[info.niche as keyof typeof nicheNames] || nicheNames.consulting;
    return names[Math.floor(Math.random() * names.length)];
  }

  const formatFieldName = (key: string): string => {
    const fieldNames: { [key: string]: string } = {
      name: "Brand Name",
      mission: "Mission Statement",
      tagline: "Tagline",
      niche: "Business Niche",
      targetAudience: "Target Audience",
      colorPalette: "Color Palette",
      logoIdea: "Logo Concept"
    };
    return fieldNames[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  const getNicheIcon = (niche?: string) => {
    const icons = {
      ecommerce: "🛒",
      saas: "💻",
      health: "🏥",
      education: "📚",
      finance: "💰",
      consulting: "💼"
    };
    return icons[niche as keyof typeof icons] || "💼";
  };

  return (
    <Card className="h-[600px] flex flex-col shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-600" />
            <span className="text-xl font-bold text-black">Brand Identity</span>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={completionPercentage} className="w-24" />
            <span className="text-sm font-medium text-gray-600">{completionPercentage}%</span>
          </div>
        </CardTitle>
        <p className="text-gray-600">
          {isConversationComplete 
            ? "Your complete brand identity based on our conversation"
            : "Building your brand identity as we chat..."
          }
        </p>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-6 space-y-6">
        {completedFields > 0 ? (
          <>
            {/* Brand Header Preview */}
            {enhancedBrandInfo.name && (
              <div 
                className="p-6 rounded-xl text-white text-center relative overflow-hidden"
                style={{ 
                  background: brandInfo.colorPalette 
                    ? `linear-gradient(135deg, ${brandInfo.colorPalette.primary}, ${brandInfo.colorPalette.secondary})`
                    : 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                }}
              >
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-8 w-8" style={{ 
                      color: brandInfo.colorPalette?.accent || '#fbbf24' 
                    }} />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{enhancedBrandInfo.name}</h2>
                  {enhancedBrandInfo.tagline && (
                    <p className="text-lg opacity-90">{enhancedBrandInfo.tagline}</p>
                  )}
                </div>
              </div>
            )}

            {/* Brand Details Grid */}
            <div className="grid grid-cols-1 gap-4">
              {/* Niche */}
              {brandInfo.niche && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{getNicheIcon(brandInfo.niche)}</span>
                    <h3 className="font-semibold text-gray-800">Business Niche</h3>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {brandInfo.niche.replace(/([A-Z])/g, ' $1').trim()}
                  </Badge>
                </div>
              )}

              {/* Target Audience */}
              {brandInfo.targetAudience && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Target Audience</h3>
                  </div>
                  <p className="text-sm text-gray-600">{brandInfo.targetAudience}</p>
                </div>
              )}

              {/* Mission Statement */}
              {enhancedBrandInfo.mission && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <h3 className="font-semibold text-gray-800">Mission Statement</h3>
                  </div>
                  <p className="text-sm text-gray-600 italic">"{enhancedBrandInfo.mission}"</p>
                </div>
              )}

              {/* Color Palette */}
              {brandInfo.colorPalette && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Palette className="h-4 w-4 text-purple-600" />
                    <h3 className="font-semibold text-gray-800">Color Palette</h3>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(brandInfo.colorPalette).map(([name, color]) => (
                      <div key={name} className="text-center">
                        <div 
                          className="w-12 h-12 rounded-lg border-2 border-gray-200 mx-auto mb-1"
                          style={{ backgroundColor: color }}
                        ></div>
                        <p className="text-xs font-medium capitalize">{name}</p>
                        <p className="text-xs text-gray-500">{color}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Logo Concept */}
              {enhancedBrandInfo.logoIdea && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="h-4 w-4 text-yellow-600" />
                    <h3 className="font-semibold text-gray-800">Logo Concept</h3>
                  </div>
                  <p className="text-sm text-gray-600">{enhancedBrandInfo.logoIdea}</p>
                </div>
              )}
            </div>

            {/* Progress Indicator */}
            {!isConversationComplete && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-blue-800">Aura is building your brand...</span>
                </div>
                <p className="text-xs text-blue-600">
                  Keep chatting with Aura to discover more about your brand identity!
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {isConversationComplete && (
              <div className="space-y-3 pt-4 border-t">
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={onApprove}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold h-12"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Brand
                  </Button>
                  <Button 
                    onClick={onTryAgain}
                    variant="outline"
                    className="border-2 border-gray-300 hover:bg-gray-50 h-12"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                  </Button>
                </div>
                
                <Button 
                  onClick={onManualEntry}
                  variant="outline"
                  className="w-full border-2 border-purple-300 text-purple-700 hover:bg-purple-50 h-12"
                >
                  Have Your Own Brand Info? Click Here for Manual Entry
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex items-center justify-center text-center py-12">
            <div>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Your Brand Awaits Discovery</h3>
              <p className="text-gray-500 max-w-xs">
                Start chatting with Aura to begin building your unique brand identity. 
                Watch this space as your brand comes to life!
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}