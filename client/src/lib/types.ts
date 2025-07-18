import type { 
  Agent, 
  Customer, 
  Delivery, 
  Staff, 
  LeaveRequest, 
  Attendance, 
  Branch 
} from "@shared/schema";

export interface DashboardMetrics {
  activeAgents: string;
  pendingDeliveries: number;
  activeDeliveries: number;
  overdueDeliveries: number;
}

export interface DeliveryWithCustomer extends Delivery {
  customer?: Customer;
  agent?: Agent;
}

export interface StaffWithBranch extends Staff {
  branch?: Branch;
}

export interface LeaveRequestWithStaff extends LeaveRequest {
  staff?: Staff;
  approver?: Staff;
}

export interface AttendanceWithStaff extends Attendance {
  staff?: Staff;
}

export type DeliveryStatus = "pending" | "active" | "completed" | "overdue" | "cancelled";
export type AgentStatus = "available" | "busy" | "offline";
export type PaymentStatus = "pending" | "paid" | "failed";
export type LeaveStatus = "pending" | "approved" | "rejected";
