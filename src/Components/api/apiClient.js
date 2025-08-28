import axios from 'axios';

// For External Tomcat
// export const apiClient = axios.create({
//     baseURL : 'http://localhost:8080/trainingtrackerrest/'
// })

// For Local Tomcat
// export const apiClient = axios.create({
//     baseURL : 'http://localhost:7878/trainingtrackerrest/'
// })

// For Tomcat 10
export const apiClient = axios.create({
    baseURL : 'http://13.233.33.85:8080/trainingtrackerrest/'
})
