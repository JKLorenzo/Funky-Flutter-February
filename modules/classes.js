const { google, sheets_v4 } = require('googleapis');
const functions = require('./functions.js');

/**
 * Creates a Process Queue.
 * @param {number} timeout Time in miliseconds.
 *  @returns Process Queue
 */
module.exports.ProcessQueue = class {
    constructor(timeout = 0) {
        this.timeout = timeout;
        this.processID = 0;
        this.currentID = 0;
    }

    /**
     * Start queueing.
     * @returns {Promise<null>}
     */
    queue() {
        const ID = this.processID++;
        return new Promise(async resolve => {
            while (ID != this.currentID) await functions.sleep(2500);
            resolve();
        });
    }

    /**
     * Finish queue turn.
     */
    finish() {
        setTimeout(() => {
            this.currentID++;;
        }, this.timeout);
    }
}

module.exports.Finisher = class {
    /** @param {Array<String>} data */
    constructor(data) {
        this.timestamp = data[0];
        this.email = data[1];
        let name = data[2];
        // Format name to FN LN
        let splitname = name.split(',');
        if (splitname.length > 0){
            name = `${splitname[1].trim()} ${splitname[0].trim()}`
        }
        this.fullname = name.split(' ').map(word => `${word.charAt(0).toUpperCase()}${word.substring(1).toLowerCase()}`).join(' ');
        this.address = data[3];
        this.badges = data[4];
    }
}

module.exports.SheetInstant = class {
    /**
     * @param {String} sheetID 
     * @param {sheets_v4.Sheets} sheetAPI 
     */
    constructor(sheetID, sheetAPI){
        this.sheetID = sheetID,
        this.sheetAPI = sheetAPI
    }
}