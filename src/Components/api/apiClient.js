import axios from 'axios';

// For Localhost
// export const apiClient = axios.create({
//     baseURL : 'http://localhost:7878/'
// })

// For Local Tomcat
// export const apiClient = axios.create({
//     baseURL : 'http://localhost:7878/trainingtrackerrest/'
// })

// For Tomcat 10
export const apiClient = axios.create({
    baseURL : 'http://65.1.112.209:8080/trainingtrackerrest/'
})
