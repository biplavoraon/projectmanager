import { createContext, useState } from "react";
import jwt_decode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const decoded = auth?.accessToken ? jwt_decode(auth.accessToken) : undefined;
    const roles = decoded?.authorities;
    const rolesMap = roles?.map(role => role.authority);
    const name = decoded?.sub;

    return (
        <AuthContext.Provider value={{ auth, setAuth, rolesMap, name }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;