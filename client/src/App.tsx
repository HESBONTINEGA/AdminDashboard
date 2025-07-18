import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Deliveries from "@/pages/deliveries";
import Agents from "@/pages/agents";
import Staff from "@/pages/hr/staff";
import Leave from "@/pages/hr/leave";
import Attendance from "@/pages/hr/attendance";
import Payroll from "@/pages/hr/payroll";
import Customers from "@/pages/customers";
import Reports from "@/pages/reports";
import Communications from "@/pages/communications";
import Configuration from "@/pages/configuration";
import MainLayout from "@/components/layout/main-layout";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/deliveries" component={Deliveries} />
        <Route path="/agents" component={Agents} />
        <Route path="/hr/staff" component={Staff} />
        <Route path="/hr/leave" component={Leave} />
        <Route path="/hr/attendance" component={Attendance} />
        <Route path="/hr/payroll" component={Payroll} />
        <Route path="/customers" component={Customers} />
        <Route path="/reports" component={Reports} />
        <Route path="/communications" component={Communications} />
        <Route path="/configuration" component={Configuration} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
