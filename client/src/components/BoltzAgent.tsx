import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Bot, 
  MessageCircle, 
  Zap, 
  CheckCircle, 
  ArrowRight, 
  Sparkles,
  Brain,
  Settings,
  Globe,
  Database,
  FileText,
  Share2,
  Play,
  Loader2,
  Send
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  type: 'boltz' | 'user' | 'system';
  content: string;
  timestamp: Date;
  status?: 'thinking' | 'building' | 'complete';
}

interface AutomationTask {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'complete' | 'error';
  description: string;
  mcpIntegration?: string;
}

export default function BoltzAgent() {
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentInput, setCurrentInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [automationTasks, setAutomationTasks] = useState<AutomationTask[]>([]);
  const [buildProgress, setBuildProgress] = useState(0);
  const [customerData, setCustomerData] = useState<any>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startConversation = () => {
    setIsActive(true);
    const welcomeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'boltz',
      content: "👋 Hi! I'm **Boltz**, your BoDiGi AI automation specialist. I'm going to build your complete Learn & Earn loop system automatically - you just need to chat with me for a few minutes!\n\nI'll handle all the technical work, integrations, and deployment while we talk. Ready to get started?\n\n**What's your business about?**",
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const sendMessage = async () => {
    if (!currentInput.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setCurrentInput("");
    setIsTyping(true);

    // Process user input and trigger automation
    await processBoltzResponse(currentInput);
  };

  const processBoltzResponse = async (userInput: string) => {
    // Simulate Boltz thinking
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Determine what Boltz should do based on conversation stage
    const messageCount = messages.filter(m => m.type === 'user').length;
    
    let boltzResponse = "";
    let shouldStartAutomation = false;

    switch (messageCount) {
      case 0: // First response - business type
        setCustomerData(prev => ({ ...prev, business: userInput }));
        boltzResponse = `Perfect! **${userInput}** - I'm already analyzing your industry and starting to build your custom system in the background 🚀\n\n*[Boltz is creating your workflow schema via MCP Auth A2A...]*\n\n**Who is your ideal customer?** Describe them in a sentence or two.`;
        shouldStartAutomation = true;
        break;
        
      case 1: // Target audience
        setCustomerData(prev => ({ ...prev, audience: userInput }));
        boltzResponse = `Got it! Targeting **${userInput}** - I'm now customizing your quiz questions and rewards specifically for this audience.\n\n*[Boltz is generating personalized content using AI workflows...]*\n\n**What's the biggest problem your business solves for them?**`;
        break;
        
      case 2: // Problem/solution
        setCustomerData(prev => ({ ...prev, problem: userInput }));
        boltzResponse = `Excellent! The problem: **${userInput}** - I'm building quiz questions that educate your audience about this exact issue before presenting your solution.\n\n*[Boltz is integrating with Builder.io and Supabase via MCP...]*\n\n**What's your website URL, or should I create a landing page for you?**`;
        break;
        
      case 3: // Website/landing page
        setCustomerData(prev => ({ ...prev, website: userInput }));
        boltzResponse = `Perfect! I'm setting up everything at **${userInput}** right now.\n\n*[Boltz is deploying your Learn & Earn loop and configuring automation workflows...]*\n\n**Final question: What should I call your quiz?** (Something catchy that relates to your business)`;
        break;
        
      case 4: // Quiz name
        setCustomerData(prev => ({ ...prev, quizName: userInput }));
        boltzResponse = `🎉 **"${userInput}"** - Perfect name! \n\nI'm now finalizing everything and deploying your complete system. This will take about 30 seconds...\n\n*[Boltz is completing final integrations and going live...]*`;
        shouldStartAutomation = true;
        await completeBuild();
        break;
        
      default:
        boltzResponse = "I'm processing that information and building your system automatically...";
    }

    if (shouldStartAutomation) {
      startAutomationTasks();
    }

    const boltzMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'boltz',
      content: boltzResponse,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, boltzMessage]);
    setIsTyping(false);
  };

  const startAutomationTasks = async () => {
    const tasks: AutomationTask[] = [
      {
        id: '1',
        name: 'Customer Profile Analysis',
        status: 'pending',
        description: 'Analyzing customer data and creating persona',
        mcpIntegration: 'Supabase'
      },
      {
        id: '2',
        name: 'Quiz Content Generation',
        status: 'pending',
        description: 'Creating personalized quiz questions and answers',
        mcpIntegration: 'Builder.io'
      },
      {
        id: '3',
        name: 'Workflow Schema Creation',
        status: 'pending',
        description: 'Building automation workflows and triggers',
        mcpIntegration: 'Linear'
      },
      {
        id: '4',
        name: 'Landing Page Deployment',
        status: 'pending',
        description: 'Deploying quiz to customer website',
        mcpIntegration: 'Netlify'
      },
      {
        id: '5',
        name: 'Lead Capture Setup',
        status: 'pending',
        description: 'Configuring lead collection and notifications',
        mcpIntegration: 'Notion'
      }
    ];

    setAutomationTasks(tasks);

    // Execute tasks sequentially with realistic delays
    for (let i = 0; i < tasks.length; i++) {
      setAutomationTasks(prev => 
        prev.map(task => 
          task.id === tasks[i].id ? { ...task, status: 'in_progress' } : task
        )
      );

      setBuildProgress(((i + 1) / tasks.length) * 100);
      
      // Simulate realistic build time
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
      
      setAutomationTasks(prev => 
        prev.map(task => 
          task.id === tasks[i].id ? { ...task, status: 'complete' } : task
        )
      );
    }
  };

  const completeBuild = async () => {
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const completionMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'system',
      content: `🎉 **BUILD COMPLETE!** 

Your **"${customerData.quizName}"** Learn & Earn loop is now LIVE!

✅ Quiz deployed to ${customerData.website}
✅ Lead capture configured  
✅ Automation workflows active
✅ MCP integrations connected

**Your customers can now:**
- Take the personalized quiz
- Get educational content
- Automatically become qualified leads
- Enter your sales funnel

**Share your quiz:** ${customerData.website}/quiz/${customerData.quizName?.toLowerCase().replace(/ /g, '-')}

Boltz has set up everything automatically - no technical work needed! 🚀`,
      timestamp: new Date(),
      status: 'complete'
    };

    setMessages(prev => [...prev, completionMessage]);

    toast({
      title: "🎉 System Built Successfully!",
      description: "Boltz has deployed your complete Learn & Earn automation",
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
            Meet Boltz
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your AI automation specialist that builds complete Learn & Earn systems while you chat.
          </p>
        </div>

        {!isActive ? (
          /* Start Screen */
          <Card className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl">
            <CardHeader className="text-white rounded-t-3xl text-center" style={{
              background: 'linear-gradient(135deg, #722f37 0%, #8b3a62 100%)'
            }}>
              <CardTitle className="text-3xl font-bold text-yellow-300 flex items-center justify-center gap-4">
                <Bot className="h-10 w-10" />
                Boltz AI Agent
              </CardTitle>
            </CardHeader>
            <CardContent className="p-12 text-center">
              <div className="max-w-2xl mx-auto space-y-8">
                <div className="relative">
                  <Bot className="h-32 w-32 text-yellow-500 mx-auto mb-6 animate-pulse" />
                  <div className="absolute -top-2 -right-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
                    <div className="w-4 h-4 bg-green-500 rounded-full absolute top-0"></div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-3xl font-bold mb-4">Hi, I'm Boltz!</h3>
                  <p className="text-xl text-gray-600 mb-8">
                    I'll build your complete Learn & Earn automation system in the next 5 minutes. 
                    Just chat with me - I'll handle all the technical work automatically.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-6 bg-yellow-50 rounded-xl">
                    <MessageCircle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                    <h4 className="font-bold mb-2">Just Chat</h4>
                    <p className="text-sm text-gray-600">Answer a few simple questions about your business</p>
                  </div>
                  <div className="text-center p-6 bg-yellow-50 rounded-xl">
                    <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                    <h4 className="font-bold mb-2">Auto-Build</h4>
                    <p className="text-sm text-gray-600">I create everything automatically using MCP workflows</p>
                  </div>
                  <div className="text-center p-6 bg-yellow-50 rounded-xl">
                    <Globe className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
                    <h4 className="font-bold mb-2">Go Live</h4>
                    <p className="text-sm text-gray-600">Your quiz goes live instantly and starts generating leads</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                  <h4 className="font-bold mb-4">What Boltz Builds For You:</h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Personalized quiz content</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Landing page deployment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Lead capture workflows</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Email automation setup</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Analytics integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>MCP Auth A2A connections</span>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={startConversation}
                  size="lg"
                  className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-12 py-6 text-xl rounded-xl"
                >
                  <Play className="h-6 w-6 mr-3" />
                  Start Building with Boltz
                </Button>

                <p className="text-sm text-gray-500">
                  ⚡ Powered by MCP Auth A2A • Fully automated • No technical skills required
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* Chat Interface */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Chat */}
            <div className="lg:col-span-2">
              <Card className="bg-white rounded-3xl shadow-xl h-[600px] flex flex-col">
                <CardHeader className="text-white rounded-t-3xl" style={{
                  background: 'linear-gradient(135deg, #722f37 0%, #8b3a62 100%)'
                }}>
                  <CardTitle className="text-2xl font-bold text-yellow-300 flex items-center gap-3">
                    <div className="relative">
                      <Bot className="h-8 w-8" />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    Chatting with Boltz
                    <Badge className="bg-green-500 text-white ml-auto">Building Live</Badge>
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex-1 p-6 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl ${
                          message.type === 'user' 
                            ? 'bg-yellow-500 text-black ml-4' 
                            : message.type === 'system'
                            ? 'bg-green-100 text-green-900 border-2 border-green-300'
                            : 'bg-gray-100 text-gray-900'
                        }`}>
                          {message.type === 'boltz' && (
                            <div className="flex items-center mb-2">
                              <Bot className="h-4 w-4 mr-2 text-yellow-600" />
                              <span className="font-bold text-sm text-yellow-600">Boltz</span>
                            </div>
                          )}
                          {message.type === 'system' && (
                            <div className="flex items-center mb-2">
                              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                              <span className="font-bold text-sm text-green-600">System Complete</span>
                            </div>
                          )}
                          <div className="text-sm whitespace-pre-line">
                            {message.content.split('**').map((part, index) => 
                              index % 2 === 1 ? <strong key={index}>{part}</strong> : part
                            )}
                          </div>
                          <p className="text-xs opacity-60 mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 p-4 rounded-2xl">
                          <div className="flex items-center">
                            <Bot className="h-4 w-4 mr-2 text-yellow-600" />
                            <span className="text-sm font-bold text-yellow-600">Boltz</span>
                            <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                          </div>
                          <div className="text-sm mt-1">Building your system...</div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>

                <div className="p-6 border-t">
                  <div className="flex gap-3">
                    <Input 
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      placeholder="Type your answer..."
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      disabled={isTyping}
                    />
                    <Button 
                      onClick={sendMessage}
                      disabled={isTyping || !currentInput.trim()}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black px-6"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Automation Status */}
            <div className="space-y-6">
              {/* Build Progress */}
              <Card className="bg-white rounded-3xl shadow-xl">
                <CardHeader className="text-white rounded-t-3xl" style={{
                  background: 'linear-gradient(135deg, #722f37 0%, #8b3a62 100%)'
                }}>
                  <CardTitle className="text-xl font-bold text-yellow-300 flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Automation Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Build Progress</span>
                        <span className="text-sm text-gray-500">{Math.round(buildProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${buildProgress}%` }}
                        ></div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      {automationTasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="text-sm font-medium">{task.name}</div>
                            <div className="text-xs text-gray-500">{task.description}</div>
                            {task.mcpIntegration && (
                              <Badge variant="outline" className="text-xs mt-1">
                                {task.mcpIntegration}
                              </Badge>
                            )}
                          </div>
                          <div className="ml-3">
                            {task.status === 'complete' && <CheckCircle className="h-5 w-5 text-green-500" />}
                            {task.status === 'in_progress' && <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />}
                            {task.status === 'pending' && <div className="h-5 w-5 rounded-full border-2 border-gray-300" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Customer Data */}
              {Object.keys(customerData).length > 0 && (
                <Card className="bg-white rounded-3xl shadow-xl">
                  <CardHeader className="text-white rounded-t-3xl" style={{
                    background: 'linear-gradient(135deg, #722f37 0%, #8b3a62 100%)'
                  }}>
                    <CardTitle className="text-xl font-bold text-yellow-300 flex items-center">
                      <Database className="h-5 w-5 mr-2" />
                      Collected Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      {customerData.business && (
                        <div>
                          <div className="text-xs font-bold text-gray-500 uppercase">Business</div>
                          <div className="text-sm">{customerData.business}</div>
                        </div>
                      )}
                      {customerData.audience && (
                        <div>
                          <div className="text-xs font-bold text-gray-500 uppercase">Audience</div>
                          <div className="text-sm">{customerData.audience}</div>
                        </div>
                      )}
                      {customerData.problem && (
                        <div>
                          <div className="text-xs font-bold text-gray-500 uppercase">Problem Solved</div>
                          <div className="text-sm">{customerData.problem}</div>
                        </div>
                      )}
                      {customerData.website && (
                        <div>
                          <div className="text-xs font-bold text-gray-500 uppercase">Website</div>
                          <div className="text-sm">{customerData.website}</div>
                        </div>
                      )}
                      {customerData.quizName && (
                        <div>
                          <div className="text-xs font-bold text-gray-500 uppercase">Quiz Name</div>
                          <div className="text-sm font-bold text-yellow-600">{customerData.quizName}</div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* MCP Connections */}
              <Card className="bg-white rounded-3xl shadow-xl">
                <CardHeader className="text-white rounded-t-3xl" style={{
                  background: 'linear-gradient(135deg, #722f37 0%, #8b3a62 100%)'
                }}>
                  <CardTitle className="text-xl font-bold text-yellow-300 flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    MCP Auth A2A
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {['Builder.io', 'Supabase', 'Netlify', 'Linear', 'Notion'].map((service) => (
                      <div key={service} className="flex items-center justify-between">
                        <span className="text-sm">{service}</span>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full mt-4 border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                    size="sm"
                  >
                    View Automation Logs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
