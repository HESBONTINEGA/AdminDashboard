import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Filter, DollarSign, FileText } from "lucide-react";
import type { Staff } from "@shared/schema";

export default function PayrollPage() {
  const { data: staff = [], isLoading: staffLoading } = useQuery<Staff[]>({
    queryKey: ["/api/staff"],
  });

  const formatCurrency = (amount: string | null) => {
    if (!amount) return "KSh 0";
    return `KSh ${parseFloat(amount).toLocaleString()}`;
  };

  if (staffLoading) {
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
        <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
        <p className="text-gray-600">Manage employee salaries and payslips</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Payroll Summary</h3>
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
                <DollarSign className="h-4 w-4 mr-1" />
                Generate Payslips
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Employee</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Basic Pay</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Payslip</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member) => (
                <TableRow key={member.id} className="table-hover">
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {member.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {member.idNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-900">
                      {member.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(member.basicPay)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm ${
                      member.isActive ? "text-green-600" : "text-gray-500"
                    }`}>
                      {member.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">
                      December 2024
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" title="Generate Payslip">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Download">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
