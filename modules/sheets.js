const { google } = require('googleapis');
const classes = require('./classes.js');

const googleClient = new google.auth.JWT(
    process.env.CLIENT_EMAIL, 
    null, 
    process.env.PRIVATE_KEY, 
    'https://www.googleapis.com/auth/spreadsheets.readonly'
);

/**
 * @param {String} spreadsheetId 
 * @returns {classes.SheetInstant}
 */
module.exports.initialize = (spreadsheetId) => {
    return new Promise((resolve, reject) => {
        googleClient.authorize((error) => {
            if (error) {
                console.log('A')
                reject(error);
            } else {
                resolve(new classes.SheetInstant(spreadsheetId, google.sheets({ version: 'v4', auth: googleClient })));
            }
        });
    });
}

/**
 * @param {classes.SheetInstant} sheetInstant 
 * @param {String} range The A1-based range to get.
 */
module.exports.fetch = (sheetInstant, range) => {
    return sheetInstant.sheetAPI.spreadsheets.values.get({
        spreadsheetId: sheetInstant.sheetID,
        range: range
    });
}