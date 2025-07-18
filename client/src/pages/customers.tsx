import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Download, Filter, Eye, MessageSquare, Phone } from "lucide-react";
import type { Customer } from "@shared/schema";

export default function CustomersPage() {
  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

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
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
        <p className="text-gray-600">Manage customer relationships and support</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Customer Directory</h3>
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
                Add Customer
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="directory" className="w-full">
          <div className="px-6 py-4 border-b border-gray-200">
            <TabsList>
              <TabsTrigger value="directory">Directory</TabsTrigger>
              <TabsTrigger value="support">Support Tickets</TabsTrigger>
              <TabsTrigger value="history">Delivery History</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="directory">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead>Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Deliveries</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id} className="table-hover">
                      <TableCell>
                        <div className="text-sm font-medium text-gray-900">
                          {customer.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-900">
                          {customer.phone}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-900">
                          {customer.email || "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-900">
                          {new Date(customer.registeredAt!).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-900">
                          0 {/* TODO: Calculate from deliveries */}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Call">
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" title="Message">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="support">
            <div className="p-6">
              <div className="text-center text-gray-500">
                Support ticket management coming soon...
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="p-6">
              <div className="text-center text-gray-500">
                Delivery history coming soon...
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews">
            <div className="p-6">
              <div className="text-center text-gray-500">
                Customer reviews coming soon...
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
