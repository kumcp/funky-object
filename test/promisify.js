let expect = require('chai').expect;


const { promisify } = require("../index")

describe("Promisify function test cases:", () => {

    const tempString = "result1"
    const tempString2 = "result2"
    const tempString3 = "result3"

    it('promisify default: ', (done) => {
        let functionWithCallback = (cb) => {
            cb(tempString)
        }

        let functionPromise = promisify(functionWithCallback)

        functionPromise().then((result) => {
            try {
                expect(result).to.equal(tempString)
                done()
            } catch (err) {
                done(err)
            }
        })
    })

    it('promisify function take multiple params callback with position: ', (done) => {
        let functionWithCallback = (arg1, cb, arg2) => {
            cb(arg1, arg2, tempString)
        }

        let functionPromise = promisify(functionWithCallback, { type: 1, positionCallback: 1 })

        functionPromise(tempString2, tempString3).then(([arg1, arg2, arg3]) => {
            try {
                expect(arg1).to.equal(tempString2)
                expect(arg2).to.equal(tempString3)
                expect(arg3).to.equal(tempString)
                done()
            } catch (err) {
                done(err)
            }
        }).catch((err) => {
            console.log(err)
            done(err)
        })
    })

    let functionWithCallback = (arg1, arg2, successCb, errorCb) => {

        let sum = arg1 + arg2
        let subtract = arg1 - arg2

        if (sum > 5) {
            successCb(sum, subtract)
        } else {
            errorCb(arg1, arg2)
        }
    }

    it('promisify function have success/error callback with success', (done) => {

        let functionPromise = promisify(functionWithCallback, { type: 2 })
        functionPromise(5, 3).then(([sum, subtract]) => {
            try {
                expect(sum).to.equal(8)
                expect(subtract).to.equal(2)

                done()
            } catch (err) {
                done(err)
            }
        }).catch((err) => {
            console.log(err)
            done(err)
        })

    })

    it('promisify function have success/error callback with error', (done) => {

        let functionPromise = promisify(functionWithCallback, { type: 2 })
        functionPromise(1, 2).then(([sum, subtract]) => {
            done("fail")

        }).catch(([arg1, arg2]) => {
            try {
                expect(arg1).to.equal(1)
                expect(arg2).to.equal(2)

                done()
            } catch (err) {
                done(err)
            }
        })

    })

    let functionWithCallbackPosition = (arg1, successCb, errorCb, arg2) => {

        let sum = arg1 + arg2
        let subtract = arg1 - arg2

        if (sum > 5) {
            successCb(sum, subtract)
        } else {
            errorCb(arg1, arg2)
        }
    }


    it('promisify function have success/error callback with position success', (done) => {

        let functionPromise = promisify(functionWithCallbackPosition, { positionCallback: 1, type: 2 })
        functionPromise(5, 3).then(([sum, subtract]) => {
            try {
                expect(sum).to.equal(8)
                expect(subtract).to.equal(2)

                done()
            } catch (err) {
                done(err)
            }
        }).catch((err) => {
            console.log(err)
            done(err)
        })
    })

    let functionWithoutCallback = (arg1, arg2) => {

        let sum = arg1 + arg2
        let subtract = arg1 - arg2

        return [sum, subtract]
    }

    it('promisify function do not have callback', (done) => {

        let functionPromise = promisify(functionWithoutCallback)

        functionPromise(6, 4).then(([sum, sub]) => {
            try {
                expect(sum).to.equal(10)
                expect(sub).to.equal(2)
                done()
            } catch (err) {
                done(new Error(err))
            }
        }).catch((err) => {
            done(new Error(err))
        })
    })

    let scope = {
        propertyA: tempString,
        functionWithScope: (arg1, arg2, cb) => {
            this.propertyA = arg1
            this.propertyB = tempString
            cb(arg1 + arg2)
        }
    }

    it('promisify function have simple callback with scope', (done) => {
        let functionPromise = promisify(scope.functionWithScope, { context: scope })

        functionPromise(4, 5).then((result) => {
            try {
                expect(result).to.equal(9)
                expect(this.propertyA).to.equal(4)
                expect(this.propertyB).to.equal(tempString)
                done()
            } catch (err) {
                done(new Error(err))
            }
        }).catch((err) => {
            done(new Error(err))
        })
    })

    class TestCase8 {
        
        method1(arg1, cb, arg2){
            cb(this.method2() + arg1 + this.method3() + arg2)
        }
        method2(){
            return tempString
        }
        method3(){
            return tempString2
        }

    }

    it('promisify function in fake class (proto instance)', (done) => {
        let testCase8 = new TestCase8()
        let functionPromise = promisify(testCase8.method1, { positionCallback:1, context: testCase8 })

        functionPromise(4, 5).then((result) => {
            try {
                expect(result).to.equal(tempString + 4 + tempString2 + 5)
                done()
            } catch (err) {
                done(new Error(err))
            }
        }).catch((err) => {
            done(new Error(err))
        })
    })

    class TestCase9 extends TestCase8 {
        method2(){
            return tempString2 + tempString3
        }
        method1(arg1, cb, arg2){
            TestCase8.prototype.method1.call(this, arg1, cb, arg2)
        }
    }

    it('promisify function in extend class', (done) => {
        let testCase9 = new TestCase9()
        let functionPromise = promisify(testCase9.method1, { positionCallback:1, context: testCase9 })

        functionPromise(4, 5).then((result) => {
            try {
                expect(result).to.equal(tempString2 + tempString3 + 4 + tempString2 + 5)
                done()
            } catch (err) {
                done(new Error(err))
            }
        }).catch((err) => {
            done(new Error(err))
        })
    })


})
