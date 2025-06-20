const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');


// Serve static files from the public directory (like images, CSS, etc.)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.static('public'));

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
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/dashboard/dashboard.html'));
});
app.get('/tokens', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/tokens/tokens.html'));
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/fetch-proof', async (req, res) => {
  try {
    const response = await axios.get('http://172.18.1.3:5500/proofd');
    res.json(response.data);  // Send the fetched data as a response
  } catch (error) {
    console.error('Error fetching the data:', error);
    res.status(500).send('Error fetching the data');
  }
});

app.post('/createDigitalIdentity', async (req, res) => {
  try {
    const { gas, owner, contractUser, government } = req.body;

    const requestData = {
      gas,
      owner,
      contractUser,
      government
    };

    const response = await axios.post('http://172.18.1.3:5500/createDigitalIdentity', requestData, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log(response);

    res.json(response.data);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).send('Error creating service');
  }
});

app.post('/linkTokenService', async (req, res) => {
  try {
    const { gas, from, contract2Add, contractAdd, nameToken } = req.body;

    const requestData = {
      gas,
      from,
      contract2Add,
      contractAdd,
      nameToken
    };

    const response = await axios.post('http://172.18.1.3:5500/linkToken', requestData, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log(response);

    res.json(response.data);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).send('Error creating service');
  }
});

app.get('/consultTokenCreator', async (req, res) => {
  try {
    const { contractAdd, contractToken } = req.query;

    // Make sure both parameters are provided
    if (!contractAdd || !contractToken) {
      return res.status(400).send('Both contractAdd and publicMethod are required.');
    }

    // Send a GET request to your desired endpoint with the provided query parameters
    const response = await axios.get('http://172.18.1.3:5500/consultTokenCreator', {
      params: {
        contractAdd,
        contractToken
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching the data:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching the data');
  }
});

app.get('/consultTokens', async (req, res) => {
  try {
    const { contractAdd, contractToken } = req.query;

    // Make sure both parameters are provided
    if (!contractAdd || !contractToken) {
      return res.status(400).send('Both contractAdd and publicMethod are required.');
    }

    // Send a GET request to your desired endpoint with the provided query parameters
    const response = await axios.get('http://172.18.1.3:5500/consultTokens', {
      params: {
        contractAdd,
        contractToken
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching the data:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching the data');
  }
});
app.get('/consultNumberToken', async (req, res) => {
  try {
    const { contractAdd } = req.query;

    // Make sure both parameters are provided
    if (!contractAdd) {
      return res.status(400).send('Both contractAdd and publicMethod are required.');
    }

    // Send a GET request to your desired endpoint with the provided query parameters
    const response = await axios.get('http://172.18.1.3:5500/consultNumberToken', {
      params: {
        contractAdd
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching the data:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching the data');
  }
});
app.get('/consultDigitalIdentity', async (req, res) => {
  try {
    const { contractAdd, publicMethod } = req.query;

    // Make sure both parameters are provided
    if (!contractAdd || !publicMethod) {
      return res.status(400).send('Both contractAdd and publicMethod are required.');
    }

    // Send a GET request to your desired endpoint with the provided query parameters
    const response = await axios.get('http://172.18.1.3:5500/consultDigitalIdentity', {
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

//Auth by SQL
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
});


app.post('/api/getContractAdd', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.query(
      'SELECT contractAdd FROM users WHERE contractAdd IS NOT NULL LIMIT 1'
    );

    connection.release();

    if (rows.length === 0) {
      return res.status(404).send({ message: 'No contract address found' });
    }

    res.status(200).send({ contractAdd: rows[0].contractAdd });
  } catch (error) {
    console.error('Error retrieving contract address:', error);
    res.status(400).send({ message: error.message });
  }
});


app.post('/api/getUserAdd', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: 'Email is required in the request body.' });
  }

  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.query(
      'SELECT UserAddress FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    connection.release();

    if (rows.length === 0) {
      return res.status(200).send({ UserAddress: 'No email' });
    }

    res.status(200).send({ UserAddress: rows[0].UserAddress });
  } catch (error) {
    console.error('Error retrieving user address:', error);
    res.status(500).send({ message: 'Error retrieving user address.' });
  }
});

app.get('/getInfoUser', async (req, res) => {
  try {
    const { contractAdd, userAddress } = req.query;

    // Make sure both parameters are provided
    if (!contractAdd || !userAddress) {
      return res.status(400).send('Both contractAdd and publicMethod are required.');
    }

    // Send a GET request to your desired endpoint with the provided query parameters
    const response = await axios.get('http://172.18.1.3:5500/getInfoUser', {
      params: {
        contractAdd,
        userAddress
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching the data:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching the data');
  }
});

app.post('/api/updateDigitalID', async (req, res) => {
  try {
    const { digitalIDadd, tokenAddress } = req.body;

    if (!digitalIDadd || !tokenAddress) {
      return res.status(400).send({ message: 'digitalIDadd and tokenAddress are required.' });
    }

    console.log('Updating DigitalIdentity:', digitalIDadd);

    // Verificar si la columna tokenAddresses existe y crearla si no existe
    try {
      const [columns] = await pool.query('SHOW COLUMNS FROM DigitalIdentity LIKE "tokenAddresses"');
      
      if (columns.length === 0) {
        console.log('Column tokenAddresses does not exist. Creating it...');
        await pool.query('ALTER TABLE DigitalIdentity ADD COLUMN tokenAddresses TEXT');
        console.log('Column tokenAddresses added successfully');
      }
    } catch (columnError) {
      console.error('Error checking/creating column:', columnError);
      return res.status(500).send({ message: 'Error setting up database schema.' });
    }

    // Verificar si el digital ID existe
    const [rows] = await pool.query(
      'SELECT * FROM DigitalIdentity WHERE certificateString = ?',
      [digitalIDadd]
    );

    if (rows.length === 0) {
      return res.status(404).send({ message: 'DigitalIdentity not found with the provided digitalIDadd.' });
    }

    // Comprobar si ya tiene tokenAddresses
    let tokenAddresses = [];
    if (rows[0].tokenAddresses) {
      try {
        tokenAddresses = JSON.parse(rows[0].tokenAddresses);
        if (!Array.isArray(tokenAddresses)) {
          tokenAddresses = [];
        }
      } catch (e) {
        tokenAddresses = [];
      }
    }

    // Añadir el nuevo token si no existe ya
    if (!tokenAddresses.includes(tokenAddress)) {
      tokenAddresses.push(tokenAddress);
    }

    // Actualizar el campo tokenAddresses
    await pool.query(
      'UPDATE DigitalIdentity SET tokenAddresses = ? WHERE certificateString = ?',
      [JSON.stringify(tokenAddresses), digitalIDadd]
    );

    console.log('Update complete:', tokenAddress);
    res.status(200).send({ message: 'DigitalIdentity updated successfully.' });

  } catch (error) {
    console.error('Error updating DigitalIdentity:', error);
    res.status(500).send({ 
      message: 'Error updating DigitalIdentity.', 
      error: error.message 
    });
  }
});

// Función para obtener token addresses asociados a un digital ID
app.get('/api/getDigitalID', async (req, res) => {
  try {
    const { digitalIDadd } = req.query;

    if (!digitalIDadd) {
      return res.status(400).send({ message: 'digitalIDadd is required.' });
    }

    // Verificar si el digital ID existe y obtener sus datos
    const [rows] = await pool.query(
      'SELECT * FROM DigitalIdentity WHERE certificateString = ?',
      [digitalIDadd]
    );

    if (rows.length === 0) {
      return res.status(404).send({ message: 'DigitalIdentity not found.' });
    }

    // Extraer tokenAddresses o devolver array vacío si no existe
    let tokenAddresses = [];
    if (rows[0].tokenAddresses) {
      try {
        tokenAddresses = JSON.parse(rows[0].tokenAddresses);
        if (!Array.isArray(tokenAddresses)) {
          tokenAddresses = [];
        }
      } catch (e) {
        tokenAddresses = [];
      }
    }

    res.status(200).send({ tokenAddresses: tokenAddresses });

  } catch (error) {
    console.error('Error fetching DigitalIdentity:', error);
    res.status(500).send({ message: 'Error retrieving DigitalIdentity.' });
  }
});



const PORT = 5511;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
