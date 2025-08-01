import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Rocket, 
  Sparkles, 
  Eye, 
  Save, 
  Gift, 
  Zap, 
  Target, 
  DollarSign,
  Code,
  Smartphone,
  BookOpen,
  ShoppingCart,
  Calculator,
  Palette
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const mvpTypes = {
  app: {
    icon: Smartphone,
    title: "Mobile/Web App",
    description: "Interactive application with user authentication",
    examples: ["Task Manager", "Fitness Tracker", "Social Platform"]
  },
  automation: {
    icon: Zap,
    title: "Automation Tool",
    description: "Workflow automation and process optimization",
    examples: ["Email Sequences", "Lead Nurturing", "Data Processing"]
  },
  ebook: {
    icon: BookOpen,
    title: "Digital eBook",
    description: "Comprehensive guide or training material",
    examples: ["Business Guide", "How-to Manual", "Industry Report"]
  },
  tool: {
    icon: Calculator,
    title: "Utility Tool",
    description: "Specialized calculator or utility application",
    examples: ["ROI Calculator", "Price Estimator", "Conversion Tool"]
  },
  ecommerce: {
    icon: ShoppingCart,
    title: "E-commerce Store",
    description: "Online store with payment processing",
    examples: ["Product Catalog", "Digital Downloads", "Subscription Box"]
  },
  course: {
    icon: Target,
    title: "Online Course",
    description: "Educational content with progress tracking",
    examples: ["Video Course", "Interactive Lessons", "Certification Program"]
  }
};

const bonusFeatures = [
  {
    id: "premium-ui",
    name: "Premium UI Kit",
    description: "Professional design system with 50+ components",
    value: 297,
    category: "Design"
  },
  {
    id: "ai-content",
    name: "AI Content Generator",
    description: "Automated content creation for marketing and social media",
    value: 197,
    category: "AI"
  },
  {
    id: "analytics-pro",
    name: "Advanced Analytics Suite",
    description: "Deep insights with custom dashboards and reporting",
    value: 147,
    category: "Analytics"
  },
  {
    id: "automation-workflows",
    name: "Smart Automation Workflows",
    description: "Pre-built automation templates for common business processes",
    value: 247,
    category: "Automation"
  },
  {
    id: "integrations",
    name: "Premium Integrations Pack",
    description: "Connect with 100+ popular business tools and services",
    value: 197,
    category: "Integration"
  }
];

export default function MVPBuilder() {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mvpType: "",
    niche: "",
    targetAudience: "",
    problemSolved: "",
    keyFeatures: "",
    pricingStrategy: "",
    title: "",
    description: "",
    uniqueSellingPoints: [] as string[],
  });

  const [selectedBonusFeatures, setSelectedBonusFeatures] = useState<string[]>([]);
  const [generatedMVP, setGeneratedMVP] = useState({
    title: "",
    description: "",
    features: [] as string[],
    techStack: [] as string[],
    pricing: {
      tier1: { name: "", price: 0, features: [] },
      tier2: { name: "", price: 0, features: [] },
      tier3: { name: "", price: 0, features: [] }
    },
    demoUrl: "",
    mockups: [] as string[]
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const generateMVPMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      
      // Simulate AI generation process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mvpTemplates = {
        app: {
          title: `${formData.niche} Master App`,
          description: `Revolutionary ${formData.niche.toLowerCase()} application that ${formData.problemSolved.toLowerCase()}`,
          features: [
            "User Authentication & Profiles",
            "Real-time Notifications", 
            "Advanced Search & Filtering",
            "Data Analytics Dashboard",
            "Mobile Responsive Design",
            "API Integration Support"
          ],
          techStack: ["React/React Native", "Node.js", "PostgreSQL", "Stripe", "AWS"]
        },
        automation: {
          title: `${formData.niche} Automation Suite`,
          description: `Powerful automation platform that streamlines ${formData.niche.toLowerCase()} workflows`,
          features: [
            "Drag-and-Drop Workflow Builder",
            "Multi-trigger Automation",
            "Integration Marketplace",
            "Performance Analytics",
            "Team Collaboration",
            "Custom Reporting"
          ],
          techStack: ["React", "Express.js", "MongoDB", "Redis", "Docker"]
        },
        ebook: {
          title: `Ultimate ${formData.niche} Guide`,
          description: `Comprehensive guide to mastering ${formData.niche.toLowerCase()} for modern businesses`,
          features: [
            "Interactive PDF with Bookmarks",
            "Video Tutorials Included",
            "Downloadable Templates",
            "Case Studies & Examples",
            "Action Plan Worksheets",
            "Bonus Resource Library"
          ],
          techStack: ["PDF Generation", "Video Hosting", "Download Portal", "Analytics"]
        },
        tool: {
          title: `${formData.niche} Calculator Pro`,
          description: `Advanced calculation tool for ${formData.niche.toLowerCase()} optimization`,
          features: [
            "Multi-variable Calculations",
            "Export to PDF/Excel",
            "Historical Data Tracking",
            "Comparison Charts",
            "Custom Formulas",
            "Team Sharing"
          ],
          techStack: ["React", "Chart.js", "jsPDF", "Local Storage"]
        },
        ecommerce: {
          title: `${formData.niche} Marketplace`,
          description: `E-commerce platform specialized for ${formData.niche.toLowerCase()} products`,
          features: [
            "Product Catalog Management",
            "Secure Payment Processing",
            "Inventory Management",
            "Order Tracking",
            "Customer Reviews",
            "Analytics Dashboard"
          ],
          techStack: ["Next.js", "Stripe", "PostgreSQL", "Redis", "Vercel"]
        },
        course: {
          title: `${formData.niche} Mastery Course`,
          description: `Complete online course for ${formData.niche.toLowerCase()} success`,
          features: [
            "Video Lesson Library",
            "Progress Tracking",
            "Quizzes & Assessments",
            "Downloadable Resources",
            "Community Access",
            "Completion Certificates"
          ],
          techStack: ["React", "Video.js", "Progress API", "Certificate Generator"]
        }
      };

      const template = mvpTemplates[formData.mvpType as keyof typeof mvpTemplates] || mvpTemplates.app;
      
      return {
        ...template,
        pricing: {
          tier1: { 
            name: "Starter", 
            price: 29, 
            features: template.features.slice(0, 3) 
          },
          tier2: { 
            name: "Professional", 
            price: 59, 
            features: template.features.slice(0, 5) 
          },
          tier3: { 
            name: "Enterprise", 
            price: 99, 
            features: template.features 
          }
        },
        demoUrl: `https://demo.bodigi.com/mvp/${formData.mvpType}-${Date.now()}`,
        mockups: [
          `/mockups/${formData.mvpType}-desktop.png`,
          `/mockups/${formData.mvpType}-mobile.png`,
          `/mockups/${formData.mvpType}-dashboard.png`
        ]
      };
    },
    onSuccess: (data) => {
      setGeneratedMVP(data);
      setIsGenerating(false);
      setStep(3);
      toast({
        title: "🚀 MVP Generated Successfully!",
        description: "Your product is ready for preview and customization.",
      });
    },
    onError: () => {
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your MVP. Please try again.",
        variant: "destructive",
      });
    }
  });

  const saveMVPMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/mvps", {
        userId: "demo-user-id",
        formData,
        generatedMVP,
        selectedBonusFeatures,
        timestamp: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mvps"] });
      toast({
        title: "💎 MVP Saved Successfully!",
        description: "Your product is saved. Continue to Marketing Builder to create campaigns.",
      });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "There was an error saving your MVP.",
        variant: "destructive",
      });
    }
  });

  const handleBonusFeatureToggle = (featureId: string) => {
    setSelectedBonusFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const getTotalBonusValue = () => {
    return selectedBonusFeatures.reduce((total, featureId) => {
      const feature = bonusFeatures.find(f => f.id === featureId);
      return total + (feature?.value || 0);
    }, 0);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <Label className="text-lg font-bold text-black mb-4 block">Choose Your MVP Type</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(mvpTypes).map(([key, type]) => {
            const IconComponent = type.icon;
            return (
              <Card 
                key={key}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                  formData.mvpType === key 
                    ? 'border-bodigi-gold bg-yellow-50' 
                    : 'border-gray-200 hover:border-bodigi-gold'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, mvpType: key }))}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-bodigi-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{type.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{type.description}</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {type.examples.map((example, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-black">Business Niche</Label>
          <Input 
            placeholder="e.g., Health & Wellness, E-commerce"
            value={formData.niche}
            onChange={(e) => setFormData(prev => ({ ...prev, niche: e.target.value }))}
            className="border-2 focus:border-bodigi-gold"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-black">Target Audience</Label>
          <Input 
            placeholder="e.g., Small business owners, Freelancers"
            value={formData.targetAudience}
            onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
            className="border-2 focus:border-bodigi-gold"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-black">Problem Your MVP Solves</Label>
        <Textarea
          placeholder="Describe the main problem your product will solve..."
          value={formData.problemSolved}
          onChange={(e) => setFormData(prev => ({ ...prev, problemSolved: e.target.value }))}
          className="border-2 focus:border-bodigi-gold min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-black">Key Features You Want</Label>
        <Textarea
          placeholder="List the main features you want in your MVP..."
          value={formData.keyFeatures}
          onChange={(e) => setFormData(prev => ({ ...prev, keyFeatures: e.target.value }))}
          className="border-2 focus:border-bodigi-gold min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-semibold text-black">Pricing Strategy</Label>
        <Select value={formData.pricingStrategy} onValueChange={(value) => setFormData(prev => ({ ...prev, pricingStrategy: value }))}>
          <SelectTrigger className="border-2 focus:border-bodigi-gold">
            <SelectValue placeholder="Select pricing model..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="freemium">Freemium (Free + Paid tiers)</SelectItem>
            <SelectItem value="subscription">Monthly Subscription</SelectItem>
            <SelectItem value="one-time">One-time Purchase</SelectItem>
            <SelectItem value="usage-based">Usage-based Pricing</SelectItem>
            <SelectItem value="tiered">Tiered Pricing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={() => setStep(2)}
        disabled={!formData.mvpType || !formData.niche || !formData.problemSolved}
        className="w-full h-12 bg-bodigi-gradient text-white font-bold text-lg rounded-xl hover:shadow-lg hover-lift"
      >
        Continue to Bonus Features
        <Sparkles className="ml-2 h-5 w-5" />
      </Button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-black mb-2">Choose Your Bonus Features</h2>
        <p className="text-gray-600">Select up to 5 premium features to include with your MVP</p>
        <div className="mt-4 p-4 bg-bodigi-gradient text-white rounded-xl">
          <p className="text-lg font-semibold">Total Bonus Value: ${getTotalBonusValue()}</p>
          <p className="text-sm opacity-90">All features included FREE with your MVP</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bonusFeatures.map((feature) => (
          <Card 
            key={feature.id}
            className={`cursor-pointer transition-all duration-200 border-2 ${
              selectedBonusFeatures.includes(feature.id)
                ? 'border-bodigi-gold bg-yellow-50'
                : 'border-gray-200 hover:border-bodigi-gold'
            }`}
            onClick={() => handleBonusFeatureToggle(feature.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{feature.name}</h3>
                  <Badge variant="outline" className="mb-2">{feature.category}</Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500 line-through">${feature.value}</p>
                  <Badge className="bg-green-500 text-white">FREE</Badge>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{feature.description}</p>
              {selectedBonusFeatures.includes(feature.id) && (
                <div className="mt-3 flex items-center text-green-600">
                  <Gift className="h-4 w-4 mr-2" />
                  <span className="text-sm font-semibold">Selected</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        <Button 
          onClick={() => setStep(1)}
          variant="outline"
          className="flex-1 h-12 border-2 border-gray-300"
        >
          Back to MVP Details
        </Button>
        <Button 
          onClick={() => generateMVPMutation.mutate()}
          disabled={isGenerating}
          className="flex-1 h-12 bg-bodigi-gradient text-white font-bold text-lg rounded-xl hover:shadow-lg hover-lift"
        >
          {isGenerating ? (
            <>
              <Zap className="mr-2 h-5 w-5 animate-spin" />
              Generating MVP...
            </>
          ) : (
            <>
              <Rocket className="mr-2 h-5 w-5" />
              Generate My MVP
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      {/* MVP Preview Header */}
      <div className="bg-bodigi-gradient text-white p-8 rounded-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <Rocket className="h-8 w-8 text-bodigi-gold" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{generatedMVP.title}</h1>
            <p className="text-white/90 text-lg">{generatedMVP.description}</p>
          </div>
        </div>
        <Button 
          onClick={() => window.open(generatedMVP.demoUrl, '_blank')}
          className="bg-white text-black hover:bg-bodigi-gold font-semibold"
        >
          <Eye className="mr-2 h-4 w-4" />
          View Live Demo
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Features */}
        <Card className="shadow-bodigi">
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-bodigi-gold" />
              Core Features
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ul className="space-y-3">
              {generatedMVP.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-bodigi-gradient rounded-full"></div>
                  <span className="font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card className="shadow-bodigi">
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-bodigi-gold" />
              Technology Stack
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-2">
              {generatedMVP.techStack.map((tech, idx) => (
                <Badge key={idx} variant="outline" className="border-bodigi-gold text-bodigi-gradient-start">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pricing Tiers */}
      <Card className="shadow-bodigi">
        <CardHeader className="bg-gray-50">
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-bodigi-gold" />
            Generated Pricing Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(generatedMVP.pricing).map(([key, tier]) => (
              <div key={key} className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
                <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                <div className="text-3xl font-bold text-bodigi-gradient-start mb-4">
                  ${tier.price}<span className="text-sm text-gray-500">/month</span>
                </div>
                <ul className="space-y-2 text-sm">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Bonus Features */}
      {selectedBonusFeatures.length > 0 && (
        <Card className="shadow-bodigi">
          <CardHeader className="bg-green-50 border-green-200">
            <CardTitle className="flex items-center gap-2 text-green-700">
              <Gift className="h-5 w-5" />
              Included Bonus Features (${getTotalBonusValue()} value)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedBonusFeatures.map(featureId => {
                const feature = bonusFeatures.find(f => f.id === featureId);
                return feature ? (
                  <div key={featureId} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Gift className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold">{feature.name}</p>
                      <p className="text-sm text-gray-600">${feature.value} value</p>
                    </div>
                  </div>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4">
        <Button 
          onClick={() => setStep(2)}
          variant="outline"
          className="flex-1 h-12 border-2 border-gray-300"
        >
          Back to Bonus Features
        </Button>
        <Button 
          onClick={() => saveMVPMutation.mutate()}
          disabled={saveMVPMutation.isPending}
          className="flex-1 h-12 bg-bodigi-gradient text-white font-bold text-lg rounded-xl hover:shadow-lg hover-lift"
        >
          <Save className="mr-2 h-5 w-5" />
          Save MVP & Continue to Marketing
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-bodigi-gradient text-white p-8 rounded-2xl shadow-bodigi">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-white/20 p-3 rounded-xl">
            <Rocket className="h-8 w-8 text-bodigi-gold" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">MVP Builder</h1>
            <p className="text-white/90 text-lg">Create your Minimum Viable Product with AI assistance</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm font-medium mb-2">
            <span>Step {step} of 3</span>
            <span>{Math.round((step / 3) * 100)}% Complete</span>
          </div>
          <Progress value={(step / 3) * 100} className="h-2 bg-white/20" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`bg-white/10 p-4 rounded-lg ${step >= 1 ? 'bg-white/20' : ''}`}>
            <h3 className="font-semibold mb-2">1. Define MVP</h3>
            <p className="text-sm text-white/80">Choose type and requirements</p>
          </div>
          <div className={`bg-white/10 p-4 rounded-lg ${step >= 2 ? 'bg-white/20' : ''}`}>
            <h3 className="font-semibold mb-2">2. Bonus Features</h3>
            <p className="text-sm text-white/80">Select premium additions</p>
          </div>
          <div className={`bg-white/10 p-4 rounded-lg ${step >= 3 ? 'bg-white/20' : ''}`}>
            <h3 className="font-semibold mb-2">3. Preview & Save</h3>
            <p className="text-sm text-white/80">Review and finalize</p>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <Card className="shadow-bodigi">
        <CardContent className="p-8">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </CardContent>
      </Card>
    </div>
  );
}
];

export default function MVPBuilder() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    type: "",
    name: "FlowBoost Pro Automation Suite",
    problem: "Small businesses struggle with manual task management and lack automated workflows to scale efficiently.",
    selectedFeatures: [] as string[]
  });

  const selectedFeatureDetails = availableFeatures.filter(f => formData.selectedFeatures.includes(f.id));
  const totalValue = selectedFeatureDetails.reduce((sum, f) => sum + f.price, 0);

  const generateMVPMutation = useMutation({
    mutationFn: async () => {
      if (formData.selectedFeatures.length !== 5) {
        throw new Error("Please select exactly 5 features");
      }
      
      return apiRequest("POST", "/api/mvps", {
        userId: "demo-user-id", // In real app, get from auth
        brandId: "demo-brand-id",
        name: formData.name,
        type: formData.type,
        problem: formData.problem,
        features: selectedFeatureDetails,
        pricing: {
          starter: Math.round(totalValue * 0.4),
          professional: Math.round(totalValue * 0.8), 
          enterprise: Math.round(totalValue * 1.6)
        },
        totalValue
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mvps"] });
      toast({
        title: "MVP Generated!",
        description: "Your MVP has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleFeatureToggle = (featureId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedFeatures: checked 
        ? [...prev.selectedFeatures, featureId]
        : prev.selectedFeatures.filter(id => id !== featureId)
    }));
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-slate-200">
        <CardTitle className="text-xl font-semibold text-slate-900">MVP Builder</CardTitle>
        <p className="text-sm text-slate-600">Create your digital product with 5 paid features</p>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Product Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saas">SaaS Application</SelectItem>
                  <SelectItem value="course">Digital Course</SelectItem>
                  <SelectItem value="automation">Automation Tool</SelectItem>
                  <SelectItem value="mobile">Mobile App</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Product Name</Label>
              <Input 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-700">Core Problem It Solves</Label>
              <Textarea 
                rows={3}
                value={formData.problem}
                onChange={(e) => setFormData(prev => ({ ...prev, problem: e.target.value }))}
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Select 5 Paid Features</h3>
              <div className="space-y-3">
                {availableFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-start space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <Checkbox 
                      id={feature.id}
                      checked={formData.selectedFeatures.includes(feature.id)}
                      onCheckedChange={(checked) => handleFeatureToggle(feature.id, checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor={feature.id} className="font-medium text-slate-900 cursor-pointer">
                        {feature.name}
                      </Label>
                      <div className="text-sm text-slate-600 mt-1">{feature.description}</div>
                      <div className="text-sm font-medium text-success mt-1">${feature.price}/month</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-sm text-slate-600">
                Selected: {formData.selectedFeatures.length}/5 features
              </div>
            </div>
          </div>
          
          {/* MVP Preview */}
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">MVP Summary</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-slate-600">Product Name</div>
                  <div className="font-semibold text-slate-900">{formData.name}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-slate-600">Selected Features</div>
                  <div className="text-sm text-slate-900 mt-1">{formData.selectedFeatures.length} features selected</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-slate-600">Total Monthly Value</div>
                  <div className="text-xl font-bold text-success">${totalValue}/month</div>
                </div>
                
                {totalValue > 0 && (
                  <div>
                    <div className="text-sm font-medium text-slate-600">Recommended Pricing</div>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between text-sm">
                        <span>Starter</span>
                        <span className="font-medium">${Math.round(totalValue * 0.4)}/month</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Professional</span>
                        <span className="font-medium">${Math.round(totalValue * 0.8)}/month</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Enterprise</span>
                        <span className="font-medium">${Math.round(totalValue * 1.6)}/month</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <Button 
              onClick={() => generateMVPMutation.mutate()}
              disabled={generateMVPMutation.isPending || formData.selectedFeatures.length !== 5 || !formData.type}
              className="w-full"
            >
              <Settings className="mr-2" size={16} />
              {generateMVPMutation.isPending ? "Generating..." : "Generate MVP"}
            </Button>
            
            <Button 
              variant="outline"
              className="w-full bg-success hover:bg-success/90 text-white border-success"
              disabled={formData.selectedFeatures.length !== 5}
            >
              <ArrowRight className="mr-2" size={16} />
              Continue to Marketing
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
