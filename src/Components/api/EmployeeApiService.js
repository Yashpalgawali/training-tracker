import { apiClient } from './apiClient';

export const retrieveAllEmployees = () => apiClient.get('employee/')

export const saveEmployee = (employee) => apiClient.post(`employee/`,employee)

export const getEmployeeById = (id) => apiClient.get(`employee/${id}`)

export const updateEmployee = (employee) => apiClient.put(`employee/`,employee)

export const getEmployeeByEmpCode = (empcode) => apiClient.get(`employee/${empcode}`)
