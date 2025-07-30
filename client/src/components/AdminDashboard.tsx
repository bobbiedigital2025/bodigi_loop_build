import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Rocket, Brain, Download, Settings, Mail, UserPlus, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  // Fetch platform stats
  const { data: platformStats, isLoading } = useQuery({
    queryKey: ["/api/analytics/platform-stats"],
    enabled: true
  });

  const stats = platformStats || {
    totalUsers: 2847,
    totalContacts: 1247,
    customers: 89,
    revenue: 47589,
    activeMVPs: 156,
    quizCompletions: 1023,
    conversionRate: 19.5
  };

  // Mock data for top MVPs and recent activity
  const topMVPs = [
    {
      name: "FlowBoost Pro",
      owner: "John Smith",
      revenue: 12450,
      customers: 89,
      icon: "⚡"
    },
    {
      name: "DataSync Master", 
      owner: "Maria Garcia",
      revenue: 8920,
      customers: 64,
      icon: "📊"
    },
    {
      name: "AutoFlow Suite",
      owner: "David Chen", 
      revenue: 7680,
      customers: 52,
      icon: "⚙️"
    }
  ];

  const recentActivity = [
    {
      type: "user",
      description: "New user Sarah Johnson completed FlowBoost Pro quiz",
      timestamp: "2 minutes ago",
      icon: UserPlus
    },
    {
      type: "purchase",
      description: "MVP purchase: DataSync Master - $197/month", 
      timestamp: "15 minutes ago",
      icon: DollarSign
    },
    {
      type: "mvp",
      description: "New MVP created: TaskFlow Pro by Alex Turner",
      timestamp: "1 hour ago", 
      icon: Rocket
    },
    {
      type: "quiz",
      description: "Quiz loop completed with 85% conversion rate",
      timestamp: "3 hours ago",
      icon: Brain
    }
  ];

  const handleExportData = () => {
    console.log("Export all data");
  };

  const handleViewSettings = () => {
    console.log("View platform settings");
  };

  const handleSendBroadcast = () => {
    console.log("Send broadcast");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Users className="text-primary text-xl" size={24} />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-slate-900">{stats.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-slate-600">Total Platform Users</div>
              <div className="text-xs text-success mt-1">+12% this month</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-success/10 rounded-lg">
              <DollarSign className="text-success text-xl" size={24} />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-slate-900">${stats.revenue.toLocaleString()}</div>
              <div className="text-sm text-slate-600">Monthly Revenue</div>
              <div className="text-xs text-success mt-1">+8% this month</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-lg">
              <Rocket className="text-amber-600 text-xl" size={24} />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-slate-900">{stats.activeMVPs}</div>
              <div className="text-sm text-slate-600">Active MVPs</div>
              <div className="text-xs text-success mt-1">+23 this week</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Brain className="text-purple-600 text-xl" size={24} />
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-slate-900">{stats.quizCompletions.toLocaleString()}</div>
              <div className="text-sm text-slate-600">Quiz Completions</div>
              <div className="text-xs text-success mt-1">+15% this week</div>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Platform Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing MVPs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Top Performing MVPs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMVPs.map((mvp, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white text-lg">
                      {mvp.icon}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{mvp.name}</div>
                      <div className="text-sm text-slate-600">by {mvp.owner}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900">${mvp.revenue.toLocaleString()}</div>
                    <div className="text-sm text-slate-600">{mvp.customers} customers</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">Recent Platform Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                const iconColors = {
                  user: "bg-success/10 text-success",
                  purchase: "bg-primary/10 text-primary", 
                  mvp: "bg-amber-100 text-amber-600",
                  quiz: "bg-purple-100 text-purple-600"
                };
                
                return (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mt-1 ${iconColors[activity.type as keyof typeof iconColors]}`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1">
                      <div 
                        className="text-sm text-slate-900"
                        dangerouslySetInnerHTML={{ __html: activity.description }}
                      />
                      <div className="text-xs text-slate-500">{activity.timestamp}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Platform Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">Platform Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline"
              onClick={handleExportData}
              className="flex items-center justify-center space-x-2 p-4 h-auto"
            >
              <Download className="text-slate-600" size={20} />
              <span className="font-medium text-slate-700">Export All Data</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleViewSettings} 
              className="flex items-center justify-center space-x-2 p-4 h-auto"
            >
              <Settings className="text-slate-600" size={20} />
              <span className="font-medium text-slate-700">Platform Settings</span>
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleSendBroadcast}
              className="flex items-center justify-center space-x-2 p-4 h-auto"
            >
              <Mail className="text-slate-600" size={20} />
              <span className="font-medium text-slate-700">Send Broadcast</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
