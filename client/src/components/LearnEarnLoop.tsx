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
  DollarSign,
  AlertTriangle,
  MessageSquare,
  Brain,
  Rocket,
  Shield
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Types for PDR compliance
type RewardType = {
  type: 'pdf' | 'bonus_feature';
  title: string;
  description: string;
  downloadUrl?: string;
  featureId?: string;
  isLastChance?: boolean;
};

type QuestionType = {
  questionNumber: number;
  question: string;
  options: Array<{
    id: string;
    text: string;
    value: string;
  }>;
  reward: RewardType;
};

type QuestionSetType = {
  setNumber: number;
  title: string;
  questions: QuestionType[];
};

type QuizProgressType = {
  completedSets: number[];
  earnedRewards: RewardType[];
  answeredQuestions: Array<{
    set: number;
    question: number;
    answer: string;
  }>;
};

// PDR Compliant: 5 sets of 3 MVP-specific questions
const createMVPQuestionSets = (mvpName: string, mvpFeatures: string[]): QuestionSetType[] => {
  return [
    {
      setNumber: 1,
      title: "Foundation Discovery",
      questions: [
        {
          questionNumber: 1,
          question: `What's your biggest challenge that ${mvpName} could solve?`,
          options: [
            { id: "a", text: "Time management and productivity", value: "productivity" },
            { id: "b", text: "Lead generation and customer acquisition", value: "leads" },
            { id: "c", text: "Workflow automation and efficiency", value: "automation" }
          ],
          reward: {
            type: "pdf",
            title: `${mvpName} Quick Start Guide`,
            description: "Essential strategies to get started immediately",
            downloadUrl: `/api/rewards/pdf/quickstart-${mvpName.toLowerCase().replace(/\s+/g, '-')}`
          }
        },
        {
          questionNumber: 2,
          question: `How much time do you spend daily on tasks ${mvpName} could automate?`,
          options: [
            { id: "a", text: "3+ hours per day", value: "high" },
            { id: "b", text: "1-3 hours per day", value: "medium" },
            { id: "c", text: "Less than 1 hour per day", value: "low" }
          ],
          reward: {
            type: "pdf",
            title: "Time Optimization Blueprint",
            description: "Proven framework to reclaim 10+ hours weekly",
            downloadUrl: `/api/rewards/pdf/time-optimization`
          }
        },
        {
          questionNumber: 3,
          question: `What's your expected ROI from implementing ${mvpName}?`,
          options: [
            { id: "a", text: "2-3x return within 90 days", value: "conservative" },
            { id: "b", text: "5-10x return within 6 months", value: "aggressive" },
            { id: "c", text: "Break-even within 30 days", value: "immediate" }
          ],
          reward: {
            type: "bonus_feature",
            title: mvpFeatures[0] || "Advanced Analytics Dashboard",
            description: "Unlock this premium feature worth $97/month",
            featureId: "feature_1"
          }
        }
      ]
    },
    {
      setNumber: 2,
      title: "Strategy Alignment",
      questions: [
        {
          questionNumber: 1,
          question: `Which aspect of ${mvpName} interests you most?`,
          options: [
            { id: "a", text: "Automated workflows and processes", value: "automation" },
            { id: "b", text: "Data insights and analytics", value: "analytics" },
            { id: "c", text: "Integration with existing tools", value: "integration" }
          ],
          reward: {
            type: "pdf",
            title: "Advanced Strategy Guide",
            description: "Deep-dive tactics for maximum results",
            downloadUrl: `/api/rewards/pdf/advanced-strategy`
          }
        },
        {
          questionNumber: 2,
          question: `What's your current tech stack proficiency level?`,
          options: [
            { id: "a", text: "Beginner - need guidance", value: "beginner" },
            { id: "b", text: "Intermediate - can follow tutorials", value: "intermediate" },
            { id: "c", text: "Advanced - prefer customization", value: "advanced" }
          ],
          reward: {
            type: "pdf",
            title: "Implementation Roadmap",
            description: "Step-by-step setup guide tailored to your level",
            downloadUrl: `/api/rewards/pdf/implementation-roadmap`
          }
        },
        {
          questionNumber: 3,
          question: `How quickly do you need to see results from ${mvpName}?`,
          options: [
            { id: "a", text: "Within the first week", value: "immediate" },
            { id: "b", text: "Within the first month", value: "short_term" },
            { id: "c", text: "Within 3 months", value: "long_term" }
          ],
          reward: {
            type: "bonus_feature",
            title: mvpFeatures[1] || "Priority Support Channel",
            description: "Get direct access to our expert team",
            featureId: "feature_2"
          }
        }
      ]
    },
    {
      setNumber: 3,
      title: "Implementation Focus",
      questions: [
        {
          questionNumber: 1,
          question: `What's your biggest concern about adopting ${mvpName}?`,
          options: [
            { id: "a", text: "Learning curve and complexity", value: "complexity" },
            { id: "b", text: "Integration with current systems", value: "integration" },
            { id: "c", text: "Time investment required", value: "time" }
          ],
          reward: {
            type: "pdf",
            title: "Risk Mitigation Guide",
            description: "How to minimize challenges and maximize success",
            downloadUrl: `/api/rewards/pdf/risk-mitigation`
          }
        },
        {
          questionNumber: 2,
          question: `Which success metric matters most to you?`,
          options: [
            { id: "a", text: "Time saved per week", value: "time_saved" },
            { id: "b", text: "Revenue increase", value: "revenue" },
            { id: "c", text: "Stress reduction", value: "stress" }
          ],
          reward: {
            type: "pdf",
            title: "Success Metrics Tracker",
            description: "Templates to measure and optimize your results",
            downloadUrl: `/api/rewards/pdf/success-metrics`
          }
        },
        {
          questionNumber: 3,
          question: `How important is ongoing support and training?`,
          options: [
            { id: "a", text: "Critical - I need hands-on guidance", value: "critical" },
            { id: "b", text: "Important - prefer self-service resources", value: "moderate" },
            { id: "c", text: "Not important - I'm self-sufficient", value: "minimal" }
          ],
          reward: {
            type: "bonus_feature",
            title: mvpFeatures[2] || "White-Glove Onboarding",
            description: "Personal setup session with our specialists",
            featureId: "feature_3"
          }
        }
      ]
    },
    {
      setNumber: 4,
      title: "Optimization Strategy",
      questions: [
        {
          questionNumber: 1,
          question: `What's your target growth rate with ${mvpName}?`,
          options: [
            { id: "a", text: "50% improvement in 90 days", value: "moderate" },
            { id: "b", text: "100% improvement in 6 months", value: "aggressive" },
            { id: "c", text: "200%+ improvement in 1 year", value: "exponential" }
          ],
          reward: {
            type: "pdf",
            title: "Growth Acceleration Playbook",
            description: "Advanced strategies for rapid scaling",
            downloadUrl: `/api/rewards/pdf/growth-acceleration`
          }
        },
        {
          questionNumber: 2,
          question: `Which advanced feature would be most valuable?`,
          options: [
            { id: "a", text: "AI-powered insights and recommendations", value: "ai_insights" },
            { id: "b", text: "Custom automation workflows", value: "custom_automation" },
            { id: "c", text: "Advanced reporting and analytics", value: "advanced_analytics" }
          ],
          reward: {
            type: "pdf",
            title: "Advanced Features Guide",
            description: "Unlock the full potential of premium capabilities",
            downloadUrl: `/api/rewards/pdf/advanced-features`
          }
        },
        {
          questionNumber: 3,
          question: `How do you prefer to scale your operations?`,
          options: [
            { id: "a", text: "Gradual, sustainable growth", value: "sustainable" },
            { id: "b", text: "Rapid expansion with calculated risks", value: "rapid" },
            { id: "c", text: "Conservative approach with proven methods", value: "conservative" }
          ],
          reward: {
            type: "bonus_feature",
            title: mvpFeatures[3] || "Enterprise Scaling Suite",
            description: "Tools designed for high-growth scenarios",
            featureId: "feature_4"
          }
        }
      ]
    },
    {
      setNumber: 5,
      title: "Final Mastery & Last Chance",
      questions: [
        {
          questionNumber: 1,
          question: `What would prevent you from achieving 10x ROI with ${mvpName}?`,
          options: [
            { id: "a", text: "Lack of consistent implementation", value: "consistency" },
            { id: "b", text: "Insufficient market knowledge", value: "knowledge" },
            { id: "c", text: "Limited budget for optimization", value: "budget" }
          ],
          reward: {
            type: "pdf",
            title: "10x ROI Blueprint",
            description: "Case studies and exact frameworks for exponential returns",
            downloadUrl: `/api/rewards/pdf/10x-roi-blueprint`
          }
        },
        {
          questionNumber: 2,
          question: `If you could wave a magic wand, what would be your ideal outcome?`,
          options: [
            { id: "a", text: "Complete business automation", value: "automation" },
            { id: "b", text: "10x revenue within 12 months", value: "revenue" },
            { id: "c", text: "Freedom to focus on strategy only", value: "freedom" }
          ],
          reward: {
            type: "pdf",
            title: "Ultimate Success Roadmap",
            description: "The complete path to achieving your ideal outcome",
            downloadUrl: `/api/rewards/pdf/ultimate-success`
          }
        },
        {
          questionNumber: 3,
          question: `This is your LAST CHANCE to unlock all bonuses. Are you ready to commit?`,
          options: [
            { id: "a", text: "Yes! I'm ready to transform my business", value: "commit" },
            { id: "b", text: "I need more information first", value: "hesitant" },
            { id: "c", text: "No, I'll continue without the bonuses", value: "decline" }
          ],
          reward: {
            type: "bonus_feature",
            title: mvpFeatures[4] || "Lifetime VIP Access",
            description: "⚠️ WARNING: This offer expires after this question!",
            featureId: "feature_5",
            isLastChance: true
          }
        }
      ]
    }
  ];
};

export default function LearnEarnLoop() {
  const { toast } = useToast();
  
  // Contact capture state (PDR: stored with entry_type: 'learn_and_earn')
  const [contactInfo, setContactInfo] = useState({
    name: "",
    email: ""
  });
  const [isContactCaptured, setIsContactCaptured] = useState(false);
  
  // Quiz state
  const [currentSet, setCurrentSet] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [quizProgress, setQuizProgress] = useState<QuizProgressType>({
    completedSets: [],
    earnedRewards: [],
    answeredQuestions: []
  });
  
  // MVP selection (with 5 paid features per PDR)
  const [selectedMVP, setSelectedMVP] = useState({
    name: "Business Growth Accelerator",
    features: [
      "Advanced Analytics Dashboard",
      "Priority Support Channel", 
      "White-Glove Onboarding",
      "Enterprise Scaling Suite",
      "Lifetime VIP Access"
    ]
  });
  
  // State management
  const [showMVPOffer, setShowMVPOffer] = useState(false);
  const [showBonusWarning, setShowBonusWarning] = useState(false);
  const [showAuraChat, setShowAuraChat] = useState(false);
  const [auraMessage, setAuraMessage] = useState("");
  
  const questionSets = createMVPQuestionSets(selectedMVP.name, selectedMVP.features);
  const currentQuestionSet = questionSets[currentSet - 1];
  const currentQuestionData = currentQuestionSet?.questions[currentQuestion - 1];
  
  // Calculate progress (5 sets × 3 questions = 15 total)
  const totalQuestions = 15;
  const completedQuestions = ((currentSet - 1) * 3) + (currentQuestion - 1);
  const progressPercentage = (completedQuestions / totalQuestions) * 100;

  // Contact capture mutation (PDR: stored with entry_type: 'learn_and_earn')
  const captureContactMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/contacts", {
        name: contactInfo.name,
        email: contactInfo.email,
        ownerId: "demo-user-id", // In real app, get from auth
        entryType: "learn_and_earn",
        status: "lead",
        mvpId: selectedMVP.name,
        tags: ["quiz_participant"]
      });
    },
    onSuccess: () => {
      setIsContactCaptured(true);
      toast({
        title: "🎯 Welcome to the Learn & Earn Loop!",
        description: "Let's discover the perfect rewards for you.",
      });
    }
  });

  // Answer submission and reward processing
  const submitAnswerMutation = useMutation({
    mutationFn: async (answer: string) => {
      // Store answer and process reward (PDR compliant)
      return apiRequest("POST", "/api/quiz/answer", {
        contactEmail: contactInfo.email,
        setNumber: currentSet,
        questionNumber: currentQuestion,
        answer: answer,
        reward: currentQuestionData?.reward
      });
    },
    onSuccess: (data) => {
      // Add reward to earned rewards
      if (currentQuestionData?.reward) {
        setQuizProgress(prev => ({
          ...prev,
          earnedRewards: [...prev.earnedRewards, currentQuestionData.reward],
          answeredQuestions: [...prev.answeredQuestions, {
            set: currentSet,
            question: currentQuestion,
            answer: selectedAnswer
          }]
        }));
        
        // Show reward notification
        toast({
          title: `🎁 Reward Unlocked: ${currentQuestionData.reward.title}`,
          description: currentQuestionData.reward.description,
        });
      }
      
      // Move to next question or show MVP offer
      if (currentQuestion === 3) {
        // End of set - show MVP offer
        setShowMVPOffer(true);
        
        // Check if this is the final set
        if (currentSet === 5 && currentQuestion === 3) {
          setShowBonusWarning(true);
        }
      } else {
        // Move to next question
        setCurrentQuestion(prev => prev + 1);
      }
      
      setSelectedAnswer("");
    }
  });

  // MVP purchase handler (PDR: customer conversion)
  const handleMVPPurchase = () => {
    // Store as customer in PDR system
    apiRequest("POST", "/api/contacts", {
      name: contactInfo.name,
      email: contactInfo.email,
      ownerId: "demo-user-id",
      entryType: "mvp_checkout",
      status: "customer",
      mvpId: selectedMVP.name
    });
    
    // Redirect to checkout with bonus features applied
    window.location.href = `/checkout?mvp=${selectedMVP.name}&bonuses=${quizProgress.earnedRewards.filter(r => r.type === 'bonus_feature').map(r => r.featureId).join(',')}`;
  };

  // Decline MVP offer - move to next set (or final warning)
  const handleDeclineMVP = () => {
    setShowMVPOffer(false);
    
    if (currentSet === 5) {
      // Final decline - show Aura chat (PDR requirement)
      setShowAuraChat(true);
      setAuraMessage("I understand you're not ready to purchase yet. However, I must warn you that all the bonus features you've unlocked will expire permanently if you don't act now. This is truly your last opportunity to get these exclusive bonuses worth over $500. Can I help you with any concerns about the purchase?");
    } else {
      // Move to next set
      setCurrentSet(prev => prev + 1);
      setCurrentQuestion(1);
    }
  };

  // Handle contact form submission
  const handleContactSubmit = () => {
    if (!contactInfo.name || !contactInfo.email) {
      toast({
        title: "Information Required",
        description: "Please enter your name and email to begin the Learn & Earn Loop.",
        variant: "destructive",
      });
      return;
    }
    captureContactMutation.mutate();
  };

  // Handle answer submission
  const handleAnswerSubmit = () => {
    if (!selectedAnswer) {
      toast({
        title: "Answer Required",
        description: "Please select an answer before continuing.",
        variant: "destructive",
      });
      return;
    }
    submitAnswerMutation.mutate(selectedAnswer);
  };

  // Contact capture form (PDR requirement)
  if (!isContactCaptured) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="h-8 w-8 text-yellow-300" />
              <CardTitle className="text-3xl font-bold">BoDiGi™ Learn & Earn Loop</CardTitle>
            </div>
            <p className="text-lg">Unlock valuable rewards while we create your perfect solution!</p>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Before we begin...</h2>
              <p className="text-gray-600 mb-6">
                Enter your information to unlock personalized rewards worth over $500+
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <BookOpen className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Exclusive PDFs</h3>
                  <p className="text-sm text-gray-600">Industry guides & blueprints</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <Gift className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold">Bonus Features</h3>
                  <p className="text-sm text-gray-600">Premium MVP add-ons</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <Crown className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <h3 className="font-semibold">VIP Access</h3>
                  <p className="text-sm text-gray-600">Exclusive support & training</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4 max-w-md mx-auto">
              <div>
                <Label htmlFor="name" className="text-sm font-semibold">Your Name *</Label>
                <Input
                  id="name"
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-semibold">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email address"
                  className="mt-1"
                />
              </div>
              
              <Button
                onClick={handleContactSubmit}
                disabled={captureContactMutation.isPending}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold text-lg"
              >
                {captureContactMutation.isPending ? "Starting Your Journey..." : "🚀 Start My Learn & Earn Journey"}
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                By continuing, you agree to receive educational content and product updates. Unsubscribe anytime.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress header */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Learn & Earn Loop™</h1>
              <p className="text-white/90">Set {currentSet} of 5 • Question {currentQuestion} of 3</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/90">Progress</p>
              <p className="text-xl font-bold">{Math.round(progressPercentage)}%</p>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2 bg-white/20" />
          
          <div className="mt-4 flex items-center gap-4">
            <Badge variant="secondary" className="bg-white/20 text-white">
              Rewards Earned: {quizProgress.earnedRewards.length}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white">
              MVP: {selectedMVP.name}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Current question */}
      {currentQuestionData && !showMVPOffer && !showAuraChat && (
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                {currentQuestion}
              </div>
              <CardTitle className="text-xl">{currentQuestionSet.title}</CardTitle>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">{currentQuestionData.question}</h2>
              
              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                {currentQuestionData.options.map((option) => (
                  <div key={option.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value={option.value} id={option.id} />
                    <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                      {option.text}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            {/* Reward preview */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3">
                {currentQuestionData.reward.type === 'pdf' ? <BookOpen className="h-6 w-6 text-yellow-600" /> : <Gift className="h-6 w-6 text-yellow-600" />}
                <div>
                  <h3 className="font-semibold text-gray-800">Reward: {currentQuestionData.reward.title}</h3>
                  <p className="text-sm text-gray-600">{currentQuestionData.reward.description}</p>
                  {currentQuestionData.reward.isLastChance && (
                    <Badge variant="destructive" className="mt-1">⚠️ LAST CHANCE!</Badge>
                  )}
                </div>
              </div>
            </div>
            
            <Button
              onClick={handleAnswerSubmit}
              disabled={!selectedAnswer || submitAnswerMutation.isPending}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold"
            >
              {submitAnswerMutation.isPending ? "Processing..." : `Unlock Reward & Continue`}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* MVP Offer (shown after each set of 3 questions) */}
      {showMVPOffer && (
        <Card className="shadow-lg border-2 border-yellow-400">
          <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <Crown className="h-8 w-8" />
              Special Offer: Unlock ALL Bonuses Now!
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-4">{selectedMVP.name}</h2>
              <p className="text-xl text-gray-600 mb-6">
                You've earned amazing rewards! Purchase now to unlock ALL bonus features permanently.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-bold text-green-800 mb-2">Rewards You've Earned:</h3>
                  <ul className="text-sm text-green-700 space-y-1">
                    {quizProgress.earnedRewards.map((reward, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        {reward.title}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-bold text-purple-800 mb-2">What You Get (5 Features):</h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    {selectedMVP.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {showBonusWarning && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-3 text-red-800">
                    <AlertTriangle className="h-6 w-6" />
                    <div>
                      <h3 className="font-bold">⚠️ FINAL WARNING!</h3>
                      <p className="text-sm">This is your LAST CHANCE to get these bonuses. They will expire permanently if you decline.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-4">
              <Button
                onClick={handleMVPPurchase}
                className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold text-lg"
              >
                <DollarSign className="mr-2 h-5 w-5" />
                Yes! Unlock Everything Now
              </Button>
              
              <Button
                onClick={handleDeclineMVP}
                variant="outline"
                className="flex-1 h-12 border-2 border-gray-300 hover:bg-gray-50"
              >
                {currentSet === 5 ? "No Thanks (Lose All Bonuses)" : "Continue Quiz (Harder Questions)"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Aura Chat Assistant (final decline) */}
      {showAuraChat && (
        <Card className="shadow-lg border-2 border-blue-400">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="text-xl font-bold flex items-center gap-3">
              <MessageSquare className="h-6 w-6" />
              Aura™ AI Assistant - Final Opportunity
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <p className="text-blue-800">{auraMessage}</p>
            </div>
            
            <div className="space-y-3">
              <Textarea
                placeholder="Ask Aura any questions about the MVP or your concerns..."
                className="min-h-[100px]"
              />
              
              <div className="flex gap-3">
                <Button
                  onClick={handleMVPPurchase}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold"
                >
                  I'm Ready to Purchase
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Thanks for participating!",
                      description: "You can return anytime, but the bonus offers will no longer be available.",
                    });
                  }}
                  className="border-2 border-gray-300"
                >
                  End Session
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rewards earned sidebar */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Gift className="h-5 w-5 text-purple-600" />
            Your Earned Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          {quizProgress.earnedRewards.length > 0 ? (
            <div className="space-y-3">
              {quizProgress.earnedRewards.map((reward, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  {reward.type === 'pdf' ? <BookOpen className="h-5 w-5 text-blue-600" /> : <Gift className="h-5 w-5 text-purple-600" />}
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{reward.title}</h4>
                    <p className="text-xs text-gray-600">{reward.description}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Complete questions to earn rewards
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
