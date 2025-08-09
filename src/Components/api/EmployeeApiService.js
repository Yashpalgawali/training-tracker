import { apiClient } from './apiClient';

export const retrieveAllEmployees = () => apiClient.get('employee/')

export const saveEmployee = (employee) => apiClient.post(`employee/`,employee)

export const getEmployeeById = (id) => apiClient.get(`employee/${id}`)

export const updateEmployee = (employee) => apiClient.put(`employee/`,employee)

export const getEmployeeByEmpCode = (empcode) => apiClient.get(`employee/${empcode}`)

export const getCompetency = () => apiClient.get(`/api/competencies`)

export const uploadEmployeeList = (emplist) => apiClient.post(`employee/upload`,emplist,{headers : { "Content-Type":"multipart/form-data" }})

export const downAllEmployeesList = 
                        () => apiClient.get(`employee/export/employee/list`,{
                            responseType: 'arraybuffer'
                        })