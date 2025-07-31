import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  Plus, 
  Edit3, 
  Gift, 
  Upload, 
  Eye, 
  Share2, 
  Save, 
  Lightbulb,
  CheckCircle,
  Star,
  Download,
  FileText,
  Smartphone,
  Crown,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: string;
  text: string;
  answers: { id: string; text: string; isCorrect: boolean }[];
}

interface QuizSet {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert" | "Master";
  questions: Question[];
  prize: {
    type: "pdf" | "feature" | "trial" | "coupon";
    title: string;
    description: string;
    file?: File;
  };
}

interface QuizData {
  niche: string;
  audience: string;
  mvpType: string;
  title: string;
  description: string;
  sets: QuizSet[];
  showBonusOnDecline: boolean;
}

const suggestedThemes: Record<string, string[]> = {
  "Business": ["Marketing Automation", "Sales Funnel Optimization", "Customer Retention", "Lead Generation", "ROI Tracking"],
  "Technology": ["API Integration", "Data Analytics", "Cloud Migration", "Security Best Practices", "Performance Optimization"],
  "Education": ["Online Learning", "Student Engagement", "Course Creation", "Assessment Strategies", "Learning Analytics"],
  "Healthcare": ["Patient Care", "Medical Records", "Telemedicine", "Healthcare Analytics", "Compliance"],
  "Finance": ["Investment Strategies", "Risk Management", "Financial Planning", "Market Analysis", "Compliance"]
};

const prizeTypes = [
  { value: "pdf", label: "Downloadable PDF", icon: FileText },
  { value: "feature", label: "Unlocked Feature", icon: Star },
  { value: "trial", label: "Free App Trial", icon: Zap },
  { value: "coupon", label: "Discount Coupon", icon: Gift }
];

export default function LearnEarnLoopBuilder() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [activeSet, setActiveSet] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  
  const [quizData, setQuizData] = useState<QuizData>({
    niche: "",
    audience: "",
    mvpType: "",
    title: "",
    description: "",
    sets: [
      {
        id: "1",
        title: "Getting Started",
        difficulty: "Beginner",
        questions: [
          { id: "q1", text: "", answers: [
            { id: "a1", text: "", isCorrect: false },
            { id: "a2", text: "", isCorrect: false },
            { id: "a3", text: "", isCorrect: false }
          ]},
          { id: "q2", text: "", answers: [
            { id: "a1", text: "", isCorrect: false },
            { id: "a2", text: "", isCorrect: false },
            { id: "a3", text: "", isCorrect: false }
          ]},
          { id: "q3", text: "", answers: [
            { id: "a1", text: "", isCorrect: false },
            { id: "a2", text: "", isCorrect: false },
            { id: "a3", text: "", isCorrect: false }
          ]}
        ],
        prize: { type: "pdf", title: "", description: "" }
      }
    ],
    showBonusOnDecline: false
  });

  const addQuizSet = () => {
    const difficulties: QuizSet['difficulty'][] = ["Beginner", "Intermediate", "Advanced", "Expert", "Master"];
    const newSet: QuizSet = {
      id: (quizData.sets.length + 1).toString(),
      title: `Step ${quizData.sets.length + 1}`,
      difficulty: difficulties[quizData.sets.length] || "Expert",
      questions: [
        { id: "q1", text: "", answers: [
          { id: "a1", text: "", isCorrect: false },
          { id: "a2", text: "", isCorrect: false },
          { id: "a3", text: "", isCorrect: false }
        ]},
        { id: "q2", text: "", answers: [
          { id: "a1", text: "", isCorrect: false },
          { id: "a2", text: "", isCorrect: false },
          { id: "a3", text: "", isCorrect: false }
        ]},
        { id: "q3", text: "", answers: [
          { id: "a1", text: "", isCorrect: false },
          { id: "a2", text: "", isCorrect: false },
          { id: "a3", text: "", isCorrect: false }
        ]}
      ],
      prize: { type: "pdf", title: "", description: "" }
    };
    
    setQuizData(prev => ({
      ...prev,
      sets: [...prev.sets, newSet]
    }));
  };

  const updateQuestion = (setIndex: number, questionIndex: number, field: string, value: string) => {
    setQuizData(prev => ({
      ...prev,
      sets: prev.sets.map((set, sIdx) => 
        sIdx === setIndex ? {
          ...set,
          questions: set.questions.map((q, qIdx) => 
            qIdx === questionIndex ? { ...q, [field]: value } : q
          )
        } : set
      )
    }));
  };

  const updateAnswer = (setIndex: number, questionIndex: number, answerIndex: number, field: string, value: string | boolean) => {
    setQuizData(prev => ({
      ...prev,
      sets: prev.sets.map((set, sIdx) => 
        sIdx === setIndex ? {
          ...set,
          questions: set.questions.map((q, qIdx) => 
            qIdx === questionIndex ? {
              ...q,
              answers: q.answers.map((a, aIdx) => 
                aIdx === answerIndex ? { ...a, [field]: value } : a
              )
            } : q
          )
        } : set
      )
    }));
  };

  const updatePrize = (setIndex: number, field: string, value: any) => {
    setQuizData(prev => ({
      ...prev,
      sets: prev.sets.map((set, sIdx) => 
        sIdx === setIndex ? {
          ...set,
          prize: { ...set.prize, [field]: value }
        } : set
      )
    }));
  };

  const generateSuggestions = () => {
    if (!quizData.niche || !quizData.mvpType) return;
    
    const themes = suggestedThemes[quizData.niche] || [];
    const suggestion = themes[Math.floor(Math.random() * themes.length)];
    
    toast({
      title: "AI Suggestion Generated!",
      description: `Try creating questions about: ${suggestion}`,
    });
  };

  const saveQuiz = () => {
    toast({
      title: "Quiz Saved!",
      description: "Your Learn & Earn loop has been saved to 'My Loops'",
    });
  };

  const shareQuiz = () => {
    const shareUrl = `https://bodigi.com/quiz/${quizData.title.replace(/\s+/g, '-').toLowerCase()}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied!",
      description: "Share your quiz link with your audience",
    });
  };

  return (
    <div className="min-h-screen p-8" style={{
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 40%, #4a1a2a 100%)'
    }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Build Your Learn & Earn Loop
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Gamify your marketing funnel and generate leads with quiz-based engagement.
          </p>
        </div>

        {/* AI Tip Box */}
        <Card className="mb-8 border-yellow-500 bg-gradient-to-r from-yellow-50 to-amber-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-yellow-500 rounded-full">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-yellow-900 mb-2">Smart Suggestion</h3>
                <p className="text-yellow-800">Use questions that teach your audience something before you sell.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Builder */}
          <div className="lg:col-span-2 space-y-6">
            {/* Setup Section */}
            <Card className="bg-white rounded-3xl shadow-xl">
              <CardHeader className="text-white rounded-t-3xl" style={{
                background: 'linear-gradient(135deg, #722f37 0%, #8b3a62 100%)'
              }}>
                <CardTitle className="text-2xl font-bold text-yellow-300">Quiz Setup</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="niche" className="text-lg font-semibold">Niche</Label>
                    <Select value={quizData.niche} onValueChange={(value) => setQuizData(prev => ({ ...prev, niche: value }))}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select your niche" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(suggestedThemes).map(niche => (
                          <SelectItem key={niche} value={niche}>{niche}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="audience" className="text-lg font-semibold">Target Audience</Label>
                    <Input 
                      id="audience"
                      className="mt-2"
                      placeholder="e.g., Small business owners"
                      value={quizData.audience}
                      onChange={(e) => setQuizData(prev => ({ ...prev, audience: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mvpType" className="text-lg font-semibold">MVP Type</Label>
                    <Input 
                      id="mvpType"
                      className="mt-2"
                      placeholder="e.g., SaaS Platform"
                      value={quizData.mvpType}
                      onChange={(e) => setQuizData(prev => ({ ...prev, mvpType: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <Label htmlFor="title" className="text-lg font-semibold">Quiz Title</Label>
                  <Input 
                    id="title"
                    className="mt-2"
                    placeholder="e.g., Master Your Business Automation"
                    value={quizData.title}
                    onChange={(e) => setQuizData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                
                <div className="mt-6">
                  <Label htmlFor="description" className="text-lg font-semibold">Description</Label>
                  <Textarea 
                    id="description"
                    className="mt-2"
                    placeholder="Describe what users will learn..."
                    value={quizData.description}
                    onChange={(e) => setQuizData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <Button onClick={generateSuggestions} className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-black">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Get AI Suggestions
                </Button>
              </CardContent>
            </Card>

            {/* Quiz Steps */}
            <Card className="bg-white rounded-3xl shadow-xl">
              <CardHeader className="text-white rounded-t-3xl" style={{
                background: 'linear-gradient(135deg, #722f37 0%, #8b3a62 100%)'
              }}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-yellow-300">Quiz Flow Builder</CardTitle>
                  <div className="flex gap-2">
                    {quizData.sets.length < 5 && (
                      <Button onClick={addQuizSet} variant="outline" className="border-yellow-500 text-yellow-300 hover:bg-yellow-500 hover:text-black">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Step
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {/* Step Navigator */}
                <div className="flex items-center justify-center mb-8">
                  <div className="flex items-center space-x-4">
                    {quizData.sets.map((set, index) => (
                      <div key={set.id} className="flex items-center">
                        <button
                          onClick={() => setActiveSet(index)}
                          className={`w-12 h-12 rounded-full font-bold transition-all ${
                            activeSet === index 
                              ? 'bg-yellow-500 text-black shadow-lg scale-110' 
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          {index + 1}
                        </button>
                        {index < quizData.sets.length - 1 && (
                          <div className="w-8 h-1 bg-gray-300 mx-2"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Active Step Content */}
                {quizData.sets[activeSet] && (
                  <div className="space-y-6">
                    <div className="text-center">
                      <Badge className="bg-yellow-500 text-black text-lg px-6 py-2">
                        {quizData.sets[activeSet].difficulty} Level
                      </Badge>
                      <h3 className="text-2xl font-bold mt-4">{quizData.sets[activeSet].title}</h3>
                    </div>

                    {/* Questions */}
                    {quizData.sets[activeSet].questions.map((question, qIndex) => (
                      <Card key={question.id} className="border-2 border-gray-200">
                        <CardHeader className="bg-gray-50">
                          <CardTitle className="text-lg">Question {qIndex + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="space-y-4">
                            <div>
                              <Label>Question Text</Label>
                              <Textarea 
                                className="mt-2"
                                placeholder="Enter your question..."
                                value={question.text}
                                onChange={(e) => updateQuestion(activeSet, qIndex, 'text', e.target.value)}
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 gap-4">
                              {question.answers.map((answer, aIndex) => (
                                <div key={answer.id} className="flex items-center space-x-4">
                                  <Input 
                                    placeholder={`Answer ${aIndex + 1}`}
                                    value={answer.text}
                                    onChange={(e) => updateAnswer(activeSet, qIndex, aIndex, 'text', e.target.value)}
                                    className="flex-1"
                                  />
                                  <div className="flex items-center space-x-2">
                                    <Label htmlFor={`correct-${qIndex}-${aIndex}`} className="text-sm">Correct</Label>
                                    <Switch 
                                      id={`correct-${qIndex}-${aIndex}`}
                                      checked={answer.isCorrect}
                                      onCheckedChange={(checked) => updateAnswer(activeSet, qIndex, aIndex, 'isCorrect', checked)}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {/* Prize Section */}
                    <Card className="border-2 border-yellow-500 bg-yellow-50">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Gift className="h-5 w-5 mr-2 text-yellow-600" />
                          Reward for Completing This Step
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Prize Type</Label>
                            <Select 
                              value={quizData.sets[activeSet].prize.type} 
                              onValueChange={(value) => updatePrize(activeSet, 'type', value)}
                            >
                              <SelectTrigger className="mt-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {prizeTypes.map(type => {
                                  const Icon = type.icon;
                                  return (
                                    <SelectItem key={type.value} value={type.value}>
                                      <div className="flex items-center">
                                        <Icon className="h-4 w-4 mr-2" />
                                        {type.label}
                                      </div>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Prize Title</Label>
                            <Input 
                              className="mt-2"
                              placeholder="e.g., Automation Starter Guide"
                              value={quizData.sets[activeSet].prize.title}
                              onChange={(e) => updatePrize(activeSet, 'title', e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label>Prize Description</Label>
                          <Textarea 
                            className="mt-2"
                            placeholder="Describe what they'll get..."
                            value={quizData.sets[activeSet].prize.description}
                            onChange={(e) => updatePrize(activeSet, 'description', e.target.value)}
                          />
                        </div>

                        {quizData.sets[activeSet].prize.type === 'pdf' && (
                          <div>
                            <Label>Upload PDF File</Label>
                            <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                              <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                              <p className="text-gray-600">Click to upload or drag and drop</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="bg-white rounded-3xl shadow-xl">
              <CardHeader className="text-white rounded-t-3xl" style={{
                background: 'linear-gradient(135deg, #722f37 0%, #8b3a62 100%)'
              }}>
                <CardTitle className="text-2xl font-bold text-yellow-300">Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-lg font-semibold">Show bonus offer only if user declines MVP sale</Label>
                    <p className="text-gray-600 mt-1">Display special offers to users who don't purchase initially</p>
                  </div>
                  <Switch 
                    checked={quizData.showBonusOnDecline}
                    onCheckedChange={(checked) => setQuizData(prev => ({ ...prev, showBonusOnDecline: checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card className="bg-white rounded-3xl shadow-xl sticky top-8">
              <CardHeader className="text-white rounded-t-3xl" style={{
                background: 'linear-gradient(135deg, #722f37 0%, #8b3a62 100%)'
              }}>
                <CardTitle className="text-xl font-bold text-yellow-300 flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Live Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {/* Mobile Preview */}
                <div className="bg-gray-100 rounded-3xl p-4 mb-6" style={{ aspectRatio: '9/16', maxHeight: '400px' }}>
                  <div className="bg-white rounded-2xl h-full p-4 overflow-y-auto">
                    <div className="text-center mb-4">
                      <Smartphone className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <h4 className="font-bold text-sm">{quizData.title || "Your Quiz Title"}</h4>
                      <p className="text-xs text-gray-600 mt-1">{quizData.description || "Quiz description will appear here"}</p>
                    </div>
                    
                    <div className="space-y-2">
                      {quizData.sets.map((set, index) => (
                        <div key={set.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-xs font-medium">Step {index + 1}: {set.difficulty}</span>
                          <Gift className="h-4 w-4 text-yellow-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button onClick={saveQuiz} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                    <Save className="h-4 w-4 mr-2" />
                    Save to My Loops
                  </Button>
                  
                  <Button onClick={shareQuiz} variant="outline" className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Quiz Link
                  </Button>
                </div>

                {/* Stats */}
                <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-yellow-600">{quizData.sets.length}</div>
                    <div className="text-xs text-gray-600">Quiz Steps</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-yellow-600">{quizData.sets.length * 3}</div>
                    <div className="text-xs text-gray-600">Total Questions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16 p-8 bg-white rounded-3xl shadow-xl">
          <h2 className="text-3xl font-bold mb-4" style={{ color: '#722f37' }}>
            Done? Add your loop to your homepage or share your quiz with the world.
          </h2>
          <div className="flex justify-center gap-4">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8">
              <Crown className="h-5 w-5 mr-2" />
              Add to Homepage
            </Button>
            <Button size="lg" variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 px-8">
              <Share2 className="h-5 w-5 mr-2" />
              Share with World
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
