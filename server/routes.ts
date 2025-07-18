import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertBranchSchema, insertAgentSchema, insertCustomerSchema, 
  insertDeliverySchema, insertStaffSchema, insertLeaveRequestSchema, insertAttendanceSchema 
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Dashboard metrics
  app.get("/api/dashboard/metrics", async (req, res) => {
    try {
      const agents = await storage.getAgents();
      const deliveries = await storage.getDeliveries();
      
      const activeAgents = agents.filter(agent => agent.status !== "offline").length;
      const totalAgents = agents.filter(agent => agent.isActive).length;
      const pendingDeliveries = deliveries.filter(delivery => delivery.status === "pending").length;
      const activeDeliveries = deliveries.filter(delivery => delivery.status === "active").length;
      const overdueDeliveries = deliveries.filter(delivery => delivery.status === "overdue").length;

      res.json({
        activeAgents: `${activeAgents}/${totalAgents}`,
        pendingDeliveries,
        activeDeliveries,
        overdueDeliveries
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // Branches
  app.get("/api/branches", async (req, res) => {
    try {
      const branches = await storage.getBranches();
      res.json(branches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch branches" });
    }
  });

  app.post("/api/branches", async (req, res) => {
    try {
      const branchData = insertBranchSchema.parse(req.body);
      const branch = await storage.createBranch(branchData);
      res.status(201).json(branch);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid branch data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create branch" });
      }
    }
  });

  // Agents
  app.get("/api/agents", async (req, res) => {
    try {
      const agents = await storage.getAgents();
      res.json(agents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agents" });
    }
  });

  app.post("/api/agents", async (req, res) => {
    try {
      const agentData = insertAgentSchema.parse(req.body);
      const agent = await storage.createAgent(agentData);
      res.status(201).json(agent);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid agent data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create agent" });
      }
    }
  });

  app.put("/api/agents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const agentData = req.body;
      const agent = await storage.updateAgent(id, agentData);
      res.json(agent);
    } catch (error) {
      res.status(500).json({ message: "Failed to update agent" });
    }
  });

  app.delete("/api/agents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteAgent(id);
      if (success) {
        res.json({ message: "Agent deleted successfully" });
      } else {
        res.status(404).json({ message: "Agent not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete agent" });
    }
  });

  // Customers
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customers" });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const customerData = insertCustomerSchema.parse(req.body);
      const customer = await storage.createCustomer(customerData);
      res.status(201).json(customer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid customer data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create customer" });
      }
    }
  });

  // Deliveries
  app.get("/api/deliveries", async (req, res) => {
    try {
      const deliveries = await storage.getDeliveries();
      res.json(deliveries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch deliveries" });
    }
  });

  app.get("/api/deliveries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const delivery = await storage.getDelivery(id);
      if (delivery) {
        res.json(delivery);
      } else {
        res.status(404).json({ message: "Delivery not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch delivery" });
    }
  });

  app.post("/api/deliveries", async (req, res) => {
    try {
      const deliveryData = insertDeliverySchema.parse(req.body);
      const delivery = await storage.createDelivery(deliveryData);
      res.status(201).json(delivery);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid delivery data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create delivery" });
      }
    }
  });

  app.put("/api/deliveries/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deliveryData = req.body;
      const delivery = await storage.updateDelivery(id, deliveryData);
      res.json(delivery);
    } catch (error) {
      res.status(500).json({ message: "Failed to update delivery" });
    }
  });

  // Search deliveries by invoice number
  app.get("/api/deliveries/search/:query", async (req, res) => {
    try {
      const query = req.params.query.toUpperCase();
      const delivery = await storage.getDeliveryByInvoice(query);
      if (delivery) {
        res.json(delivery);
      } else {
        res.status(404).json({ message: "Delivery not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to search deliveries" });
    }
  });

  // Staff
  app.get("/api/staff", async (req, res) => {
    try {
      const staff = await storage.getStaff();
      res.json(staff);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch staff" });
    }
  });

  app.post("/api/staff", async (req, res) => {
    try {
      const staffData = insertStaffSchema.parse(req.body);
      const staff = await storage.createStaff(staffData);
      res.status(201).json(staff);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid staff data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create staff" });
      }
    }
  });

  app.put("/api/staff/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const staffData = req.body;
      const staff = await storage.updateStaff(id, staffData);
      res.json(staff);
    } catch (error) {
      res.status(500).json({ message: "Failed to update staff" });
    }
  });

  // Leave Requests
  app.get("/api/leave-requests", async (req, res) => {
    try {
      const leaveRequests = await storage.getLeaveRequests();
      res.json(leaveRequests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leave requests" });
    }
  });

  app.post("/api/leave-requests", async (req, res) => {
    try {
      const leaveRequestData = insertLeaveRequestSchema.parse(req.body);
      const leaveRequest = await storage.createLeaveRequest(leaveRequestData);
      res.status(201).json(leaveRequest);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid leave request data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create leave request" });
      }
    }
  });

  app.put("/api/leave-requests/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const leaveRequestData = req.body;
      const leaveRequest = await storage.updateLeaveRequest(id, leaveRequestData);
      res.json(leaveRequest);
    } catch (error) {
      res.status(500).json({ message: "Failed to update leave request" });
    }
  });

  // Attendance
  app.get("/api/attendance", async (req, res) => {
    try {
      const attendance = await storage.getAttendance();
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch attendance" });
    }
  });

  app.post("/api/attendance", async (req, res) => {
    try {
      const attendanceData = insertAttendanceSchema.parse(req.body);
      const attendance = await storage.createAttendance(attendanceData);
      res.status(201).json(attendance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid attendance data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create attendance" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
