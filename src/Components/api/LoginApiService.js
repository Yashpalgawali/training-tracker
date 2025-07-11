import { apiClient } from "./apiClient";

// export const executeJwtAuthentication = 
//             (btoken) => apiClient.post(`/authenticate`, { }, 
//                 { 
//                     headers : {Authorization : btoken ,"Content-Type": "application/json"}
//                 } 
//             )

export const executeJwtAuthentication = 
            (username,password) => apiClient.post(`/authenticate`, {username,password }, 
                { 
                    headers : {"Content-Type": "application/json"}
                } 
            )
export const logoutFunction = 
    (btoken) => apiClient.post(`/logouturl`, { }, { headers : {
        Authorization : btoken ,
        "Content-Type": "application/json"
    }} )