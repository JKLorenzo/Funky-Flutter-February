/**
 * Waits for the given amount of time.
 * @param {number} timeout Time in miliseconds.
 * @returns {Promise<null>}
 */
module.exports.sleep = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
};