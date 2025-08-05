import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  Eye, 
  Mail, 
  Users, 
  TrendingUp, 
  Gift, 
  Code, 
  Plus,
  Search,
  Filter,
  UserPlus,
  ExternalLink,
  Sparkles,
  Target,
  FileText,
  Settings
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ContactHub() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [entryTypeFilter, setEntryTypeFilter] = useState("all");
  
  // Lead Magnet Creation State
  const [isCreatingMagnet, setIsCreatingMagnet] = useState(false);
  const [magnetForm, setMagnetForm] = useState({
    title: "",
    description: "",
    type: "",
    targetAudience: "",
    deliveryMethod: "email"
  });

  // Contact Form Builder State
  const [formBuilder, setFormBuilder] = useState({
    formTitle: "Join Our Community",
    fields: ["name", "email"],
    ctaText: "Get Free Access",
    thankYouMessage: "Thanks! Check your email for your free gift.",
    redirectUrl: ""
  });

  // Enhanced stats with real-time updates
  const { data: contactStats } = useQuery({
    queryKey: ['/api/contact-stats'],
    queryFn: () => fetch('/api/contact-stats').then(res => res.ok ? res.json() : {
      totalContacts: 0,
      customers: 0,
      learnEarnParticipants: 0,
      leadMagnets: 0,
      conversionRate: 0,
      monthlyGrowth: 0
    }),
    refetchInterval: 30000 // Update every 30 seconds
  });

  // Enhanced contacts with full lead journey
  const { data: contacts, isLoading } = useQuery({
    queryKey: ['/api/contacts', searchQuery, statusFilter, entryTypeFilter],
    queryFn: () => fetch(`/api/contacts?search=${searchQuery}&status=${statusFilter}&type=${entryTypeFilter}`)
      .then(res => res.ok ? res.json() : []),
  });

  // Lead Magnets query
  const { data: leadMagnets } = useQuery({
    queryKey: ['/api/lead-magnets'],
    queryFn: () => fetch('/api/lead-magnets').then(res => res.ok ? res.json() : []),
  });

  const createLeadMagnetMutation = useMutation({
    mutationFn: async (magnetData: any) => {
      return apiRequest("POST", "/api/lead-magnets", {
        userId: "demo-user-id",
        ...magnetData,
        timestamp: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/lead-magnets'] });
      setIsCreatingMagnet(false);
      setMagnetForm({ title: "", description: "", type: "", targetAudience: "", deliveryMethod: "email" });
      toast({
        title: "🎁 Lead Magnet Created!",
        description: "Your lead magnet is ready to capture emails.",
      });
    }
  });

  const generateFormCodeMutation = useMutation({
    mutationFn: async (formConfig: any) => {
      return apiRequest("POST", "/api/contact-forms", {
        userId: "demo-user-id",
        ...formConfig,
        timestamp: new Date().toISOString()
      });
    },
    onSuccess: (data) => {
      navigator.clipboard.writeText(data.embedCode);
      toast({
        title: "📋 Form Code Generated!",
        description: "Embed code copied to clipboard. Paste it anywhere on your website.",
      });
    }
  });

  const exportContactsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/contacts/export", {
        userId: "demo-user-id",
        filters: { search: searchQuery, status: statusFilter, type: entryTypeFilter }
      });
    },
    onSuccess: (data) => {
      // Trigger download
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      toast({
        title: "📊 Export Complete!",
        description: "Your contacts have been exported to CSV.",
      });
    }
  });

  const stats = contactStats || {
    totalContacts: 1247,
    customers: 89,
    learnEarnParticipants: 456,
    leadMagnets: 3,
    conversionRate: 19.5,
    monthlyGrowth: 23.4
  };

  const mockContacts = contacts || [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.j@email.com", 
      phone: "+1-555-0123",
      entryType: "learn_and_earn",
      status: "customer",
      source: "Business Growth Quiz",
      mvpInterest: "Automation Suite",
      createdAt: "2025-01-20T10:30:00Z",
      lastActivity: "2025-01-25T14:22:00Z"
    },
    {
      id: "2", 
      name: "Michael Chen",
      email: "m.chen@company.com",
      phone: "+1-555-0124",
      entryType: "mvp_checkout", 
      status: "customer",
      source: "Direct MVP Purchase",
      mvpInterest: "E-commerce Platform",
      createdAt: "2025-01-19T15:45:00Z",
      lastActivity: "2025-01-25T16:10:00Z"
    },
    {
      id: "3",
      name: "Emma Rodriguez", 
      email: "emma.r@startup.io",
      phone: "",
      entryType: "learn_and_earn",
      status: "lead", 
      source: "Marketing Quiz",
      mvpInterest: "Content Generator",
      createdAt: "2025-01-18T09:15:00Z",
      lastActivity: "2025-01-20T11:30:00Z"
    }
  ];

  const mockLeadMagnets = leadMagnets || [
    {
      id: "1",
      title: "Ultimate Business Growth Guide",
      type: "PDF",
      downloads: 234,
      conversionRate: 23.5,
      status: "active"
    },
    {
      id: "2",
      title: "Marketing Automation Toolkit",
      type: "Template Pack",
      downloads: 156,
      conversionRate: 18.2,
      status: "active"
    }
  ];

  const filteredContacts = mockContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || contact.status === statusFilter;
    const matchesType = entryTypeFilter === "all" || contact.entryType === entryTypeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      customer: "bg-green-500 text-white",
      lead: "bg-blue-500 text-white",
      prospect: "bg-yellow-500 text-black"
    };
    return variants[status as keyof typeof variants] || "bg-gray-500 text-white";
  };

  const getEntryTypeBadge = (type: string) => {
    const types = {
      learn_and_earn: "🎯 Quiz",
      mvp_checkout: "🛒 Purchase", 
      contact_form: "📝 Form",
      referral: "👥 Referral"
    };
    return types[type as keyof typeof types] || type;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-bodigi-gradient text-white p-8 rounded-2xl shadow-bodigi">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-white/20 p-3 rounded-xl">
            <Users className="h-8 w-8 text-bodigi-gold" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Contact Hub</h1>
            <p className="text-white/90 text-lg">Manage leads, create magnets, and track conversions</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-white/10 p-4 rounded-lg text-center">
            <Users className="h-6 w-6 text-bodigi-gold mx-auto mb-2" />
            <h3 className="text-2xl font-bold">{stats.totalContacts.toLocaleString()}</h3>
            <p className="text-sm text-white/80">Total Contacts</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg text-center">
            <UserPlus className="h-6 w-6 text-bodigi-gold mx-auto mb-2" />
            <h3 className="text-2xl font-bold">{stats.customers}</h3>
            <p className="text-sm text-white/80">Customers</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg text-center">
            <Target className="h-6 w-6 text-bodigi-gold mx-auto mb-2" />
            <h3 className="text-2xl font-bold">{stats.learnEarnParticipants}</h3>
            <p className="text-sm text-white/80">Quiz Participants</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg text-center">
            <Gift className="h-6 w-6 text-bodigi-gold mx-auto mb-2" />
            <h3 className="text-2xl font-bold">{stats.leadMagnets}</h3>
            <p className="text-sm text-white/80">Lead Magnets</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg text-center">
            <TrendingUp className="h-6 w-6 text-bodigi-gold mx-auto mb-2" />
            <h3 className="text-2xl font-bold">{stats.conversionRate}%</h3>
            <p className="text-sm text-white/80">Conversion Rate</p>
          </div>
          <div className="bg-white/10 p-4 rounded-lg text-center">
            <Sparkles className="h-6 w-6 text-bodigi-gold mx-auto mb-2" />
            <h3 className="text-2xl font-bold">+{stats.monthlyGrowth}%</h3>
            <p className="text-sm text-white/80">Monthly Growth</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="contacts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Contacts
          </TabsTrigger>
          <TabsTrigger value="magnets" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Lead Magnets
          </TabsTrigger>
          <TabsTrigger value="forms" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Form Builder
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-6">
          {/* Contact Management */}
          <Card className="shadow-bodigi">
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-bold text-black">Contact Management</CardTitle>
                  <p className="text-gray-600">View and manage all your leads and customers</p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => exportContactsMutation.mutate()}
                    variant="outline"
                    className="border-bodigi-gold text-bodigi-gradient-start hover:bg-bodigi-gold hover:text-black"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-2 focus:border-bodigi-gold"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="lead">Leads</SelectItem>
                    <SelectItem value="customer">Customers</SelectItem>
                    <SelectItem value="prospect">Prospects</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={entryTypeFilter} onValueChange={setEntryTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="learn_and_earn">Learn & Earn</SelectItem>
                    <SelectItem value="mvp_checkout">MVP Purchase</SelectItem>
                    <SelectItem value="contact_form">Contact Form</SelectItem>
                    <SelectItem value="referral">Referral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Contacts Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-semibold">Contact</th>
                      <th className="text-left p-3 font-semibold">Source</th>
                      <th className="text-left p-3 font-semibold">Status</th>
                      <th className="text-left p-3 font-semibold">MVP Interest</th>
                      <th className="text-left p-3 font-semibold">Added</th>
                      <th className="text-left p-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredContacts.map((contact) => (
                      <tr key={contact.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div>
                            <p className="font-semibold">{contact.name}</p>
                            <p className="text-sm text-gray-600">{contact.email}</p>
                            {contact.phone && (
                              <p className="text-sm text-gray-500">{contact.phone}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <Badge variant="outline" className="mb-1">
                              {getEntryTypeBadge(contact.entryType)}
                            </Badge>
                            <p className="text-xs text-gray-500">{contact.source}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusBadge(contact.status)}>
                            {contact.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          <p className="text-sm font-medium">{contact.mvpInterest}</p>
                        </td>
                        <td className="p-3">
                          <p className="text-sm">{new Date(contact.createdAt).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-500">
                            Last: {new Date(contact.lastActivity).toLocaleDateString()}
                          </p>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Mail className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="magnets" className="space-y-6">
          {/* Lead Magnets */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-black">Lead Magnets</h2>
              <p className="text-gray-600">Create valuable content to capture emails</p>
            </div>
            <Button 
              onClick={() => setIsCreatingMagnet(true)}
              className="bg-bodigi-gradient text-white hover:shadow-lg hover-lift"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Lead Magnet
            </Button>
          </div>

          {isCreatingMagnet ? (
            <Card className="shadow-bodigi">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle>Create New Lead Magnet</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input 
                      placeholder="e.g., Ultimate Business Growth Guide"
                      value={magnetForm.title}
                      onChange={(e) => setMagnetForm(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={magnetForm.type} onValueChange={(value) => setMagnetForm(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Guide</SelectItem>
                        <SelectItem value="template">Template Pack</SelectItem>
                        <SelectItem value="checklist">Checklist</SelectItem>
                        <SelectItem value="video">Video Course</SelectItem>
                        <SelectItem value="toolkit">Toolkit Bundle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea 
                    placeholder="Describe what value this provides..."
                    value={magnetForm.description}
                    onChange={(e) => setMagnetForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Target Audience</Label>
                  <Input 
                    placeholder="e.g., Small business owners, Entrepreneurs"
                    value={magnetForm.targetAudience}
                    onChange={(e) => setMagnetForm(prev => ({ ...prev, targetAudience: e.target.value }))}
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => setIsCreatingMagnet(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => createLeadMagnetMutation.mutate(magnetForm)}
                    disabled={!magnetForm.title || !magnetForm.type}
                    className="flex-1 bg-bodigi-gradient text-white"
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    Create Lead Magnet
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockLeadMagnets.map((magnet) => (
                <Card key={magnet.id} className="shadow-bodigi hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-bodigi-gradient p-3 rounded-lg">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <Badge className="bg-green-500 text-white">{magnet.status}</Badge>
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2">{magnet.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{magnet.type}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-bodigi-gradient-start">{magnet.downloads}</p>
                        <p className="text-xs text-gray-500">Downloads</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-bodigi-gradient-start">{magnet.conversionRate}%</p>
                        <p className="text-xs text-gray-500">Conversion</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="mr-1 h-3 w-3" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Settings className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="forms" className="space-y-6">
          {/* Contact Form Builder */}
          <Card className="shadow-bodigi">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-xl font-bold text-black">Contact Form Builder</CardTitle>
              <p className="text-gray-600">Create embeddable forms for your website</p>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Form Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Form Settings</h3>
                  
                  <div className="space-y-2">
                    <Label>Form Title</Label>
                    <Input 
                      value={formBuilder.formTitle}
                      onChange={(e) => setFormBuilder(prev => ({ ...prev, formTitle: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Call-to-Action Text</Label>
                    <Input 
                      value={formBuilder.ctaText}
                      onChange={(e) => setFormBuilder(prev => ({ ...prev, ctaText: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Thank You Message</Label>
                    <Textarea 
                      value={formBuilder.thankYouMessage}
                      onChange={(e) => setFormBuilder(prev => ({ ...prev, thankYouMessage: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Redirect URL (Optional)</Label>
                    <Input 
                      placeholder="https://yourdomain.com/thank-you"
                      value={formBuilder.redirectUrl}
                      onChange={(e) => setFormBuilder(prev => ({ ...prev, redirectUrl: e.target.value }))}
                    />
                  </div>

                  <Button 
                    onClick={() => generateFormCodeMutation.mutate(formBuilder)}
                    className="w-full bg-bodigi-gradient text-white font-bold hover:shadow-lg hover-lift"
                  >
                    <Code className="mr-2 h-4 w-4" />
                    Generate Embed Code
                  </Button>
                </div>

                {/* Form Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Live Preview</h3>
                  
                  <div className="border-2 border-gray-200 rounded-lg p-6 bg-white">
                    <div className="max-w-md mx-auto">
                      <h2 className="text-2xl font-bold text-center mb-4">{formBuilder.formTitle}</h2>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Name *</Label>
                          <Input placeholder="Enter your name" />
                        </div>
                        <div>
                          <Label>Email *</Label>
                          <Input type="email" placeholder="Enter your email" />
                        </div>
                        <Button className="w-full bg-bodigi-gradient text-white">
                          {formBuilder.ctaText}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="shadow-bodigi">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">87%</h3>
                <p className="text-gray-600">Email Open Rate</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-bodigi">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">34%</h3>
                <p className="text-gray-600">Lead to Customer</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-bodigi">
              <CardContent className="p-6 text-center">
                <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">12.3</h3>
                <p className="text-gray-600">Avg. Quiz Score</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-bodigi">
              <CardContent className="p-6 text-center">
                <Gift className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <h3 className="text-2xl font-bold">156</h3>
                <p className="text-gray-600">Rewards Claimed</p>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-bodigi">
            <CardHeader>
              <CardTitle>Contact Sources Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Learn & Earn Quizzes</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-bodigi-gradient h-2 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                    <span className="font-semibold">67%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>MVP Direct Purchases</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                    <span className="font-semibold">23%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Contact Forms</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                    <span className="font-semibold">10%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
