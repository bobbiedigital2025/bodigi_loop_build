import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle, 
  Gift, 
  Star, 
  Download, 
  Trophy, 
  Zap, 
  Target, 
  Share2, 
  Eye,
  Play,
  ArrowRight,
  Sparkles,
  Crown,
  BookOpen,
  DollarSign
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Enhanced question structure with AI-generated content based on niche
const generateLearnEarnQuestions = (niche: string) => {
  const questionSets = {
    "Business Growth": [
      {
        id: 1,
        setNumber: 1,
        title: "Foundation Assessment",
        questions: [
          {
            questionNumber: 1,
            question: "What's your biggest challenge in scaling your business?",
            options: [
              { id: "a", text: "Finding qualified leads consistently", value: "lead-generation" },
              { id: "b", text: "Converting prospects into paying customers", value: "conversion" },
              { id: "c", text: "Retaining customers long-term", value: "retention" }
            ],
            reward: {
              type: "guide",
              title: "Lead Generation Masterclass PDF",
              description: "37-page guide with proven strategies",
              value: "$97"
            }
          },
          {
            questionNumber: 2,
            question: "How much time do you currently spend on repetitive marketing tasks?",
            options: [
              { id: "a", text: "More than 10 hours per week", value: "high-time" },
              { id: "b", text: "5-10 hours per week", value: "medium-time" },
              { id: "c", text: "Less than 5 hours per week", value: "low-time" }
            ],
            reward: {
              type: "bonus",
              title: "Automation Toolkit Bundle",
              description: "Save 15+ hours weekly with these templates",
              value: "$147"
            }
          },
          {
            questionNumber: 3,
            question: "What's your current monthly revenue goal?",
            options: [
              { id: "a", text: "$10K - $25K per month", value: "starter" },
              { id: "b", text: "$25K - $100K per month", value: "growth" },
              { id: "c", text: "$100K+ per month", value: "scale" }
            ],
            reward: {
              type: "course",
              title: "Revenue Acceleration Workshop",
              description: "90-minute strategy session recording",
              value: "$197"
            }
          }
        ],
        mvpOffer: {
          title: "Business Growth Accelerator",
          description: "Complete system for consistent lead generation and conversion",
          price: "$97/month",
          features: ["Automated lead funnels", "Email sequences", "Analytics dashboard"]
        }
      }
    ]
  };

  return questionSets["Business Growth"]; // Default for demo
};

export default function LearnEarnLoop() {
  const { toast } = useToast();
  const [setupMode, setSetupMode] = useState(true);
  const [loopConfig, setLoopConfig] = useState({
    niche: "",
    targetAudience: "",
    mainProblem: "",
    mvpTitle: "",
    mvpPrice: "",
    leadMagnet: ""
  });

  // Generated loop state
  const [generatedLoop, setGeneratedLoop] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Quiz taking state
  const [contactInfo, setContactInfo] = useState({ name: "", email: "" });
  const [hasStarted, setHasStarted] = useState(false);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [userAnswers, setUserAnswers] = useState<any[]>([]);
  const [completedRewards, setCompletedRewards] = useState<string[]>([]);
  const [showMVPOffer, setShowMVPOffer] = useState(false);

  const generateLoopMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const questionSets = generateLearnEarnQuestions(loopConfig.niche);
      
      return {
        id: `loop-${Date.now()}`,
        title: `${loopConfig.niche} Learn & Earn Loop™`,
        description: `Gamified assessment that educates ${loopConfig.targetAudience} while qualifying leads`,
        questionSets,
        shareableUrl: `https://loop.bodigi.com/${loopConfig.niche.toLowerCase().replace(/\s+/g, '-')}-assessment`,
        analytics: {
          completionRate: 0,
          leadConversion: 0,
          avgTimeSpent: 0
        },
        config: loopConfig
      };
    },
    onSuccess: (data) => {
      setGeneratedLoop(data);
      setIsGenerating(false);
      setSetupMode(false);
      toast({
        title: "🎮 Learn & Earn Loop Generated!",
        description: "Your gamified marketing assessment is ready to capture leads.",
      });
    },
    onError: () => {
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: "There was an error generating your loop. Please try again.",
        variant: "destructive",
      });
    }
  });

  const submitAnswerMutation = useMutation({
    mutationFn: async (answerData: any) => {
      return apiRequest("POST", "/api/loop-answers", {
        loopId: generatedLoop.id,
        ...answerData,
        timestamp: new Date().toISOString()
      });
    },
    onSuccess: () => {
      const currentSet = generatedLoop.questionSets[currentSetIndex];
      const currentQuestion = currentSet.questions[currentQuestionIndex];
      
      // Add reward to completed list
      setCompletedRewards(prev => [...prev, `${currentSetIndex}-${currentQuestionIndex}`]);
      
      // Progress to next question or show MVP offer
      if (currentQuestionIndex < currentSet.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else if (currentSetIndex < generatedLoop.questionSets.length - 1) {
        setCurrentSetIndex(prev => prev + 1);
        setCurrentQuestionIndex(0);
      } else {
        setShowMVPOffer(true);
      }
      
      setSelectedAnswer("");
      
      toast({
        title: "🎁 Reward Unlocked!",
        description: `You've earned: ${currentQuestion.reward.title}`,
      });
    }
  });

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) return;
    
    const answerData = {
      contactInfo,
      setIndex: currentSetIndex,
      questionIndex: currentQuestionIndex,
      selectedAnswer,
      userAnswers: [...userAnswers, { 
        question: currentQuestionIndex, 
        answer: selectedAnswer,
        timestamp: new Date().toISOString()
      }]
    };
    
    setUserAnswers(answerData.userAnswers);
    submitAnswerMutation.mutate(answerData);
  };

  const shareLoop = () => {
    navigator.clipboard.writeText(generatedLoop.shareableUrl);
    toast({
      title: "🔗 Link Copied!",
      description: "Share your Learn & Earn Loop to start capturing leads.",
    });
  };

  if (setupMode) {
    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-bodigi-gradient text-white p-8 rounded-2xl shadow-bodigi">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Target className="h-8 w-8 text-bodigi-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Learn & Earn Engagement Loop™</h1>
              <p className="text-white/90 text-lg">Gamified marketing that educates prospects while qualifying leads</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🎯 Lead Qualification</h3>
              <p className="text-sm text-white/80">5 strategic questions per set</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">🎁 Instant Rewards</h3>
              <p className="text-sm text-white/80">Valuable prizes for each answer</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">💰 Soft MVP Sells</h3>
              <p className="text-sm text-white/80">Natural product introductions</p>
            </div>
          </div>
        </div>

        {/* Setup Form */}
        <Card className="shadow-bodigi">
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="text-xl font-bold text-black flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-bodigi-gold" />
              Configure Your Loop
            </CardTitle>
            <p className="text-gray-600">Set up your gamified marketing assessment</p>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-black">Business Niche</Label>
                <Input 
                  placeholder="e.g., Business Growth, Health & Wellness"
                  value={loopConfig.niche}
                  onChange={(e) => setLoopConfig(prev => ({ ...prev, niche: e.target.value }))}
                  className="border-2 focus:border-bodigi-gold"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-black">Target Audience</Label>
                <Input 
                  placeholder="e.g., Small business owners, Entrepreneurs"
                  value={loopConfig.targetAudience}
                  onChange={(e) => setLoopConfig(prev => ({ ...prev, targetAudience: e.target.value }))}
                  className="border-2 focus:border-bodigi-gold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-black">Main Problem You Solve</Label>
              <Textarea
                placeholder="What's the primary challenge your business helps solve?"
                value={loopConfig.mainProblem}
                onChange={(e) => setLoopConfig(prev => ({ ...prev, mainProblem: e.target.value }))}
                className="border-2 focus:border-bodigi-gold min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-black">MVP/Product Title</Label>
                <Input 
                  placeholder="What you'll soft-sell in the loop"
                  value={loopConfig.mvpTitle}
                  onChange={(e) => setLoopConfig(prev => ({ ...prev, mvpTitle: e.target.value }))}
                  className="border-2 focus:border-bodigi-gold"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-black">Product Price</Label>
                <Input 
                  placeholder="e.g., $97/month or $297 one-time"
                  value={loopConfig.mvpPrice}
                  onChange={(e) => setLoopConfig(prev => ({ ...prev, mvpPrice: e.target.value }))}
                  className="border-2 focus:border-bodigi-gold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-black">Lead Magnet Theme</Label>
              <Input 
                placeholder="e.g., Ultimate Guide, Toolkit, Masterclass"
                value={loopConfig.leadMagnet}
                onChange={(e) => setLoopConfig(prev => ({ ...prev, leadMagnet: e.target.value }))}
                className="border-2 focus:border-bodigi-gold"
              />
            </div>

            <Button 
              onClick={() => generateLoopMutation.mutate()}
              disabled={!loopConfig.niche || !loopConfig.targetAudience || !loopConfig.mainProblem || isGenerating}
              className="w-full h-12 bg-bodigi-gradient text-white font-bold text-lg rounded-xl hover:shadow-lg hover-lift"
            >
              {isGenerating ? (
                <>
                  <Target className="mr-2 h-5 w-5 animate-spin" />
                  Generating Your Loop...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-5 w-5" />
                  Generate Learn & Earn Loop
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Quiz Interface (when taking the actual quiz)
  if (hasStarted && generatedLoop) {
    const currentSet = generatedLoop.questionSets[currentSetIndex];
    const currentQuestion = currentSet.questions[currentQuestionIndex];
    const totalQuestions = generatedLoop.questionSets.reduce((total: number, set: any) => total + set.questions.length, 0);
    const currentQuestionNum = currentSetIndex * 3 + currentQuestionIndex + 1;
    const progress = (currentQuestionNum / totalQuestions) * 100;

    if (showMVPOffer) {
      return (
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-bodigi overflow-hidden">
            <div className="bg-bodigi-gradient text-white p-8 text-center">
              <Trophy className="h-16 w-16 text-bodigi-gold mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Congratulations, {contactInfo.name}!</h1>
              <p className="text-xl text-white/90">You've completed the assessment and earned amazing rewards!</p>
            </div>
            
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-black mb-4">Your Rewards Summary</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {completedRewards.map((rewardId, idx) => {
                    const [setIdx, qIdx] = rewardId.split('-').map(Number);
                    const reward = generatedLoop.questionSets[setIdx].questions[qIdx].reward;
                    return (
                      <div key={rewardId} className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <Gift className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-sm">{reward.title}</h3>
                        <Badge className="bg-green-500 text-white mt-2">{reward.value}</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-bodigi-gradient text-white p-6 rounded-xl text-center mb-6">
                <Crown className="h-12 w-12 text-bodigi-gold mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Special Offer Just for You!</h3>
                <h4 className="text-xl font-semibold text-bodigi-gold mb-2">{currentSet.mvpOffer.title}</h4>
                <p className="text-lg mb-4">{currentSet.mvpOffer.description}</p>
                <div className="text-3xl font-bold mb-4">{currentSet.mvpOffer.price}</div>
                <ul className="text-left max-w-md mx-auto mb-6">
                  {currentSet.mvpOffer.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-bodigi-gold" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="bg-bodigi-gold text-black hover:bg-yellow-400 font-bold text-lg px-8 py-3">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Get Instant Access
                </Button>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-4">Your rewards have been sent to {contactInfo.email}</p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Start New Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-bodigi">
          <CardHeader className="bg-bodigi-gradient text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">
                  {currentSet.title} - Question {currentQuestion.questionNumber}
                </CardTitle>
                <p className="text-white/90">Progress: {Math.round(progress)}% Complete</p>
              </div>
              <div className="text-right">
                <div className="bg-white/20 p-3 rounded-lg">
                  <Gift className="h-6 w-6 text-bodigi-gold" />
                </div>
              </div>
            </div>
            <Progress value={progress} className="mt-4 bg-white/20" />
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-black mb-6">{currentQuestion.question}</h2>
              
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                <div className="space-y-4">
                  {currentQuestion.options.map((option) => (
                    <div key={option.id} className="flex items-start space-x-3">
                      <RadioGroupItem value={option.value} id={option.id} className="mt-1" />
                      <Label htmlFor={option.id} className="cursor-pointer flex-1">
                        <div className="p-4 border-2 border-gray-200 rounded-lg hover:border-bodigi-gold transition-colors">
                          <p className="font-semibold mb-1">{option.text}</p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Gift className="h-6 w-6 text-yellow-600" />
                <h3 className="font-bold text-lg">Reward for This Question</h3>
              </div>
              <h4 className="font-semibold text-lg text-black">{currentQuestion.reward.title}</h4>
              <p className="text-gray-600 mb-2">{currentQuestion.reward.description}</p>
              <Badge className="bg-yellow-500 text-white">{currentQuestion.reward.value} Value</Badge>
            </div>

            <Button 
              onClick={handleAnswerSubmit}
              disabled={!selectedAnswer || submitAnswerMutation.isPending}
              className="w-full h-12 bg-bodigi-gradient text-white font-bold text-lg rounded-xl hover:shadow-lg hover-lift"
            >
              {submitAnswerMutation.isPending ? (
                "Unlocking Reward..."
              ) : (
                <>
                  Unlock My Reward & Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loop Management Interface
  return (
    <div className="space-y-8">
      {/* Generated Loop Preview */}
      <Card className="shadow-bodigi">
        <CardHeader className="bg-bodigi-gradient text-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">{generatedLoop.title}</CardTitle>
              <p className="text-white/90 text-lg">{generatedLoop.description}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={shareLoop}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Loop
              </Button>
              <Button 
                onClick={() => setHasStarted(true)}
                className="bg-bodigi-gold text-black hover:bg-yellow-400 font-semibold"
              >
                <Play className="mr-2 h-4 w-4" />
                Preview Quiz
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-bold text-lg">0</h3>
              <p className="text-gray-600">Total Views</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-bold text-lg">0%</h3>
              <p className="text-gray-600">Completion Rate</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Crown className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-bold text-lg">0</h3>
              <p className="text-gray-600">Leads Generated</p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h3 className="font-bold text-lg mb-2">Shareable URL</h3>
            <div className="flex items-center gap-2">
              <Input 
                value={generatedLoop.shareableUrl} 
                readOnly 
                className="bg-white"
              />
              <Button onClick={shareLoop} variant="outline">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Quiz Start */}
      <Card className="shadow-bodigi">
        <CardHeader>
          <CardTitle>Test Your Loop</CardTitle>
          <p className="text-gray-600">Experience the quiz from your customer's perspective</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="max-w-md mx-auto space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input 
                placeholder="Enter your name"
                value={contactInfo.name}
                onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input 
                type="email"
                placeholder="Enter your email"
                value={contactInfo.email}
                onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <Button 
              onClick={() => setHasStarted(true)}
              disabled={!contactInfo.name || !contactInfo.email}
              className="w-full bg-bodigi-gradient text-white font-bold hover-lift"
            >
              <Play className="mr-2 h-4 w-4" />
              Start Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
  
  const question = mockQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / 15) * 100; // 5 sets × 3 questions = 15 total

  const startQuizMutation = useMutation({
    mutationFn: async () => {
      if (!contactInfo.name || !contactInfo.email) {
        throw new Error("Please enter your name and email");
      }
      
      // Create contact
      const contactResponse = await apiRequest("POST", "/api/contacts", {
        name: contactInfo.name,
        email: contactInfo.email,
        ownerId: "demo-user-id",
        entryType: "learn_and_earn",
        status: "lead"
      });
      const contact = await contactResponse.json();
      
      // Create quiz session
      await apiRequest("POST", "/api/quiz-sessions", {
        contactId: contact.id,
        mvpId: "demo-mvp-id",
        currentSet: 1,
        currentQuestion: 1
      });
      
      return contact;
    },
    onSuccess: () => {
      setHasStarted(true);
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({
        title: "Quiz Started!",
        description: "Welcome to your personalized learning experience.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const submitAnswerMutation = useMutation({
    mutationFn: async () => {
      if (!selectedAnswer) {
        throw new Error("Please select an answer");
      }
      
      // Generate PDF reward
      const pdfResponse = await apiRequest("GET", `/api/generate-pdf/${question.reward.type}?mvpName=FlowBoost Pro&contactName=${contactInfo.name}`);
      const pdfReward = await pdfResponse.json();
      
      return pdfReward;
    },
    onSuccess: (pdfData) => {
      setCompletedRewards(prev => [...prev, question.reward.title]);
      setSelectedAnswer("");
      toast({
        title: "Reward Unlocked!",
        description: `You've earned: ${question.reward.title}`,
      });
      
      // Move to next question (in real app, would check if more questions available)
      if (currentQuestion < mockQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      }
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const downloadPDF = (rewardTitle: string) => {
    // In real app, would download actual PDF
    toast({
      title: "Download Started",
      description: `Downloading ${rewardTitle}...`,
    });
  };

  if (!hasStarted) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-xl font-semibold text-slate-900">Learn & Earn Loop Builder</CardTitle>
          <p className="text-sm text-slate-600">Create personalized quiz experiences that convert to sales</p>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="max-w-md mx-auto">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Get Started with Your Personalized Quiz</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name"
                    placeholder="Your name"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                
                <Button 
                  onClick={() => startQuizMutation.mutate()}
                  disabled={startQuizMutation.isPending || !contactInfo.name || !contactInfo.email}
                  className="w-full"
                >
                  {startQuizMutation.isPending ? "Starting..." : "Start My Personalized Quiz"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-slate-200">
        <CardTitle className="text-xl font-semibold text-slate-900">Learn & Earn Loop Builder</CardTitle>
        <p className="text-sm text-slate-600">Create personalized quiz experiences that convert to sales</p>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Quiz Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-900">Quiz Progress</h3>
            <span className="text-sm text-slate-600">Set 1 of 5 | Question 1 of 3</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
        
        {/* Current Question */}
        <div className="bg-slate-50 rounded-lg p-6 mb-6">
          <div className="mb-4">
            <span className="inline-block bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full mb-3">
              FlowBoost Pro Question
            </span>
            <h4 className="text-xl font-semibold text-slate-900">
              {question.question}
            </h4>
          </div>
          
          <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
            {question.options.map((option) => (
              <div key={option.id} className="flex items-start space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-white cursor-pointer transition-colors">
                <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={option.id} className="font-medium text-slate-900 cursor-pointer">
                    {option.text}
                  </Label>
                  <div className="text-sm text-slate-600 mt-1">{option.description}</div>
                </div>
              </div>
            ))}
          </RadioGroup>
          
          <Button 
            onClick={() => submitAnswerMutation.mutate()}
            disabled={submitAnswerMutation.isPending || !selectedAnswer}
            className="mt-6"
          >
            {submitAnswerMutation.isPending ? "Submitting..." : "Submit Answer & Get Reward"}
          </Button>
        </div>
        
        {/* Rewards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Completed Rewards */}
          <div className="bg-success/5 border border-success/20 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <CheckCircle className="text-success mr-2" size={20} />
              <h4 className="font-semibold text-success">Completed Rewards</h4>
            </div>
            <div className="space-y-2 text-sm">
              {completedRewards.map((reward, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-success">{reward}</span>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => downloadPDF(reward)}
                    className="text-success hover:text-success p-1"
                  >
                    <Download size={16} />
                  </Button>
                </div>
              ))}
              {completedRewards.length === 0 && (
                <div className="text-success/60">No rewards yet</div>
              )}
            </div>
          </div>
          
          {/* Current Reward */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Gift className="text-primary mr-2" size={20} />
              <h4 className="font-semibold text-primary">Current Reward</h4>
            </div>
            <div className="text-sm text-primary">
              <div className="font-medium">{question.reward.title}</div>
              <div>{question.reward.description}</div>
            </div>
          </div>
          
          {/* Next Bonus */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <Star className="text-amber-600 mr-2" size={20} />
              <h4 className="font-semibold text-amber-900">Bonus Feature</h4>
            </div>
            <div className="text-sm text-amber-700">
              <div className="font-medium">AI Analytics Dashboard</div>
              <div>Unlock by purchasing MVP</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
