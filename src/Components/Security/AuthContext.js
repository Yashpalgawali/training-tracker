import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext()

export const useAuth = ()=> useContext(AuthContext)

export default function AuthProvider({children}) {

const [number,setNumber] = useState(100)

const [isAuthenticated , setAuthenticated] = useState(false)



function login(username,password) {
    if(username==='admin') {
        setAuthenticated(true)
        alert('success')
    }
    else {
        setAuthenticated(false)
        alert('failed')
    }
}

    function logout()
    {alert('Logged Out')
        setAuthenticated(false)
       return true

    }
    return (
        <AuthContext.Provider value={ { number , isAuthenticated, login, logout } }>
            { children }
        </AuthContext.Provider>
    )
}
