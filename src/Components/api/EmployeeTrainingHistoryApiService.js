import { apiClient } from "./apiClient";

export const getTrainingHistoryByEmpAndTrainingId = (empid,trainingid) => apiClient.get(`employee-training-history/employee/${empid}/training/${trainingid}`)

export const getTrainingHistoryByEmpId = (empid) => apiClient.get(`employee-training-history/employee/${empid}`)