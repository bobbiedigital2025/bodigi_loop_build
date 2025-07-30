import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Gift, Star, Download } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const mockQuestions = [
  {
    id: 1,
    setNumber: 1,
    questionNumber: 1,
    question: "What's your biggest challenge with task automation in your business?",
    options: [
      {
        id: "a",
        text: "Setting up complex workflows takes too much time",
        description: "I need a solution that can create workflows automatically"
      },
      {
        id: "b", 
        text: "My team doesn't know how to use automation tools",
        description: "We need better training and simpler interfaces"
      },
      {
        id: "c",
        text: "Integration with our existing tools is complicated", 
        description: "I need seamless API connections with our current stack"
      }
    ],
    reward: {
      type: "pdf",
      title: "Automation Basics Guide",
      description: "Complete this question to unlock"
    }
  }
];

export default function LearnEarnLoop() {
  const { toast } = useToast();
  const [contactInfo, setContactInfo] = useState({ name: "", email: "" });
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [completedRewards, setCompletedRewards] = useState<string[]>([]);
  
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
