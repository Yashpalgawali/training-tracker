import { createContext, useContext, useState } from "react"; 
import { executeJwtAuthentication } from "../api/LoginApiService";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext()

export const useAuth = ()=> useContext(AuthContext)

export default function AuthProvider({children}) { 
 
    const [isAuthenticated , setAuthenticated] = useState(false)

    const [jwtToken, setJwtToken] = useState('')
    const [userid,setUserId] = useState('')
    const [username, setUsername] = useState('')

    async function login(username,password) {
         
        const resp = await executeJwtAuthentication(username,password)
        const jwtToken = 'Bearer ' + resp.data.token
        const decoded = jwtDecode(jwtToken)
        
        console.log('decoded ',decoded)

        setUserId(decoded.userId)
        setAuthenticated(true)
        setJwtToken(jwtToken)
        setUsername(decoded.username)
        sessionStorage.setItem('userid',decoded.userId)
        localStorage.setItem('userid',decoded.userId)

    
    }

    function logout()
    { 
        setAuthenticated(false)
        return true
    }

    return (
        <AuthContext.Provider value={ { isAuthenticated, login, logout, jwtToken, userid,username } }>
            { children }
        </AuthContext.Provider>
    )
}
