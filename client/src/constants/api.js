export const GET = 'GET';
export const POST = 'POST';
export const DELETE = 'DELETE';
export const PUT = 'PUT';

export const API_LOGIN = 'api/auth/login';
export const API_REGISTER = 'api/auth/register';

export const API_COUNTRIES = '/api/countries/';
export const API_COUNTRY_BY_ID = countryId => `api/countries/${countryId}`;

export const API_COUNTRY_CITIES = countryId => `/api/countries/${countryId}/cities`;

export const API_SET_DEFAULT_CITIES = 'api/countries/default';

export const AUTHORIZATION_HEADER = token => ({ Authorization: `Bearer ${token}` });