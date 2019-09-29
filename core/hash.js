const crypto = require('crypto');


class FakeHash {
    constructor(salt) {
        this.salt = salt;
    }

    static hashGenerate(length = 0) {
        const timestampRandom = Date.now().toString + Math.random();
        if (length <= 0) {
            return crypto
                .createHash('sha256')
                .update(timestampRandom)
                .digest('hex');
        }
        return crypto
            .createHash('sha256')
            .update(timestampRandom)
            .digest('hex')
            .substr(0, length);
    }

    hash(textString) {
        const fakeHidden = this.hashGenerate();
        const realHidden = fakeHidden.substr(10);
        const textRaw = textString + this.salt + realHidden;
        return `${crypto
            .createHash('sha256')
            .update(textRaw)
            .digest('hex')}$${fakeHidden}`;
    }

    validateHash(textString, hashString) {
        if (hashString === undefined) {
            return false;
        }
        const hashSplit = hashString.split('$');
        const realHash = hashSplit[0];
        const realHidden = hashSplit[1].substr(10);
        const textRaw = textString + this.salt + realHidden;

        return (
            crypto
                .createHash('sha256')
                .update(textRaw)
                .digest('hex') === realHash
        );
    }
}

module.exports = FakeHash;
