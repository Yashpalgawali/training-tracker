import { apiClient } from './apiClient';

export const retrieveAllEmployees = () => apiClient.get('employee/')

// export const retrieveAllEmployeesUsingTrainingAndCompetencyId = (tid,cid) => apiClient.get(`employee/training/${tid}/competency/${cid}`)

export const retrieveAllEmployeesUsingTrainingAndCompetencyId = (tid,cid,tdate,timeslot) => apiClient.get(`employee/training/${tid}/competency/${cid}/trainingdate/${tdate}/timeslot/${timeslot}`)

export const retrieveEmployeePresentForOtherTraining = (id,tdate,timeslot) => apiClient.get(`employee/${id}/trainingdate/${tdate}/timeslot/${timeslot}`)

export const retrieveAllActiveEmployees = () => apiClient.get('employee/active')

export const retrieveAllEmployeesWithPagination = (page , size) => apiClient.get(`employee/paged?page=${page}&size=${size}`)

export const saveEmployee = (employee) => apiClient.post(`employee/`,employee)

export const getEmployeeById = (id) => apiClient.get(`employee/${id}`)

export const updateEmployee = (employee) => apiClient.put(`employee/`,employee)

export const getEmployeeByEmpCode = (empcode) => apiClient.get(`employee/code/${empcode}`)

export const uploadEmployeeList = (empListExcel) => apiClient.post(`employee/upload`,empListExcel,{ headers : { "Content-Type":"multipart/form-data" }})

export const downAllEmployeesList =
                        () => apiClient.get(`employee/export/employee/list`, {
                            responseType : 'arraybuffer'
                        })

export const downSampleEmployeesList = () => apiClient.get(`employee/export/sample/employeelist`, {
                                            responseType : 'arraybuffer'
                                        })