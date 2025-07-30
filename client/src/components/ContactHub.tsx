import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Download, Eye, Mail } from "lucide-react";

export default function ContactHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [entryTypeFilter, setEntryTypeFilter] = useState("all");

  // Mock stats - in real app would come from API
  const stats = {
    totalContacts: 1247,
    customers: 89,
    quizParticipants: 456,
    conversionRate: 19.5
  };

  // Mock contacts data - in real app would come from API
  const mockContacts = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.j@email.com", 
      entryType: "learn_and_earn",
      status: "customer",
      owner: "FlowBoost Pro",
      createdAt: "2025-01-20"
    },
    {
      id: "2", 
      name: "Michael Chen",
      email: "m.chen@company.com",
      entryType: "mvp_checkout", 
      status: "customer",
      owner: "FlowBoost Pro",
      createdAt: "2025-01-19"
    },
    {
      id: "3",
      name: "Emma Rodriguez", 
      email: "emma.r@startup.io",
      entryType: "learn_and_earn",
      status: "lead", 
      owner: "FlowBoost Pro",
      createdAt: "2025-01-18"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "customer": return "bg-success/10 text-success border-success/20";
      case "lead": return "bg-slate-100 text-slate-700 border-slate-300";
      case "churned": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  const getEntryTypeColor = (entryType: string) => {
    switch (entryType) {
      case "learn_and_earn": return "bg-primary/10 text-primary border-primary/20";
      case "mvp_checkout": return "bg-success/10 text-success border-success/20";
      case "newsletter": return "bg-amber-100 text-amber-700 border-amber-300";
      default: return "bg-slate-100 text-slate-700 border-slate-300";
    }
  };

  const handleExport = () => {
    // In real app, would trigger actual export
    console.log("Export contacts");
  };

  const handleViewContact = (contactId: string) => {
    console.log("View contact:", contactId);
  };

  const handleEmailContact = (contactId: string) => {
    console.log("Email contact:", contactId);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-slate-200 flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl font-semibold text-slate-900">Contact Hub</CardTitle>
          <p className="text-sm text-slate-600 mt-1">Centralized CRM for all leads and customers</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={entryTypeFilter} onValueChange={setEntryTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Entry Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entry Types</SelectItem>
              <SelectItem value="learn_and_earn">Learn & Earn</SelectItem>
              <SelectItem value="mvp_checkout">MVP Checkout</SelectItem>
              <SelectItem value="newsletter">Newsletter</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExport} size="sm">
            <Download className="mr-2" size={16} />
            Export
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-slate-900">{stats.totalContacts.toLocaleString()}</div>
            <div className="text-sm text-slate-600">Total Contacts</div>
          </div>
          <div className="bg-success/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-success">{stats.customers}</div>
            <div className="text-sm text-slate-600">Customers</div>
          </div>
          <div className="bg-primary/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">{stats.quizParticipants}</div>
            <div className="text-sm text-slate-600">Quiz Participants</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-amber-600">{stats.conversionRate}%</div>
            <div className="text-sm text-slate-600">Conversion Rate</div>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <Input 
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="lead">Lead</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="churned">Churned</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Contacts Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">Contact</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Entry Type</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Owner</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockContacts.map((contact) => (
                <tr key={contact.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-slate-900">{contact.name}</div>
                      <div className="text-sm text-slate-600">{contact.email}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={getEntryTypeColor(contact.entryType)}>
                      {contact.entryType}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge className={getStatusColor(contact.status)}>
                      {contact.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-slate-600">{contact.owner}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm text-slate-600">{contact.createdAt}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleViewContact(contact.id)}
                        className="text-primary hover:text-primary p-1"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button 
                        size="sm"
                        variant="ghost" 
                        onClick={() => handleEmailContact(contact.id)}
                        className="text-slate-600 hover:text-slate-700 p-1"
                      >
                        <Mail size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-slate-600">
            Showing 1 to 20 of 1,247 contacts
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
