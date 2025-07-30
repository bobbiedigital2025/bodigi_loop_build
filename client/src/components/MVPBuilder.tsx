import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Settings, ArrowRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const availableFeatures = [
  {
    id: "workflow-automation",
    name: "Advanced Workflow Automation",
    description: "Create complex multi-step automation workflows with conditions and triggers",
    price: 49
  },
  {
    id: "ai-analytics",
    name: "AI-Powered Analytics Dashboard", 
    description: "Get insights and recommendations based on your business data",
    price: 29
  },
  {
    id: "team-collaboration",
    name: "Team Collaboration Tools",
    description: "Share workflows and collaborate with unlimited team members", 
    price: 19
  },
  {
    id: "api-integration",
    name: "API Integration Hub",
    description: "Connect with 500+ third-party applications seamlessly",
    price: 39
  },
  {
    id: "white-label",
    name: "White-Label Branding",
    description: "Customize the platform with your brand colors and logo",
    price: 99
  },
  {
    id: "custom-reports",
    name: "Custom Report Builder",
    description: "Create detailed custom reports and scheduled deliveries",
    price: 25
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
