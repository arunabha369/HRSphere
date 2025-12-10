# HRSphere

HRSphere is a comprehensive, modern Human Resource Management System (HRMS) designed to streamline workforce management for small to medium-sized enterprises. Built with a focus on user experience and scalability, it automates core HR processes from recruitment to payroll.

![HRSphere Dashboard](/public/dashboard-mockup.png)

## 🚀 Features

### Core HR
- **Employee Management**: Centralized database for employee records, documents, and personal details.
- **Attendance Tracking**: Real-time attendance monitoring with check-in/out functionality.
- **Leave Management**: Automated leave request workflows and balance tracking.

### Financials
- **Payroll Processing**: Automated salary calculation including tax deductions and allowances.
- **Expense Tracking**: Manage employee reimbursements and operational expenses.
- **Asset Management**: Track company assets assigned to employees.

### Talent & Growth
- **Recruitment (ATS)**: Kanban-style applicant tracking system for managing job candidates.
- **Performance Reviews**: structured performance appraisal cycles.
- **Training**: Manage employee training programs and development.

### Communication
- **Announcements**: Company-wide updates and news feed.
- **Reports**: Detailed analytics and reporting for HR metrics.

## 🛠️ Tech Stack

### Frontend
- **React.js**: UI library for building interactive interfaces.
- **Vite**: Next-generation frontend tooling.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Framer Motion**: Production-ready animation library.
- **React Router**: Client-side routing.
- **Lucide React**: Beautiful & consistent icons.

### Backend
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for flexible data storage.
- **Mongoose**: ODM library for MongoDB and Node.js.

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas URI)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/arunabha369/HRSphere.git
   cd HRSphere
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. **Start the Backend Server**
   Open a terminal and run:
   ```bash
   node server/index.js
   ```
   The server will start on port 5000 (or as defined in .env).

5. **Start the Frontend Development Server**
   Open a new terminal window and run:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 📁 Project Structure

```
HRSphere/
├── public/              # Static assets
├── server/              # Backend source code
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth and other middleware
│   └── index.js         # Server entry point
├── src/                 # Frontend source code
│   ├── api/             # API client configuration
│   ├── components/      # Reusable UI components
│   ├── context/         # React Context (State Management)
│   ├── layouts/         # Page layouts
│   ├── pages/           # Application pages
│   └── main.jsx         # App entry point
└── package.json         # Project dependencies and scripts
```
