import React, { createContext, useContext, useState, useEffect } from 'react';
import client from '../api/client';

const EmployeeContext = createContext();

export const useEmployees = () => useContext(EmployeeContext);

export const EmployeeProvider = ({ children }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEmployees = async () => {
    try {
      const { data } = await client.get('/employees');
      setEmployees(data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
      // Fallback to mock data if API fails (for demo robustness)
      setEmployees([
        { id: 'EMP001', name: 'Aarav Sharma', role: 'Senior Developer', department: 'Engineering', status: 'Active', email: 'aarav.sharma@hrsphere.com', phone: '+91 98765 43210', joinDate: '2022-03-15', salary: '₹18,00,000' },
        { id: 'EMP002', name: 'Diya Patel', role: 'Product Manager', department: 'Product', status: 'Active', email: 'diya.patel@hrsphere.com', phone: '+91 98765 43211', joinDate: '2021-06-10', salary: '₹22,00,000' },
        { id: 'EMP003', name: 'Vihaan Gupta', role: 'UX Designer', department: 'Design', status: 'On Leave', email: 'vihaan.gupta@hrsphere.com', phone: '+91 98765 43212', joinDate: '2023-01-05', salary: '₹14,00,000' },
        { id: 'EMP004', name: 'Ananya Singh', role: 'HR Manager', department: 'HR', status: 'Active', email: 'ananya.singh@hrsphere.com', phone: '+91 98765 43213', joinDate: '2020-11-20', salary: '₹16,00,000' },
        { id: 'EMP005', name: 'Rohan Verma', role: 'Marketing Specialist', department: 'Marketing', status: 'Active', email: 'rohan.verma@hrsphere.com', phone: '+91 98765 43214', joinDate: '2023-04-12', salary: '₹12,00,000' },
      ]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const addEmployee = async (employee) => {
    try {
      const { data } = await client.post('/employees', employee);
      setEmployees([...employees, data]);
    } catch (err) {
      console.error('Failed to add employee:', err);
      // Fallback mock add
      setEmployees([...employees, { ...employee, id: `EMP${String(employees.length + 1).padStart(3, '0')}` }]);
    }
  };

  const updateEmployee = async (id, updatedData) => {
    try {
      const { data } = await client.put(`/employees/${id}`, updatedData);
      setEmployees(employees.map(emp => emp.id === id || emp._id === id ? data : emp));
    } catch (err) {
      console.error('Failed to update employee:', err);
      setEmployees(employees.map(emp => emp.id === id ? { ...emp, ...updatedData } : emp));
    }
  };

  const deleteEmployee = async (id) => {
    try {
      await client.delete(`/employees/${id}`);
      setEmployees(employees.filter(emp => emp.id !== id && emp._id !== id));
    } catch (err) {
      console.error('Failed to delete employee:', err);
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const stats = {
    total: employees.length,
    active: employees.filter(e => e.status === 'Active').length,
    onLeave: employees.filter(e => e.status === 'On Leave').length,
    newHires: employees.filter(e => {
      const joinDate = new Date(e.joinDate);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return joinDate > oneMonthAgo;
    }).length
  };

  return (
    <EmployeeContext.Provider value={{ employees, loading, error, addEmployee, updateEmployee, deleteEmployee, stats }}>
      {children}
    </EmployeeContext.Provider>
  );
};
