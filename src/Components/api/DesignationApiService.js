import { apiClient } from "./apiClient";

export const getAllDesignations= () => apiClient.get('/designation/')
export const getDesignationById= (id) => apiClient.get(`/designation/${id}`)
export const saveDesignation= (designation) => apiClient.post(`/designation/`,designation)
export const updateDesignation= (designation) => apiClient.put(`/designation/`,designation)