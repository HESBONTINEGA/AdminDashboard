import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Clock, Truck, AlertTriangle } from "lucide-react";
import type { DashboardMetrics } from "@/lib/types";

interface MetricsCardsProps {
  metrics?: DashboardMetrics;
  isLoading: boolean;
}

export default function MetricsCards({ metrics, isLoading }: MetricsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Active Agents",
      value: metrics?.activeAgents || "0/0",
      icon: TrendingUp,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      subtitle: "↑ 2 from yesterday",
      subtitleColor: "text-green-600",
    },
    {
      title: "Pending Deliveries",
      value: metrics?.pendingDeliveries?.toString() || "0",
      icon: Clock,
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      subtitle: "3 awaiting assignment",
      subtitleColor: "text-yellow-600",
    },
    {
      title: "Active Deliveries",
      value: metrics?.activeDeliveries?.toString() || "0",
      icon: Truck,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      subtitle: "Avg. 42 min remaining",
      subtitleColor: "text-blue-600",
    },
    {
      title: "Overdue Deliveries",
      value: metrics?.overdueDeliveries?.toString() || "0",
      icon: AlertTriangle,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      subtitle: "🔴 Requires attention",
      subtitleColor: "text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card) => (
        <Card key={card.title} className="border border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`w-12 h-12 ${card.iconBg} rounded-lg flex items-center justify-center`}>
                <card.icon className={`h-6 w-6 ${card.iconColor}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className={`text-sm font-medium ${card.subtitleColor}`}>
                {card.subtitle}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
