import { apiClient } from "./apiClient";

export const retrieveAllTrainingTimeSlots = () => apiClient.get('trainingtimeslot/')
export const saveTrainingTimeSlot = (trainingtimeslot) => apiClient.post('trainingtimeslot/',trainingtimeslot)
export const retrieveTrainingTimeSlotById = (id) => apiClient.get(`trainingtimeslot/${id}`)
export const updateTrainingTimeSlot = (trainingtimeslot) => apiClient.put('trainingtimeslot/',trainingtimeslot)
