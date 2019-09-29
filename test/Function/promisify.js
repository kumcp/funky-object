/* eslint-disable no-undef */
/* eslint-disable max-classes-per-file */
const { expect } = require('chai');

const {
    Function: { promisify }
} = require('../../index');

describe('Promisify function test cases:', () => {
    const tempString = 'result1';
    const tempString2 = 'result2';
    const tempString3 = 'result3';

    it('promisify default: ', done => {
        const functionWithCallback = cb => {
            cb(tempString);
        };

        const functionPromise = promisify(functionWithCallback);

        functionPromise().then(result => {
            try {
                expect(result).to.equal(tempString);
                done();
            } catch (err) {
                done(err);
            }
        });
    });

    it('promisify function take multiple params callback with position: ', done => {
        const functionWithCallback = (arg1, cb, arg2) => {
            cb(arg1, arg2, tempString);
        };

        const functionPromise = promisify(functionWithCallback, {
            type: 1,
            positionCallback: 1
        });

        functionPromise(tempString2, tempString3)
            .then(([arg1, arg2, arg3]) => {
                try {
                    expect(arg1).to.equal(tempString2);
                    expect(arg2).to.equal(tempString3);
                    expect(arg3).to.equal(tempString);
                    done();
                } catch (err) {
                    done(err);
                }
            })
            .catch(err => {
                console.log(err);
                done(err);
            });
    });

    const functionWithCallback = (arg1, arg2, successCb, errorCb) => {
        const sum = arg1 + arg2;
        const subtract = arg1 - arg2;

        if (sum > 5) {
            successCb(sum, subtract);
        } else {
            errorCb(arg1, arg2);
        }
    };

    it('promisify function have success/error callback with success', done => {
        const functionPromise = promisify(functionWithCallback, { type: 2 });
        functionPromise(5, 3)
            .then(([sum, subtract]) => {
                try {
                    expect(sum).to.equal(8);
                    expect(subtract).to.equal(2);

                    done();
                } catch (err) {
                    done(err);
                }
            })
            .catch(err => {
                console.log(err);
                done(err);
            });
    });

    it('promisify function have success/error callback with error', done => {
        const functionPromise = promisify(functionWithCallback, { type: 2 });
        functionPromise(1, 2)
            .then(([sum, subtract]) => {
                done('fail');
            })
            .catch(([arg1, arg2]) => {
                try {
                    expect(arg1).to.equal(1);
                    expect(arg2).to.equal(2);

                    done();
                } catch (err) {
                    done(err);
                }
            });
    });

    const functionWithCallbackPosition = (arg1, successCb, errorCb, arg2) => {
        const sum = arg1 + arg2;
        const subtract = arg1 - arg2;

        if (sum > 5) {
            successCb(sum, subtract);
        } else {
            errorCb(arg1, arg2);
        }
    };

    it('promisify function have success/error callback with position success', done => {
        const functionPromise = promisify(functionWithCallbackPosition, {
            positionCallback: 1,
            type: 2
        });
        functionPromise(5, 3)
            .then(([sum, subtract]) => {
                try {
                    expect(sum).to.equal(8);
                    expect(subtract).to.equal(2);

                    done();
                } catch (err) {
                    done(err);
                }
            })
            .catch(err => {
                console.log(err);
                done(err);
            });
    });

    const functionWithoutCallback = (arg1, arg2) => {
        const sum = arg1 + arg2;
        const subtract = arg1 - arg2;

        return [sum, subtract];
    };

    it('promisify function do not have callback', done => {
        const functionPromise = promisify(functionWithoutCallback);

        functionPromise(6, 4)
            .then(([sum, sub]) => {
                try {
                    expect(sum).to.equal(10);
                    expect(sub).to.equal(2);
                    done();
                } catch (err) {
                    done(new Error(err));
                }
            })
            .catch(err => {
                done(new Error(err));
            });
    });

    const scope = {
        propertyA: tempString,
        functionWithScope: (arg1, arg2, cb) => {
            this.propertyA = arg1;
            this.propertyB = tempString;
            cb(arg1 + arg2);
        }
    };

    it('promisify function have simple callback with scope', done => {
        const functionPromise = promisify(scope.functionWithScope, {
            context: scope
        });

        functionPromise(4, 5)
            .then(result => {
                try {
                    expect(result).to.equal(9);
                    expect(this.propertyA).to.equal(4);
                    expect(this.propertyB).to.equal(tempString);
                    done();
                } catch (err) {
                    done(new Error(err));
                }
            })
            .catch(err => {
                done(new Error(err));
            });
    });

    class TestCase8 {
        method1(arg1, cb, arg2) {
            cb(this.method2() + arg1 + this.method3() + arg2);
        }

        method2() {
            return this.method3() + tempString;
        }

        // eslint-disable-next-line class-methods-use-this
        method3() {
            return tempString2;
        }

        method10(arg1, cb, arg2, ClassName) {
            if (arg2 > 5) {
                cb(this.method2() + ClassName.method3() + arg1);
            } else {
                cb(null, arg2);
            }
        }
    }

    it('promisify function in fake class (proto instance)', done => {
        const testCase8 = new TestCase8();
        const functionPromise = promisify(testCase8.method1, {
            positionCallback: 1,
            context: testCase8
        });

        functionPromise(4, 5)
            .then(result => {
                try {
                    expect(result).to.equal(
                        tempString2 + tempString + 4 + tempString2 + 5
                    );
                    done();
                } catch (err) {
                    done(new Error(err));
                }
            })
            .catch(err => {
                done(new Error(err));
            });
    });

    class TestCase9 extends TestCase8 {
        // eslint-disable-next-line class-methods-use-this
        method2() {
            return tempString2 + tempString3;
        }

        method1(arg1, cb, arg2) {
            // TestCase8.prototype.method1.call(this, arg1, cb, arg2)
            super.method1(arg1, cb, arg2);
        }
    }

    it('promisify function in extend class', done => {
        const testCase9 = new TestCase9();
        const functionPromise = promisify(testCase9.method1, {
            positionCallback: 1,
            context: testCase9
        });

        functionPromise(4, 5)
            .then(result => {
                try {
                    expect(result).to.equal(
                        tempString2 + tempString3 + 4 + tempString2 + 5
                    );
                    done();
                } catch (err) {
                    done(new Error(err));
                }
            })
            .catch(err => {
                done(new Error(err));
            });
    });

    class TestCase10 extends TestCase8 {
        method10(arg1, cb, arg2) {
            // Parse this scope inside super.method10 -> super.method10 will have instance 10 scope
            return super.method10(arg1, cb, arg2, TestCase10);
        }

        method2() {
            return 2 + this.method3();
        }

        static method3() {
            // this here is prototype, not instance
            return TestCase9.prototype.method3.call(this);
        }
    }

    // eslint-disable-next-line no-undef
    it('promisify function in extend class with super call and force class', done => {
        const testCase10 = new TestCase10();
        const functionPromise = promisify(testCase10.method10, {
            positionCallback: 1,
            type: 0,
            context: testCase10
        });

        functionPromise(5, 10)
            .then(result => {
                try {
                    expect(result).to.equal(2 + tempString2 + tempString2 + 5);
                    done();
                } catch (err) {
                    done(new Error(err));
                }
            })
            .catch(err => {
                done(new Error(err));
            });
    });
});
