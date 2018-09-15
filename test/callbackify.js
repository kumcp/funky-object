let expect = require('chai').expect;

const { callbackify } = require("../index")
describe("Callbackify function test cases:", () => {
    const tempString = "result1"
    const tempString2 = "result2"
    const tempString3 = "result3"

    let functionPromise = (arg1) => {
        return Promise.resolve(tempString + arg1)
    }

    let functionFullPromise = (arg1, arg2) => {
        return new Promise((resolve, reject) => {
            let sum = arg1 + arg2
            let substract = arg1 - arg2
            if (sum > 10) {
                resolve(sum)
            }

            reject(substract)
        })
    }

    it('callbackify default', (done) => {


        let functionCallback = callbackify(functionPromise)

        functionCallback(tempString2, (result) => {
            try {
                expect(result).to.equal(tempString + tempString2)
                done()
            } catch (err) {
                done(err)
            }
        })
    })

    it('callbackify full case resolve', (done) => {
        let functionCallback = callbackify(functionFullPromise)

        functionCallback(10, 15, (result) => {
            try {
                expect(result).to.equal(10 + 15)
                done()
            } catch (err) {
                done(err)
            }
        })
    })

    it('callbackify full case reject', (done) => {
        let functionCallback = callbackify(functionFullPromise)

        functionCallback(1, 2, (result, error) => {
            try {
                expect(error).to.equal(1 - 2)
                done()
            } catch (err) {
                done(err)
            }
        })
    })
})