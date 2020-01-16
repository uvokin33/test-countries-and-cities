import React, { 
  useState, 
  useCallback, 
  useEffect 
} from 'react';
import { Header } from './components/Header';
import { AuthContext } from './context/AuthContext';
import { useAuth } from './hooks/auth.hook';
import { MainPage } from './pages/MainPage';
import { useHttp } from './hooks/http.hook';
import { 
  GET, 
  API_COUNTRIES, 
  AUTHORIZATION_HEADER 
} from './constants/api';

export const App = () => {
  const {
    token,
    login,
    logout,
    email,
  } = useAuth();
  const { request } = useHttp();
  const [countries, setCountries] = useState([]);

  const isAuthenticated = !!token;

  const getAllCountries = useCallback(async () => {
      try {
          const data = await request(API_COUNTRIES, GET, null, AUTHORIZATION_HEADER(token));
          if (data) {
              setCountries(data);
          }
      } catch (e) {} 
  }, [request, token]);

  useEffect(() => {
      getAllCountries();
  }, [getAllCountries]);

  return (
    <AuthContext.Provider value={{
      token, 
      login, 
      logout, 
      isAuthenticated,
      email,
      getAllCountries,
      countries,
    }}>
      <div className="main">
        <Header />
        <MainPage />
      </div>
    </AuthContext.Provider>
  );
};
