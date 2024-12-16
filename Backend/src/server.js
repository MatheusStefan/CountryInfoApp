const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const countriesRoutes = require('./routes/countriesRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/countries', countriesRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Countries Information API',
    availableEndpoints: [
      'GET /api/countries/available',
      'GET /api/countries/info/:countryCode'
    ]
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV !== 'production' ? err.stack : {}
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});