import React, { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import { useHttp } from '../hooks/http.hook';
import { AuthContext } from '../context/AuthContext';
import { EditCountry } from '../components/EditCountry';
import { COUNTRY_LABELS } from '../constants/constants';
import { 
  PUT, 
  DELETE, 
  AUTHORIZATION_HEADER, 
  API_COUNTRY_BY_ID 
} from '../constants/api';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export const CountriesTable = ({ handleOnSelect }) => {
    const classes = useStyles();
    const { request } = useHttp();
    const { token, getAllCountries, countries } = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [country, setCountry] = useState(null);

    const handleOnClickOpen = country => {
        setOpen(true);
        setCountry(country);
    };

    const handleOnClose = () => {
        setOpen(false);
    };

    const handleOnDelete = async countryId => {
      try {
        await request(API_COUNTRY_BY_ID(countryId), DELETE, null, AUTHORIZATION_HEADER(token));
        getAllCountries();
      } catch (e) {}
    }

    return (
      <TableContainer component={Paper}>
        <Table className={classes.table} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {Object.values(COUNTRY_LABELS).map(value => (
                <TableCell key={value} align="right">{value}</TableCell>
              ))}
              <TableCell align="right">Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {countries.map(country => (
              <TableRow key={country._id}>
                {Object.keys(COUNTRY_LABELS).map(value => (
                    <TableCell key={value} align="right">{country[value]}</TableCell>
                ))}
                <TableCell align="right">
                  <Button variant="contained" onClick={() => handleOnSelect(country._id)}>Select</Button>
                  <Button variant="contained" onClick={() => handleOnClickOpen(country)}>Edit</Button>
                  <Button variant="contained" onClick={() => handleOnDelete(country._id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <EditCountry 
            handleOnClose={handleOnClose}
            open={open}
            method={PUT}
            country={country}
        />
    </TableContainer>
    );
};