import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const serviceAccount = require('../../serviceAccountKey.json');

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: "movie-creation.appspot.com"
});

const db = getFirestore();
export default db;
