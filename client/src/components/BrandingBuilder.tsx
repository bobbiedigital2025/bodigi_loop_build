import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Wand2, Save } from "lucide-react";
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

  const [generatedBrand, setGeneratedBrand] = useState({
    name: "",
    slogan: "",
    colorPalette: {
      primary: "#3b82f6",
      secondary: "#10b981",
      accent: "#374151"
    },
    logoUrl: ""
  });

  const generateBrandMutation = useMutation({
    mutationFn: async () => {
      // Simulate brand generation based on inputs
      const brandNames = [
        "FlowBoost Pro", "AutoSync Elite", "TaskFlow Master", "WorkStream Pro", "EfficiencyHub"
      ];
      const slogans = [
        "Automate Your Success", "Streamline Everything", "Work Smarter, Not Harder", 
        "Efficiency Redefined", "Your Productivity Partner"
      ];
      
      const randomName = brandNames[Math.floor(Math.random() * brandNames.length)];
      const randomSlogan = slogans[Math.floor(Math.random() * slogans.length)];
      
      return {
        name: randomName,
        slogan: randomSlogan,
        colorPalette: {
          primary: "#3b82f6",
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
        userId: "demo-user-id", // In real app, get from auth
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
        description: "Your brand has been saved successfully. You can now continue to the MVP Builder.",
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
