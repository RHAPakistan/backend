
var admin = require("firebase-admin");

var serviceAccount = require("./rhafoodapp-firebase-adminsdk-2d8ab-4f819954c5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rhafoodapp-default-rtdb.firebaseio.com"
});

module.exports.admin = admin