import axios from 'axios';

// For Localhost
// export const apiClient = axios.create({
//     baseURL : 'http://localhost:7878/'
// })

// For Local Tomcat
export const apiClient = axios.create({
    baseURL : 'http://localhost:7878/trainingtrackerrest/'
})

// For Tomcat 10
// export const apiClient = axios.create({
//     baseURL : 'http://13.235.67.121:8081/trainingtrackerrest/'
// })

