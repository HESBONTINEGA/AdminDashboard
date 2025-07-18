import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function PerformanceOverview() {
  const topPerformers = [
    { name: "John Kamau", deliveries: 12, rating: 98 },
    { name: "Mary Wanjiku", deliveries: 9, rating: 95 },
  ];

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-lg font-semibold">Today's Performance</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Turnaround Time</span>
            <span className="font-medium text-green-600">42 min avg</span>
          </div>
          <Progress value={70} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">Target: 45-60 min</p>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Delivery Success Rate</span>
            <span className="font-medium text-green-600">96%</span>
          </div>
          <Progress value={96} className="h-2" />
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Top Performers</h4>
          <div className="space-y-3">
            {topPerformers.map((performer) => (
              <div key={performer.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-3">
                    <AvatarFallback className="bg-gray-300">
                      {performer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{performer.name}</p>
                    <p className="text-xs text-gray-500">{performer.deliveries} deliveries</p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {performer.rating}%
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
