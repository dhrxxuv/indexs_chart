const express = require('express');
const axios = require('axios');
const csv = require('csv-parse');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

const url = 'https://raw.githubusercontent.com/shaktids/stock_app_test/refs/heads/main/dump.csv';

let fullData = []; 
axios.get(url)
  .then(response => {
    csv.parse(response.data, { columns: true, trim: true }, (err, output) => {
      if (err) {
        console.error('Error parsing CSV data:', err);
      } else {
        fullData = output;
      }
    });
  })
  .catch(error => {
    console.error('Error fetching CSV data:', error);
  });

app.get('/get-csv-data', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const data = fullData.slice(startIndex, endIndex);

  res.json(data);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
