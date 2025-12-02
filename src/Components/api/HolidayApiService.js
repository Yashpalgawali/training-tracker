import { apiClient } from "./apiClient";

export const retrieveAllHolidays = () => apiClient.get('holiday/')
export const saveCategory = (holiday) => apiClient.post('holiday/',holiday)
export const retrieveCategoryById = (id) => apiClient.get(`holiday/${id}`)
export const updateCategory = (holiday) => apiClient.put('holiday/',holiday)
