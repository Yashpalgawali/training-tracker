import { apiClient } from "./apiClient";

export const retrieveAllHolidays = () => apiClient.get('holiday/')
export const saveHoliday = (holiday) => apiClient.post('holiday/',holiday)
export const retrieveHolidayById = (id) => apiClient.get(`holiday/${id}`)
export const retrieveHolidayByDate = (date) => apiClient.get(`holiday/date/${date}`)
export const updateHoliday = (holiday) => apiClient.put('holiday/',holiday)
