import { apiClient } from "./apiClient";

export const retrieveAllCompetencies = () => apiClient.get('competency/')
export const savecompetency = (competency) => apiClient.post('competency/',competency)
export const retrievecompetencyById = (id) => apiClient.get(`competency/${id}`)
export const updatecompetency = (competency) => apiClient.put('competency/',competency)
