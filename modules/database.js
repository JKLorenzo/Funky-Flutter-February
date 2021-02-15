const admin = require('firebase-admin');
const classes = require('./classes.js');

admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_CREDENTIALS.replace(/'/g, '"').replace(/\n/g, '\\n'))),
    databaseURL: "https://funky-flutter-february-default-rtdb.firebaseio.com"
});

const Firestore = admin.firestore();
const DBfinishers = Firestore.collection('finishers');
let index = -1;

module.exports.getLastCount = async () => {
    const finishers = await DBfinishers.orderBy('index').get();
    for (const finisher of finishers.docs) {
        const data = finisher.data();
        if (data.index > index) index = data.index;
    }
    return index;
}

/** @param {classes.Finisher} finisher  */
module.exports.push = (finisher) => {
    // Upload to database
    return DBfinishers.add({
        timestamp: finisher.timestamp,
        name: finisher.fullname,
        email: finisher.email,
        address: finisher.address,
        badges: finisher.badges,
        index: ++index
    });
}