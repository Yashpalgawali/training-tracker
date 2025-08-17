import { apiClient } from "./apiClient";

export const retrieveAllCategories = () => apiClient.get('category/')
export const saveCategory = (category) => apiClient.post('category/',category)
export const retrieveCategoryById = (id) => apiClient.get(`category/${id}`)
export const updateCategory = (category) => apiClient.put('category/',category)
