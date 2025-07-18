import { useQuery } from "@tanstack/react-query";
import DeliveryTable from "@/components/deliveries/delivery-table";

export default function Deliveries() {
  const { data: deliveries = [], isLoading } = useQuery({
    queryKey: ["/api/deliveries"],
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Deliveries Management</h1>
        <p className="text-gray-600">Manage all delivery orders and assignments</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <DeliveryTable deliveries={deliveries} isLoading={isLoading} />
      </div>
    </div>
  );
}
