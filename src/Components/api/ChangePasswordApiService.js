import { apiClient } from "./apiClient";


export const updatePassword = (user) => apiClient.put('password/change',user)

export const sendOtp = (email) => apiClient.get(`password/otp/${email}`)

export const updateForgotPassword = (user) => apiClient.put(`password/forgot`,user)

export const validateOtp = (email,otp) => apiClient.get(`password/email/${encodeURIComponent(email)}/otp/${otp}`)
