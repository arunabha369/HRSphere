import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

import { EmployeeProvider } from './context/EmployeeContext';
import AppLayout from './layouts/AppLayout';
import Dashboard from './pages/app/Dashboard';
import EmployeeList from './pages/app/EmployeeList';
import Attendance from './pages/app/Attendance';
import Settings from './pages/app/Settings';
import Payroll from './pages/app/Payroll';
import Performance from './pages/app/Performance';
import Recruitment from './pages/app/Recruitment';
import Leave from './pages/app/Leave';
import Assets from './pages/app/Assets';
import Expenses from './pages/app/Expenses';
import Training from './pages/app/Training';
import Announcements from './pages/app/Announcements';
import Reports from './pages/app/Reports';

function App() {
  return (
    <EmployeeProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Marketing Website Routes */}
          <Route path="/" element={
            <div className="flex flex-col min-h-screen bg-slate-50">
              <Navbar />
              <main className="flex-grow">
                <Outlet />
              </main>
              <Footer />
            </div>
          }>
            <Route index element={<Home />} />
            <Route path="features" element={<Features />} />
            <Route path="pricing" element={<Pricing />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* App Routes */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="leave" element={<Leave />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="performance" element={<Performance />} />
            <Route path="recruitment" element={<Recruitment />} />
            <Route path="assets" element={<Assets />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="training" element={<Training />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<div>Page not found</div>} />
          </Route>
        </Routes>
      </Router>
    </EmployeeProvider>
  );
}

export default App;
