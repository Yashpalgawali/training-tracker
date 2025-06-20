import { apiClient } from './apiClient'

export const saveTraining = (training) => apiClient.post(`training/`,training)

export const retrieveAllTraining = () => apiClient.get(`training/`)

export const getTrainingById = (id) => apiClient.get(`training/${id}`)

export const updateTraining = (training) => apiClient.put(`training/`,training)