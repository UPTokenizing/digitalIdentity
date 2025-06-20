const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db'); 

// Serve static files from the public directory (like images, CSS, etc.)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.static('public'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


// Serve static files from app/pages/dashboard if needed
app.use('/dashboard', express.static(path.join(__dirname, 'app/pages/dashboard')));

// Serve your HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/home/home.html'));
});
app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/home/homeGuest.html'));
});
app.get('/studentPanel', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/dashboard/dashboardNoAuth.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/login/login.html'));
});
app.get('/registerGovernment', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/register/registerCriticUsers.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/pages/dashboard/dashboard.html'));
});


app.get('/fetch-proof', async (req, res) => {
  try {
    const response = await axios.get('http://172.18.1.3:5500/proof');
    res.json(response.data);  // Send the fetched data as a response
  } catch (error) {
    console.error('Error fetching the data:', error);
    res.status(500).send('Error fetching the data');
  }
});



// Route to handle the POST request from the form
app.post('/createCurriculum', async (req, res) => {

  try {
    const { gas, BirthCertificate, studentID, from } = req.body;

    const requestData = {
      gas,
      BirthCertificate,
      studentID,
      from
    };

    console.log(requestData);



    const response = await axios.post('http://172.18.1.3:5500/createCurriculum', requestData, {
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

/////////////////////////////////////////////////////////////////
app.get('/api/getCertificates', async (req, res) => {
  try {
  
    const [rows] = await pool.query('SELECT certificate_string FROM BirthCertificates');
    const certificates = rows.map(row => row.certificate_string);

    console.log('All certificates:', certificates);
    res.status(200).send({ certificates });
  } catch (error) {
    console.error('Error retrieving certificates:', error);
    res.status(400).send({ message: error.message });
  }
});

app.post('/api/getBirthCertificate', async (req, res) => {
  try {
    const { userAddress } = req.body;

    if (!userAddress) {
      return res.status(400).send({ message: 'UserAddress is required.' });
    }

    // Buscar el usuario con el UserAddress dado
    const [rows] = await pool.query(
      'SELECT BirthCertificate FROM users WHERE UserAddress = ?',
      [userAddress]
    );

    if (rows.length === 0) {
      return res.status(404).send({ message: 'User not found with the provided UserAddress.' });
    }

    // Obtener el BirthCertificate del usuario
    const birthCertificate = rows[0].BirthCertificate || 'No Birth Certificate found';

    res.status(200).send({ BirthCertificate: birthCertificate });
  } catch (error) {
    console.error('Error retrieving BirthCertificate:', error);
    res.status(500).send({ message: 'Error retrieving BirthCertificate.' });
  }
});

//Retrieve students ID
app.get('/api/getStudentsIDs', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT certificate_string, StudentID FROM BirthCertificates WHERE StudentID IS NOT NULL'
    );

    if (rows.length === 0) {
      return res.status(404).send({ message: 'No birth certificates with student IDs found.' });
    }

    // Mapear los resultados
    const students = rows.map(row => ({
      certificate: row.certificate_string,
      studentID: row.StudentID
    }));

    console.log('Students:', students);
    res.status(200).send({ students });
  } catch (error) {
    console.error('Error retrieving student IDs:', error);
    res.status(500).send({ message: 'Error retrieving student IDs.' });
  }
});

app.post('/api/updateBirthCertificateWithStudentID', async (req, res) => {
  try {
    const { studentID, birthCertificate } = req.body;

    if (!studentID || !birthCertificate) {
      return res.status(400).send({ message: 'studentID and birthCertificate are required.' });
    }

    console.log('Registered birth:', birthCertificate);
    
    // Verificar primero si la tabla BirthCertificates existe
    try {
      const [tables] = await pool.query("SHOW TABLES LIKE 'BirthCertificates'");
      
      if (tables.length === 0) {
        // Si la tabla no existe, la creamos
        console.log('Creating BirthCertificates table...');
        await pool.query(`
          CREATE TABLE BirthCertificates (
            id INT AUTO_INCREMENT PRIMARY KEY,
            certificate_string VARCHAR(255) UNIQUE NOT NULL,
            StudentID VARCHAR(255)
          )
        `);
        console.log('BirthCertificates table created');
      }
    } catch (tableError) {
      console.error('Error checking/creating table:', tableError);
      return res.status(500).send({ message: 'Error setting up database table.' });
    }
    
    // Verificar si la columna StudentID existe
    try {
      const [columns] = await pool.query('SHOW COLUMNS FROM BirthCertificates LIKE "StudentID"');
      
      if (columns.length === 0) {
        // Si la columna no existe, la creamos
        console.log('Creating StudentID column...');
        await pool.query('ALTER TABLE BirthCertificates ADD COLUMN StudentID VARCHAR(255)');
        console.log('Column StudentID added to BirthCertificates table');
      }
    } catch (columnError) {
      console.error('Error checking/creating column:', columnError);
      return res.status(500).send({ message: 'Error setting up database schema.' });
    }

    // Verificar si el certificado existe
    const [rows] = await pool.query(
      'SELECT * FROM BirthCertificates WHERE certificate_string = ?',
      [birthCertificate]
    );

    if (rows.length === 0) {
      // Si el certificado no existe, lo creamos
      console.log('Birth certificate not found, creating it');
      await pool.query(
        'INSERT INTO BirthCertificates (certificate_string, StudentID) VALUES (?, ?)',
        [birthCertificate, studentID]
      );
      
      console.log('Registered id: complete', studentID);
      return res.status(200).send({ message: 'Birth certificate created with studentID' });
    }

    // Si el certificado existe, actualizamos el StudentID
    await pool.query(
      'UPDATE BirthCertificates SET StudentID = ? WHERE certificate_string = ?',
      [studentID, birthCertificate]
    );

    console.log('Registered id: complete', studentID);
    res.status(200).send({ message: 'studentID updated successfully' });
  } catch (error) {
    console.error('Error updating studentID:', error);
    res.status(500).send({ message: 'Error updating studentID.' });
  }
});

app.post('/api/updateScholarCurriculum', async (req, res) => {
  try {
    const { birthCertificate, curriculumAdd, Institution } = req.body;

    if (!birthCertificate || !curriculumAdd || !Institution) {
      return res.status(400).send({ message: 'birthCertificate, Institution, and curriculumAdd are required.' });
    }

    console.log('Registered curriculum:', curriculumAdd);
    
    // Verificar si la columna de la institución existe
    try {
      const [columns] = await pool.query(`SHOW COLUMNS FROM users LIKE '${Institution}'`);
      
      if (columns.length === 0) {
        // Si la columna no existe, la creamos
        await pool.query(`ALTER TABLE users ADD COLUMN \`${Institution}\` VARCHAR(255)`);
        console.log(`Column ${Institution} added to users table`);
      }
    } catch (columnError) {
      console.error('Error checking/creating column:', columnError);
      return res.status(500).send({ message: 'Error setting up database schema.' });
    }
    
    // Buscar el usuario con el BirthCertificate dado
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE BirthCertificate = ?',
      [birthCertificate]
    );

    if (rows.length === 0) {
      return res.status(404).send({ message: 'User not found with the provided birthCertificate.' });
    }

    // Actualizar el campo de institución con el curriculumAdd
    await pool.query(
      `UPDATE users SET \`${Institution}\` = ? WHERE BirthCertificate = ?`,
      [curriculumAdd, birthCertificate]
    );

    console.log(`Updated: ${Institution}: ${curriculumAdd}`);
    res.status(200).send({ message: `Curriculum added under ${Institution}` });
  } catch (error) {
    console.error('Error updating curriculumAdd:', error);
    res.status(500).send({ message: 'Error updating curriculumAdd.' });
  }
});

app.post('/api/getStudentsCurriculum', async (req, res) => {
  try {
    const { birthCertificate, Institution } = req.body;
    if (!birthCertificate || !Institution) {
      return res.status(400).send({ message: 'Missing birthcertificate or Institution parameter.' });
    }

    // Verificar si la columna institución existe
    try {
      const [columns] = await pool.query(`SHOW COLUMNS FROM users LIKE '${Institution}'`);
      if (columns.length === 0) {
        return res.status(404).send({ message: `No curriculum found for ${Institution}.` });
      }
    } catch (error) {
      console.error('Error checking column:', error);
      return res.status(500).send({ message: 'Error checking database schema.' });
    }

    // Buscar el estudiante por su BirthCertificate
    const [rows] = await pool.query(
      `SELECT \`${Institution}\` FROM users WHERE BirthCertificate = ?`,
      [birthCertificate]
    );

    if (rows.length === 0) {
      return res.status(404).send({ message: 'No matching student found.' });
    }

    // Verificar si el campo de la institución tiene valor
    if (!rows[0][Institution]) {
      return res.status(404).send({ message: `No curriculum found for ${Institution}.` });
    }

    // Devolver el currículo
    res.status(200).send({ ScholarCurriculum: rows[0][Institution] });
  } catch (error) {
    console.error('Error retrieving student curriculum:', error);
    res.status(500).send({ message: 'Error retrieving student curriculum.' });
  }
});

app.post('/api/updateCurriculum', async (req, res) => {
  try {
    const { Institution, tokenAddress, birthCertificates } = req.body;

    if (!Institution || !tokenAddress || !birthCertificates) {
      return res.status(400).send({ message: 'Institution, tokenAddress, and birthCertificates are required.' });
    }

    console.log(`Updating DigitalIdentity for Institution: ${Institution}`);

    // El nombre del campo para los logros
    const achievementsField = `${Institution}Achievements`;
    
    // Verificar si la columna de logros existe
    try {
      const [columns] = await pool.query(`SHOW COLUMNS FROM BirthCertificates LIKE '${achievementsField}'`);
      
      if (columns.length === 0) {
        // Si la columna no existe, la creamos para almacenar JSON
        await pool.query(`ALTER TABLE BirthCertificates ADD COLUMN \`${achievementsField}\` TEXT`);
        console.log(`Column ${achievementsField} added to BirthCertificates table`);
      }
    } catch (columnError) {
      console.error('Error checking/creating column:', columnError);
      return res.status(500).send({ message: 'Error setting up database schema.' });
    }
    
    // Verificar si el certificado existe
    const [rows] = await pool.query(
      'SELECT * FROM BirthCertificates WHERE certificate_string = ?',
      [birthCertificates]
    );

    if (rows.length === 0) {
      return res.status(404).send({ message: 'BirthCertificate not found with the provided birthCertificates.' });
    }

    // Actualizar el campo de logros
    let achievements = [];
    if (rows[0][achievementsField]) {
      try {
        achievements = JSON.parse(rows[0][achievementsField]);
        if (!Array.isArray(achievements)) {
          achievements = [];
        }
      } catch (e) {
        achievements = [];
      }
    }
    
    // Añadir el token si no existe
    if (!achievements.includes(tokenAddress)) {
      achievements.push(tokenAddress);
    }
    
    await pool.query(
      `UPDATE BirthCertificates SET \`${achievementsField}\` = ? WHERE certificate_string = ?`,
      [JSON.stringify(achievements), birthCertificates]
    );

    console.log(`Update complete: Added ${tokenAddress} to ${achievementsField}`);
    res.status(200).send({ message: `DigitalIdentity updated successfully for ${Institution}` });
  } catch (error) {
    console.error('Error updating DigitalIdentity:', error);
    res.status(500).send({ message: 'Error updating DigitalIdentity.' });
  }
});


app.post('/api/searchStudent', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ message: "Missing search query" });

    const [students] = await pool.query(`
      SELECT studentID, certificate_string FROM BirthCertificates
      WHERE studentID = ? `,
      [query, `%${query}%`]
    );

    if (!students.length) return res.status(404).json({ message: "No matching students found." });

    res.json({ students });
  } catch (err) {
    console.error("Error in /api/searchStudent:", err);
    res.status(500).json({ message: "Server error searching student" });
  }
});

app.post('/api/checkStudentBirthCertificate', async (req, res) => {
  try {
    const { studentId } = req.body;
    
    // Validate that studentId was provided
    if (!studentId) {
      return res.status(400).send(false);
    }
    
    // First check if the BirthCertificates table exists
    const [tableCheck] = await pool.query(`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema = DATABASE() AND table_name = 'BirthCertificates'
    `);

    if (tableCheck[0].count === 0) {
      return res.status(200).send(false);
    }
    
    // Then check if the student ID exists in the table
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM BirthCertificates WHERE StudentID = ?', 
      [studentId]
    );

    // Simply return true if found, false if not
    return res.status(200).send(rows[0].count > 0);
    
  } catch (error) {
    console.error('Error checking birth certificate:', error);
    return res.status(200).send(false);
  }
});


////////////////////////////////////////////////////////////

app.get('/numberOfAchievements', async (req, res) => {
  try {
    const { contractAdd } = req.query;

    if (!contractAdd) {
      return res.status(400).send({ message: 'contractAdd is required.' });
    }

    // Simulating a response (replace with actual logic if needed)
    const response = await axios.get('http://172.18.1.3:5500/numberOfAchievements', {
      params: { contractAdd }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching numberOfAchievements:', error.message);
    res.status(500).send({ message: 'Error fetching numberOfAchievements' });
  }
});

app.get('/consultCertificate', async (req, res) => {
  try {
    const { contractAdd, id } = req.query;

    if (!contractAdd || id === undefined) {
      return res.status(400).send({ message: 'contractAdd and id are required.' });
    }

    // Simulating a response (replace with actual logic if needed)
    const response = await axios.get('http://172.18.1.3:5500/consultCertificate', {
      params: { contractAdd, id }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching consultCertificate:', error.message);
    res.status(500).send({ message: 'Error fetching consultCertificate' });
  }
});

app.post('/addAchievement', async (req, res) => {
  try {
    // Destructure data sent from frontend
    const { gas, from, contractAdd, id, title, date, details } = req.body;

    const requestData = {
      gas,
      from,
      contractAdd,
      id,
      title,
      date,
      details
    };

    console.log("Received data:", requestData);

    // Send request to an external service (like your Solidity contract or another API)
    const response = await axios.post('http://172.18.1.3:5500/addAchievement', requestData, {
      headers: { 'Content-Type': 'application/json' },
    });

    // Send the result back to the frontend
    res.json(response.data);
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).send('Error creating achievement');
  }
});

app.post('/api/checkInstitutionField', async (req, res) => {
  try {
    const { birthCertificate, Institution } = req.body;

    if (!birthCertificate || !Institution) {
      return res.status(400).send({ message: 'birthCertificate and Institution are required.' });
    }

    // Primero verificamos si la columna de la institución existe
    try {
      const [columns] = await pool.query(`SHOW COLUMNS FROM users LIKE '${Institution}'`);
      
      // Si la columna no existe, retornamos false directamente
      if (columns.length === 0) {
        return res.status(200).send({ exists: false });
      }
    } catch (columnError) {
      console.error('Error checking column:', columnError);
      return res.status(500).send({ message: 'Error checking database schema.', exists: false });
    }

    // Buscamos el usuario con el birthCertificate proporcionado
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE BirthCertificate = ?',
      [birthCertificate]
    );

    if (rows.length === 0) {
      return res.status(404).send({ message: 'User not found with the provided birthCertificate.', exists: false });
    }

    // Verificar si el campo Institution tiene valor
    if (rows[0][Institution]) {
      return res.status(200).send({ exists: true });
    } else {
      return res.status(200).send({ exists: false });
    }
  } catch (error) {
    console.error('Error checking Institution field:', error);
    return res.status(500).send({ message: 'Error checking Institution field.', exists: false });
  }
});



const PORT = 5513;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
