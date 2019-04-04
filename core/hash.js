require('dotenv').config();

const crypto = require('crypto')
;
const salt = process.env.CRYPTO_SALT;

function hashGenerate(length=0) {
    let timestampRandom = Date.now().toString + Math.random()
    if (length <= 0){
        return crypto.createHash('sha256').update(timestampRandom).digest('hex')
    } 
        return crypto.createHash('sha256').update(timestampRandom).digest('hex').substr(0, length)
    
    
}


function hash(textString) {
    let fakeHidden = hashGenerate();
    const realHidden = fakeHidden.substr(10);
    const textRaw = textString + salt + realHidden;
    return (
        crypto
            .createHash('sha256')
            .update(textRaw)
            .digest('hex') +
        '$' +
        fakeHidden
    );
}

function validateHash(textString, hash) {
    if (hash == undefined) {
        return false;
    }
    const hashSplit = hash.split('$');
    const realHash = hashSplit[0];
    const realHidden = hashSplit[1].substr(10);
    const textRaw = textString + salt + realHidden;

    return (
        crypto
            .createHash('sha256')
            .update(textRaw)
            .digest('hex') == realHash
    );
}

module.exports = {
    hashGenerate,
    hash,
    validateHash
};
