import axios from 'axios';

// For Localhost
// export const apiClient = axios.create({
//     baseURL : 'http://localhost:7878/'
// })

// For Local Tomcat
export const apiClient = axios.create({
    baseURL : 'http://localhost:7878/trainingtrackerrest/'
})