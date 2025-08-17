import axios from 'axios';

// For Localhost
// export const apiClient = axios.create({
//     baseURL : 'http://localhost:7878/'
// })

// For Local Tomcat
export const apiClient = axios.create({
    baseURL : 'http://localhost:7878/trainingtrackerrest/'
})

// For Local Tomcat
// export const apiClient = axios.create({
//     baseURL : 'http://43.204.227.39:8080/trainingtrackerrest/'
// })
 