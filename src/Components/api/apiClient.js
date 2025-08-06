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
//     baseURL : 'http://13.201.226.149:8080/trainingtrackerrest/'
// })
