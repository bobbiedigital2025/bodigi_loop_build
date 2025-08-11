import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Sparkles, 
  Rocket, 
  DollarSign, 
  Users, 
  MapPin, 
  ShoppingCart,
  Lightbulb,
  CheckCircle,
  Clock,
  Target,
  TrendingUp
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface MVPSuggestion {
  id: string;
  name: string;
  type: string;
  description: string;
  problem: string;
  features: string[];
  pricing: {
    starter: { name: string; price: number; features: string[] };
    professional: { name: string; price: number; features: string[] };
    enterprise: { name: string; price: number; features: string[] };
  };
  howItWorks: string;
  setupInstructions: string;
  revenueProjection: { monthly: number; yearly: number; growth: string };
  investorTypes: string[];
  investorPlatforms: string[];
  promotionChannels: string[];
  salesPlatforms: string[];
}

interface Brand {
  id: string;
  name: string;
  niche: string;
  targetAudience: string;
  keywords: string;
  personality: string[];
}

export default function AutomatedMVPBuilder() {
  const { toast } = useToast();
  const [currentUserId] = useState("demo-user-id");
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [suggestions, setSuggestions] = useState<MVPSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<MVPSuggestion | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch user's brands
  const { data: brands } = useQuery({
    queryKey: ['/api/brands/user', currentUserId],
    queryFn: () => apiRequest(`/api/brands/user/${currentUserId}`),
  });

  const generateSuggestionsMutation = useMutation({
    mutationFn: async (brandId: string) => {
      setIsGenerating(true);
      const response = await apiRequest('/api/mvps/generate-suggestions', {
        method: 'POST',
        body: { userId: currentUserId, brandId }
      });
      return response;
    },
    onSuccess: (data) => {
      setSuggestions(data);
      setIsGenerating(false);
      toast({
        title: "MVP Ideas Generated!",
        description: "AI has analyzed your brand and generated 5 tailored MVP suggestions."
      });
    },
    onError: (error: any) => {
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate MVP suggestions",
        variant: "destructive"
      });
    }
  });

  const selectSuggestionMutation = useMutation({
    mutationFn: async (suggestionId: string) => {
      return apiRequest('/api/mvps/select-suggestion', {
        method: 'POST',
        body: { suggestionId, userId: currentUserId }
      });
    },
    onSuccess: () => {
      toast({
        title: "MVP Selected!",
        description: "Your chosen MVP has been saved to your profile with complete details."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/mvps/user', currentUserId] });
    },
    onError: (error: any) => {
      toast({
        title: "Selection Failed",
        description: error.message || "Failed to select MVP suggestion",
        variant: "destructive"
      });
    }
  });

  const handleGenerateSuggestions = () => {
    if (!selectedBrand) {
      toast({
        title: "No Brand Selected",
        description: "Please select a brand first to generate MVP suggestions.",
        variant: "destructive"
      });
      return;
    }
    generateSuggestionsMutation.mutate(selectedBrand.id);
  };

  const handleSelectSuggestion = (suggestion: MVPSuggestion) => {
    setSelectedSuggestion(suggestion);
    setShowDetails(true);
  };

  const handleConfirmSelection = () => {
    if (selectedSuggestion) {
      selectSuggestionMutation.mutate(selectedSuggestion.id);
      setShowDetails(false);
    }
  };

  if (showDetails && selectedSuggestion) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">MVP Details</h2>
            <p className="text-slate-600 mt-2">Complete information about your selected MVP</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowDetails(false)}>
              Back to Options
            </Button>
            <Button onClick={handleConfirmSelection} disabled={selectSuggestionMutation.isPending}>
              {selectSuggestionMutation.isPending ? "Saving..." : "Select This MVP"}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-6 w-6 text-blue-600" />
              {selectedSuggestion.name}
            </CardTitle>
            <Badge className="w-fit">{selectedSuggestion.type}</Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-slate-700">{selectedSuggestion.description}</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Problem Solved
                </h3>
                <p className="text-slate-600">{selectedSuggestion.problem}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Revenue Projection
                </h3>
                <div className="space-y-2">
                  <p className="text-slate-600">Monthly: <span className="font-semibold text-green-600">${selectedSuggestion.revenueProjection.monthly.toLocaleString()}</span></p>
                  <p className="text-slate-600">Yearly: <span className="font-semibold text-green-600">${selectedSuggestion.revenueProjection.yearly.toLocaleString()}</span></p>
                  <p className="text-slate-600">Growth: <span className="font-semibold text-blue-600">{selectedSuggestion.revenueProjection.growth}</span></p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                How It Works
              </h3>
              <p className="text-slate-600">{selectedSuggestion.howItWorks}</p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Setup Instructions
              </h3>
              <div className="text-slate-600 whitespace-pre-line">{selectedSuggestion.setupInstructions}</div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Investor Types
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSuggestion.investorTypes.map((type, index) => (
                    <Badge key={index} variant="secondary">{type}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Where to Find Investors
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSuggestion.investorPlatforms.map((platform, index) => (
                    <Badge key={index} variant="outline">{platform}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Where to Promote
                </h3>
                <div className="space-y-1">
                  {selectedSuggestion.promotionChannels.map((channel, index) => (
                    <p key={index} className="text-slate-600 text-sm">• {channel}</p>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Sales Platforms
                </h3>
                <div className="space-y-1">
                  {selectedSuggestion.salesPlatforms.map((platform, index) => (
                    <p key={index} className="text-slate-600 text-sm">• {platform}</p>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pricing Strategy
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {Object.entries(selectedSuggestion.pricing).map(([tier, details]) => (
                  <Card key={tier} className="border-slate-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{details.name}</CardTitle>
                      <p className="text-2xl font-bold text-blue-600">${details.price}/mo</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1">
                        {details.features.map((feature, index) => (
                          <p key={index} className="text-sm text-slate-600">• {feature}</p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">AI-Powered MVP Builder</h2>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
          Let our AI analyze your brand profile and generate 5 tailored MVP ideas with complete business details
        </p>
      </div>

      {!brands || brands.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No Brands Found</h3>
            <p className="text-slate-600 mb-4">You need to create a brand first before generating MVP suggestions.</p>
            <Button>Create Your First Brand</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Select Your Brand</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {brands.map((brand: Brand) => (
                  <Card 
                    key={brand.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedBrand?.id === brand.id ? 'ring-2 ring-blue-500 border-blue-200' : 'border-slate-200'
                    }`}
                    onClick={() => setSelectedBrand(brand)}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-slate-900 mb-2">{brand.name}</h3>
                      <Badge className="mb-2">{brand.niche}</Badge>
                      <p className="text-sm text-slate-600">{brand.targetAudience}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {selectedBrand && (
                <div className="mt-6 text-center">
                  <Button 
                    onClick={handleGenerateSuggestions}
                    disabled={isGenerating}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    {isGenerating ? "Analyzing Brand..." : "Generate MVP Ideas"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {isGenerating && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="space-y-4">
                  <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                  <h3 className="text-xl font-semibold text-slate-900">AI Analyzing Your Brand</h3>
                  <p className="text-slate-600">Generating 5 custom MVP ideas based on your brand profile...</p>
                  <Progress value={75} className="w-64 mx-auto" />
                </div>
              </CardContent>
            </Card>
          )}

          {suggestions.length > 0 && !isGenerating && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Your AI-Generated MVP Ideas</h3>
                <p className="text-slate-600">Choose the MVP that best fits your vision</p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-6">
                {suggestions.map((suggestion, index) => (
                  <Card key={suggestion.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleSelectSuggestion(suggestion)}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg mb-2">{suggestion.name}</CardTitle>
                          <Badge>{suggestion.type}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500">Revenue Potential</p>
                          <p className="text-lg font-semibold text-green-600">${suggestion.revenueProjection.monthly.toLocaleString()}/mo</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 mb-4">{suggestion.description}</p>
                      <div className="space-y-2">
                        <p className="text-sm text-slate-500"><strong>Problem:</strong> {suggestion.problem}</p>
                        <div className="flex flex-wrap gap-1">
                          {suggestion.features.slice(0, 3).map((feature, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">{feature}</Badge>
                          ))}
                          {suggestion.features.length > 3 && (
                            <Badge variant="secondary" className="text-xs">+{suggestion.features.length - 3} more</Badge>
                          )}
                        </div>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        View Complete Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}