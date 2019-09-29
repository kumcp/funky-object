/* eslint-disable no-undef */
const { expect } = require('chai');
const { ObjectTransform } = require('../../index');

describe('Test object tranform functions', () => {
    describe('Object with filter function', () => {
        it('Value filter', done => {
            const object = {
                a: 1,
                b: 2,
                c: 3
            };

            const objfiltered = ObjectTransform.objectFilter(
                object,
                (key, val) => val > 2
            );

            expect(objfiltered).to.haveOwnProperty('c');
            expect(objfiltered).to.not.haveOwnProperty('b');
            expect(objfiltered).to.not.haveOwnProperty('a');

            expect(objfiltered).to.not.equal(object);
            done();
        });

        it('No filter', done => {
            try {
                ObjectTransform.objectFilter(
                    { a: 3 }
                );
                done('Should throw error FILTER_IS_NOT_FUNCTION');
            } catch (err) {
                expect(err.message).to.equal('FILTER_IS_NOT_FUNCTION');
                done();
            }
        });

        it('Key filter', done => {
            const object = {
                abcd: 1,
                bbbb: 2,
                cccc: 3
            };

            const objfiltered = ObjectTransform.objectFilter(
                object,
                (key, val) => key.indexOf('c') > -1
            );

            expect(objfiltered).to.haveOwnProperty('cccc');
            expect(objfiltered).not.to.haveOwnProperty('b');
            expect(objfiltered).to.haveOwnProperty('abcd');
            expect(objfiltered).to.not.equal(object);
            done();
        });

        it('Key + Val filter', done => {
            const object = {
                2: 1,
                3: 2,
                4: 3
            };

            const objfiltered = ObjectTransform.objectFilter(
                object,
                (key, val) => parseInt(key, 10) + val > 4
            );

            expect(objfiltered).to.haveOwnProperty('3');
            expect(objfiltered).not.to.haveOwnProperty('2');
            expect(objfiltered).to.haveOwnProperty('4');
            expect(objfiltered).to.not.equal(object);
            done();
        });

        it('Object undefined', done => {
            try {
                ObjectTransform.objectFilter(
                    undefined,
                    (key, val) => parseInt(key, 10) + val > 4
                );
                done('Should throw error object undefined');
            } catch (err) {
                expect(err.message).to.equal('OBJECT_NOT_DEFINED');
                done();
            }
        });

        it('Object is not an instance of object', done => {
            try {
                ObjectTransform.objectFilter(
                    () => {},
                    (key, val) => parseInt(key, 10) + val > 4
                );
                done('Should throw error NOT_AN_OBJECT');
            } catch (err) {
                expect(err.message).to.equal('NOT_AN_OBJECT');
                done();
            }
        });

        it('Filter is not a function', done => {
            try {
                ObjectTransform.objectFilter(
                    {},
                    4
                );
                done('Should throw error FILTER_IS_NOT_FUNCTION');
            } catch (err) {
                expect(err.message).to.equal('FILTER_IS_NOT_FUNCTION');
                done();
            }
        });
    });

    describe('flattenChildrenObjectList :', () => {
        const listA = [
            {
                name: 'Johny',
                age: 10,
                marks: [
                    {
                        subject: 'Math',
                        grade: 'A'
                    },
                    {
                        subject: 'Biology',
                        grade: 'B'
                    }
                ]
            },
            {
                name: 'Timmy',
                age: 12,
                marks: [
                    {
                        subject: 'Math',
                        grade: 'C'
                    },
                    {
                        subject: 'Biology',
                        grade: 'B'
                    },
                    {
                        subject: 'History',
                        grade: 'B'
                    }
                ]
            }
        ];

        it('wrapped 1 function: ', done => {
            const flattenList = ObjectTransform.flattenChildrenObjectList(listA, 'marks');
            if (flattenList.length !== listA.reduce((sum, cur) => sum + cur.marks.length, 0)) {
                throw new Error('Object length is not correct');
            }

            if (flattenList.reduce((sumName, obj) => (obj.name === 'Timmy' ? sumName + 1 : sumName), 0) !== 3) {
                throw new Error('Object number when flatten is not correct');
            }

            done();
        });
    });
});
