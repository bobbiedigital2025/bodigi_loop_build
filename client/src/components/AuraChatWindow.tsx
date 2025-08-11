import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send, Sparkles, Bot, User } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  role: 'user' | 'aura';
  content: string;
  timestamp: Date;
}

interface BrandInfo {
  name?: string;
  mission?: string;
  colorPalette?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  logoIdea?: string;
  tagline?: string;
  niche?: string;
  targetAudience?: string;
}

interface AuraChatWindowProps {
  onBrandInfoUpdate: (brandInfo: BrandInfo) => void;
  onConversationComplete: (complete: boolean) => void;
}

export default function AuraChatWindow({ onBrandInfoUpdate, onConversationComplete }: AuraChatWindowProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'aura',
      content: "Hello! I'm Aura, your AI brand companion. I'm here to help you discover your perfect brand identity by understanding your feelings, desires, and vision. Let's start with something personal - what inspired you to start this business? What feeling or moment made you think 'I need to create this'?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentQuestionStep, setCurrentQuestionStep] = useState(0);
  const [userResponses, setUserResponses] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Probing questions for brand discovery
  const probingQuestions = [
    "What inspired you to start this business? What feeling or moment made you think 'I need to create this'?",
    "When you imagine your ideal customer, what are they struggling with emotionally? What keeps them up at night?",
    "If your business was a person at a party, how would they dress and what would they talk about? Describe their personality.",
    "What's the one transformation you want to create in your customers' lives? How should they feel after working with you?",
    "Think about brands you admire - what emotions do they make you feel? What attracts you to them?",
    "If you could only say three words to describe what you do, what would they be? What's the essence?",
    "What's your biggest fear about how your brand might be perceived? What would devastate you to hear someone say?",
    "When you're successful, what impact will you have made on the world? What legacy do you want to leave?",
    "What colors make you feel most confident and powerful? What visual style speaks to your soul?",
    "If your brand had a voice, would it whisper wisdom, shout with excitement, or speak with calm authority?"
  ];

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const newUserMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, newUserMessage]);
      setIsTyping(true);

      // Store user response
      const updatedResponses = [...userResponses, userMessage];
      setUserResponses(updatedResponses);

      // Simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

      // Analyze responses and extract brand information
      const brandInfo = analyzeBrandFromResponses(updatedResponses);
      onBrandInfoUpdate(brandInfo);

      // Generate Aura's response
      let auraResponse = "";
      const nextStep = currentQuestionStep + 1;

      if (nextStep < probingQuestions.length) {
        // Continue with probing questions
        auraResponse = generateContextualResponse(userMessage, nextStep);
        setCurrentQuestionStep(nextStep);
      } else {
        // Conversation complete
        auraResponse = "Beautiful! I've gathered so much insight about your vision. I can feel the passion and purpose behind your brand. Let me synthesize everything we've discussed into a complete brand identity that truly represents who you are and what you stand for. Take a look at what I've discovered about your brand!";
        onConversationComplete(true);
      }

      const auraMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'aura',
        content: auraResponse,
        timestamp: new Date()
      };

      return auraMessage;
    },
    onSuccess: (auraMessage) => {
      setIsTyping(false);
      setMessages(prev => [...prev, auraMessage]);
    },
    onError: () => {
      setIsTyping(false);
    }
  });

  const generateContextualResponse = (userMessage: string, nextStep: number): string => {
    const responses = [
      "I can feel the passion in your words! That emotional drive is exactly what will make your brand authentic. ",
      "That's such a beautiful insight into your customers' hearts. Understanding their emotional journey is key. ",
      "I love how you described that personality! Your brand is already coming alive in my mind. ",
      "The transformation you want to create is so powerful. That's the soul of your brand right there. ",
      "Those emotional connections you mentioned tell me so much about your aesthetic preferences. ",
      "Those three words are like seeds of your brand essence. I can see them growing into something beautiful. ",
      "Thank you for sharing that vulnerability. Those fears often point us toward our greatest strengths. ",
      "Your vision for impact is inspiring! That legacy you want to leave will guide every brand decision. ",
      "I can sense how those colors resonate with your energy. Visual identity is so connected to our emotions. ",
      "The voice you described gives me chills! I can already hear your brand speaking to the world. "
    ];

    const contextualResponse = responses[Math.min(nextStep - 1, responses.length - 1)];
    const nextQuestion = probingQuestions[nextStep];

    return contextualResponse + nextQuestion;
  };

  const analyzeBrandFromResponses = (responses: string[]): BrandInfo => {
    // Simple AI-like analysis based on keywords and sentiment
    const allText = responses.join(' ').toLowerCase();
    
    // Analyze niche
    let niche = 'consulting';
    if (allText.includes('shop') || allText.includes('sell') || allText.includes('product')) niche = 'ecommerce';
    if (allText.includes('software') || allText.includes('app') || allText.includes('tech')) niche = 'saas';
    if (allText.includes('health') || allText.includes('wellness') || allText.includes('fitness')) niche = 'health';
    if (allText.includes('teach') || allText.includes('learn') || allText.includes('education')) niche = 'education';
    if (allText.includes('money') || allText.includes('finance') || allText.includes('investment')) niche = 'finance';

    // Analyze color preferences
    let colorPalette = { primary: '#3b82f6', secondary: '#8b5cf6', accent: '#06b6d4' };
    if (allText.includes('warm') || allText.includes('passionate') || allText.includes('energy')) {
      colorPalette = { primary: '#e11d48', secondary: '#f59e0b', accent: '#10b981' };
    } else if (allText.includes('calm') || allText.includes('trust') || allText.includes('professional')) {
      colorPalette = { primary: '#0891b2', secondary: '#0ea5e9', accent: '#22d3ee' };
    } else if (allText.includes('nature') || allText.includes('growth') || allText.includes('health')) {
      colorPalette = { primary: '#10b981', secondary: '#84cc16', accent: '#f59e0b' };
    }

    // Generate brand elements based on responses
    const brandInfo: BrandInfo = {
      niche,
      colorPalette,
      // These will be filled as more responses come in
      targetAudience: responses.length > 1 ? extractAudience(responses[1]) : undefined,
      mission: responses.length > 3 ? extractMission(responses[3]) : undefined,
      tagline: responses.length > 5 ? extractTagline(responses[5]) : undefined,
    };

    return brandInfo;
  };

  const extractAudience = (response: string): string => {
    // Simple extraction logic
    if (response.includes('entrepreneur')) return 'Entrepreneurs and business owners';
    if (response.includes('small business')) return 'Small business owners';
    if (response.includes('corporate') || response.includes('enterprise')) return 'Corporate professionals';
    if (response.includes('creative')) return 'Creative professionals';
    return 'Business professionals seeking growth';
  };

  const extractMission = (response: string): string => {
    // Extract mission from transformation response
    const words = response.split(' ');
    if (words.length > 10) {
      return `To ${response.toLowerCase().substring(0, 100)}...`;
    }
    return `To empower people through ${response.toLowerCase()}`;
  };

  const extractTagline = (response: string): string => {
    const words = response.split(' ').slice(0, 3);
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      chatMutation.mutate(inputMessage.trim());
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
        <CardTitle className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Chat with Aura</h3>
            <p className="text-purple-100 text-sm">Your AI Brand Discovery Companion</p>
          </div>
          <div className="ml-auto">
            <div className="flex items-center gap-2 text-purple-100">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs">Online</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'aura' && (
                  <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500">
                    <AvatarFallback className="bg-transparent">
                      <Bot className="h-4 w-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {message.role === 'user' && (
                  <Avatar className="w-8 h-8 bg-blue-500">
                    <AvatarFallback className="bg-transparent">
                      <User className="h-4 w-4 text-white" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500">
                  <AvatarFallback className="bg-transparent">
                    <Bot className="h-4 w-4 text-white" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-1 block">Aura is thinking...</span>
                </div>
              </div>
            )}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts and feelings..."
              className="flex-1 border-2 focus:border-purple-500"
              disabled={isTyping || chatMutation.isPending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping || chatMutation.isPending}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Press Enter to send • Aura analyzes your responses in real-time
          </p>
        </div>
      </CardContent>
    </Card>
  );
}