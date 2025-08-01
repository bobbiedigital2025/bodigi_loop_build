import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Megaphone, 
  Mail, 
  Share2, 
  FileText, 
  Save, 
  Eye,
  Copy,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
  Globe,
  Instagram,
  Facebook,
  Twitter
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const campaignTypes = {
  landing_page: {
    title: "Landing Page",
    description: "High-converting sales page for your MVP",
    icon: Globe,
    color: "bg-blue-500"
  },
  email_sequence: {
    title: "Email Sequence",
    description: "Automated follow-up emails for leads",
    icon: Mail,
    color: "bg-green-500"
  },
  social_media: {
    title: "Social Media",
    description: "Engaging posts for all platforms",
    icon: Share2,
    color: "bg-purple-500"
  },
  ads_copy: {
    title: "Ad Copy",
    description: "Facebook & Google ad campaigns",
    icon: Target,
    color: "bg-orange-500"
  }
};

export default function MarketingBuilder() {
  const { toast } = useToast();
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [campaignInputs, setCampaignInputs] = useState({
    mvpName: "",
    targetAudience: "",
    mainBenefit: "",
    pricePoint: "",
    urgency: "",
    tone: "professional"
  });

  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCampaignMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const campaigns = {
        landing_page: {
          headline: `Transform Your ${campaignInputs.targetAudience} Business with ${campaignInputs.mvpName}`,
          subheadline: `${campaignInputs.mainBenefit} - Starting at just ${campaignInputs.pricePoint}`,
          heroSection: {
            headline: `Stop Struggling with [Problem]. ${campaignInputs.mvpName} Makes It Simple.`,
            subtitle: `Join 2,000+ ${campaignInputs.targetAudience} who've already transformed their business with our proven system.`,
            cta: "Start Your Free Assessment Now"
          },
          benefits: [
            `Save 10+ hours per week with automated ${campaignInputs.mainBenefit.toLowerCase()}`,
            "Get results in 24 hours or less",
            "No technical skills required",
            "Cancel anytime, no questions asked"
          ],
          socialProof: "Trusted by 2,000+ businesses worldwide",
          guarantee: "30-day money-back guarantee"
        },
        email_sequence: {
          subject_lines: [
            `Your ${campaignInputs.mvpName} assessment results are ready...`,
            `3 ways ${campaignInputs.targetAudience} are using ${campaignInputs.mvpName}`,
            `Why 89% of users upgrade after trying ${campaignInputs.mvpName}`,
            `[URGENT] Your trial expires in 24 hours`,
            `Last chance: ${campaignInputs.mvpName} bonus expires tonight`
          ],
          emails: [
            {
              subject: `Your ${campaignInputs.mvpName} assessment results are ready...`,
              preview: "See how you scored compared to other businesses",
              body: `Hi [NAME],\n\nYour assessment results are in, and I have some exciting news to share...\n\nBased on your answers, you could save ${campaignInputs.mainBenefit} with the right automation system.\n\nHere's your personalized action plan...`
            }
          ]
        },
        social_media: {
          posts: [
            {
              platform: "LinkedIn",
              text: `🚀 Ready to transform your business?\n\n${campaignInputs.mvpName} helps ${campaignInputs.targetAudience} ${campaignInputs.mainBenefit.toLowerCase()}.\n\n✅ No technical skills needed\n✅ Results in 24 hours\n✅ 30-day guarantee\n\nTake the free assessment: [LINK]`,
              hashtags: ["#BusinessGrowth", "#Automation", "#Productivity"]
            },
            {
              platform: "Facebook",
              text: `Attention ${campaignInputs.targetAudience}! 🎯\n\nTired of spending hours on tasks that should take minutes?\n\n${campaignInputs.mvpName} automates your most time-consuming processes so you can focus on what matters most.\n\n💡 Start with our free assessment`,
              hashtags: ["#SmallBusiness", "#Entrepreneur", "#TimeManagement"]
            },
            {
              platform: "Twitter",
              text: `${campaignInputs.targetAudience}: Stop wasting time on manual tasks! 🕐\n\n${campaignInputs.mvpName} = ${campaignInputs.mainBenefit}\n\n✨ Free assessment\n🚀 Instant results\n💰 ${campaignInputs.pricePoint}\n\n[LINK]`,
              hashtags: ["#Automation", "#BusinessTools", "#Productivity"]
            }
          ]
        },
        ads_copy: {
          facebook_ads: [
            {
              headline: `${campaignInputs.mvpName} - ${campaignInputs.mainBenefit}`,
              primary_text: `Attention ${campaignInputs.targetAudience}: Stop wasting hours on manual tasks that could be automated in minutes.\n\n${campaignInputs.mvpName} has helped 2,000+ businesses save 10+ hours per week.\n\nStart your free assessment and see how much time you could save.`,
              cta: "Learn More",
              link_description: "Free assessment takes 2 minutes"
            }
          ],
          google_ads: [
            {
              headline_1: `${campaignInputs.mvpName} - ${campaignInputs.mainBenefit}`,
              headline_2: `Save 10+ Hours Per Week`,
              headline_3: `Free Assessment Available`,
              description_1: `Transform your business with automated workflows. Join 2,000+ ${campaignInputs.targetAudience} already saving time.`,
              description_2: `No technical skills required. Results in 24 hours. Try free for 7 days.`
            }
          ]
        }
      };

      return campaigns[selectedCampaign as keyof typeof campaigns];
    },
    onSuccess: (data) => {
      setGeneratedContent(data);
      setIsGenerating(false);
      toast({
        title: "🎯 Campaign Generated!",
        description: "Your marketing content is ready for review and customization.",
      });
    },
    onError: () => {
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your campaign. Please try again.",
        variant: "destructive",
      });
    }
  });

  const saveCampaignMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/marketing-campaigns", {
        userId: "demo-user-id",
        campaignType: selectedCampaign,
        inputs: campaignInputs,
        generatedContent,
        timestamp: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/marketing-campaigns"] });
      toast({
        title: "💾 Campaign Saved!",
        description: "Your marketing campaign has been saved and is ready to deploy.",
      });
    }
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "📋 Copied!",
      description: "Content copied to clipboard.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-bodigi-gradient text-white p-8 rounded-2xl shadow-bodigi">
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-xl">
            <Megaphone className="h-8 w-8 text-bodigi-gold" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Marketing Builder</h1>
            <p className="text-white/90 text-lg">AI-powered marketing campaigns tailored to your MVP</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {Object.entries(campaignTypes).map(([key, type]) => {
            const IconComponent = type.icon;
            return (
              <div key={key} className="bg-white/10 p-4 rounded-lg">
                <IconComponent className="h-6 w-6 text-bodigi-gold mb-2" />
                <h3 className="font-semibold mb-1">{type.title}</h3>
                <p className="text-sm text-white/80">{type.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {!selectedCampaign ? (
        // Campaign Type Selection
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(campaignTypes).map(([key, type]) => {
            const IconComponent = type.icon;
            return (
              <Card 
                key={key}
                className="cursor-pointer transition-all duration-200 hover:shadow-bodigi hover-lift border-2 border-gray-200 hover:border-bodigi-gold"
                onClick={() => setSelectedCampaign(key)}
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 ${type.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">{type.title}</h3>
                  <p className="text-gray-600 mb-4">{type.description}</p>
                  <Button className="bg-bodigi-gradient text-white hover:shadow-lg">
                    Create {type.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : !generatedContent ? (
        // Campaign Configuration
        <Card className="shadow-bodigi">
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-black">
                  Configure {campaignTypes[selectedCampaign as keyof typeof campaignTypes].title}
                </CardTitle>
                <p className="text-gray-600">Provide details to generate personalized marketing content</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSelectedCampaign("")}
              >
                Back to Selection
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-black">MVP/Product Name</Label>
                <Input 
                  placeholder="e.g., FlowBoost Pro, TaskMaster Elite"
                  value={campaignInputs.mvpName}
                  onChange={(e) => setCampaignInputs(prev => ({ ...prev, mvpName: e.target.value }))}
                  className="border-2 focus:border-bodigi-gold"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-black">Target Audience</Label>
                <Input 
                  placeholder="e.g., Small business owners, Freelancers"
                  value={campaignInputs.targetAudience}
                  onChange={(e) => setCampaignInputs(prev => ({ ...prev, targetAudience: e.target.value }))}
                  className="border-2 focus:border-bodigi-gold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-black">Main Benefit/Value Proposition</Label>
              <Input 
                placeholder="e.g., Save 10+ hours per week with automated workflows"
                value={campaignInputs.mainBenefit}
                onChange={(e) => setCampaignInputs(prev => ({ ...prev, mainBenefit: e.target.value }))}
                className="border-2 focus:border-bodigi-gold"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-black">Price Point</Label>
                <Input 
                  placeholder="e.g., $97/month, $297 one-time"
                  value={campaignInputs.pricePoint}
                  onChange={(e) => setCampaignInputs(prev => ({ ...prev, pricePoint: e.target.value }))}
                  className="border-2 focus:border-bodigi-gold"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-black">Urgency/Scarcity</Label>
                <Input 
                  placeholder="e.g., Limited time offer, Only 100 spots"
                  value={campaignInputs.urgency}
                  onChange={(e) => setCampaignInputs(prev => ({ ...prev, urgency: e.target.value }))}
                  className="border-2 focus:border-bodigi-gold"
                />
              </div>
            </div>

            <Button 
              onClick={() => generateCampaignMutation.mutate()}
              disabled={!campaignInputs.mvpName || !campaignInputs.targetAudience || !campaignInputs.mainBenefit || isGenerating}
              className="w-full h-12 bg-bodigi-gradient text-white font-bold text-lg rounded-xl hover:shadow-lg hover-lift"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                  Generating Campaign...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-5 w-5" />
                  Generate Marketing Campaign
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        // Generated Content Display
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-black">
                Generated {campaignTypes[selectedCampaign as keyof typeof campaignTypes].title}
              </h2>
              <p className="text-gray-600">Review, customize, and deploy your marketing content</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setGeneratedContent(null)}
              >
                Edit Inputs
              </Button>
              <Button 
                onClick={() => saveCampaignMutation.mutate()}
                className="bg-bodigi-gradient text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Campaign
              </Button>
            </div>
          </div>

          {selectedCampaign === 'landing_page' && (
            <Card className="shadow-bodigi">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle>Landing Page Content</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-semibold">Hero Headline</Label>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(generatedContent.heroSection.headline)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h1 className="text-2xl font-bold">{generatedContent.heroSection.headline}</h1>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="font-semibold">Subtitle</Label>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(generatedContent.heroSection.subtitle)}>
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-lg text-gray-600">{generatedContent.heroSection.subtitle}</p>
                  </div>
                </div>

                <div>
                  <Label className="font-semibold mb-2 block">Key Benefits</Label>
                  <div className="space-y-2">
                    {generatedContent.benefits.map((benefit: string, idx: number) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span>✅ {benefit}</span>
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(benefit)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {selectedCampaign === 'email_sequence' && (
            <div className="space-y-4">
              <Card className="shadow-bodigi">
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle>Email Subject Lines</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {generatedContent.subject_lines.map((subject: string, idx: number) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="font-medium">📧 {subject}</span>
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(subject)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {selectedCampaign === 'social_media' && (
            <div className="space-y-4">
              {generatedContent.posts.map((post: any, idx: number) => (
                <Card key={idx} className="shadow-bodigi">
                  <CardHeader className="bg-gray-50 border-b">
                    <div className="flex items-center gap-2">
                      {post.platform === 'LinkedIn' && <div className="w-6 h-6 bg-blue-600 rounded"></div>}
                      {post.platform === 'Facebook' && <div className="w-6 h-6 bg-blue-800 rounded"></div>}
                      {post.platform === 'Twitter' && <div className="w-6 h-6 bg-blue-400 rounded"></div>}
                      <CardTitle>{post.platform} Post</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <p className="whitespace-pre-line">{post.text}</p>
                      <div className="flex gap-2 mt-3">
                        {post.hashtags.map((tag: string, tagIdx: number) => (
                          <Badge key={tagIdx} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(post.text + '\n\n' + post.hashtags.join(' '))}>
                      <Copy className="mr-2 h-3 w-3" />
                      Copy Post
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {selectedCampaign === 'ads_copy' && (
            <Tabs defaultValue="facebook" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="facebook">Facebook Ads</TabsTrigger>
                <TabsTrigger value="google">Google Ads</TabsTrigger>
              </TabsList>
              
              <TabsContent value="facebook">
                {generatedContent.facebook_ads.map((ad: any, idx: number) => (
                  <Card key={idx} className="shadow-bodigi">
                    <CardHeader className="bg-gray-50 border-b">
                      <CardTitle>Facebook Ad Copy #{idx + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <Label className="font-semibold">Headline</Label>
                        <div className="bg-gray-50 p-3 rounded-lg mt-1">
                          <p className="font-semibold">{ad.headline}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="font-semibold">Primary Text</Label>
                        <div className="bg-gray-50 p-3 rounded-lg mt-1">
                          <p className="whitespace-pre-line">{ad.primary_text}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge>{ad.cta}</Badge>
                        <Badge variant="outline">{ad.link_description}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
              
              <TabsContent value="google">
                {generatedContent.google_ads.map((ad: any, idx: number) => (
                  <Card key={idx} className="shadow-bodigi">
                    <CardHeader className="bg-gray-50 border-b">
                      <CardTitle>Google Ad Copy #{idx + 1}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <Label className="font-semibold">Headlines</Label>
                        <div className="space-y-2 mt-1">
                          <div className="bg-gray-50 p-2 rounded">{ad.headline_1}</div>
                          <div className="bg-gray-50 p-2 rounded">{ad.headline_2}</div>
                          <div className="bg-gray-50 p-2 rounded">{ad.headline_3}</div>
                        </div>
                      </div>
                      <div>
                        <Label className="font-semibold">Descriptions</Label>
                        <div className="space-y-2 mt-1">
                          <div className="bg-gray-50 p-2 rounded">{ad.description_1}</div>
                          <div className="bg-gray-50 p-2 rounded">{ad.description_2}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          )}
        </div>
      )}
    </div>
  );
}
