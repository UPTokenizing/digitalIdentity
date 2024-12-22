// config/firebase-config.js
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-credentials.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = admin; // Exportamos el admin para usarlo en otros archivos
