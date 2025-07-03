import { apiClient } from './apiClient'

export const getTrainingsByEmployeeId = (empid) => apiClient.get(`employee-training/${empid}`)

export const saveEmployeeTraining = (emptrain) => apiClient.post(`employee-training/`,emptrain)