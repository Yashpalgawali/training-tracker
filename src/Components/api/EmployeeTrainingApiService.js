import { apiClient } from './apiClient'

export const getTrainingsByEmployeeId = (empid) => apiClient.get(`employee-training/${empid}`)
export const saveEmployeeTraining = (emptrain) => apiClient.post(`employee-training/`,emptrain)
export const updateCompletionDate = (emphistid,completion_date) => apiClient.patch(`employee-training/training/${emphistid}`,{completion_date: completion_date})

export const getTrainingsHistoryByEmployeeId = 
                        (empid) => apiClient.get(`employee-training/exporttrainingshistory/excel/${empid}`,{
                            responseType: 'arraybuffer'
                        })

export const getAllTrainingHistory = 
                        () => apiClient.get(`employee-training/exporttrainings/excel`,{
                            responseType: 'arraybuffer'
                        })