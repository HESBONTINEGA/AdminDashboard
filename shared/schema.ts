import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("admin"),
  branchId: integer("branch_id"),
});

// Branches table
export const branches = pgTable("branches", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  phone: text("phone"),
  isActive: boolean("is_active").default(true),
});

// Agents table
export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  agentType: text("agent_type").notNull(), // "rider" | "cbd_walkin"
  agentCategory: text("agent_category").notNull(), // "internal" | "outsourced"
  status: text("status").notNull().default("available"), // "available" | "busy" | "offline"
  tasksCompleted: integer("tasks_completed").default(0),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  currentLat: decimal("current_lat", { precision: 10, scale: 7 }),
  currentLng: decimal("current_lng", { precision: 10, scale: 7 }),
  branchId: integer("branch_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Customers table
export const customers = pgTable("customers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  address: text("address"),
  registeredAt: timestamp("registered_at").defaultNow(),
});

// Deliveries table
export const deliveries = pgTable("deliveries", {
  id: serial("id").primaryKey(),
  invoiceNumber: text("invoice_number").notNull().unique(),
  customerId: integer("customer_id").notNull(),
  agentId: integer("agent_id"),
  deliveryType: text("delivery_type").notNull(), // "door" | "walkin" | "internal" | "outsourced"
  status: text("status").notNull().default("pending"), // "pending" | "active" | "completed" | "overdue" | "cancelled"
  items: json("items").notNull(), // Array of order items
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paymentMethod: text("payment_method").notNull(), // "cod" | "mpesa" | "paid"
  paymentStatus: text("payment_status").default("pending"), // "pending" | "paid" | "failed"
  deliveryAddress: text("delivery_address").notNull(),
  estimatedTime: integer("estimated_time"), // in minutes
  actualTime: integer("actual_time"), // in minutes
  photoProof: text("photo_proof"),
  notes: text("notes"),
  branchId: integer("branch_id"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Staff table
export const staff = pgTable("staff", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  idNumber: text("id_number").notNull().unique(),
  phone: text("phone").notNull(),
  email: text("email"),
  role: text("role").notNull(),
  department: text("department"),
  branchId: integer("branch_id"),
  nextOfKinName: text("next_of_kin_name"),
  nextOfKinPhone: text("next_of_kin_phone"),
  nextOfKinAddress: text("next_of_kin_address"),
  basicPay: decimal("basic_pay", { precision: 10, scale: 2 }),
  maritalStatus: text("marital_status"),
  dependents: integer("dependents").default(0),
  medicalConditions: text("medical_conditions"),
  currentAddress: text("current_address"),
  isActive: boolean("is_active").default(true),
  hiredAt: timestamp("hired_at").defaultNow(),
});

// Leave requests table
export const leaveRequests = pgTable("leave_requests", {
  id: serial("id").primaryKey(),
  staffId: integer("staff_id").notNull(),
  leaveType: text("leave_type").notNull(), // "annual" | "sick" | "maternity" | "emergency"
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  days: integer("days").notNull(),
  reason: text("reason").notNull(),
  status: text("status").default("pending"), // "pending" | "approved" | "rejected"
  approvedBy: integer("approved_by"),
  requestedAt: timestamp("requested_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

// Attendance table
export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  staffId: integer("staff_id").notNull(),
  date: timestamp("date").notNull(),
  clockIn: timestamp("clock_in"),
  clockOut: timestamp("clock_out"),
  clockInLat: decimal("clock_in_lat", { precision: 10, scale: 7 }),
  clockInLng: decimal("clock_in_lng", { precision: 10, scale: 7 }),
  clockOutLat: decimal("clock_out_lat", { precision: 10, scale: 7 }),
  clockOutLng: decimal("clock_out_lng", { precision: 10, scale: 7 }),
  isLate: boolean("is_late").default(false),
  notes: text("notes"),
});

// Create insert schemas
export const insertBranchSchema = createInsertSchema(branches).omit({ id: true });
export const insertAgentSchema = createInsertSchema(agents).omit({ id: true, createdAt: true });
export const insertCustomerSchema = createInsertSchema(customers).omit({ id: true, registeredAt: true });
export const insertDeliverySchema = createInsertSchema(deliveries).omit({ id: true, createdAt: true });
export const insertStaffSchema = createInsertSchema(staff).omit({ id: true, hiredAt: true });
export const insertLeaveRequestSchema = createInsertSchema(leaveRequests).omit({ id: true, requestedAt: true });
export const insertAttendanceSchema = createInsertSchema(attendance).omit({ id: true });

// Export types
export type Branch = typeof branches.$inferSelect;
export type Agent = typeof agents.$inferSelect;
export type Customer = typeof customers.$inferSelect;
export type Delivery = typeof deliveries.$inferSelect;
export type Staff = typeof staff.$inferSelect;
export type LeaveRequest = typeof leaveRequests.$inferSelect;
export type Attendance = typeof attendance.$inferSelect;

export type InsertBranch = z.infer<typeof insertBranchSchema>;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type InsertDelivery = z.infer<typeof insertDeliverySchema>;
export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type InsertLeaveRequest = z.infer<typeof insertLeaveRequestSchema>;
export type InsertAttendance = z.infer<typeof insertAttendanceSchema>;

// Keep original user types for backward compatibility
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
