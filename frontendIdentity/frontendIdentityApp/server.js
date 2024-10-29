const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const qs = require('qs');

// Serve static files from the public directory (like images, CSS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from app/pages/dashboard if needed
app.use('/dashboard', express.static(path.join(__dirname, 'app/pages/dashboard')));

// Serve your HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/home/home.html'));
});
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/home/home.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/login/login.html'));
});
app.get('/loading', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/loading/loading.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/dashboard/dashboard.html'));
});

app.get('/create-service', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/createService/create-service.html'));
});
app.get('/consult-service', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/consultService/consult-service.html'));
});



app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/fetch-proof', async (req, res) => {
  try {
    const response = await axios.get('http://172.18.1.3:5500/proof');
    res.json(response.data);  // Send the fetched data as a response
  } catch (error) {
    console.error('Error fetching the data:', error);
    res.status(500).send('Error fetching the data');
  }
});



app.get('/consult-data', async (req, res) => {
  try {
    const { contractAdd, publicMethod } = req.query;

    // Make sure both parameters are provided
    if (!contractAdd || !publicMethod) {
      return res.status(400).send('Both contractAdd and publicMethod are required.');
    }

    // Send a GET request to your desired endpoint with the provided query parameters
    const response = await axios.get('http://172.18.1.3:5500/consult', {
      params: {
        contractAdd,
        publicMethod
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching the data:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching the data');
  }
});


// Route to handle the POST request from the form
app.post('/createService', async (req, res) => {
  try {
    const { gas, name, fLastName, mLastName, sex, day, month, year, state, municipality, tokenFather, tokenMother, from } = req.body;

    const requestData = {
      gas,
      name,
      fLastName,
      mLastName,
      sex,
      day,
      month,
      year,
      state,
      municipality,
      tokenFather,
      tokenMother,
      from
    };

    const response = await axios.post('http://172.18.1.3:5500/create', requestData, {
      headers: { 'Content-Type': 'application/json' }
    });
    

    res.json(response.data);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).send('Error creating service');
  }
});


app.post('/setAddress', async (req, res) => {
  try {
    const { contractAdd, fAddress, gas, government, publicMethod} = req.body;

    const requestData = {
      contractAdd,
      fAddress,
      gas,
      government,
      publicMethod
    };
   
    const response = await axios.post('http://172.18.1.3:5500/setAddress', requestData, {
      headers: { 'Content-Type': 'application/json' }
    });
    

    res.json(response.data);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).send('Error creating service');
  }
});




const PORT = 5510;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
