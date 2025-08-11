import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, HelpCircle, Bot, Save } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

interface BrandFormData {
  businessName: string;
  niche: string;
  targetAudience: string;
  missionStatement: string;
  tagline: string;
  colorPreferences: string;
  logoIdeas: string;
  brandPersonality: string[];
}

interface ManualBrandFormProps {
  onBack: () => void;
  onSave: (brandData: any) => void;
}

export default function ManualBrandForm({ onBack, onSave }: ManualBrandFormProps) {
  const [formData, setFormData] = useState<BrandFormData>({
    businessName: "",
    niche: "",
    targetAudience: "",
    missionStatement: "",
    tagline: "",
    colorPreferences: "",
    logoIdeas: "",
    brandPersonality: []
  });

  const [aiSuggestions, setAiSuggestions] = useState<{ [key: string]: string }>({});
  const [requestingHelp, setRequestingHelp] = useState<string | null>(null);

  const getAiHelpMutation = useMutation({
    mutationFn: async (field: string) => {
      setRequestingHelp(field);
      
      // Simulate AI analysis and suggestions
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const suggestions: { [key: string]: string } = {
        businessName: generateBusinessNameSuggestion(),
        niche: "Based on your description, I detect this might be in the SaaS/Technology space. Consider 'Software as a Service' or 'Technology Solutions' as your niche.",
        targetAudience: "Your audience appears to be 'Small to medium business owners looking for efficiency and growth solutions.'",
        missionStatement: "Based on your inputs, consider: 'To empower businesses with innovative tools that simplify operations and accelerate growth.'",
        tagline: generateTaglineSuggestion(),
        colorPreferences: "I suggest a professional palette: Primary: Deep Blue (#1e40af), Secondary: Teal (#0891b2), Accent: Orange (#f59e0b) for trust, innovation, and energy.",
        logoIdeas: "Consider a modern, minimalist design with interlocking shapes representing connection and growth. Think clean lines with your brand colors.",
        brandPersonality: "Professional, Innovative, Trustworthy, Growth-focused"
      };
      
      return suggestions[field] || "I'd be happy to help! Please provide more context about your business.";
    },
    onSuccess: (suggestion, field) => {
      setAiSuggestions(prev => ({ ...prev, [field]: suggestion }));
      setRequestingHelp(null);
    },
    onError: () => {
      setRequestingHelp(null);
    }
  });

  const generateBusinessNameSuggestion = (): string => {
    const prefixes = ["Pro", "Smart", "Boost", "Elite", "Flow", "Sync"];
    const suffixes = ["Solutions", "Hub", "Labs", "Works", "Tech", "Co"];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    return `${prefix}${suffix}`;
  };

  const generateTaglineSuggestion = (): string => {
    const taglines = [
      "Innovation That Delivers",
      "Your Success, Our Mission",
      "Empowering Growth Through Technology",
      "Solutions That Scale",
      "Building Tomorrow, Today",
      "Where Ideas Meet Impact"
    ];
    return taglines[Math.floor(Math.random() * taglines.length)];
  };

  const handlePersonalityChange = (personality: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      brandPersonality: checked 
        ? [...prev.brandPersonality, personality]
        : prev.brandPersonality.filter(p => p !== personality)
    }));
  };

  const applySuggestion = (field: string) => {
    const suggestion = aiSuggestions[field];
    if (suggestion) {
      setFormData(prev => ({ ...prev, [field]: suggestion }));
      setAiSuggestions(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSave = () => {
    // Convert form data to brand info format
    const brandData = {
      name: formData.businessName,
      niche: formData.niche,
      mission: formData.missionStatement,
      tagline: formData.tagline,
      targetAudience: formData.targetAudience,
      logoIdea: formData.logoIdeas,
      colorPalette: parseColorPreferences(formData.colorPreferences),
      personality: formData.brandPersonality
    };
    
    onSave(brandData);
  };

  const parseColorPreferences = (colorText: string) => {
    // Simple color parsing - in a real app, this would be more sophisticated
    const colors = colorText.toLowerCase();
    if (colors.includes('blue')) {
      return { primary: '#3b82f6', secondary: '#1e40af', accent: '#06b6d4' };
    } else if (colors.includes('green')) {
      return { primary: '#10b981', secondary: '#059669', accent: '#84cc16' };
    } else if (colors.includes('red') || colors.includes('warm')) {
      return { primary: '#e11d48', secondary: '#dc2626', accent: '#f59e0b' };
    } else {
      return { primary: '#6b7280', secondary: '#374151', accent: '#f59e0b' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center gap-4">
          <Button 
            onClick={onBack}
            variant="ghost" 
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Chat
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">Manual Brand Builder</h1>
            <p className="text-indigo-100">
              Fill in your brand details with Aura's intelligent assistance
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Brand Information Form
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Business Name */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Business Name</Label>
                <Button
                  onClick={() => getAiHelpMutation.mutate('businessName')}
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700"
                  disabled={requestingHelp === 'businessName'}
                >
                  {requestingHelp === 'businessName' ? (
                    <Bot className="h-4 w-4 animate-spin" />
                  ) : (
                    <HelpCircle className="h-4 w-4" />
                  )}
                  <span className="ml-1 text-xs">Ask Aura</span>
                </Button>
              </div>
              <Input
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                placeholder="Enter your business name"
                className="border-2 focus:border-purple-500"
              />
              {aiSuggestions.businessName && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-purple-800 font-medium">Aura suggests:</p>
                      <p className="text-sm text-purple-700">{aiSuggestions.businessName}</p>
                    </div>
                    <Button
                      onClick={() => applySuggestion('businessName')}
                      size="sm"
                      variant="outline"
                      className="border-purple-300 text-purple-700"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Niche */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Business Niche</Label>
                <Button
                  onClick={() => getAiHelpMutation.mutate('niche')}
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700"
                  disabled={requestingHelp === 'niche'}
                >
                  {requestingHelp === 'niche' ? (
                    <Bot className="h-4 w-4 animate-spin" />
                  ) : (
                    <HelpCircle className="h-4 w-4" />
                  )}
                  <span className="ml-1 text-xs">Ask Aura</span>
                </Button>
              </div>
              <Select value={formData.niche} onValueChange={(value) => setFormData(prev => ({ ...prev, niche: value }))}>
                <SelectTrigger className="border-2 focus:border-purple-500">
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
              {aiSuggestions.niche && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-purple-800 font-medium">Aura suggests:</p>
                      <p className="text-sm text-purple-700">{aiSuggestions.niche}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Target Audience</Label>
                <Button
                  onClick={() => getAiHelpMutation.mutate('targetAudience')}
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700"
                  disabled={requestingHelp === 'targetAudience'}
                >
                  {requestingHelp === 'targetAudience' ? (
                    <Bot className="h-4 w-4 animate-spin" />
                  ) : (
                    <HelpCircle className="h-4 w-4" />
                  )}
                  <span className="ml-1 text-xs">Ask Aura</span>
                </Button>
              </div>
              <Input
                value={formData.targetAudience}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                placeholder="e.g., Small business owners, entrepreneurs"
                className="border-2 focus:border-purple-500"
              />
              {aiSuggestions.targetAudience && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-purple-800 font-medium">Aura suggests:</p>
                      <p className="text-sm text-purple-700">{aiSuggestions.targetAudience}</p>
                    </div>
                    <Button
                      onClick={() => applySuggestion('targetAudience')}
                      size="sm"
                      variant="outline"
                      className="border-purple-300 text-purple-700"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Mission Statement */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Mission Statement</Label>
                <Button
                  onClick={() => getAiHelpMutation.mutate('missionStatement')}
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700"
                  disabled={requestingHelp === 'missionStatement'}
                >
                  {requestingHelp === 'missionStatement' ? (
                    <Bot className="h-4 w-4 animate-spin" />
                  ) : (
                    <HelpCircle className="h-4 w-4" />
                  )}
                  <span className="ml-1 text-xs">Ask Aura</span>
                </Button>
              </div>
              <Textarea
                value={formData.missionStatement}
                onChange={(e) => setFormData(prev => ({ ...prev, missionStatement: e.target.value }))}
                placeholder="What does your business aim to achieve?"
                className="border-2 focus:border-purple-500 min-h-[80px]"
              />
              {aiSuggestions.missionStatement && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-purple-800 font-medium">Aura suggests:</p>
                      <p className="text-sm text-purple-700">{aiSuggestions.missionStatement}</p>
                    </div>
                    <Button
                      onClick={() => applySuggestion('missionStatement')}
                      size="sm"
                      variant="outline"
                      className="border-purple-300 text-purple-700"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Tagline */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">Tagline</Label>
                <Button
                  onClick={() => getAiHelpMutation.mutate('tagline')}
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700"
                  disabled={requestingHelp === 'tagline'}
                >
                  {requestingHelp === 'tagline' ? (
                    <Bot className="h-4 w-4 animate-spin" />
                  ) : (
                    <HelpCircle className="h-4 w-4" />
                  )}
                  <span className="ml-1 text-xs">Ask Aura</span>
                </Button>
              </div>
              <Input
                value={formData.tagline}
                onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                placeholder="A catchy phrase that represents your brand"
                className="border-2 focus:border-purple-500"
              />
              {aiSuggestions.tagline && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm text-purple-800 font-medium">Aura suggests:</p>
                      <p className="text-sm text-purple-700">{aiSuggestions.tagline}</p>
                    </div>
                    <Button
                      onClick={() => applySuggestion('tagline')}
                      size="sm"
                      variant="outline"
                      className="border-purple-300 text-purple-700"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleSave}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg rounded-xl"
            >
              <Save className="mr-2 h-5 w-5" />
              Generate Brand Preview
            </Button>
          </CardContent>
        </Card>

        {/* AI Assistant Panel */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-purple-600" />
              Aura's Assistance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2">How Aura Helps</h3>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Click "Ask Aura" next to any field for intelligent suggestions</li>
                <li>• Aura analyzes your existing inputs to provide contextual help</li>
                <li>• All suggestions are personalized to your business</li>
                <li>• You can accept, modify, or ignore any suggestion</li>
              </ul>
            </div>

            {Object.keys(aiSuggestions).length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">Recent Suggestions</h3>
                {Object.entries(aiSuggestions).map(([field, suggestion]) => 
                  suggestion && (
                    <div key={field} className="p-3 bg-gray-50 rounded-lg border">
                      <p className="text-sm font-medium text-gray-800 capitalize mb-1">
                        {field.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-xs text-gray-600">{suggestion}</p>
                    </div>
                  )
                )}
              </div>
            )}

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">💡 Pro Tip</h3>
              <p className="text-sm text-yellow-700">
                The more fields you fill out, the better Aura's suggestions become! 
                Each input helps the AI understand your brand better.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}