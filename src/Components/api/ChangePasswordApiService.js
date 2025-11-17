import { apiClient } from "./apiClient";

export const updatePassword = (user) => apiClient.post('password/change',user)