# test-countries-and-cities - **[Demo](http://test-countries-and-cities.herokuapp.com/)**

# Instalation
`git clone https://github.com/uvokin33/test-countries-and-cities.git`\
`npm install`\
Create file `.env` and fill it. Example in `.env-example`\
`npm run client-install`

`npm run client-build`, `npm run start-server-as-prod` and go to localhost:8000\
  *or*\
`npm run start-dev` and go to localhost:3000

# API

`post` to `/api/auth/login` (password, email) - login\
`post` to `/api/auth/register` (password, email) - register

> **Send with header** `Authorization: Bearer ${token from login}`


`get` to `/api/countries` - get all countries\
`post` to `/api/countries`(name, full_name, numcode:number, alfa3, alfa2, sort:number) - add new countrie\

`get` to `/api/countries/:countrieId` - get country by id\
`put` to `/api/countries/:countrieId` (name, full_name, numcode:number, alfa3, alfa2, sort:number) - update countrie with id\
`delete` to `/api/countries/:countrieId` - delete countrie with id\

`get` to `/api/countries/:countrieId/cities` - get cities in selected county\
`get` to `/api/countries/:countrieId/cities:cityId` - get selected city in country\

`post` to `/api/countries/default` - set countries and cities to default (`default_cities.json`, `default_countries.json`)
