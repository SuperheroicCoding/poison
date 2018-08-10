const os = require('os');
const admin = require("firebase-admin");
const serviceAccount = require(os.homedir() + "/.firebase/angularexamples-firebase-adminsdk.json");

const initBaseData = require('../admin/base-data.v1').initBaseData;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://angularexamples-b69f4.firebaseio.com"
});

const db = admin.firestore();

async function writeDefaultData() {
  return await initBaseData(db);
}

writeDefaultData().then(ignored => console.log('initialized firestore'), error => {
  console.error('error initializing firestore', error);
  throw error;
});

