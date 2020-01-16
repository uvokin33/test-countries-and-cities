import { createContext } from "react";

const noop = () => {}

export const AuthContext = createContext({
    isAuthenticated: false,
    countries: null,
    token: null,
    email: null,
    login: noop,
    logout: noop,
    getAllCountries: noop,
});