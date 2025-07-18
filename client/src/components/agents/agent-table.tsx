import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, MapPin, Plus, Download, Filter } from "lucide-react";
import type { Agent } from "@shared/schema";

interface AgentTableProps {
  agents: Agent[];
  isLoading: boolean;
}

export default function AgentTable({ agents, isLoading }: AgentTableProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      available: "bg-green-100 text-green-800",
      busy: "bg-blue-100 text-blue-800",
      offline: "bg-gray-100 text-gray-800",
    } as const;

    return (
      <Badge className={variants[status as keyof typeof variants] || variants.offline}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getCategoryBadge = (category: string) => {
    const variants = {
      internal: "bg-blue-100 text-blue-800",
      outsourced: "bg-orange-100 text-orange-800",
    } as const;

    return (
      <Badge className={variants[category as keyof typeof variants] || variants.internal}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  if (isLoading) {
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
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Agent Management</h3>
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
              <Plus className="h-4 w-4 mr-1" />
              Add Agent
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="directory" className="w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <TabsList>
            <TabsTrigger value="directory">Directory</TabsTrigger>
            <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="directory">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Name</TableHead>
                  <TableHead>Agent Type</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tasks Completed</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id} className="table-hover">
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {agent.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {agent.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-900 capitalize">
                        {agent.agentType.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getCategoryBadge(agent.agentCategory)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(agent.status)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-900">
                        {agent.tasksCompleted}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          {agent.rating}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">★</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Track Location">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="tracking">
          <div className="p-6">
            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-gray-500">Live Agent Tracking Map</p>
                <p className="text-sm text-gray-400">Real-time GPS locations</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <div className="p-6">
            <div className="text-center text-gray-500">
              Performance analytics coming soon...
            </div>
          </div>
        </TabsContent>

        <TabsContent value="assignments">
          <div className="p-6">
            <div className="text-center text-gray-500">
              Assignment management coming soon...
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
