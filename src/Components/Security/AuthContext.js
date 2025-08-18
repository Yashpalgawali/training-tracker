import { createContext, useContext, useEffect, useState } from "react"; 
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
const [loading, setLoading] = useState(true); // 👈 new
    
  // ✅ Restore auth from localStorage/sessionStorage on refresh
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userid");
    const storedUsername = localStorage.getItem("username");

    if (storedToken && storedUserId) {
      setJwtToken(storedToken);
      setUserId(storedUserId);
      setUsername(storedUsername);
      setAuthenticated(true);

      // re-attach axios interceptor
      apiClient.interceptors.request.use((config) => {
        config.headers.Authorization = storedToken;
        return config;
      });
    }
      setLoading(false); // 👈 auth check done
  }, []);

    async function login(username,password) {
        try{ 
            const resp = await executeJwtAuthentication(username,password)
           
            if(resp.status==200) {
              
                const jwtToken =  resp.data.token
                const decoded = jwtDecode(jwtToken)
                setUserId(decoded.userId)
                setAuthenticated(true)
                setJwtToken('Bearer ' +jwtToken)
                setUsername(decoded.username)
                sessionStorage.setItem('userid',decoded.userId)
                localStorage.setItem('userid',decoded.userId) 

                // ✅ persist in storage
                localStorage.setItem("token", "Bearer " + jwtToken);
                localStorage.setItem("userid", decoded.userId);
                localStorage.setItem("username", decoded.username);

                apiClient.interceptors.request.use(
                    (config) => {
                        config.headers.Authorization='Bearer ' +jwtToken
                        return config
                    }
                )
                return true
            }
            else {
                 
                 logout()
                 return false
            }
        }
        catch(error) {
            
            logout()
            return false
        }
    }
    async function logout()
    {      
        const result = await logoutFunction(jwtToken)
      
        sessionStorage.setItem('logout',result.data.message) 
        
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
            {loading ? <div>Loading...</div> : children}
            {/* { children } */}
        </AuthContext.Provider>
    )
}
