import { createContext, useContext, useState } from "react"; 
import { executeJwtAuthentication , logoutFunction } from "../api/LoginApiService";
import { jwtDecode } from "jwt-decode";
import { apiClient } from "../api/apiClient";

export const AuthContext = createContext()

export const useAuth = ()=> useContext(AuthContext)

export default function AuthProvider({children}) { 
 
    const [isAuthenticated , setAuthenticated] = useState(false)

    const [jwtToken, setJwtToken] = useState('')
    const [userid,setUserId] = useState('')
    const [username, setUsername] = useState('')

    async function login(username,password) {
        try{ 
            const resp = await executeJwtAuthentication(username,password)
            console.log('response from JWT authentication ',resp)
            if(resp.status==200) {
                alert('login success')
                const jwtToken = 'Bearer ' + resp.data.token
                const decoded = jwtDecode(jwtToken)
                setUserId(decoded.userId)
                setAuthenticated(true)
                setJwtToken(jwtToken)
                setUsername(decoded.username)
                sessionStorage.setItem('userid',decoded.userId)
                localStorage.setItem('userid',decoded.userId) 

                apiClient.interceptors.request.use(
                    (config) => {
                        config.headers.Authorization=jwtToken
                        return config
                    }
                )
                return true
            }
            else {
                 alert('login failed'+resp.data)
                 console.log('Login failed returning false',resp.data)
                 logout()
                 return false
            }
        }
        catch(error) {
            alert('INSIDE Error ')
            console.log(error)
            // logout()
            // return false
        }
    }
    async function logout()
    {      
        const result = await logoutFunction(jwtToken)
      
        alert(result.data.message) 
        
        setAuthenticated(false)
        setUserId('')
        setJwtToken(null)
        setUsername('')
        sessionStorage.clear()
        localStorage.clear()
       
        return result
    }

    return (
        <AuthContext.Provider value={ { isAuthenticated, login, logout, jwtToken, userid,username } }>
            { children }
        </AuthContext.Provider>
    )
}
