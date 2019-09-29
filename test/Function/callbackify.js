/* eslint-disable no-undef */
const { expect } = require('chai');

const {
    Function: { callbackify }
} = require('../../index');

describe('Callbackify function test cases:', () => {
    const tempString = 'result1';
    const tempString2 = 'result2';
    const tempString3 = 'result3';

    const functionPromise = arg1 => Promise.resolve(tempString + arg1);

    const functionFullPromise = (arg1, arg2) =>
        new Promise((resolve, reject) => {
            const sum = arg1 + arg2;
            const substract = arg1 - arg2;
            if (sum > 10) {
                resolve(sum);
            }

            reject(substract);
        });

    it('callbackify default', done => {
        const functionCallback = callbackify(functionPromise);

        functionCallback(tempString2, result => {
            try {
                expect(result).to.equal(tempString + tempString2);
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    it('callbackify full case resolve', done => {
        const functionCallback = callbackify(functionFullPromise);

        functionCallback(10, 15, result => {
            try {
                expect(result).to.equal(10 + 15);
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    it('callbackify full case reject', done => {
        const functionCallback = callbackify(functionFullPromise);

        functionCallback(1, 2, (result, error) => {
            try {
                expect(error).to.equal(1 - 2);
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    it('callbackify with position', done => {
        const functionCallback = callbackify(functionFullPromise, {
            positionCallback: 1
        });

        functionCallback(
            1,
            (result, error) => {
                try {
                    expect(error).to.equal(1 - 2);
                    done();
                } catch (err) {
                    done(err);
                }
            },
            2
        );
    });

    it('callbackify have success/error callback position success case', done => {
        const functionCallback = callbackify(functionFullPromise, {
            positionCallback: 1,
            type: 1
        });

        functionCallback(
            10,
            result => {
                try {
                    expect(result).to.equal(10 + 20);
                    done();
                } catch (err) {
                    done(new Error(err));
                }
            },
            err => {
                done(new Error(err));
            },
            20
        );
    });

    it('callbackify have success/error callback position error case', done => {
        const functionCallback = callbackify(functionFullPromise, {
            positionCallback: 1,
            type: 1
        });

        functionCallback(
            1,
            () => {
                done(new Error('failed'));
            },
            err => {
                try {
                    expect(err).to.equal(1 - 2);
                    done();
                } catch (error) {
                    done(new Error(error));
                }
            },
            2
        );
    });
});
