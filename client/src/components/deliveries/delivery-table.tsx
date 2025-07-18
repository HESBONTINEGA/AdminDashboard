import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye, MapPin, UserPlus, Phone, Check, Receipt, Filter, Download, Plus } from "lucide-react";
import type { Delivery, Customer, Agent } from "@shared/schema";

interface DeliveryTableProps {
  deliveries: Delivery[];
  isLoading: boolean;
  showFilters?: boolean;
  limit?: number;
}

export default function DeliveryTable({ deliveries, isLoading, showFilters = true, limit }: DeliveryTableProps) {
  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const { data: agents = [] } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const getCustomer = (customerId: number) => 
    customers.find(c => c.id === customerId);

  const getAgent = (agentId: number | null) => 
    agentId ? agents.find(a => a.id === agentId) : null;

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "default",
      active: "default", 
      completed: "default",
      overdue: "destructive",
    } as const;

    const colors = {
      pending: "status-pending",
      active: "status-active", 
      completed: "status-completed",
      overdue: "status-overdue",
    } as const;

    return (
      <Badge className={colors[status as keyof typeof colors] || "status-pending"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getETA = (delivery: Delivery) => {
    if (delivery.status === "completed") return "Completed";
    if (delivery.status === "pending") return "-";
    
    const now = new Date();
    const created = new Date(delivery.createdAt!);
    const elapsed = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    const estimated = delivery.estimatedTime || 60;
    
    if (elapsed > estimated) {
      return <span className="text-red-600">+{elapsed - estimated} min</span>;
    } else {
      return <span className="text-green-600">{estimated - elapsed} min</span>;
    }
  };

  const displayDeliveries = limit ? deliveries.slice(0, limit) : deliveries;

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
      {showFilters && (
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Deliveries</h3>
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
                New Delivery
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Invoice #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>ETA</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayDeliveries.map((delivery) => {
              const customer = getCustomer(delivery.customerId);
              const agent = getAgent(delivery.agentId);
              
              return (
                <TableRow key={delivery.id} className="table-hover">
                  <TableCell>
                    <span className="text-sm font-medium text-primary">
                      {delivery.invoiceNumber}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {customer?.name || "Unknown"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {customer?.phone || ""}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-900 capitalize">
                      {delivery.deliveryType}
                    </span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(delivery.status)}
                  </TableCell>
                  <TableCell>
                    {agent ? (
                      <div>
                        <div className="text-sm text-gray-900">{agent.name}</div>
                        <div className="text-xs text-gray-500 capitalize">
                          {agent.agentType.replace('_', ' ')}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">Unassigned</div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    {getETA(delivery)}
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm ${
                      delivery.paymentStatus === "paid" ? "text-green-600" : "text-gray-900"
                    }`}>
                      {delivery.paymentMethod.toUpperCase()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" title="View Details">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {delivery.status === "active" && (
                        <Button variant="ghost" size="icon" title="Track">
                          <MapPin className="h-4 w-4" />
                        </Button>
                      )}
                      {delivery.status === "pending" && (
                        <Button variant="ghost" size="icon" title="Assign Agent">
                          <UserPlus className="h-4 w-4" />
                        </Button>
                      )}
                      {delivery.status === "active" && (
                        <Button variant="ghost" size="icon" title="Complete">
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {delivery.status === "completed" && (
                        <Button variant="ghost" size="icon" title="Receipt">
                          <Receipt className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {!limit && displayDeliveries.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing 1 to {displayDeliveries.length} of {deliveries.length} deliveries
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">Previous</Button>
              <Button size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
