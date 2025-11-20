import { apiClient } from "./apiClient";

export const retrieveEmployeeHistoryByEmpId = (empid) => apiClient.get(`history/employee/${empid}`)
