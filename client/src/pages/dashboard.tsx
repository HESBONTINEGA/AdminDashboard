import { useQuery } from "@tanstack/react-query";
import MetricsCards from "@/components/dashboard/metrics-cards";
import LiveMap from "@/components/dashboard/live-map";
import PerformanceOverview from "@/components/dashboard/performance-overview";
import DeliveryTable from "@/components/deliveries/delivery-table";

export default function Dashboard() {
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  const { data: deliveries = [], isLoading: deliveriesLoading } = useQuery({
    queryKey: ["/api/deliveries"],
  });

  return (
    <div>
      {/* Dashboard Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Real-time delivery operations monitoring</p>
      </div>

      {/* Key Metrics Cards */}
      <MetricsCards metrics={metrics} isLoading={metricsLoading} />

      {/* Live Map and Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <LiveMap />
        <PerformanceOverview />
      </div>

      {/* Recent Deliveries Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Deliveries</h3>
          </div>
        </div>
        <DeliveryTable 
          deliveries={deliveries} 
          isLoading={deliveriesLoading} 
          showFilters={false}
          limit={5}
        />
      </div>
    </div>
  );
}
