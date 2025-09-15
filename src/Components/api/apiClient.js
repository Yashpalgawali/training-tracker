import axios from 'axios';

// For External Tomcat
// export const apiClient = axios.create({
//     baseURL : 'http://192.168.0.219:8081/trainingtrackerrest/'
// })

// For Local Tomcat
// export const apiClient = axios.create({
//     baseURL : 'http://localhost:7878/trainingtrackerrest/'
// })

// For Tomcat 10
export const apiClient = axios.create({
    baseURL : 'http://65.1.85.186:8080/trainingtrackerrest/'
})
