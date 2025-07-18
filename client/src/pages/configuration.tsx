import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  Users, 
  MapPin, 
  Clock, 
  Bell, 
  Building2,
  Save,
  UserPlus,
  Eye,
  Shield
} from "lucide-react";
import type { Branch } from "@shared/schema";

interface DeliveryZone {
  id: number;
  name: string;
  description: string;
  estimatedTime: number;
  isActive: boolean;
}

interface LeaveType {
  id: number;
  name: string;
  daysAllowed: number;
  carryOver: boolean;
  requiresApproval: boolean;
  isActive: boolean;
}

interface NotificationTemplate {
  id: number;
  name: string;
  type: string;
  content: string;
  variables: string[];
  isActive: boolean;
}

export default function ConfigurationPage() {
  const [selectedTab, setSelectedTab] = useState("users");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: branches = [], isLoading: branchesLoading } = useQuery<Branch[]>({
    queryKey: ["/api/branches"],
  });

  // Mock data for demonstration
  const deliveryZones: DeliveryZone[] = [
    {
      id: 1,
      name: "CBD Zone",
      description: "Central Business District - High priority area",
      estimatedTime: 30,
      isActive: true
    },
    {
      id: 2,
      name: "Westlands",
      description: "Westlands and surrounding areas",
      estimatedTime: 45,
      isActive: true
    },
    {
      id: 3,
      name: "Karen/Langata",
      description: "Karen, Langata, and nearby suburbs",
      estimatedTime: 60,
      isActive: true
    }
  ];

  const leaveTypes: LeaveType[] = [
    {
      id: 1,
      name: "Annual Leave",
      daysAllowed: 21,
      carryOver: true,
      requiresApproval: true,
      isActive: true
    },
    {
      id: 2,
      name: "Sick Leave",
      daysAllowed: 14,
      carryOver: false,
      requiresApproval: false,
      isActive: true
    },
    {
      id: 3,
      name: "Maternity Leave",
      daysAllowed: 90,
      carryOver: false,
      requiresApproval: true,
      isActive: true
    },
    {
      id: 4,
      name: "Emergency Leave",
      daysAllowed: 5,
      carryOver: false,
      requiresApproval: true,
      isActive: true
    }
  ];

  const notificationTemplates: NotificationTemplate[] = [
    {
      id: 1,
      name: "Order Confirmation",
      type: "Customer Notification",
      content: "Hi {customer_name}, your order {invoice_number} has been confirmed and will be delivered in {estimated_time} minutes.",
      variables: ["customer_name", "invoice_number", "estimated_time"],
      isActive: true
    },
    {
      id: 2,
      name: "Agent Assignment",
      type: "Customer Notification",
      content: "Your order {invoice_number} has been assigned to {agent_name}. You can track your delivery in real-time.",
      variables: ["invoice_number", "agent_name"],
      isActive: true
    },
    {
      id: 3,
      name: "Leave Request",
      type: "HR Notification",
      content: "{employee_name} has submitted a {leave_type} request from {start_date} to {end_date}.",
      variables: ["employee_name", "leave_type", "start_date", "end_date"],
      isActive: true
    }
  ];

  const systemUsers = [
    {
      id: 1,
      username: "admin",
      email: "admin@topserve.com",
      role: "Administrator",
      branch: "Shop A (Main)",
      lastLogin: "2024-01-15T09:30:00Z",
      isActive: true
    },
    {
      id: 2,
      username: "manager",
      email: "manager@topserve.com",
      role: "Manager",
      branch: "Shop A (Main)",
      lastLogin: "2024-01-15T08:15:00Z",
      isActive: true
    }
  ];

  if (branchesLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
        <p className="text-gray-600">Manage system settings and configurations</p>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <div className="mb-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="branches" className="flex items-center space-x-2">
              <Building2 className="h-4 w-4" />
              <span>Branches</span>
            </TabsTrigger>
            <TabsTrigger value="zones" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Delivery Zones</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Templates</span>
            </TabsTrigger>
            <TabsTrigger value="leave" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Leave Types</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>System</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Users Management */}
        <TabsContent value="users">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Add User
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemUsers.map((user) => (
                    <TableRow key={user.id} className="table-hover">
                      <TableCell>
                        <div className="font-medium">{user.username}</div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{user.role}</Badge>
                      </TableCell>
                      <TableCell>{user.branch}</TableCell>
                      <TableCell>
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Shield className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* Branches Management */}
        <TabsContent value="branches">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Branch Management</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Branch
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Name</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branches.map((branch) => (
                    <TableRow key={branch.id} className="table-hover">
                      <TableCell>
                        <div className="font-medium">{branch.name}</div>
                      </TableCell>
                      <TableCell>{branch.address}</TableCell>
                      <TableCell>{branch.phone || "-"}</TableCell>
                      <TableCell>
                        <Badge variant={branch.isActive ? "default" : "secondary"}>
                          {branch.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* Delivery Zones */}
        <TabsContent value="zones">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Delivery Zones</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Zone
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Zone Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Estimated Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveryZones.map((zone) => (
                    <TableRow key={zone.id} className="table-hover">
                      <TableCell>
                        <div className="font-medium">{zone.name}</div>
                      </TableCell>
                      <TableCell>{zone.description}</TableCell>
                      <TableCell>{zone.estimatedTime} min</TableCell>
                      <TableCell>
                        <Badge variant={zone.isActive ? "default" : "secondary"}>
                          {zone.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* Notification Templates */}
        <TabsContent value="templates">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Notification Templates</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Template
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {notificationTemplates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">{template.name}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {template.type}
                          </Badge>
                        </div>
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
                      <p className="text-sm text-gray-600 mb-3">{template.content}</p>
                      <div className="flex flex-wrap gap-1">
                        {template.variables.map((variable) => (
                          <Badge key={variable} variant="secondary" className="text-xs">
                            {`{${variable}}`}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Leave Types */}
        <TabsContent value="leave">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Leave Types & Limits</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Leave Type
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Days Allowed</TableHead>
                    <TableHead>Carry Over</TableHead>
                    <TableHead>Requires Approval</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveTypes.map((leaveType) => (
                    <TableRow key={leaveType.id} className="table-hover">
                      <TableCell>
                        <div className="font-medium">{leaveType.name}</div>
                      </TableCell>
                      <TableCell>{leaveType.daysAllowed}</TableCell>
                      <TableCell>
                        <Badge variant={leaveType.carryOver ? "default" : "secondary"}>
                          {leaveType.carryOver ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={leaveType.requiresApproval ? "default" : "secondary"}>
                          {leaveType.requiresApproval ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={leaveType.isActive ? "default" : "secondary"}>
                          {leaveType.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="open-time">Opening Time</Label>
                    <Input id="open-time" type="time" defaultValue="08:00" />
                  </div>
                  <div>
                    <Label htmlFor="close-time">Closing Time</Label>
                    <Input id="close-time" type="time" defaultValue="18:00" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="weekend" />
                  <Label htmlFor="weekend">Weekend Operations</Label>
                </div>
                <Button size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  Save Hours
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="max-deliveries">Max Deliveries per Agent</Label>
                  <Input id="max-deliveries" type="number" defaultValue="5" />
                </div>
                <div>
                  <Label htmlFor="default-eta">Default ETA (minutes)</Label>
                  <Input id="default-eta" type="number" defaultValue="60" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="photo-required" defaultChecked />
                  <Label htmlFor="photo-required">Photo Verification Required</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="otp-required" />
                  <Label htmlFor="otp-required">OTP for High-Value Items</Label>
                </div>
                <Button size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  Save Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input id="company-name" defaultValue="TopServe Ltd" />
                </div>
                <div>
                  <Label htmlFor="company-phone">Phone Number</Label>
                  <Input id="company-phone" defaultValue="+254 700 000 000" />
                </div>
                <div>
                  <Label htmlFor="company-email">Email Address</Label>
                  <Input id="company-email" defaultValue="info@topserveltd.co.ke" />
                </div>
                <div>
                  <Label htmlFor="company-address">Address</Label>
                  <Textarea id="company-address" defaultValue="Nairobi, Kenya" />
                </div>
                <Button size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  Save Information
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Maintenance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="h-4 w-4 mr-2" />
                    View System Logs
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Save className="h-4 w-4 mr-2" />
                    Backup Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    System Health Check
                  </Button>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">
                    Last backup: January 15, 2024 at 3:00 AM
                  </p>
                  <p className="text-sm text-gray-600">
                    System status: All services operational
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
