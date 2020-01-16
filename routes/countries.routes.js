const { Router } = require('express');
const auth = require('../middleware/auth.middleware');
const Country = require('../models/Country');
const City = require('../models/City');
const defaultCountries = require('../default_countries.json');
const defaultCities = require('../default_cities.json');
const router = Router();

// /api/countries/
router.get('/', auth, async (req, res) => {
    try {
        const countries = await Country.find({});
        res.json(countries);
    } catch (e) {
        res.status(500).json({
            message: 'Something went wrong, try again',
        });
    }
});

// /api/countries/
router.post('/', auth, async (req, res) => {
    try {
        const { 
            name, 
            full_name, 
            numcode, 
            alfa3, 
            alfa2, 
            sort 
        } = req.body;

        const country = new Country({
            name, 
            full_name, 
            numcode, 
            alfa3, 
            alfa2, 
            sort,
        });

        await country.save();
        res.status(201).json({ country });
    } catch (e) {
        res.status(500).json({
            message: 'Something went wrong, try again',
        });
    }
});

// /api/countries/:countryId
router.get('/:countryId', auth, async (req, res) => {
    try {
        const { countryId } = req.params;
        const country = await Country.findById(countryId);
        res.json(country);
    } catch (e) {
        res.status(500).json({
            message: 'Something went wrong, try again',
        });
    }
});

// /api/countries/:countryId
router.put('/:countryId', auth, async (req, res) => {
    try {
        const { countryId } = req.params;
        await Country.updateOne({ _id: countryId }, { ...req.body });
        res.json({});
    } catch (e) {
        res.status(500).json({
            message: 'Something went wrong, try again',
        });
    }
});

// /api/countries/:countryId
router.delete('/:countryId', auth, async (req, res) => {
    try {
        const { countryId } = req.params;
        await Country.deleteOne({ _id: countryId });
        res.json({});
    } catch (e) {
        res.status(500).json({
            message: 'Something went wrong, try again',
        });
    }
});

// /api/countries/:countryId/cities
router.get('/:countryId/cities', auth, async (req, res) => {
    try {
        const { countryId } = req.params;

        const country = await Country.findOne({ _id: countryId });

        const cities = await City.find({ 
            "region.country": countryId
        }).lean();

        const responce = cities.map(value => ({
            ...value, 
            region: { 
                ...value.region,
                country 
            }
        }));
        res.json(responce);
    } catch (e) {
        res.status(500).json({
            message: 'Something went wrong, try again',
        });
    }
});

// /api/countries/:countryId/cities/:cityId
router.get('/:countryId/cities/:cityId', auth, async (req, res) => {
    try {
        const { countryId, cityId } = req.params;
        const city = await City.findOne({ _id: cityId, "region.country": countryId });
        res.json(city);
    } catch (e) {
        res.status(500).json({
            message: 'Something went wrong, try again',
        });
    }
});

// /api/countries/default
router.post('/default', auth, async (req, res) => {
    try {
        await Country.deleteMany({});
        await City.deleteMany({});

        const countriesIds = {};
        defaultCountries.forEach(async country => {
            const newCountry = new Country({ ...country });    
            countriesIds[newCountry.name] = newCountry._id;
            await newCountry.save();
        });

        defaultCities.forEach(async city => {
            const countryId = countriesIds[city.region.country];
            if (countryId) {
                await new City({ 
                    ...city,
                    region: {
                        country: countryId,
                    },
                }).save();    
            }
        });
        res.json({});
    } catch (e) {
        res.status(500).json({
            message: 'Something went wrong, try again',
        });
    }
});

module.exports = router;