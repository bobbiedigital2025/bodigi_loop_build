import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Mail, Share2, ChevronRight, Save } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function MarketingBuilder() {
  const { toast } = useToast();
  const [generatedContent, setGeneratedContent] = useState({
    headline: "",
    valueProposition: "",
    callToAction: "",
    emailSubjects: [] as string[]
  });

  const generateContentMutation = useMutation({
    mutationFn: async (contentType: string) => {
      // Simulate content generation
      const mockContent = {
        landing_page: {
          headline: "Transform Your Business with FlowBoost Pro's AI-Powered Automation",
          valueProposition: "Stop wasting 10+ hours per week on manual tasks. FlowBoost Pro automatically creates workflows that save time and boost productivity by 300%.",
          callToAction: "Start Your Free Assessment"
        },
        email_sequence: {
          subjects: [
            "Your automation assessment results are in...",
            "3 workflows that could save you 15 hours/week", 
            "FlowBoost Pro: Why 89% upgrade after the quiz"
          ]
        },
        social_media: {
          headline: "Ready to 3x Your Productivity?",
          valueProposition: "FlowBoost Pro users save 15+ hours per week with automated workflows. Join 2,000+ businesses already scaling smarter.",
          callToAction: "Take the Free Assessment"
        }
      };
      
      return mockContent[contentType as keyof typeof mockContent] || mockContent.landing_page;
    },
    onSuccess: (data) => {
      if ('headline' in data) {
        setGeneratedContent({
          headline: data.headline,
          valueProposition: data.valueProposition,
          callToAction: data.callToAction,
          emailSubjects: []
        });
      } else if ('subjects' in data) {
        setGeneratedContent(prev => ({
          ...prev,
          emailSubjects: data.subjects
        }));
      }
      
      toast({
        title: "Content Generated!",
        description: "Marketing content has been created successfully.",
      });
    }
  });

  const saveMarketingMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/marketing-content", {
        mvpId: "demo-mvp-id", // In real app, get from context
        contentType: "landing_page",
        headline: generatedContent.headline,
        valueProposition: generatedContent.valueProposition,
        callToAction: generatedContent.callToAction,
        content: {
          emailSubjects: generatedContent.emailSubjects
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketing-content"] });
      toast({
        title: "Marketing Assets Saved!",
        description: "Your marketing content has been saved successfully.",
      });
    }
  });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-slate-200">
        <CardTitle className="text-xl font-semibold text-slate-900">Marketing Builder</CardTitle>
        <p className="text-sm text-slate-600">Generate marketing content and funnels for your MVP</p>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Content Generation */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Content Templates</h3>
              <div className="space-y-3">
                <Button 
                  variant="outline"
                  className="w-full flex items-center justify-between p-4 h-auto"
                  onClick={() => generateContentMutation.mutate("landing_page")}
                  disabled={generateContentMutation.isPending}
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="text-primary" size={20} />
                    <div className="text-left">
                      <div className="font-medium text-slate-900">Landing Page Copy</div>
                      <div className="text-sm text-slate-600">Headlines, features, CTAs</div>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-400" size={16} />
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full flex items-center justify-between p-4 h-auto"
                  onClick={() => generateContentMutation.mutate("email_sequence")}
                  disabled={generateContentMutation.isPending}
                >
                  <div className="flex items-center space-x-3">
                    <Mail className="text-success" size={20} />
                    <div className="text-left">
                      <div className="font-medium text-slate-900">Email Sequences</div>
                      <div className="text-sm text-slate-600">Nurture, sales, onboarding</div>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-400" size={16} />
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full flex items-center justify-between p-4 h-auto"
                  onClick={() => generateContentMutation.mutate("social_media")}
                  disabled={generateContentMutation.isPending}
                >
                  <div className="flex items-center space-x-3">
                    <Share2 className="text-amber-600" size={20} />
                    <div className="text-left">
                      <div className="font-medium text-slate-900">Social Media Posts</div>
                      <div className="text-sm text-slate-600">LinkedIn, Twitter, Instagram</div>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-400" size={16} />
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Funnel Builder</h3>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">1</div>
                    <span className="text-slate-700">Quiz Entry (Lead Capture)</span>
                  </div>
                  <div className="ml-4 border-l-2 border-slate-300 h-4"></div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">2</div>
                    <span className="text-slate-700">Progressive Rewards (PDFs)</span>
                  </div>
                  <div className="ml-4 border-l-2 border-slate-300 h-4"></div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">3</div>
                    <span className="text-slate-700">MVP Offer (Bonus Features)</span>
                  </div>
                  <div className="ml-4 border-l-2 border-slate-300 h-4"></div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center text-white text-sm font-medium">4</div>
                    <span className="text-slate-700">Checkout & Onboarding</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Generated Content Preview */}
          <div className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Generated Content Preview</h3>
              
              {generatedContent.headline ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600">Headline</label>
                    <div className="mt-1 text-xl font-bold text-slate-900">
                      {generatedContent.headline}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-600">Value Proposition</label>
                    <div className="mt-1 text-slate-700">
                      {generatedContent.valueProposition}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-slate-600">Call-to-Action</label>
                    <Button className="mt-1">
                      {generatedContent.callToAction}
                    </Button>
                  </div>
                  
                  {generatedContent.emailSubjects.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-slate-600">Email Subject Lines</label>
                      <div className="mt-1 space-y-1 text-sm text-slate-700">
                        {generatedContent.emailSubjects.map((subject, index) => (
                          <div key={index}>• "{subject}"</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  Generate content to see the preview
                </div>
              )}
            </div>
            
            {generatedContent.headline && (
              <Button 
                onClick={() => saveMarketingMutation.mutate()}
                disabled={saveMarketingMutation.isPending}
                className="w-full bg-success hover:bg-success/90"
              >
                <Save className="mr-2" size={16} />
                {saveMarketingMutation.isPending ? "Saving..." : "Save Marketing Assets"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
