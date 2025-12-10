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
      setEmployees([]);
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
