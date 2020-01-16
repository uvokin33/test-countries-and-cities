import React, { 
    useState, 
    useContext, 
    useEffect 
} from 'react';
import { useHttp } from '../hooks/http.hook';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { AuthContext } from '../context/AuthContext';
import { 
    AUTHORIZATION_HEADER, 
    POST, 
    API_COUNTRIES, 
    PUT, 
    API_COUNTRY_BY_ID 
} from '../constants/api';
import { 
    COUNTRY_LABEL_TYPES, 
    COUNTRY_LABELS 
} from '../constants/constants';

export const EditCountry = ({ open, handleOnClose, country = {}, method = POST }) => {
    const { token, getAllCountries } = useContext(AuthContext);
    const { request } = useHttp();
    const [formData, setFormData] = useState({
        name: '',
        full_name: '',
        numcode: '',
        alfa3: '',
        alfa2: '',
        sort: '',
    });
    
    const isUpdate = method === PUT;

    useEffect(() => {
        if (isUpdate) {
            setFormData((prevState) => ({ ...prevState, ...country }));
        }
    }, [setFormData, country, isUpdate]);


    const handleOnSave = async (event) => {
        if (Object.values(formData).some(value => !value) && !isUpdate) {
            event.preventDefault();
            return;
        }
        handleOnClose();
 
        await request(isUpdate ? API_COUNTRY_BY_ID(country._id) : API_COUNTRIES, method, { ...formData}, AUTHORIZATION_HEADER(token));
        getAllCountries();
    }

    const handleOnChange = (event) => {
        setFormData({ 
            ...formData, 
            [event.target.id]: event.target.value 
        });
    };

    return (
        <Dialog open={open} onClose={handleOnClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">New country</DialogTitle>
            <DialogContent>
                {Object.keys(formData).map(value => (
                    <TextField
                        key={value}
                        autoFocus
                        margin="dense"
                        id={value}
                        label={COUNTRY_LABELS[value]}
                        type={COUNTRY_LABEL_TYPES[value]}
                        value={formData[value]}
                        onChange={handleOnChange}
                        required={!isUpdate}
                        fullWidth
                    />
                ))}
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={handleOnClose} 
                    color="primary"
                >Cancel</Button>
                <Button 
                    onClick={handleOnSave} 
                    color="primary"
                >Save</Button>
            </DialogActions>
        </Dialog>
    );
};