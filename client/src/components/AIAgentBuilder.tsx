import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Bot, 
  MessageCircle, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  Brain,
  Target,
  Users,
  Lightbulb,
  FileText,
  Share2,
  Settings,
  Play
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIConversation {
  id: string;
  type: 'question' | 'response' | 'analysis';
  content: string;
  timestamp: Date;
  metadata?: any;
}

interface CustomerProfile {
  businessType: string;
  industry: string;
  targetAudience: string;
  painPoints: string[];
  goals: string[];
  experience: string;
  budget: string;
  timeline: string;
}

interface GeneratedQuizData {
  title: string;
  description: string;
  niche: string;
  difficulty_progression: string[];
  questions: Array<{
    set: number;
    difficulty: string;
    questions: Array<{
      question: string;
      answers: string[];
      correct_answer: number;
      explanation: string;
    }>;
    prize: {
      type: string;
      title: string;
      description: string;
    };
  }>;
}

export default function AIAgentBuilder() {
  const { toast } = useToast();
  const [conversationActive, setConversationActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'intake' | 'analysis' | 'generation' | 'review' | 'complete'>('intake');
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuizData | null>(null);
  const [currentInput, setCurrentInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const aiQuestions = [
    {
      phase: 'intake',
      questions: [
        "Hi! I'm your BoDiGi AI assistant. Let's create your perfect Learn & Earn loop. First, tell me about your business - what industry are you in?",
        "Great! Who is your ideal customer? Describe them in detail.",
        "What are the biggest challenges your customers face that your business solves?",
        "What's your main business goal for this quarter?",
        "How tech-savvy are you and your team? (Beginner/Intermediate/Advanced)",
        "What's your budget range for customer acquisition tools?",
        "When do you want to launch this Learn & Earn loop?"
      ]
    }
  ];

  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    const phases = ['intake', 'analysis', 'generation', 'review', 'complete'];
    const currentIndex = phases.indexOf(currentPhase);
    setProgress((currentIndex / (phases.length - 1)) * 100);
  }, [currentPhase]);

  const startAIConversation = () => {
    setConversationActive(true);
    const firstQuestion = aiQuestions[0].questions[0];
    setConversations([{
      id: Date.now().toString(),
      type: 'question',
      content: firstQuestion,
      timestamp: new Date()
    }]);
  };

  const submitResponse = async () => {
    if (!currentInput.trim()) return;

    setIsProcessing(true);
    
    // Add user response
    const userResponse: AIConversation = {
      id: Date.now().toString(),
      type: 'response',
      content: currentInput,
      timestamp: new Date()
    };
    
    setConversations(prev => [...prev, userResponse]);
    setCurrentInput("");

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if we need to ask next question or move to analysis
    if (questionIndex < aiQuestions[0].questions.length - 1) {
      const nextQuestion = aiQuestions[0].questions[questionIndex + 1];
      const aiQuestion: AIConversation = {
        id: (Date.now() + 1).toString(),
        type: 'question',
        content: nextQuestion,
        timestamp: new Date()
      };
      
      setConversations(prev => [...prev, aiQuestion]);
      setQuestionIndex(prev => prev + 1);
    } else {
      // Move to analysis phase
      setCurrentPhase('analysis');
      await analyzeCustomerProfile();
    }

    setIsProcessing(false);
  };

  const analyzeCustomerProfile = async () => {
    const analysisMessage: AIConversation = {
      id: Date.now().toString(),
      type: 'analysis',
      content: "Perfect! I'm analyzing your responses to create a customized Learn & Earn strategy...",
      timestamp: new Date()
    };
    
    setConversations(prev => [...prev, analysisMessage]);

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Extract profile from conversations
    const responses = conversations.filter(c => c.type === 'response').map(c => c.content);
    
    const profile: CustomerProfile = {
      businessType: responses[0] || "General Business",
      industry: responses[0] || "Technology",
      targetAudience: responses[1] || "Small business owners",
      painPoints: responses[2]?.split(',').map(p => p.trim()) || ["Time management", "Customer acquisition"],
      goals: responses[3]?.split(',').map(g => g.trim()) || ["Increase sales", "Generate leads"],
      experience: responses[4] || "Intermediate",
      budget: responses[5] || "$500-2000",
      timeline: responses[6] || "1-2 weeks"
    };

    setCustomerProfile(profile);
    setCurrentPhase('generation');
    await generateQuizContent(profile);
  };

  const generateQuizContent = async (profile: CustomerProfile) => {
    const generationMessage: AIConversation = {
      id: Date.now().toString(),
      type: 'analysis',
      content: "Generating your personalized Learn & Earn loop with AI-optimized questions and rewards...",
      timestamp: new Date()
    };
    
    setConversations(prev => [...prev, generationMessage]);

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Generate quiz based on profile
    const quiz: GeneratedQuizData = {
      title: `Master ${profile.industry} Success`,
      description: `A gamified learning experience designed specifically for ${profile.targetAudience} to overcome ${profile.painPoints[0]} and achieve ${profile.goals[0]}.`,
      niche: profile.industry,
      difficulty_progression: ["Beginner", "Intermediate", "Advanced", "Expert", "Master"],
      questions: [
        {
          set: 1,
          difficulty: "Beginner",
          questions: [
            {
              question: `What's the most important first step when starting a ${profile.industry.toLowerCase()} business?`,
              answers: ["Market research", "Building a product", "Finding investors", "Creating a website"],
              correct_answer: 0,
              explanation: "Market research helps you understand your customers and validate your business idea."
            },
            {
              question: `Which tool is essential for ${profile.targetAudience} to track their progress?`,
              answers: ["Spreadsheets", "Analytics dashboard", "Email lists", "Social media"],
              correct_answer: 1,
              explanation: "Analytics dashboards provide real-time insights and actionable data."
            },
            {
              question: `What's the biggest mistake new ${profile.industry.toLowerCase()} businesses make?`,
              answers: ["Not having a website", "Ignoring customer feedback", "Spending too much on ads", "Hiring too quickly"],
              correct_answer: 1,
              explanation: "Customer feedback is crucial for product-market fit and business success."
            }
          ],
          prize: {
            type: "pdf",
            title: `${profile.industry} Starter Checklist`,
            description: "A comprehensive checklist to launch your business successfully"
          }
        },
        {
          set: 2,
          difficulty: "Intermediate",
          questions: [
            {
              question: `How can ${profile.targetAudience} automate their ${profile.painPoints[0]}?`,
              answers: ["Hire more staff", "Use automation tools", "Work longer hours", "Outsource everything"],
              correct_answer: 1,
              explanation: "Automation tools can significantly reduce manual work and increase efficiency."
            },
            {
              question: `What's the best strategy to achieve ${profile.goals[0]}?`,
              answers: ["Cold calling", "Content marketing", "Paid advertising", "All of the above"],
              correct_answer: 3,
              explanation: "A multi-channel approach typically yields the best results."
            },
            {
              question: `Which metric should ${profile.targetAudience} track most closely?`,
              answers: ["Website traffic", "Social followers", "Customer lifetime value", "Email open rates"],
              correct_answer: 2,
              explanation: "Customer lifetime value directly impacts your business profitability."
            }
          ],
          prize: {
            type: "feature",
            title: "Advanced Analytics Dashboard",
            description: "Unlock premium features to track your business metrics"
          }
        }
      ]
    };

    setGeneratedQuiz(quiz);
    setCurrentPhase('review');

    const completionMessage: AIConversation = {
      id: Date.now().toString(),
      type: 'analysis',
      content: "🎉 Your Learn & Earn loop is ready! I've created a personalized quiz with educational content and strategic rewards. Review and customize it below.",
      timestamp: new Date()
    };
    
    setConversations(prev => [...prev, completionMessage]);
  };

  const deployQuiz = async () => {
    setIsProcessing(true);
    
    // Simulate deployment via API/MCP
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setCurrentPhase('complete');
    
    toast({
      title: "Quiz Deployed Successfully!",
      description: "Your Learn & Earn loop is now live and ready to generate leads.",
    });

    setIsProcessing(false);
  };

  const exportToMCP = async () => {
    // This would integrate with MCP servers to save data
    toast({
      title: "Exported to MCP",
      description: "Quiz data saved to your connected Builder.io and Supabase accounts.",
    });
  };

  return (
    <div className="min-h-screen p-8" style={{
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 40%, #4a1a2a 100%)'
    }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 flex items-center justify-center gap-4">
            <Bot className="h-12 w-12 text-yellow-500" />
            AI Agent Builder
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Let our AI assistant interview your customers and automatically generate personalized Learn & Earn loops.
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">Automation Progress</h3>
              <Badge className="bg-yellow-500 text-black">
                {currentPhase.charAt(0).toUpperCase() + currentPhase.slice(1)} Phase
              </Badge>
            </div>
            <Progress value={progress} className="h-3 mb-4" />
            <div className="flex justify-between text-sm text-gray-600">
              <span className={currentPhase === 'intake' ? 'font-bold text-yellow-600' : ''}>Customer Interview</span>
              <span className={currentPhase === 'analysis' ? 'font-bold text-yellow-600' : ''}>AI Analysis</span>
              <span className={currentPhase === 'generation' ? 'font-bold text-yellow-600' : ''}>Content Generation</span>
              <span className={currentPhase === 'review' ? 'font-bold text-yellow-600' : ''}>Review & Deploy</span>
              <span className={currentPhase === 'complete' ? 'font-bold text-yellow-600' : ''}>Live & Active</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Conversation Area */}
          <div className="lg:col-span-2 space-y-6">
            {!conversationActive ? (
              <Card className="bg-white rounded-3xl shadow-xl">
                <CardHeader className="text-white rounded-t-3xl" style={{
                  background: 'linear-gradient(135deg, #722f37 0%, #8b3a62 100%)'
                }}>
                  <CardTitle className="text-2xl font-bold text-yellow-300 flex items-center">
                    <Sparkles className="h-6 w-6 mr-3" />
                    AI-Powered Customer Interview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 text-center">
                  <div className="max-w-2xl mx-auto">
                    <Bot className="h-24 w-24 text-yellow-500 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-4">Ready to Automate Your Quiz Creation?</h3>
                    <p className="text-gray-600 mb-8 text-lg">
                      Our AI agent will conduct an intelligent interview with your customer, analyze their needs, 
                      and automatically generate a personalized Learn & Earn loop with relevant questions and rewards.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="text-center">
                        <MessageCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <h4 className="font-bold">Smart Questions</h4>
                        <p className="text-sm text-gray-600">AI asks strategic questions to understand business needs</p>
                      </div>
                      <div className="text-center">
                        <Brain className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <h4 className="font-bold">Intelligent Analysis</h4>
                        <p className="text-sm text-gray-600">Analyzes responses to create customer profile</p>
                      </div>
                      <div className="text-center">
                        <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                        <h4 className="font-bold">Auto-Generation</h4>
                        <p className="text-sm text-gray-600">Generates complete quiz with questions and rewards</p>
                      </div>
                    </div>

                    <Button 
                      onClick={startAIConversation}
                      size="lg"
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 py-4 text-lg"
                    >
                      <Play className="h-5 w-5 mr-2" />
                      Start AI Interview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-white rounded-3xl shadow-xl">
                <CardHeader className="text-white rounded-t-3xl" style={{
                  background: 'linear-gradient(135deg, #722f37 0%, #8b3a62 100%)'
                }}>
                  <CardTitle className="text-2xl font-bold text-yellow-300 flex items-center">
                    <MessageCircle className="h-6 w-6 mr-3" />
                    AI Customer Interview
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  {/* Conversation Display */}
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {conversations.map((conv) => (
                      <div key={conv.id} className={`flex ${conv.type === 'response' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md p-4 rounded-2xl ${
                          conv.type === 'response' 
                            ? 'bg-yellow-500 text-black' 
                            : conv.type === 'analysis'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          {conv.type !== 'response' && (
                            <div className="flex items-center mb-2">
                              <Bot className="h-4 w-4 mr-2" />
                              <span className="font-bold text-sm">AI Assistant</span>
                            </div>
                          )}
                          <p className="text-sm">{conv.content}</p>
                          <p className="text-xs opacity-60 mt-2">
                            {conv.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isProcessing && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 p-4 rounded-2xl">
                          <div className="flex items-center">
                            <Bot className="h-4 w-4 mr-2 animate-pulse" />
                            <span className="text-sm">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Input Area */}
                  {currentPhase === 'intake' && (
                    <div className="flex gap-4">
                      <Textarea 
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        placeholder="Type your response here..."
                        className="flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            submitResponse();
                          }
                        }}
                      />
                      <Button 
                        onClick={submitResponse}
                        disabled={isProcessing || !currentInput.trim()}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Generated Quiz Preview */}
            {generatedQuiz && currentPhase === 'review' && (
              <Card className="bg-white rounded-3xl shadow-xl">
                <CardHeader className="text-white rounded-t-3xl" style={{
                  background: 'linear-gradient(135deg, #722f37 0%, #8b3a62 100%)'
                }}>
                  <CardTitle className="text-2xl font-bold text-yellow-300 flex items-center">
                    <CheckCircle className="h-6 w-6 mr-3" />
                    Generated Learn & Earn Loop
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-2">{generatedQuiz.title}</h3>
                      <p className="text-gray-600">{generatedQuiz.description}</p>
                    </div>

                    {generatedQuiz.questions.map((set, index) => (
                      <Card key={index} className="border-2 border-yellow-200">
                        <CardHeader className="bg-yellow-50">
                          <CardTitle className="text-lg flex items-center justify-between">
                            <span>Set {set.set}: {set.difficulty} Level</span>
                            <Badge className="bg-yellow-500 text-black">
                              {set.questions.length} Questions
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            {set.questions.slice(0, 1).map((q, qIndex) => (
                              <div key={qIndex} className="bg-gray-50 p-4 rounded-lg">
                                <h5 className="font-bold mb-2">Sample Question:</h5>
                                <p className="mb-3">{q.question}</p>
                                <div className="space-y-1">
                                  {q.answers.map((answer, aIndex) => (
                                    <div key={aIndex} className={`p-2 rounded ${
                                      aIndex === q.correct_answer ? 'bg-green-100 border border-green-300' : 'bg-white border'
                                    }`}>
                                      {answer} {aIndex === q.correct_answer && <CheckCircle className="inline h-4 w-4 text-green-600 ml-2" />}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                            
                            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                              <h5 className="font-bold mb-2 flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                Reward: {set.prize.title}
                              </h5>
                              <p className="text-sm text-gray-600">{set.prize.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    <div className="flex gap-4">
                      <Button 
                        onClick={deployQuiz}
                        disabled={isProcessing}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold"
                        size="lg"
                      >
                        {isProcessing ? "Deploying..." : "Deploy Quiz Live"}
                      </Button>
                      <Button 
                        onClick={exportToMCP}
                        variant="outline"
                        className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                        size="lg"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Export to MCP
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Profile */}
            {customerProfile && (
              <Card className="bg-white rounded-3xl shadow-xl sticky top-8">
                <CardHeader className="text-white rounded-t-3xl" style={{
                  background: 'linear-gradient(135deg, #722f37 0%, #8b3a62 100%)'
                }}>
                  <CardTitle className="text-xl font-bold text-yellow-300 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Customer Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h4 className="font-bold text-sm text-gray-600">INDUSTRY</h4>
                    <p className="font-medium">{customerProfile.industry}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-600">TARGET AUDIENCE</h4>
                    <p className="font-medium">{customerProfile.targetAudience}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-600">PAIN POINTS</h4>
                    <div className="space-y-1">
                      {customerProfile.painPoints.map((point, index) => (
                        <Badge key={index} variant="outline" className="mr-1 mb-1">
                          {point}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-600">GOALS</h4>
                    <div className="space-y-1">
                      {customerProfile.goals.map((goal, index) => (
                        <Badge key={index} className="bg-green-100 text-green-800 mr-1 mb-1">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-yellow-600">{customerProfile.timeline}</div>
                      <div className="text-xs text-gray-600">Timeline</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-yellow-600">{customerProfile.budget}</div>
                      <div className="text-xs text-gray-600">Budget</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* MCP Integration Status */}
            <Card className="bg-white rounded-3xl shadow-xl">
              <CardHeader className="text-white rounded-t-3xl" style={{
                background: 'linear-gradient(135deg, #722f37 0%, #8b3a62 100%)'
              }}>
                <CardTitle className="text-xl font-bold text-yellow-300 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  MCP Integrations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Builder.io</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Supabase</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notion</span>
                    <Badge variant="outline">Available</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Linear</span>
                    <Badge variant="outline">Available</Badge>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                  onClick={() => window.open('#open-mcp-popover', '_blank')}
                >
                  Connect More Services
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Success State */}
        {currentPhase === 'complete' && (
          <Card className="mt-8 bg-green-50 border-2 border-green-200">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-green-900 mb-4">
                🎉 Learn & Earn Loop Deployed Successfully!
              </h2>
              <p className="text-green-700 mb-6 text-lg">
                Your AI-generated quiz is now live and ready to generate leads. 
                Share the link with your customers to start collecting qualified leads.
              </p>
              <div className="flex justify-center gap-4">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Target className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="border-green-600 text-green-600">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Quiz Link
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
