import React, { 
    useContext, 
    Fragment, 
    useState 
} from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { CountriesTable } from '../components/CountriesTable';
import { CitiesTable } from '../components/CitiesTable';
import { AuthContext } from '../context/AuthContext';
import { useHttp } from '../hooks/http.hook';
import { EditCountry } from '../components/EditCountry';
import { 
    GET, 
    AUTHORIZATION_HEADER, 
    API_COUNTRY_CITIES, 
    POST,
    API_SET_DEFAULT_CITIES
 } from '../constants/api';

export const MainPage = () => {
    const { request } = useHttp();
    const [cities, setCities] = useState([]);
    const [open, setOpen] = useState(false);
    const { 
        isAuthenticated, 
        token, 
        countries, 
        getAllCountries 
    } = useContext(AuthContext);
    
    const handleOnClickOpen = () => {
        setOpen(true);
    };

    const handleOnClose = () => {
        setOpen(false);
    };

    const handleOnSelect = async countryId => {
        try {
            const data = await request(API_COUNTRY_CITIES(countryId), GET, null, AUTHORIZATION_HEADER(token));
            if (data) {
                setCities(data);
            }
        } catch (e) {}
    };

    const handleOnDefault = async () => {
        try {
            await request(API_SET_DEFAULT_CITIES, POST, {}, AUTHORIZATION_HEADER(token));
            getAllCountries();
        } catch (e) {}
    }

    return (
        <div>
            {isAuthenticated ? (
                <Fragment>
                    <Button variant="contained" onClick={handleOnClickOpen}>New Country</Button>
                    <Button variant="contained" onClick={handleOnDefault}>Default</Button>
                    <Button variant="contained" onClick={getAllCountries}>Refresh</Button>

                    <Typography variant="h6" align="center">Countries</Typography>
                    <CountriesTable handleOnSelect={handleOnSelect} />
                    
                    {!!(cities.length && countries.length) && (
                        <Fragment>
                            <Typography variant="h6" align="center">Cities</Typography>
                            <CitiesTable cities={cities} />
                        </Fragment>
                    )}
                    <EditCountry 
                        handleOnClose={handleOnClose}
                        open={open}
                    />
                </Fragment>
            ) : (
                <Typography variant="h1" align="center">Please login to the system</Typography>
            )}
        </div>
    );
};