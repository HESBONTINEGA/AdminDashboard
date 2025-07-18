import { 
  users, branches, agents, customers, deliveries, staff, leaveRequests, attendance,
  type User, type Branch, type Agent, type Customer, type Delivery, type Staff, type LeaveRequest, type Attendance,
  type InsertUser, type InsertBranch, type InsertAgent, type InsertCustomer, type InsertDelivery, 
  type InsertStaff, type InsertLeaveRequest, type InsertAttendance 
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Branches
  getBranches(): Promise<Branch[]>;
  getBranch(id: number): Promise<Branch | undefined>;
  createBranch(branch: InsertBranch): Promise<Branch>;

  // Agents
  getAgents(): Promise<Agent[]>;
  getAgent(id: number): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: number, agent: Partial<Agent>): Promise<Agent>;
  deleteAgent(id: number): Promise<boolean>;

  // Customers
  getCustomers(): Promise<Customer[]>;
  getCustomer(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;

  // Deliveries
  getDeliveries(): Promise<Delivery[]>;
  getDelivery(id: number): Promise<Delivery | undefined>;
  getDeliveryByInvoice(invoiceNumber: string): Promise<Delivery | undefined>;
  createDelivery(delivery: InsertDelivery): Promise<Delivery>;
  updateDelivery(id: number, delivery: Partial<Delivery>): Promise<Delivery>;
  deleteDelivery(id: number): Promise<boolean>;

  // Staff
  getStaff(): Promise<Staff[]>;
  getStaffMember(id: number): Promise<Staff | undefined>;
  createStaff(staff: InsertStaff): Promise<Staff>;
  updateStaff(id: number, staff: Partial<Staff>): Promise<Staff>;

  // Leave Requests
  getLeaveRequests(): Promise<LeaveRequest[]>;
  getLeaveRequest(id: number): Promise<LeaveRequest | undefined>;
  createLeaveRequest(leaveRequest: InsertLeaveRequest): Promise<LeaveRequest>;
  updateLeaveRequest(id: number, leaveRequest: Partial<LeaveRequest>): Promise<LeaveRequest>;

  // Attendance
  getAttendance(): Promise<Attendance[]>;
  getAttendanceByStaff(staffId: number): Promise<Attendance[]>;
  createAttendance(attendance: InsertAttendance): Promise<Attendance>;
  updateAttendance(id: number, attendance: Partial<Attendance>): Promise<Attendance>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private branches: Map<number, Branch>;
  private agents: Map<number, Agent>;
  private customers: Map<number, Customer>;
  private deliveries: Map<number, Delivery>;
  private staff: Map<number, Staff>;
  private leaveRequests: Map<number, LeaveRequest>;
  private attendance: Map<number, Attendance>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.branches = new Map();
    this.agents = new Map();
    this.customers = new Map();
    this.deliveries = new Map();
    this.staff = new Map();
    this.leaveRequests = new Map();
    this.attendance = new Map();
    this.currentId = 1;

    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Create sample branches
    const branch1: Branch = { id: 1, name: "Shop A (Main)", address: "Nairobi CBD", phone: "+254 700 000 001", isActive: true };
    const branch2: Branch = { id: 2, name: "Warehouse", address: "Industrial Area", phone: "+254 700 000 002", isActive: true };
    this.branches.set(1, branch1);
    this.branches.set(2, branch2);

    // Create sample customers
    const customers = [
      { id: 1, name: "Sarah Muthoni", phone: "+254 700 123 456", email: "sarah@example.com", address: "Kilimani, Nairobi", registeredAt: new Date() },
      { id: 2, name: "Peter Ochieng", phone: "+254 722 987 654", email: "peter@example.com", address: "Westlands, Nairobi", registeredAt: new Date() },
      { id: 3, name: "Grace Njeri", phone: "+254 733 456 789", email: "grace@example.com", address: "Karen, Nairobi", registeredAt: new Date() },
      { id: 4, name: "David Kiprotich", phone: "+254 711 234 567", email: "david@example.com", address: "Kasarani, Nairobi", registeredAt: new Date() }
    ];
    customers.forEach(customer => this.customers.set(customer.id, customer));

    // Create sample agents
    const agents = [
      { id: 1, name: "John Kamau", phone: "+254 700 111 001", agentType: "rider", agentCategory: "internal", status: "busy", tasksCompleted: 145, rating: "4.8", currentLat: "-1.2921", currentLng: "36.8219", branchId: 1, isActive: true, createdAt: new Date() },
      { id: 2, name: "Mary Wanjiku", phone: "+254 700 111 002", agentType: "cbd_walkin", agentCategory: "internal", status: "available", tasksCompleted: 98, rating: "4.6", currentLat: "-1.2864", currentLng: "36.8172", branchId: 1, isActive: true, createdAt: new Date() },
      { id: 3, name: "James Mwangi", phone: "+254 700 111 003", agentType: "rider", agentCategory: "outsourced", status: "offline", tasksCompleted: 67, rating: "4.3", currentLat: "-1.3031", currentLng: "36.8441", branchId: 2, isActive: true, createdAt: new Date() }
    ];
    agents.forEach(agent => this.agents.set(agent.id, agent));

    // Create sample deliveries
    const deliveries = [
      { 
        id: 1, 
        invoiceNumber: "KIM-001234", 
        customerId: 1, 
        agentId: 1, 
        deliveryType: "door", 
        status: "overdue", 
        items: [{ name: "Chocolate Powder", quantity: 2, price: 800 }], 
        totalAmount: "1600", 
        paymentMethod: "cod", 
        paymentStatus: "pending", 
        deliveryAddress: "Kilimani, Nairobi",
        estimatedTime: 60,
        branchId: 1,
        createdAt: new Date(Date.now() - 90 * 60 * 1000), // 90 minutes ago
        completedAt: null
      },
      { 
        id: 2, 
        invoiceNumber: "ACCRA-005678", 
        customerId: 2, 
        agentId: 2, 
        deliveryType: "walkin", 
        status: "active", 
        items: [{ name: "Vanilla Extract", quantity: 1, price: 350 }], 
        totalAmount: "350", 
        paymentMethod: "mpesa", 
        paymentStatus: "paid", 
        deliveryAddress: "Westlands, Nairobi",
        estimatedTime: 45,
        branchId: 1,
        createdAt: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
        completedAt: null
      },
      { 
        id: 3, 
        invoiceNumber: "KIM-001235", 
        customerId: 3, 
        agentId: null, 
        deliveryType: "internal", 
        status: "pending", 
        items: [{ name: "Baking Flour", quantity: 1, price: 450 }], 
        totalAmount: "450", 
        paymentMethod: "cod", 
        paymentStatus: "pending", 
        deliveryAddress: "Karen, Nairobi",
        branchId: 1,
        createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
        completedAt: null
      }
    ];
    deliveries.forEach(delivery => this.deliveries.set(delivery.id, delivery));

    // Create sample staff
    const staffMembers = [
      { id: 1, fullName: "Alice Wanjiru", idNumber: "12345678", phone: "+254 700 200 001", email: "alice@topserve.com", role: "Manager", department: "Operations", branchId: 1, basicPay: "60000", isActive: true, hiredAt: new Date() },
      { id: 2, fullName: "Robert Kipkoech", idNumber: "87654321", phone: "+254 700 200 002", email: "robert@topserve.com", role: "Supervisor", department: "Delivery", branchId: 1, basicPay: "45000", isActive: true, hiredAt: new Date() }
    ];
    staffMembers.forEach(staff => this.staff.set(staff.id, staff));

    this.currentId = 10; // Start from 10 to avoid conflicts
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id, role: "admin", branchId: 1 };
    this.users.set(id, user);
    return user;
  }

  // Branch methods
  async getBranches(): Promise<Branch[]> {
    return Array.from(this.branches.values());
  }

  async getBranch(id: number): Promise<Branch | undefined> {
    return this.branches.get(id);
  }

  async createBranch(insertBranch: InsertBranch): Promise<Branch> {
    const id = this.currentId++;
    const branch: Branch = { ...insertBranch, id };
    this.branches.set(id, branch);
    return branch;
  }

  // Agent methods
  async getAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async getAgent(id: number): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const id = this.currentId++;
    const agent: Agent = { ...insertAgent, id, createdAt: new Date() };
    this.agents.set(id, agent);
    return agent;
  }

  async updateAgent(id: number, agentUpdate: Partial<Agent>): Promise<Agent> {
    const agent = this.agents.get(id);
    if (!agent) throw new Error("Agent not found");
    const updatedAgent = { ...agent, ...agentUpdate };
    this.agents.set(id, updatedAgent);
    return updatedAgent;
  }

  async deleteAgent(id: number): Promise<boolean> {
    return this.agents.delete(id);
  }

  // Customer methods
  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = this.currentId++;
    const customer: Customer = { ...insertCustomer, id, registeredAt: new Date() };
    this.customers.set(id, customer);
    return customer;
  }

  // Delivery methods
  async getDeliveries(): Promise<Delivery[]> {
    return Array.from(this.deliveries.values());
  }

  async getDelivery(id: number): Promise<Delivery | undefined> {
    return this.deliveries.get(id);
  }

  async getDeliveryByInvoice(invoiceNumber: string): Promise<Delivery | undefined> {
    return Array.from(this.deliveries.values()).find(delivery => delivery.invoiceNumber === invoiceNumber);
  }

  async createDelivery(insertDelivery: InsertDelivery): Promise<Delivery> {
    const id = this.currentId++;
    const delivery: Delivery = { ...insertDelivery, id, createdAt: new Date(), completedAt: null };
    this.deliveries.set(id, delivery);
    return delivery;
  }

  async updateDelivery(id: number, deliveryUpdate: Partial<Delivery>): Promise<Delivery> {
    const delivery = this.deliveries.get(id);
    if (!delivery) throw new Error("Delivery not found");
    const updatedDelivery = { ...delivery, ...deliveryUpdate };
    this.deliveries.set(id, updatedDelivery);
    return updatedDelivery;
  }

  async deleteDelivery(id: number): Promise<boolean> {
    return this.deliveries.delete(id);
  }

  // Staff methods
  async getStaff(): Promise<Staff[]> {
    return Array.from(this.staff.values());
  }

  async getStaffMember(id: number): Promise<Staff | undefined> {
    return this.staff.get(id);
  }

  async createStaff(insertStaff: InsertStaff): Promise<Staff> {
    const id = this.currentId++;
    const staff: Staff = { ...insertStaff, id, hiredAt: new Date() };
    this.staff.set(id, staff);
    return staff;
  }

  async updateStaff(id: number, staffUpdate: Partial<Staff>): Promise<Staff> {
    const staff = this.staff.get(id);
    if (!staff) throw new Error("Staff member not found");
    const updatedStaff = { ...staff, ...staffUpdate };
    this.staff.set(id, updatedStaff);
    return updatedStaff;
  }

  // Leave Request methods
  async getLeaveRequests(): Promise<LeaveRequest[]> {
    return Array.from(this.leaveRequests.values());
  }

  async getLeaveRequest(id: number): Promise<LeaveRequest | undefined> {
    return this.leaveRequests.get(id);
  }

  async createLeaveRequest(insertLeaveRequest: InsertLeaveRequest): Promise<LeaveRequest> {
    const id = this.currentId++;
    const leaveRequest: LeaveRequest = { ...insertLeaveRequest, id, requestedAt: new Date(), reviewedAt: null };
    this.leaveRequests.set(id, leaveRequest);
    return leaveRequest;
  }

  async updateLeaveRequest(id: number, leaveRequestUpdate: Partial<LeaveRequest>): Promise<LeaveRequest> {
    const leaveRequest = this.leaveRequests.get(id);
    if (!leaveRequest) throw new Error("Leave request not found");
    const updatedLeaveRequest = { ...leaveRequest, ...leaveRequestUpdate };
    this.leaveRequests.set(id, updatedLeaveRequest);
    return updatedLeaveRequest;
  }

  // Attendance methods
  async getAttendance(): Promise<Attendance[]> {
    return Array.from(this.attendance.values());
  }

  async getAttendanceByStaff(staffId: number): Promise<Attendance[]> {
    return Array.from(this.attendance.values()).filter(attendance => attendance.staffId === staffId);
  }

  async createAttendance(insertAttendance: InsertAttendance): Promise<Attendance> {
    const id = this.currentId++;
    const attendance: Attendance = { ...insertAttendance, id };
    this.attendance.set(id, attendance);
    return attendance;
  }

  async updateAttendance(id: number, attendanceUpdate: Partial<Attendance>): Promise<Attendance> {
    const attendance = this.attendance.get(id);
    if (!attendance) throw new Error("Attendance record not found");
    const updatedAttendance = { ...attendance, ...attendanceUpdate };
    this.attendance.set(id, updatedAttendance);
    return updatedAttendance;
  }
}

export const storage = new MemStorage();
