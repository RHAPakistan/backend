
var admin = require("firebase-admin");

var serviceAccount = require("./rhafoodapp-firebase-adminsdk-2d8ab-f568503a46.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://rhafoodapp-default-rtdb.firebaseio.com"
});

module.exports.admin = admin