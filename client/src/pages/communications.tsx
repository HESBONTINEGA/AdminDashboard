import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Send, 
  Filter, 
  Download, 
  Bell, 
  MessageSquare, 
  Mail, 
  Calendar,
  Users,
  Eye,
  Edit,
  Trash2
} from "lucide-react";

interface NotificationTemplate {
  id: number;
  name: string;
  type: 'push' | 'sms' | 'email';
  subject?: string;
  content: string;
  createdAt: string;
}

interface Campaign {
  id: number;
  name: string;
  type: 'push' | 'sms' | 'email';
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  recipients: number;
  sent: number;
  opened?: number;
  clicked?: number;
  scheduledAt?: string;
  sentAt?: string;
}

export default function CommunicationsPage() {
  const [selectedTab, setSelectedTab] = useState("push");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Mock data for demonstration
  const templates: NotificationTemplate[] = [
    {
      id: 1,
      name: "Delivery Assigned",
      type: "push",
      content: "Your delivery has been assigned to {agent_name}. Track your order with invoice {invoice_number}.",
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      name: "Order Confirmation",
      type: "sms",
      content: "Hi {customer_name}, your order {invoice_number} totaling {amount} has been confirmed. Expected delivery in {eta} minutes.",
      createdAt: "2024-01-14T09:15:00Z"
    },
    {
      id: 3,
      name: "Weekly Report",
      type: "email",
      subject: "Weekly Delivery Report - {week_date}",
      content: "Dear {recipient_name}, please find attached your weekly delivery performance report...",
      createdAt: "2024-01-13T16:45:00Z"
    }
  ];

  const campaigns: Campaign[] = [
    {
      id: 1,
      name: "New Year Promotion",
      type: "push",
      status: "sent",
      recipients: 1250,
      sent: 1247,
      opened: 892,
      clicked: 134,
      sentAt: "2024-01-01T08:00:00Z"
    },
    {
      id: 2,
      name: "Service Update Notice",
      type: "sms",
      status: "sent",
      recipients: 2100,
      sent: 2098,
      sentAt: "2024-01-10T14:30:00Z"
    },
    {
      id: 3,
      name: "Monthly Newsletter",
      type: "email",
      status: "scheduled",
      recipients: 850,
      sent: 0,
      scheduledAt: "2024-01-25T09:00:00Z"
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: "bg-gray-100 text-gray-800",
      scheduled: "bg-blue-100 text-blue-800",
      sent: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800"
    } as const;

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.draft}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'push':
        return <Bell className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Communications Center</h1>
        <p className="text-gray-600">Manage notifications, messages, and customer communications</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <div className="mb-6">
          <TabsList>
            <TabsTrigger value="push" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Push Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="sms" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>SMS</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>Email</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Push Notifications Tab */}
        <TabsContent value="push">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sent Today</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">+12% from yesterday</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">71.5%</div>
                <p className="text-xs text-muted-foreground">+2.1% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Templates</CardTitle>
                <Edit className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">3 updated this week</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Templates */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Push Templates</CardTitle>
                  <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        New Template
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Create Push Template</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="template-name">Template Name</Label>
                          <Input id="template-name" placeholder="Enter template name" />
                        </div>
                        <div>
                          <Label htmlFor="template-content">Message Content</Label>
                          <Textarea 
                            id="template-content" 
                            placeholder="Enter message content with variables like {customer_name}"
                            rows={4}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={() => setIsCreateDialogOpen(false)}>
                            Create Template
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {templates.filter(t => t.type === 'push').map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{template.name}</div>
                        <div className="text-xs text-gray-500 truncate">{template.content}</div>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Campaign History */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Campaigns</CardTitle>
                  <Button size="sm">
                    <Send className="h-4 w-4 mr-1" />
                    New Campaign
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {campaigns.filter(c => c.type === 'push').map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{campaign.name}</span>
                          {getStatusBadge(campaign.status)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {campaign.sent}/{campaign.recipients} sent
                          {campaign.opened && ` • ${campaign.opened} opened`}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SMS Tab */}
        <TabsContent value="sms">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">SMS Management</h3>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export Logs
                  </Button>
                  <Button size="sm">
                    <Send className="h-4 w-4 mr-1" />
                    Bulk Send
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="campaigns" className="w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <TabsList>
                  <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                  <TabsTrigger value="templates">Templates</TabsTrigger>
                  <TabsTrigger value="logs">Message Logs</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="campaigns">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Campaign</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Recipients</TableHead>
                        <TableHead>Sent</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaigns.filter(c => c.type === 'sms').map((campaign) => (
                        <TableRow key={campaign.id} className="table-hover">
                          <TableCell>
                            <div className="font-medium">{campaign.name}</div>
                          </TableCell>
                          <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                          <TableCell>{campaign.recipients}</TableCell>
                          <TableCell>{campaign.sent}</TableCell>
                          <TableCell>
                            {campaign.sentAt ? new Date(campaign.sentAt).toLocaleDateString() : 
                             campaign.scheduledAt ? `Scheduled: ${new Date(campaign.scheduledAt).toLocaleDateString()}` : '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="templates">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.filter(t => t.type === 'sms').map((template) => (
                      <Card key={template.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600">{template.content}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Created: {new Date(template.createdAt).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="logs">
                <div className="p-6">
                  <div className="text-center text-gray-500">
                    SMS message logs will appear here...
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        {/* Email Tab */}
        <TabsContent value="email">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Email Marketing</h3>
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-1" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button size="sm">
                    <Mail className="h-4 w-4 mr-1" />
                    New Campaign
                  </Button>
                </div>
              </div>
            </div>

            <Tabs defaultValue="campaigns" className="w-full">
              <div className="px-6 py-4 border-b border-gray-200">
                <TabsList>
                  <TabsTrigger value="campaigns">Email Campaigns</TabsTrigger>
                  <TabsTrigger value="templates">Email Templates</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="campaigns">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Campaign</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Recipients</TableHead>
                        <TableHead>Delivered</TableHead>
                        <TableHead>Opened</TableHead>
                        <TableHead>Clicked</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {campaigns.filter(c => c.type === 'email').map((campaign) => (
                        <TableRow key={campaign.id} className="table-hover">
                          <TableCell>
                            <div className="font-medium">{campaign.name}</div>
                          </TableCell>
                          <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                          <TableCell>{campaign.recipients}</TableCell>
                          <TableCell>{campaign.sent}</TableCell>
                          <TableCell>{campaign.opened || '-'}</TableCell>
                          <TableCell>{campaign.clicked || '-'}</TableCell>
                          <TableCell>
                            {campaign.sentAt ? new Date(campaign.sentAt).toLocaleDateString() : 
                             campaign.scheduledAt ? `Scheduled: ${new Date(campaign.scheduledAt).toLocaleDateString()}` : '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="templates">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {templates.filter(t => t.type === 'email').map((template) => (
                      <Card key={template.id}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">{template.name}</CardTitle>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="icon">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {template.subject && (
                            <p className="text-sm font-medium text-gray-900 mb-2">
                              Subject: {template.subject}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">{template.content}</p>
                          <p className="text-xs text-gray-400 mt-2">
                            Created: {new Date(template.createdAt).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="analytics">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Open Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">24.5%</div>
                        <p className="text-xs text-gray-500">Industry avg: 21.3%</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Click Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">3.2%</div>
                        <p className="text-xs text-gray-500">Industry avg: 2.6%</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Bounce Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-orange-600">1.8%</div>
                        <p className="text-xs text-gray-500">Industry avg: 2.1%</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
