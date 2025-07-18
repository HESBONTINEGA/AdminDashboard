import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Truck, 
  Users, 
  Building, 
  UserCheck, 
  MessageSquare, 
  Settings,
  PieChart
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: PieChart,
    badge: null,
  },
  {
    title: "Deliveries",
    href: "/deliveries",
    icon: Truck,
    badge: { text: "2", variant: "destructive" as const },
  },
  {
    title: "Agents",
    href: "/agents",
    icon: Users,
    badge: { text: "12/15", variant: "secondary" as const },
  },
  {
    title: "HR",
    href: "/hr/staff",
    icon: Building,
    badge: null,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: UserCheck,
    badge: null,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    badge: null,
  },
  {
    title: "Communications",
    href: "/communications",
    icon: MessageSquare,
    badge: null,
  },
  {
    title: "Configuration",
    href: "/configuration",
    icon: Settings,
    badge: null,
  },
];

export default function Sidebar() {
  const [location, setLocation] = useLocation();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location === "/" || location === "/dashboard";
    }
    if (href === "/hr/staff") {
      return location.startsWith("/hr");
    }
    return location === href;
  };

  return (
    <aside className="w-64 bg-white h-screen fixed sidebar-shadow overflow-y-auto">
      <nav className="p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <button
                onClick={() => setLocation(item.href)}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg transition-colors",
                  isActive(item.href)
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.title}</span>
                {item.badge && (
                  <Badge 
                    variant={item.badge.variant} 
                    className="ml-auto text-xs"
                  >
                    {item.badge.text}
                  </Badge>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
