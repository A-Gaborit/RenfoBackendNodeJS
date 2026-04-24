import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type UserContextValue = {
    user: any;
    setUser: any;
    token: string | null;
    setToken: (token: string | null) => void;
    expiration: Date | null;
    logout: () => void;
};

export const UserContext = createContext<UserContextValue>({
    user: {},
    setUser: () => {},
    token: null,
    setToken: () => {},
    expiration: null,
    logout: () => {},
});

export const UserProvider = ({ children }: { children?: any }) => {
    const [user, setUser] = useState<any>(undefined);
    const [token, setTokenState] = useState<string | null>(null);
    const [expiration, setExpiration] = useState<Date | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) loadFromToken(storedToken);
    }, []);

    const loadFromToken = (rawToken: string) => {
        try {
            const decoded: any = jwtDecode(rawToken);
            const expirationDate = new Date(decoded.exp * 1000);

            if (expirationDate > new Date()) {
                setUser(decoded.user);
                setTokenState(rawToken);
                setExpiration(expirationDate);
            } else {
                logout();
            }
        } catch {
            logout();
        }
    };

    const setToken = (newToken: string | null) => {
        if (newToken) {
            localStorage.setItem("token", newToken);
            loadFromToken(newToken);
        } else {
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(undefined);
        setTokenState(null);
        setExpiration(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, token, setToken, expiration, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useCurrentUser = () => useContext(UserContext);