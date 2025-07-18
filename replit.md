# replit.md

## Overview

This is a comprehensive delivery management platform called TopServe Delivery, built for TopServe Ltd (a cake baking ingredients supplier). The system is a full-stack web application that manages delivery operations, workforce, and customer relationships with real-time tracking capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API with structured route handlers
- **Development**: tsx for TypeScript execution in development

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Centralized schema definitions with Zod validation
- **Migrations**: Drizzle Kit for database migrations

## Key Components

### 1. Database Schema
- **Users**: Authentication and role-based access
- **Branches**: Multi-location support
- **Agents**: Delivery personnel with GPS tracking
- **Customers**: Customer management and profiles
- **Deliveries**: Core delivery operations with status tracking
- **Staff**: HR management including attendance and leave
- **Leave Requests**: Employee leave management system
- **Attendance**: Time tracking and workforce monitoring

### 2. Frontend Pages
- **Dashboard**: Real-time metrics, live map, and performance overview
- **Deliveries**: Complete delivery lifecycle management
- **Agents**: Agent performance tracking and assignment
- **HR Modules**: Staff, leave, attendance, and payroll management
- **Customers**: Customer relationship management
- **Reports**: Business intelligence and analytics
- **Communications**: Notification and messaging system
- **Configuration**: System settings and branch management

### 3. UI Components
- **Modular Design**: shadcn/ui component library for consistent design
- **Responsive Layout**: Main layout with sidebar navigation and top navigation
- **Data Tables**: Comprehensive tables for all entity management
- **Forms**: Type-safe forms with validation
- **Real-time Elements**: Live maps and status indicators

## Data Flow

### 1. Order Processing
- Orders come from multiple channels (website, WhatsApp, phone)
- Staff converts orders into delivery tasks
- System assigns deliveries to available agents
- Real-time tracking throughout delivery lifecycle

### 2. Agent Management
- GPS location tracking for real-time positioning
- Status management (available, busy, offline)
- Performance metrics and rating system
- Support for both internal and outsourced agents

### 3. Customer Experience
- Login credentials for delivery tracking
- Real-time status updates
- Photo verification upon delivery completion
- Multiple delivery types (door, CBD walk-in, internal transfers)

## External Dependencies

### Core Libraries
- **UI Framework**: React with shadcn/ui components
- **Database**: Drizzle ORM with PostgreSQL
- **Validation**: Zod for schema validation
- **HTTP Client**: Native fetch with TanStack Query
- **Styling**: Tailwind CSS with custom design tokens

### Development Tools
- **TypeScript**: Full type safety across the stack
- **Vite**: Fast development and optimized builds
- **ESBuild**: Production bundle optimization
- **Replit Integration**: Development environment support

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with HMR
- **TypeScript Compilation**: Real-time type checking
- **Database**: Local PostgreSQL or Neon serverless for development

### Production
- **Build Process**: Vite builds frontend, ESBuild bundles backend
- **Static Assets**: Frontend built to `dist/public`
- **Server Bundle**: Backend bundled to `dist/index.js`
- **Environment**: Node.js production server

### Configuration
- **Environment Variables**: DATABASE_URL for database connection
- **Branch Management**: Multi-branch support with branch switching
- **Scalability**: Designed for multiple delivery operations

The application follows a monorepo structure with shared TypeScript definitions between frontend and backend, ensuring type safety across the full stack. The architecture supports real-time operations, multi-tenant branches, and scalable delivery management workflows.