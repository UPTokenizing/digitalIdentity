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
app.get('/registerGovernment', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/register/registerCriticUsers.html'));
});
app.get('/users', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/userList/userList.html'));
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
app.get('/dashboard/genesisId.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/dashboard/dashboardPages/genesisId/genesisId.html'));
});
app.get('/dashboard/digitalId.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/dashboard/dashboardPages/digitalId/digitalId.html'));
});


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/fetch-proof', async (req, res) => {
  try {
    const response = await axios.get('http://172.18.1.3:5500/proofu');
    res.json(response.data);  // Send the fetched data as a response
  } catch (error) {
    console.error('Error fetching the data:', error);
    res.status(500).send('Error fetching the data');
  }
});

app.post('/createUser', async (req, res) => {
  try {
    const { gas, government } = req.body;

    const requestData = {
      gas,
      government
    };

    console.log(requestData);

    const response = await axios.post('http://172.18.1.3:5500/createUser', requestData, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log(response);

    res.json(response.data);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).send('Error creating service');
  }
});

app.post('/registerUser', async (req, res) => {
  try {
    const {
      gas,
      contractAdd,
      publicMethod,
      userAddress,
      userType,
      government } = req.body;

    const requestData = {
      gas,
      contractAdd,
      publicMethod,
      userAddress,
      userType,
      government
    };
    console.log(requestData);

    const response = await axios.post('http://172.18.1.3:5500/registerUser', requestData, {
      headers: { 'Content-Type': 'application/json' }
    });

    console.log(response.data);
    res.json(response.data);

  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).send('Error creating service');
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

app.get('/consultuser', async (req, res) => {
  try {
    const { contractAdd, publicMethod } = req.query;

    // Make sure both parameters are provided
    if (!contractAdd || !publicMethod) {
      return res.status(400).send('Both contractAdd and publicMethod are required.');
    }

    // Send a GET request to your desired endpoint with the provided query parameters
    const response = await axios.get('http://172.18.1.3:5500/consultuser', {
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



app.post('/api/registerCritic', async (req, res) => {
  const { email, password, UserAddress, Type, contractAdd } = req.body;

  try {
    const connection = await pool.getConnection();

    // Crear tabla si no existe
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        UserAddress VARCHAR(255),
        Type VARCHAR(50),
        contractAdd VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Deleat existen user table if existed after creating the new critical user
    await connection.query('DELETE FROM users');

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar nuevo usuario
    await connection.query(
      `INSERT INTO users (email, password, UserAddress, Type, contractAdd) 
       VALUES (?, ?, ?, ?, ?)`,
      [email, hashedPassword, UserAddress, Type, contractAdd]
    );

    connection.release();

    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(400).send({ message: error.message });
  }
});


//before this was teh critic
app.post('/api/registerUser2', async (req, res) => {
  const { email, password, UserAddress, Type, contractAdd } = req.body;

  try {
    const connection = await pool.getConnection();

    // Create table if not exists
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        UserAddress VARCHAR(255),
        Type VARCHAR(50),
        contractAdd VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    await connection.query(
      `INSERT INTO users (email, password, UserAddress, Type, contractAdd) 
       VALUES (?, ?, ?, ?, ?)`,
      [email, hashedPassword, UserAddress, Type, contractAdd]
    );

    connection.release();

    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(400).send({ message: error.message });
  }
});

app.post('/api/getContractAdd', async (req, res) => {
  const UserAddress = '0x2CFcBB9Cf2910fBa7E7E7a8092aa1a40BC5BA341';  // Default address

  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.query(
      'SELECT contractAdd FROM users WHERE UserAddress = ? LIMIT 1',
      [UserAddress]
    );

    connection.release();

    if (rows.length === 0) {
      return res.status(200).send({ contractAdd: UserAddress }); // Default if not found
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


app.get('/api/getAllEmails', async (req, res) => {
  try {
    const connection = await pool.getConnection();

    const [rows] = await connection.query('SELECT email FROM users');

    connection.release();

    if (rows.length === 0) {
      return res.status(404).send({ message: 'No users found.' });
    }

    const emails = rows.map((row) => row.email);

    console.log('Registered Emails:', emails);
    res.status(200).send({ emails });
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).send({ message: 'Error fetching emails.' });
  }
});



app.post('/api/registerDigitalIdentity', async (req, res) => {
  const { certificateString } = req.body;

  if (!certificateString) {
    return res.status(400).send({ message: 'certificateString is required.' });
  }

  try {
    const connection = await pool.getConnection();

    // Crear tabla si no existe
    await connection.query(`
      CREATE TABLE IF NOT EXISTS DigitalIdentity (
        id INT AUTO_INCREMENT PRIMARY KEY,
        certificateString VARCHAR(255) UNIQUE NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Insertar el certificado
    await connection.query(
      'INSERT INTO DigitalIdentity (certificateString) VALUES (?)',
      [certificateString]
    );

    connection.release();

    res.status(201).send({ message: 'Certificate added successfully', certificateString });
  } catch (error) {
    console.error('Error adding certificate:', error.message);
    res.status(400).send({ message: error.message });
  }
});




const PORT = 5512;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
