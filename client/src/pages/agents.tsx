import { useQuery } from "@tanstack/react-query";
import AgentTable from "@/components/agents/agent-table";

export default function Agents() {
  const { data: agents = [], isLoading } = useQuery({
    queryKey: ["/api/agents"],
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Agent Management</h1>
        <p className="text-gray-600">Manage delivery agents and track performance</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <AgentTable agents={agents} isLoading={isLoading} />
      </div>
    </div>
  );
}
