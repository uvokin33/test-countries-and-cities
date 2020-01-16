import React, { 
    useState, 
    useContext, 
    Fragment 
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { 
    POST, 
    API_REGISTER, 
    API_LOGIN 
} from '../constants/api';
import { 
    AUTH_LABELS, 
    AUTH_LABEL_TYPES 
} from '../constants/constants';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

export const Header = () => {
    const { 
        isAuthenticated, 
        login, 
        logout, 
        email 
    } = useContext(AuthContext);
    const classes = useStyles();
    const { request } = useHttp();
    const [open, setOpen] = useState(false);
    const [register, setRegister] = useState(false);
    const [formData, setFormData] = useState({
        email: '', 
        password: '',
    });

    const handleClickOpen = (isRegister = false) => {
        setOpen(true);
        setRegister(isRegister);
    };

    const handleOnClose = () => {
        setOpen(false);
    };

    const handleOnSubmit = (event) => {
        if (Object.values(formData).some(value => !value)) {
            event.preventDefault();
            return;
        }
        handleOnClose();

        if (register) {
            handleOnClickRegister();
        } else {
            handleOnClickLogin();
        }
    }

    const handleOnClickRegister = async () => {
        try {
            await request(API_REGISTER, POST, { ...formData });
        } catch (e) {}
    };

    const handleOnClickLogin = async () => {
        try {
            const { token } = await request(API_LOGIN, POST, { ...formData });
            login(token, formData.email);
        } catch (e) {}
    };

    const handleOnChange = (event) => {
        setFormData({ 
            ...formData, 
            [event.target.id]: event.target.value 
        });
    };

    const actionTitle = register ? 'Register' : 'Login';
    
    const buttons = isAuthenticated ? (
        <Fragment>
            <p style={{marginBottom: 22}}>{email}</p>
            <Button color="inherit" onClick={() => logout()}>Logout</Button>
        </Fragment>
    ) : (
        <Fragment>
            <Button color="inherit" onClick={() => handleClickOpen(false)}>Login</Button>
            <Button color="inherit" onClick={() => handleClickOpen(true)}>Register</Button>
        </Fragment>
    );

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        Countries and cities
                    </Typography>
                    {buttons}
                </Toolbar>

                <Dialog open={open} onClose={handleOnClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{actionTitle}</DialogTitle>
                    <DialogContent>
                        {Object.keys(AUTH_LABELS).map(value => (
                            <TextField
                                autoFocus
                                margin="dense"
                                id={value}
                                label={AUTH_LABELS[value]}
                                type={AUTH_LABEL_TYPES[value]}
                                value={formData[value]}
                                onChange={handleOnChange}
                                fullWidth
                                required
                            />
                        ))}
                    </DialogContent>
                    <DialogActions>
                        <Button 
                            onClick={handleOnClose} 
                            color="primary"
                        >Cancel</Button>
                        <Button 
                            onClick={handleOnSubmit} 
                            color="primary"
                        >{actionTitle}</Button>
                    </DialogActions>
                </Dialog>
            </AppBar>
        </div>
    );
};