const { google } = require('googleapis');
const classes = require('./classes.js');
const sheet_credentials = JSON.parse(process.env.SHEET_CREDENTIALS.replace(/'/g, '"').replace(/\n/g, '\\n'));

const googleClient = new google.auth.JWT(
    sheet_credentials.client_email, 
    null, 
    sheet_credentials.private_key, 
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