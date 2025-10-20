const crypto = require('crypto');

const generateSHA256 = (str) => {
    return crypto.createHash('sha256').update(str).digest('hex');
}

module.exports = { generateSHA256 };