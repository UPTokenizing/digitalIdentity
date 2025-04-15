const express = require('express');
const app = express();
const path = require('path');
const axios = require('axios');
require('dotenv').config();
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

//Firebase Auth verification
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

//Get contract Address for whole project (Critical user) *Uses a default Address to look for it -> "0x2CFcBB9Cf2910fBa7E7E7a8092aa1a40BC5BA341"
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

//Fetch User Address by utilizing its email saved on the user collection 
app.post('/api/getUserAdd', async (req, res) => {
  try {
    const email = req.body.email; // Get the email from the request body

    const db = admin.firestore();

    // Query Firestore to find the user based on the default UserAddress
    const userSnapshot = await db.collection('users')
      .where('email', '==', email)
      .get();

    if (userSnapshot.empty) {
      // Return a default user address if no user is found with the given UserAddress
      const defaultUserAdd = 'No email';
      return res.status(200).send({ UserAddress: defaultUserAdd });
    }

    // Get userAdd from the found user document
    const userDoc = userSnapshot.docs[0];  // Assuming UserAddress is unique
    const UserAddress = userDoc.data().UserAddress;

    res.status(200).send({ UserAddress: UserAddress });
  } catch (error) {
    console.error('Error retrieving user address:', error);
    res.status(400).send({ message: error.message });
  }
});

//Fetch all emails from the user collection in Firestore
app.get('/api/getAllEmails', async (req, res) => {
  try {
    const db = admin.firestore();

    // Retrieve all documents in the 'users' collection
    const usersSnapshot = await db.collection('users').get();

    if (usersSnapshot.empty) {
      return res.status(404).send({ message: 'No users found.' });
    }

    // Extract emails from the documents
    const emails = usersSnapshot.docs.map((doc) => doc.data().email);
    res.status(200).send({ emails }); // Send the emails as a response
  } catch (error) {
    console.error('Error fetching emails:', error);
    res.status(500).send({ message: 'Error fetching emails.' });
  }
});

//Add to collection BirthCertificates the new birthcertificate Address 
app.post('/api/registerCertificate', async (req, res) => {
  const { certificateString } = req.body;
  
  try {
    const db = admin.firestore();

    // Create a new document in the `BirthCertificates` collection with the certificate string as the document ID
    const docRef = db.collection('BirthCertificates').doc(certificateString);

    // Set the document data (it can be an empty object or you can add additional metadata)
    await docRef.set({ createdAt: admin.firestore.FieldValue.serverTimestamp() });

    res.status(201).send({ message: 'Certificate added successfully', certificateString });
  } catch (error) {
    console.error('Error adding certificate:', error);
    res.status(400).send({ message: error.message });
  }
});

//Fetch all birthcertificates stored in the database in firestore BirthCertificates collection
app.get('/api/getCertificates', async (req, res) => {
  try {
    const db = admin.firestore();
    const certificatesSnapshot = await db.collection('BirthCertificates').get();

    // Extract the document IDs (certificate strings)
    const certificates = certificatesSnapshot.docs.map(doc => doc.id);
    res.status(200).send({ certificates });
  } catch (error) {
    console.error('Error retrieving certificates:', error);
    res.status(400).send({ message: error.message });
  }
});

//Add birthcertificate Address to the BirthCertificate or cretes de field BirthCertificate in the user table that has the useraddress in firestore
app.post('/api/updateBirthCertificate', async (req, res) => {
  try {
    const { userAddress, birthCertificate } = req.body;

    if (!userAddress || !birthCertificate) {
      return res.status(400).send({ message: 'UserAddress and BirthCertificate are required.' });
    }
    const db = admin.firestore();

    // Find the user document with the given UserAddress
    const userSnapshot = await db.collection('users')
      .where('UserAddress', '==', userAddress)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).send({ message: 'User not found with the provided UserAddress.' });
    }

    // Update the first found user document (assuming UserAddress is unique)
    const userDoc = userSnapshot.docs[0].ref;
    await userDoc.update({ BirthCertificate: birthCertificate });
    res.status(200).send({ message: 'BirthCertificate updated successfully' });
  } catch (error) {
    console.error('Error updating BirthCertificate:', error);
    res.status(500).send({ message: 'Error updating BirthCertificate.' });
  }
});

//Obtain the birthcertificate Address using the userAddress
app.post('/api/getBirthCertificate', async (req, res) => {
  try {
    const { userAddress } = req.body;

    if (!userAddress) {
      return res.status(400).send({ message: 'UserAddress is required.' });
    }

    const db = admin.firestore();

    // Query Firestore to find the user based on UserAddress
    const userSnapshot = await db.collection('users')
      .where('UserAddress', '==', userAddress)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).send({ message: 'User not found with the provided UserAddress.' });
    }

    // Get BirthCertificate field from the found user document
    const userDoc = userSnapshot.docs[0];
    const birthCertificate = userDoc.data().BirthCertificate || 'No Birth Certificate found';

    res.status(200).send({ BirthCertificate: birthCertificate });
  } catch (error) {
    console.error('Error retrieving BirthCertificate:', error);
    res.status(500).send({ message: 'Error retrieving BirthCertificate.' });
  }
});

//Obtain User Address using the Birthcertificate Address, info saved on firstore
app.post('/api/getUserFromBirthC', async (req, res) => {
  try {
    
    const { birthCertificate } = req.body;
    if (!birthCertificate) {
      return res.status(400).send({ message: 'birthCertificate is required.' });
    }
    
    const db = admin.firestore();
    // Query Firestore to find the user based on BirthCertificate
    const userSnapshot = await db.collection('users')
      .where('BirthCertificate', '==', birthCertificate)
      .get();
      
    
    if (userSnapshot.empty) {
      
      return res.status(404).send({ message: 'User not found with the provided BirthCertificate.' });
    }
    
    // Get UserAddress field from the found user document
    const userDoc = userSnapshot.docs[0];
    const userAddress = userDoc.data().UserAddress || 'No UserAddress found';
    
    res.status(200).send({ UserAddress: userAddress });
  } catch (error) {
    console.error('Error retrieving userAddress:', error);
    res.status(500).send({ message: 'Error retrieving userAddress.' });
  }
});

//Listening to port PORT
const PORT = 5510;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
