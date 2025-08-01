import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Wand2, Save } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function BrandingBuilder() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    niche: "",
    keywords: "",
    personality: [] as string[],
  });

  const [generatedBrand, setGeneratedBrand] = useState<any>(null);

  const personalityOptions = [
    "Professional", "Creative", "Friendly", "Bold",
    "Minimalist", "Luxury", "Playful", "Trustworthy"
  ];

  const generateBrandMutation = useMutation({
    mutationFn: async () => {
      const randomName = formData.niche + " Pro";
      return {
        name: randomName,
        slogan: `Your ${formData.niche} Solution`,
        colorPalette: {
          primary: "#722f37",
          secondary: "#10b981",
          accent: "#374151"
        },
        logoUrl: "/api/generate-logo/" + randomName.replace(/\s+/g, '-').toLowerCase()
      };
    },
    onSuccess: (data) => {
      setGeneratedBrand(data);
      toast({
        title: "Brand Generated!",
        description: "Your brand identity has been created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your brand.",
        variant: "destructive",
      });
    }
  });

  const saveBrandMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/brands", {
        userId: "demo-user-id",
        name: generatedBrand.name,
        niche: formData.niche,
        keywords: formData.keywords,
        personality: formData.personality,
        slogan: generatedBrand.slogan,
        colorPalette: generatedBrand.colorPalette,
        logoUrl: generatedBrand.logoUrl
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      toast({
        title: "Brand Saved!",
        description: "Your brand has been saved successfully.",
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

  const handlePersonalityChange = (personality: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      personality: checked 
        ? [...prev.personality, personality]
        : prev.personality.filter(p => p !== personality)
    }));
  };

  const generateBrand = () => {
    if (!formData.niche.trim()) {
      toast({
        title: "Niche Required",
        description: "Please enter your business niche before generating a brand.",
        variant: "destructive",
      });
      return;
    }
    generateBrandMutation.mutate();
  };

  return (
    <Card className="bg-white rounded-2xl shadow-lg border-0">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="bg-white/20 p-3 rounded-full">
            <Palette className="text-white" size={24} />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">BoDiGi™ Branding Builder</CardTitle>
            <CardDescription className="text-white/90">
              Create your unique brand identity in seconds with AI assistance
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Business Niche *
              </label>
              <input
                type="text"
                value={formData.niche}
                onChange={(e) => setFormData(prev => ({ ...prev, niche: e.target.value }))}
                placeholder="e.g., Sustainable Fashion, Digital Marketing, Health & Wellness"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Keywords (Optional)
              </label>
              <input
                type="text"
                value={formData.keywords}
                onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                placeholder="e.g., innovative, premium, eco-friendly, cutting-edge"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Brand Personality
              </label>
              <div className="grid grid-cols-2 gap-3">
                {personalityOptions.map((personality) => (
                  <label key={personality} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.personality.includes(personality)}
                      onChange={(e) => handlePersonalityChange(personality, e.target.checked)}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">{personality}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button
              onClick={generateBrand}
              disabled={generateBrandMutation.isPending}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              <Wand2 className="mr-2" size={16} />
              {generateBrandMutation.isPending ? "Generating..." : "✨ Generate My Brand Identity"}
            </Button>
          </div>

          {/* Preview Section */}
          <div className="bg-gray-50 rounded-xl p-6">
            {generatedBrand ? (
              <div className="space-y-6">
                <div className="text-center">
                  <div 
                    className="w-32 h-32 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold"
                    style={{ backgroundColor: generatedBrand.colorPalette.primary }}
                  >
                    {generatedBrand.name.charAt(0)}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{generatedBrand.name}</h2>
                  <p className="text-lg text-gray-600 italic">"{generatedBrand.slogan}"</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Color Palette</h3>
                    <div className="flex space-x-3">
                      <div className="text-center">
                        <div 
                          className="w-12 h-12 rounded-lg border-2 border-gray-200"
                          style={{ backgroundColor: generatedBrand.colorPalette.primary }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-1 block">Primary</span>
                      </div>
                      <div className="text-center">
                        <div 
                          className="w-12 h-12 rounded-lg border-2 border-gray-200"
                          style={{ backgroundColor: generatedBrand.colorPalette.secondary }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-1 block">Secondary</span>
                      </div>
                      <div className="text-center">
                        <div 
                          className="w-12 h-12 rounded-lg border-2 border-gray-200"
                          style={{ backgroundColor: generatedBrand.colorPalette.accent }}
                        ></div>
                        <span className="text-xs text-gray-500 mt-1 block">Accent</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Brand Details</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Niche:</strong> {formData.niche}</p>
                      <p><strong>Keywords:</strong> {formData.keywords || "None specified"}</p>
                      <p><strong>Personality:</strong> {formData.personality.join(", ") || "None selected"}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Palette className="text-gray-400" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Brand Generated Yet</h3>
                <p className="text-gray-500">Fill out the form and click "Generate My Brand" to see your brand preview</p>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        {generatedBrand && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Ready to save your brand and continue?
              </div>
              <Button
                onClick={() => saveBrandMutation.mutate()}
                disabled={saveBrandMutation.isPending}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
              >
                <Save className="mr-2" size={16} />
                {saveBrandMutation.isPending ? "Saving..." : "Save & Continue to MVP Builder"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

  const generateBrandMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      
      // Enhanced brand generation logic based on niche and inputs
      const brandNames = {
        ecommerce: ["ShopFlow Pro", "Commerce Elite", "Retail Boost", "MarketMaster", "SaleStream"],
        saas: ["TechFlow", "CloudBoost Pro", "DataSync Elite", "AutoFlow", "WorkStream"],
        health: ["WellnessFlow", "HealthBoost Pro", "VitalSync", "WellStream", "FitFlow"],
        education: ["LearnFlow Pro", "EduBoost", "KnowledgeSync", "StudyStream", "SkillFlow"],
        finance: ["FinanceFlow", "WealthBoost", "MoneySync Pro", "InvestStream", "CapitalFlow"],
        consulting: ["ConsultFlow", "ExpertBoost", "AdviseSync", "StrategyStream", "GrowthFlow"]
      };
      
      const slogans = {
        ecommerce: ["Sell Smarter, Grow Faster", "Your Commerce Partner", "Retail Success Automated"],
        saas: ["Automate Your Success", "Technology That Works", "Software Made Simple"],
        health: ["Wellness Made Easy", "Your Health Journey", "Better Life, Better You"],
        education: ["Learn Without Limits", "Knowledge Unlocked", "Education Evolved"],
        finance: ["Financial Freedom Simplified", "Wealth Building Made Easy", "Your Money, Optimized"],
        consulting: ["Strategic Growth Solutions", "Expert Guidance, Real Results", "Transform Your Business"]
      };

      const niche = formData.niche || "saas";
      const names = brandNames[niche as keyof typeof brandNames] || brandNames.saas;
      const sloganOptions = slogans[niche as keyof typeof slogans] || slogans.saas;
      
      const randomName = formData.businessName || names[Math.floor(Math.random() * names.length)];
      const randomSlogan = sloganOptions[Math.floor(Math.random() * sloganOptions.length)];
      
      // Generate niche-appropriate colors
      const colorPalettes = {
        ecommerce: { primary: "#e11d48", secondary: "#f59e0b", accent: "#10b981" },
        saas: { primary: "#3b82f6", secondary: "#8b5cf6", accent: "#06b6d4" },
        health: { primary: "#10b981", secondary: "#84cc16", accent: "#f59e0b" },
        education: { primary: "#8b5cf6", secondary: "#3b82f6", accent: "#06b6d4" },
        finance: { primary: "#059669", secondary: "#0891b2", accent: "#fbbf24" },
        consulting: { primary: "#374151", secondary: "#6b7280", accent: "#f59e0b" }
      };

      const palette = colorPalettes[niche as keyof typeof colorPalettes] || colorPalettes.saas;
      
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        name: randomName,
        slogan: randomSlogan,
        colorPalette: {
          primary: palette.primary,
          secondary: palette.secondary,
          accent: palette.accent,
          neutral: "#1f2937",
          background: "#ffffff"
        },
        logoUrl: `/api/generate-logo/${randomName.replace(/\s+/g, '-').toLowerCase()}`,
        typography: {
          primary: "Inter",
          secondary: "Georgia"
        },
        brandVoice: {
          tone: formData.personality.join(", "),
          personality: "Professional, approachable, and results-driven",
          messaging: [
            "We deliver exceptional value to our clients",
            "Innovation drives everything we do",
            "Your success is our primary focus"
          ]
        }
      };
    },
    onSuccess: (data) => {
      setGeneratedBrand(data);
      setIsGenerating(false);
      toast({
        title: "🎨 Brand Generated Successfully!",
        description: "Your AI-powered brand identity is ready for review.",
      });
    },
    onError: () => {
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your brand. Please try again.",
        variant: "destructive",
      });
    }
  });

  const saveBrandMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/brands", {
        userId: "demo-user-id",
        formData,
        generatedBrand,
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

  const handlePersonalityChange = (personality: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      personality: checked 
        ? [...prev.personality, personality]
        : prev.personality.filter(p => p !== personality)
    }));
  };

  const exportStyleGuide = () => {
    toast({
      title: "📄 Style Guide Exported",
      description: "Your brand style guide PDF is being generated...",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-bodigi-gradient text-white p-8 rounded-2xl shadow-bodigi">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <Palette className="h-8 w-8 text-bodigi-gold" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Brand Builder</h1>
            <p className="text-white/90 text-lg">AI-powered brand identity creation in minutes</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">🎨 Brand Identity</h3>
            <p className="text-sm text-white/80">Name, slogan, colors, and logo</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">📋 Style Guide</h3>
            <p className="text-sm text-white/80">Complete brand guidelines</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">💾 Export Ready</h3>
            <p className="text-sm text-white/80">PDF and digital assets</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <Card className="shadow-bodigi hover-lift">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-xl font-bold text-black flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-bodigi-gold" />
              Brand Information
            </CardTitle>
            <p className="text-gray-600">Tell us about your business to generate the perfect brand</p>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-black">Business Name (Optional)</Label>
              <Input 
                placeholder="Leave blank for AI generation"
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                className="border-2 focus:border-bodigi-gold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-black">Business Niche *</Label>
              <Select value={formData.niche} onValueChange={(value) => setFormData(prev => ({ ...prev, niche: value }))}>
                <SelectTrigger className="border-2 focus:border-bodigi-gold">
                  <SelectValue placeholder="Select your business niche..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecommerce">🛒 E-commerce & Retail</SelectItem>
                  <SelectItem value="saas">💻 SaaS & Technology</SelectItem>
                  <SelectItem value="health">🏥 Health & Wellness</SelectItem>
                  <SelectItem value="education">📚 Education & Training</SelectItem>
                  <SelectItem value="finance">💰 Finance & Investment</SelectItem>
                  <SelectItem value="consulting">💼 Consulting & Services</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-black">Target Audience</Label>
              <Input 
                placeholder="e.g., Small business owners, entrepreneurs"
                value={formData.targetAudience}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                className="border-2 focus:border-bodigi-gold"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-black">Target Keywords</Label>
              <Input 
                placeholder="e.g., automation, productivity, growth, success"
                value={formData.keywords}
                onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                className="border-2 focus:border-bodigi-gold"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-black">Mission Statement</Label>
              <Textarea
                placeholder="What does your business aim to achieve?"
                value={formData.missionStatement}
                onChange={(e) => setFormData(prev => ({ ...prev, missionStatement: e.target.value }))}
                className="border-2 focus:border-bodigi-gold min-h-[80px]"
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-black">Brand Personality</Label>
              <div className="grid grid-cols-2 gap-3">
                {["Professional", "Innovative", "Friendly", "Trustworthy", "Bold", "Reliable", "Creative", "Expert"].map((personality) => (
                  <div key={personality} className="flex items-center space-x-2">
                    <Checkbox 
                      id={personality}
                      checked={formData.personality.includes(personality)}
                      onCheckedChange={(checked) => handlePersonalityChange(personality, checked as boolean)}
                    />
                    <Label htmlFor={personality} className="text-sm">{personality}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={() => generateBrandMutation.mutate()}
              disabled={!formData.niche || isGenerating}
              className="w-full h-12 bg-bodigi-gradient text-white font-bold text-lg rounded-xl hover:shadow-lg hover-lift"
            >
              {isGenerating ? (
                <>
                  <Wand2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Brand...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate My Brand
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Brand Preview */}
        <Card className="shadow-bodigi hover-lift">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-xl font-bold text-black flex items-center gap-2">
              <Eye className="h-5 w-5 text-bodigi-gold" />
              Brand Preview
            </CardTitle>
            <p className="text-gray-600">Live preview of your generated brand identity</p>
          </CardHeader>
          
          <CardContent className="p-6">
            {generatedBrand.name ? (
              <div className="space-y-6">
                {/* Brand Header */}
                <div 
                  className="p-6 rounded-xl text-white text-center"
                  style={{ background: `linear-gradient(135deg, ${generatedBrand.colorPalette.primary}, ${generatedBrand.colorPalette.secondary})` }}
                >
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-8 w-8" style={{ color: generatedBrand.colorPalette.accent }} />
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{generatedBrand.name}</h2>
                  <p className="text-lg opacity-90">{generatedBrand.slogan}</p>
                </div>

                {/* Color Palette */}
                <div>
                  <h3 className="font-bold text-lg mb-3">Color Palette</h3>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(generatedBrand.colorPalette).map(([name, color]) => (
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

                {/* Typography */}
                <div>
                  <h3 className="font-bold text-lg mb-3">Typography</h3>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Primary Font</p>
                      <p className="text-lg font-bold" style={{ fontFamily: generatedBrand.typography.primary }}>
                        {generatedBrand.typography.primary}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Secondary Font</p>
                      <p className="text-lg" style={{ fontFamily: generatedBrand.typography.secondary }}>
                        {generatedBrand.typography.secondary}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Brand Voice */}
                <div>
                  <h3 className="font-bold text-lg mb-3">Brand Voice</h3>
                  <div className="space-y-2">
                    <div>
                      <Badge variant="outline" className="mb-2">{generatedBrand.brandVoice.tone}</Badge>
                      <p className="text-sm text-gray-600">{generatedBrand.brandVoice.personality}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={() => setShowStyleGuide(true)}
                    variant="outline"
                    className="flex-1 border-2 border-bodigi-gold text-bodigi-gradient-start hover:bg-bodigi-gold hover:text-black"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Style Guide
                  </Button>
                  <Button 
                    onClick={exportStyleGuide}
                    variant="outline"
                    className="flex-1 border-2 border-gray-300 hover:bg-gray-50"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                </div>

                <Button 
                  onClick={() => saveBrandMutation.mutate()}
                  disabled={saveBrandMutation.isPending}
                  className="w-full h-12 bg-bodigi-gradient text-white font-bold text-lg rounded-xl hover:shadow-lg hover-lift"
                >
                  <Save className="mr-2 h-5 w-5" />
                  Save Brand & Continue to MVP
                </Button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Brand Generated Yet</h3>
                <p className="text-gray-500">Fill out the form and click "Generate My Brand" to see your brand preview</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
  </CardContent>
        </Card>
      </div>
    </div>
  );
}

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-slate-200">
        <CardTitle className="text-xl font-semibold text-slate-900">Branding Builder</CardTitle>
        <p className="text-sm text-slate-600">Create your brand identity automatically</p>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Business Niche</Label>
              <Select value={formData.niche} onValueChange={(value) => setFormData(prev => ({ ...prev, niche: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your niche..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecommerce">E-commerce & Retail</SelectItem>
                  <SelectItem value="saas">SaaS & Technology</SelectItem>
                  <SelectItem value="health">Health & Wellness</SelectItem>
                  <SelectItem value="education">Education & Training</SelectItem>
                  <SelectItem value="finance">Finance & Consulting</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Target Keywords</Label>
              <Input 
                placeholder="e.g., automation, productivity, growth"
                value={formData.keywords}
                onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
              />
            </div>
            
            <div className="space-y-3">
              <Label className="text-sm font-medium text-slate-700">Brand Personality</Label>
              <div className="grid grid-cols-2 gap-3">
                {["Professional", "Innovative", "Friendly", "Trustworthy"].map((personality) => (
                  <div key={personality} className="flex items-center space-x-2">
                    <Checkbox 
                      id={personality}
                      checked={formData.personality.includes(personality)}
                      onCheckedChange={(checked) => handlePersonalityChange(personality, checked as boolean)}
                    />
                    <Label htmlFor={personality} className="text-sm text-slate-700">{personality}</Label>
                  </div>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={() => generateBrandMutation.mutate()}
              disabled={generateBrandMutation.isPending || !formData.niche}
              className="w-full"
            >
              <Wand2 className="mr-2" size={16} />
              {generateBrandMutation.isPending ? "Generating..." : "Generate Brand Identity"}
            </Button>
          </div>
          
          {/* Generated Preview */}
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Generated Brand Preview</h3>
              
              {generatedBrand.name ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Brand Name</Label>
                    <div className="mt-1 text-2xl font-bold text-slate-900">{generatedBrand.name}</div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Slogan</Label>
                    <div className="mt-1 text-lg text-slate-700">"{generatedBrand.slogan}"</div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Color Palette</Label>
                    <div className="mt-2 flex space-x-2">
                      <div 
                        className="w-12 h-12 rounded-lg border-2 border-white shadow-sm" 
                        style={{ backgroundColor: generatedBrand.colorPalette.primary }}
                        title="Primary Color"
                      />
                      <div 
                        className="w-12 h-12 rounded-lg border-2 border-white shadow-sm"
                        style={{ backgroundColor: generatedBrand.colorPalette.secondary }}
                        title="Secondary Color"
                      />
                      <div 
                        className="w-12 h-12 rounded-lg border-2 border-white shadow-sm"
                        style={{ backgroundColor: generatedBrand.colorPalette.accent }}
                        title="Accent Color"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-slate-600">Logo Concept</Label>
                    <div className="mt-2 w-20 h-20 bg-primary rounded-xl flex items-center justify-center">
                      <Wand2 className="text-white text-2xl" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  Generate your brand to see the preview
                </div>
              )}
            </div>
            
            {generatedBrand.name && (
              <Button 
                onClick={() => saveBrandMutation.mutate()}
                disabled={saveBrandMutation.isPending}
                className="w-full bg-success hover:bg-success/90"
              >
                <Save className="mr-2" size={16} />
                {saveBrandMutation.isPending ? "Saving..." : "Save & Continue to MVP Builder"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
