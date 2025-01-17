const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
const qs = require('qs');
require('dotenv').config();
const { auth } = require('./app/pages/config/firebase-config');
const authMiddleware = require('./app/pages/middleware/auth');
const admin = require('./app/pages/config/firebase-config');

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
    const { gas, email, government } = req.body;

    const requestData = {
      gas,
      email,
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
      name,
      lastName,
      email,
      userType,
      government } = req.body;

    const requestData = {
      gas,
      contractAdd,
      publicMethod,
      userAddress,
      name,
      lastName,
      email,
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

app.post('/api/login', async (req, res) => {

  const { email, password } = req.body;
  const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;


  try {
    // Step 1: Use Firebase Identity Toolkit API to verify email and password
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    const { localId } = response.data;

    // Step 2: Generate a custom token for the user
    const customToken = await admin.auth().createCustomToken(localId);

    // Step 3: Return the custom token and user data
    res.json({
      token: customToken,
      user: {
        email,
        uid: localId,
      },
    });
  } catch (error) {
    console.error('Login error:', error.response ? error.response.data : error.message);
    res.status(401).json({
      message: 'Invalid credentials',
      error: error.message,
    });
  }
});


app.post('/api/registerCritic', async (req, res) => {
  const { email, password, UserAddress, Type, contractAdd } = req.body;

  try {
    const db = admin.firestore();

    // Verificar si Firestore contiene datos en la colección `users`
    const usersSnapshot = await db.collection('users').get();

    if (!usersSnapshot.empty) {
      // La colección `users` no está vacía, eliminar todos los usuarios y documentos
      console.log('Firestore no está vacío. Eliminando datos existentes...');

      // 1. Eliminar todos los usuarios de Firebase Authentication
      const listUsersResult = await admin.auth().listUsers();
      const deletePromises = listUsersResult.users.map(user =>
        admin.auth().deleteUser(user.uid)
      );
      await Promise.all(deletePromises);
      console.log('Todos los usuarios de Firebase Authentication han sido eliminados.');

      // 2. Eliminar todas las colecciones/documentos de Firestore
      const deleteFirestorePromises = usersSnapshot.docs.map(doc => doc.ref.delete());
      await Promise.all(deleteFirestorePromises);
      console.log('Todos los documentos de la colección `users` han sido eliminados.');
    }

    // Crear un nuevo usuario en Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    // Guardar datos adicionales del usuario en Firestore
    await db.collection('users').doc(userRecord.uid).set({
      email: email,
      UserAddress: UserAddress,
      Type: Type,
      contractAdd: contractAdd,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).send({ message: 'User registered successfully', uid: userRecord.uid });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(400).send({ message: error.message });
  }
});

//before this was teh critic
app.post('/api/registerUser2', async (req, res) => {
  const { email, password, UserAddress, Type, contractAdd } = req.body;

  try {
    // Create a new user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
    });

    // Save additional user data to Firestore
    const db = admin.firestore();
    await db.collection('users').doc(userRecord.uid).set({
      email: email,
      UserAddress: UserAddress,
      Type: Type,
      contractAdd: contractAdd,
      createdAt: admin.firestore.FieldValue.serverTimestamp(), // optional: track creation timestamp
    });

    res.status(201).send({ message: 'User registered successfully', uid: userRecord.uid });
  } catch (error) {
    console.error('Error creating new user:', error);
    res.status(400).send({ message: error.message });
  }
});

app.post('/api/getContractAdd', async (req, res) => {
  // Default User Address
  const UserAddress = '0x2CFcBB9Cf2910fBa7E7E7a8092aa1a40BC5BA341';  // Default address

  try {
    const db = admin.firestore();

    // Query Firestore to find the user based on the default UserAddress
    const userSnapshot = await db.collection('users')
      .where('UserAddress', '==', UserAddress)
      .get();

    if (userSnapshot.empty) {
      // Return a default contract address if no user is found with the given UserAddress
      const defaultContractAdd = '0x2CFcBB9Cf2910fBa7E7E7a8092aa1a40BC5BA341';
      return res.status(200).send({ contractAdd: defaultContractAdd });
    }

    // Get contractAdd from the found user document
    const userDoc = userSnapshot.docs[0];  // Assuming UserAddress is unique
    const contractAdd = userDoc.data().contractAdd;

    res.status(200).send({ contractAdd: contractAdd });
  } catch (error) {
    console.error('Error retrieving contract address:', error);
    res.status(400).send({ message: error.message });
  }
});


app.post('/api/getUserAdd', async (req, res) => {
  try {
    const email = req.body.email; // Get the email from the request body

    if (!email) {
      return res.status(400).send({ message: 'Email is required in the request body.' });
    }

    const db = admin.firestore();

    // Query Firestore to find the user based on the email
    const userSnapshot = await db.collection('users')
      .where('email', '==', email)
      .get();

    if (userSnapshot.empty) {
      // Return a default user address if no user is found with the given email
      const defaultUserAdd = 'No email';
      return res.status(200).send({ UserAddress: defaultUserAdd });
    }

    // Get UserAddress from the found user document
    const userDoc = userSnapshot.docs[0]; // Assuming email is unique
    const UserAddress = userDoc.data().UserAddress;

    res.status(200).send({ UserAddress });
  } catch (error) {
    console.error('Error retrieving user address:', error);
    res.status(500).send({ message: 'Error retrieving user address.' });
  }
});




const PORT = 5512;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
