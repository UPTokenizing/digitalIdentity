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
  res.sendFile(path.join(__dirname, 'app/pages/home/homeGuest.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/login/login.html'));
});
app.get('/userlist', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/dashboard/UserList.html'));
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//Ensure webpage is live nad correctly connected to the API Gateway
app.get('/fetch-proof', async (req, res) => {
  try {
    const response = await axios.get('http://172.18.1.3:5500/proof');
    res.json(response.data);  // Send the fetched data as a response
  } catch (error) {
    console.error('Error fetching the data:', error);
    res.status(500).send('Error fetching the data');
  }
});

//Cerate a new contracct address named birthcertificate
app.post('/createService', async (req, res) => {
  try {
    const { gas, name, fLastName, mLastName, sex, day, month, year, state, municipality, contractUser, government, owner } = req.body;
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
      contractUser,
      government,
      owner
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

//Consult individual public information of the birthcertificate Address 
app.get('/consult', async (req, res) => {
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

//Consult individual public information of the birthcertificate Address 
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

//Consult individual public information of the birthcertificate Address 
app.get('/consultPrivates', async (req, res) => {
  try {
    const { contractAdd, from } = req.query;

    // Make sure both parameters are provided
    if (!contractAdd || !from) {
      return res.status(400).send('Both contractAdd and from are required.');
    }

    // Send a GET request to your desired endpoint with the provided query parameters
    const response = await axios.get('http://172.18.1.3:5500/consultPrivates', {
      params: {
        contractAdd,
        from
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching the data:', error.response ? error.response.data : error.message);
    res.status(500).send('Error fetching the data');
  }
});

//Change de Address Selected of the birthcertificate Address 
app.post('/setAddress', async (req, res) => {
  try {
    const { contractAdd, replaceAdd, gas, government, publicMethod } = req.body;

    const requestData = {
      contractAdd,
      replaceAdd,
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


//Get contract Address for whole project (Critical user) *Uses a default Address to look for it -> "0x2CFcBB9Cf2910fBa7E7E7a8092aa1a40BC5BA341"
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

//Fetch User Address by utilizing its email saved on the user table 
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


//Fetch all emails from the user table
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

//Add to table or create the table BirthCertificates the new birthcertificate Address
app.post('/api/registerCertificate', async (req, res) => {
  const { certificateString } = req.body;

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS BirthCertificates (
        certificate_string VARCHAR(255) PRIMARY KEY,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(
      'INSERT INTO BirthCertificates (certificate_string) VALUES (?)',
      [certificateString]
    );

    res.status(201).send({ message: 'Certificate added successfully', certificateString });
  } catch (error) {
    console.error('Error adding certificate:', error);
    res.status(400).send({ message: error.message });
  }
});

//Fetch all birthcertificates stored in the database in firestore BirthCertificates Table
app.get('/api/getCertificates', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT certificate_string FROM BirthCertificates');
    const certificates = rows.map(row => row.certificate_string);
    res.status(200).send({ certificates });
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(200).send({ certificates: [] });
    }
    console.error('Error retrieving certificates:', error);
    res.status(400).send({ message: error.message });
  }
});

//Add birthcertificate Address to the BirthCertificate or cretes de field BirthCertificate in the user table
app.post('/api/updateBirthCertificate', async (req, res) => {
  const { userAddress, birthCertificate } = req.body;
  if (!userAddress || !birthCertificate) {
    return res.status(400).send({ message: 'UserAddress and BirthCertificate are required.' });
  }
  try {
    // Verify user exist
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE UserAddress = ?',
      [userAddress]
    );
    if (rows.length === 0) {
      return res.status(404).send({ message: 'User not found with the provided UserAddress.' });
    }
    
    // Verify the birthcerificate column
    const [columns] = await pool.query('SHOW COLUMNS FROM users LIKE "BirthCertificate"');
    
    // Create column if not exist
    if (columns.length === 0) {
      await pool.query('ALTER TABLE users ADD COLUMN BirthCertificate VARCHAR(255)');
      console.log('Column BirthCertificate added to users table');
    }
    
    // Update birthcertificate
    await pool.query(
      'UPDATE users SET BirthCertificate = ? WHERE UserAddress = ?',
      [birthCertificate, userAddress]
    );
    res.status(200).send({ message: 'BirthCertificate updated successfully' });
  } catch (error) {
    console.error('Error updating BirthCertificate:', error);
    res.status(500).send({ message: 'Error updating BirthCertificate.' });
  }
});

//Obtain the birthcertificate Address using the userAddress
app.post('/api/getBirthCertificate', async (req, res) => {
  const { userAddress } = req.body;

  if (!userAddress) {
    return res.status(400).send({ message: 'UserAddress is required.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT BirthCertificate FROM users WHERE UserAddress = ?',
      [userAddress]
    );

    if (rows.length === 0) {
      return res.status(404).send({ message: 'User not found with the provided UserAddress.' });
    }

    const birthCertificate = rows[0].BirthCertificate || 'No Birth Certificate found';
    res.status(200).send({ BirthCertificate: birthCertificate });
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(404).send({ message: 'User not found with the provided UserAddress.' });
    }

    console.error('Error retrieving BirthCertificate:', error);
    res.status(500).send({ message: 'Error retrieving BirthCertificate.' });
  }
});

//Obtain User Address using the Birthcertificate Address
app.post('/api/getUserFromBirthC', async (req, res) => {
  const { birthCertificate } = req.body;

  if (!birthCertificate) {
    return res.status(400).send({ message: 'birthCertificate is required.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT UserAddress FROM users WHERE BirthCertificate = ?',
      [birthCertificate]
    );

    if (rows.length === 0) {
      return res.status(404).send({ message: 'User not found with the provided BirthCertificate.' });
    }

    const userAddress = rows[0].UserAddress || 'No UserAddress found';
    res.status(200).send({ UserAddress: userAddress });
  } catch (error) {
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(404).send({ message: 'User not found with the provided BirthCertificate.' });
    }

    console.error('Error retrieving userAddress:', error);
    res.status(500).send({ message: 'Error retrieving userAddress.' });
  }
});


//Listening to port PORT
const PORT = 5510;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
