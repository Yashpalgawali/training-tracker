import { apiClient } from './apiClient'

export const getTrainingsByEmployeeId = (empid) => apiClient.get(`employee-training/${empid}`)
export const saveEmployeeTraining = (emptrain) => apiClient.post(`employee-training/`,emptrain)

export const getTrainingsByEmployeeIdAndTrainingId = (empid,trainingid) => apiClient.get(`employee-training/${empid}/training/${trainingid}`)

export const updateEmployeeTraining = (emptrain) => apiClient.put(`employee-training/`,emptrain)


export const updateCompletionDate = (emphistid,completion_date) => apiClient.patch(`employee-training/training/${emphistid}`,{completion_date: completion_date})

export const updateTrainingDateAndCompetency = (emphistid,training_date,competency_id,training_time_id) => apiClient.patch(`employee-training/training/${emphistid}`,{training_date: training_date, competency_id: competency_id,training_time_id:training_time_id})

export const getCompetency = (empid) => apiClient.get(`employee-training/competencies/${empid}`)

export const getTrainingsHistoryByEmployeeId = 
                        (empid) => apiClient.get(`employee-training/exporttrainingshistory/excel/${empid}`,{
                            responseType: 'arraybuffer'
                        })

export const getAllTrainingHistory = 
                        () => apiClient.get(`employee-training/exporttrainings/excel`,{
                            responseType: 'arraybuffer'
                        })