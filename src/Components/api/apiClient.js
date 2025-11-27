import axios from 'axios';

// For External Tomcat
export const apiClient = axios.create({
    baseURL : 'http://192.168.0.219:8081/trainingtrackerrest/'
})

// For Local Tomcat (STS)
// export const apiClient = axios.create({
//     baseURL : 'http://localhost:7878/trainingtrackerrest/'
// })

// export const apiClient = axios.create({
//     baseURL : 'http://192.168.0.219:7878/trainingtrackerrest/'
// })

// export const apiClient = axios.create({
//     baseURL : 'http://192.168.0.219:8282/trainingtrackerrest/'
// }) 


// For Tomcat 10
// export const apiClient = axios.create({
//     baseURL : 'http://13.232.150.127:8080/trainingtrackerrest/'
// })
 