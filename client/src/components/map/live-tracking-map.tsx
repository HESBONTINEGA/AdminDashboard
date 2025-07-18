import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, User, Package, MapPin } from "lucide-react";
import type { Agent, Delivery } from "@shared/schema";

interface LiveTrackingMapProps {
  isOpen: boolean;
  onClose: () => void;
}

type FilterType = "all" | "on_delivery" | "available";

interface AgentWithDeliveries extends Agent {
  deliveries?: Delivery[];
  totalPackages?: number;
}

export default function LiveTrackingMap({ isOpen, onClose }: LiveTrackingMapProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [selectedAgent, setSelectedAgent] = useState<AgentWithDeliveries | null>(null);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null);

  const { data: agents = [] } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const { data: deliveries = [] } = useQuery<Delivery[]>({
    queryKey: ["/api/deliveries"],
  });

  // Combine agents with their deliveries
  const agentsWithDeliveries: AgentWithDeliveries[] = agents.map(agent => {
    const agentDeliveries = deliveries.filter(d => d.agentId === agent.id && d.status === "active");
    return {
      ...agent,
      deliveries: agentDeliveries,
      totalPackages: agentDeliveries.reduce((total, delivery) => {
        return total + (Array.isArray(delivery.items) ? delivery.items.length : 1);
      }, 0)
    };
  });

  // Filter agents based on selected filter
  const filteredAgents = agentsWithDeliveries.filter(agent => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "on_delivery") return agent.status === "busy" && agent.deliveries && agent.deliveries.length > 0;
    if (selectedFilter === "available") return agent.status === "available";
    return true;
  });

  const getStatusBadge = (agent: AgentWithDeliveries) => {
    if (agent.status === "busy" && agent.deliveries && agent.deliveries.length > 0) {
      return (
        <Badge className="bg-blue-100 text-blue-800">
          {agent.deliveries.length} Stops
        </Badge>
      );
    }
    if (agent.status === "available") {
      return (
        <Badge className="bg-green-100 text-green-800">
          Available
        </Badge>
      );
    }
    return (
      <Badge className="bg-gray-100 text-gray-800">
        Offline
      </Badge>
    );
  };

  const getStatusDescription = (agent: AgentWithDeliveries) => {
    if (agent.status === "busy" && agent.totalPackages) {
      return `${agent.totalPackages} Total Packages`;
    }
    if (agent.status === "available") {
      return "Ready for assignment";
    }
    return "Currently offline";
  };

  const getMarkerIcon = (agent: AgentWithDeliveries) => {
    if (agent.status === "busy" && agent.deliveries && agent.deliveries.length > 0) {
      return (
        <div className="w-10 h-10 bg-blue-500 border-4 border-white rounded-full shadow-lg flex items-center justify-center text-white font-bold">
          {agent.deliveries.length}
        </div>
      );
    }
    if (agent.status === "available") {
      return (
        <div className="w-10 h-10 bg-green-500 border-4 border-white rounded-full shadow-lg flex items-center justify-center text-white">
          <User className="h-5 w-5" />
        </div>
      );
    }
    return (
      <div className="w-10 h-10 bg-gray-500 border-4 border-white rounded-full shadow-lg flex items-center justify-center text-white">
        <User className="h-5 w-5" />
      </div>
    );
  };

  const handleAgentClick = (agent: AgentWithDeliveries) => {
    setSelectedAgent(agent);
  };

  const handleAgentHover = (agentId: number | null) => {
    setHoveredAgent(agentId);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[95vh] w-full h-full p-0">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Package className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">TopServe Ltd</h1>
                  <p className="text-sm text-gray-600">Delivery Operations</p>
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant={selectedFilter === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedFilter("all")}
                className={selectedFilter === "all" ? "bg-white shadow-sm" : ""}
              >
                All Agents
              </Button>
              <Button
                variant={selectedFilter === "on_delivery" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedFilter("on_delivery")}
                className={selectedFilter === "on_delivery" ? "bg-white shadow-sm" : ""}
              >
                On Delivery
              </Button>
              <Button
                variant={selectedFilter === "available" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedFilter("available")}
                className={selectedFilter === "available" ? "bg-white shadow-sm" : ""}
              >
                Available
              </Button>
            </div>

            {/* Live Status & Close */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-medium">Live</span>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Collapsible Side Panel */}
            {!isPanelCollapsed && (
              <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Agents in View</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsPanelCollapsed(true)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {filteredAgents.map((agent) => (
                    <Card
                      key={agent.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        selectedAgent?.id === agent.id 
                          ? "ring-2 ring-primary shadow-md" 
                          : "hover:shadow-md"
                      } ${
                        hoveredAgent === agent.id ? "ring-1 ring-blue-300" : ""
                      }`}
                      onClick={() => handleAgentClick(agent)}
                      onMouseEnter={() => handleAgentHover(agent.id)}
                      onMouseLeave={() => handleAgentHover(null)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{agent.name}</h4>
                          {getStatusBadge(agent)}
                        </div>
                        <p className="text-sm text-gray-600">
                          {getStatusDescription(agent)}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {filteredAgents.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <MapPin className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p>No agents found for the selected filter</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Expand Panel Button */}
            {isPanelCollapsed && (
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsPanelCollapsed(false)}
                  className="bg-white shadow-md"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Map View */}
            <div className="flex-1 relative bg-gray-100">
              {/* Map Container */}
              <div className="w-full h-full flex items-center justify-center relative">
                {/* Mock Map Background */}
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
                  {/* Map Grid Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="grid grid-cols-12 grid-rows-8 h-full w-full">
                      {Array.from({ length: 96 }).map((_, i) => (
                        <div key={i} className="border border-gray-300"></div>
                      ))}
                    </div>
                  </div>

                  {/* Agent Markers */}
                  {filteredAgents.map((agent, index) => {
                    // Mock positions for demonstration
                    const positions = [
                      { top: "25%", left: "30%" },
                      { top: "45%", left: "60%" },
                      { top: "70%", left: "40%" },
                      { top: "35%", left: "75%" },
                      { top: "60%", left: "25%" },
                    ];
                    const position = positions[index % positions.length];
                    
                    return (
                      <div
                        key={agent.id}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                          hoveredAgent === agent.id ? "scale-110 z-20" : "z-10"
                        } ${
                          selectedAgent?.id === agent.id ? "scale-125 z-30" : ""
                        }`}
                        style={position}
                        onClick={() => handleAgentClick(agent)}
                        onMouseEnter={() => handleAgentHover(agent.id)}
                        onMouseLeave={() => handleAgentHover(null)}
                      >
                        {getMarkerIcon(agent)}
                      </div>
                    );
                  })}

                  {/* Map Label */}
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
                    <h3 className="font-medium text-gray-900">Nairobi, Kenya</h3>
                    <p className="text-sm text-gray-600">Live Agent Tracking</p>
                  </div>

                  {/* Zoom Controls */}
                  <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                    <Button variant="outline" size="icon" className="bg-white shadow-sm">
                      +
                    </Button>
                    <Button variant="outline" size="icon" className="bg-white shadow-sm">
                      -
                    </Button>
                  </div>
                </div>

                {/* Agent Popup */}
                {selectedAgent && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl border border-gray-200 p-6 min-w-80 z-40">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{selectedAgent.name}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedAgent(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {selectedAgent.status === "busy" && selectedAgent.deliveries && selectedAgent.deliveries.length > 0 ? (
                      <div>
                        <p className="text-sm text-gray-600 mb-4">
                          {selectedAgent.deliveries.length} Stops • {selectedAgent.totalPackages} Total Packages
                        </p>
                        <div className="border-t pt-4">
                          <h4 className="font-medium text-gray-900 mb-3">Active Deliveries</h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {selectedAgent.deliveries.map((delivery) => (
                              <div key={delivery.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <div>
                                  <p className="font-medium text-sm">{delivery.invoiceNumber}</p>
                                  <p className="text-xs text-gray-600">
                                    {delivery.deliveryAddress}
                                  </p>
                                </div>
                                <Button variant="link" size="sm" className="text-primary">
                                  Track It
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <User className="h-6 w-6 text-green-600" />
                        </div>
                        <p className="font-medium text-green-600">Available for new tasks</p>
                        <p className="text-sm text-gray-600 mt-1">Ready to accept deliveries</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}