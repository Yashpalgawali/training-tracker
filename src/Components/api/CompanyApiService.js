import { apiClient } from "./apiClient";

export const retrieveAllCompanies = () => apiClient.get('company/')
export const saveCompany = (company) => apiClient.post('company/',company)
export const retrieveCompanyById = (id) => apiClient.get(`company/${id}`)
export const updateCompany = (company) => apiClient.put('company/',company)
