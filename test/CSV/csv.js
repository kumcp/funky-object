/* eslint-disable no-undef */
const { expect } = require('chai');
const { getLineValueRequire, setLineListValue } = require('../../core/csv');

describe('Transform line list to csv', () => {
    describe('Line in the middle: ', () => {
        it('Normal line list turn to object list in the middle', done => {
            const lineList = [
                'id,name,age',
                '1,Helen,17',
                '2,Kum,25',
                '3,クム　高, 20'
            ];

            const expectObjectList = [
                { id: '1', name: 'Helen', age: '17' },
                { id: '2', name: 'Kum', age: '25' },
                { id: '3', name: 'クム　高', age: '20' }
            ];

            const resultObjectList = setLineListValue(lineList);

            expect(resultObjectList.length).to.equal(expectObjectList.length);

            const checkResult = resultObjectList
                .map((result, index) => {
                    expect(result.id).to.equal(expectObjectList[index].id);
                    expect(result.name).to.equal(expectObjectList[index].name);
                    expect(result.age).to.equal(expectObjectList[index].age);
                    return true;
                })
                .filter(passObject => passObject).length;

            expect(checkResult).to.equal(expectObjectList.length);
            done();
        });

        it('Line list with blank field turn to object list in the middle', done => {
            const lineList = ['id,name,age', '2,,25', '3,クム　高,'];

            const expectObjectList = [
                { id: '2', name: '', age: '25' },
                { id: '3', name: 'クム　高', age: '' }
            ];

            const resultObjectList = setLineListValue(lineList);

            expect(resultObjectList.length).to.equal(expectObjectList.length);

            expect(resultObjectList[0].id).to.equal(expectObjectList[0].id);
            expect(resultObjectList[0].name).to.equal(expectObjectList[0].name);
            expect(resultObjectList[0].age).to.equal(expectObjectList[0].age);

            done();
        });

        it('Line with comma wrapped in double quotes in the middle', done => {
            const lineList = [
                'id,name,age',
                '1,"absolutely ,Helen",17',
                '2,"Hi there" ,here",25',
                '3,-"-"-,'
            ];

            const expectObjectList = [
                { id: '1', name: 'absolutely ,Helen', age: '17' },
                { id: '2', name: 'Hi there" ,here', age: '25' },
                { id: '3', name: '-"-"-', age: '' }
            ];
            const resultObjectList = setLineListValue(lineList);
            const result = resultObjectList[0];

            expect(resultObjectList.length).to.equal(expectObjectList.length);

            expect(result.id).to.equal(expectObjectList[0].id);
            expect(result.name).to.equal(expectObjectList[0].name);
            expect(result.age).to.equal(expectObjectList[0].age);

            done();
        });

        it('Line with quotes not as wrapper in the middle', done => {
            const lineList = [
                'id,name,age',
                '1,"absolutely ,Helen",17',
                '2,"Hi there" ,here",25',
                '3,-"-"-,'
            ];

            const expectObjectList = [
                { id: '1', name: 'absolutely ,Helen', age: '17' },
                { id: '2', name: 'Hi there" ,here', age: '25' },
                { id: '3', name: '-"-"-', age: '' }
            ];
            const resultObjectList = setLineListValue(lineList);
            const result = resultObjectList[2];

            expect(resultObjectList.length).to.equal(expectObjectList.length);

            expect(result.id).to.equal(expectObjectList[2].id);
            expect(result.name).to.equal(expectObjectList[2].name);
            expect(result.age).to.equal(expectObjectList[2].age);

            done();
        });

        it('Line with quotes and comma wrapped in quote in the middle', done => {
            const lineList = [
                'id,name,age',
                '1,"absolutely ,Helen",17',
                '2,"Hi "there" ,here",25',
                '3,-"-"-,'
            ];

            const expectObjectList = [
                { id: '1', name: 'absolutely ,Helen', age: '17' },
                { id: '2', name: 'Hi "there" ,here', age: '25' },
                { id: '3', name: '-"-"-', age: '' }
            ];
            const resultObjectList = setLineListValue(lineList);
            const result = resultObjectList[1];

            expect(resultObjectList.length).to.equal(expectObjectList.length);

            expect(result.id).to.equal(expectObjectList[1].id);
            expect(result.name).to.equal(expectObjectList[1].name);
            expect(result.age).to.equal(expectObjectList[1].age);

            done();
        });

        it('Line with blank field wrapped in quote in the middle', done => {
            const lineList = [
                'id,name,age',
                '1,"absolutely ,Helen",17',
                '2,"Hi ,,here",25',
                '3,-"-"-,'
            ];

            const expectObjectList = [
                { id: '1', name: 'absolutely ,Helen', age: '17' },
                { id: '2', name: 'Hi ,,here', age: '25' },
                { id: '3', name: '-"-"-', age: '' }
            ];
            const resultObjectList = setLineListValue(lineList);
            const result = resultObjectList[1];

            expect(resultObjectList.length).to.equal(expectObjectList.length);

            expect(result.id).to.equal(expectObjectList[1].id);
            expect(result.name).to.equal(expectObjectList[1].name);
            expect(result.age).to.equal(expectObjectList[1].age);

            done();
        });

        it('Line with multiple quotes in the middle', done => {
            const lineList = [
                'id,name,age',
                '1,"absolutely ,Helen",17',
                '2,""""here",25'
            ];

            const expectObjectList = [
                { id: '1', name: 'absolutely ,Helen', age: '17' },
                { id: '2', name: '"""here', age: '25' }
            ];
            const resultObjectList = setLineListValue(lineList);
            const result = resultObjectList[1];

            expect(resultObjectList.length).to.equal(expectObjectList.length);

            expect(result.id).to.equal(expectObjectList[1].id);
            expect(result.name).to.equal(expectObjectList[1].name);
            expect(result.age).to.equal(expectObjectList[1].age);

            done();
        });

        it('Line with end quote in the middle', done => {
            const lineList = [
                'id,name,age',
                '1,"absolutely ,Helen",17',
                '2,here",25'
            ];

            const expectObjectList = [
                { id: '1', name: 'absolutely ,Helen', age: '17' },
                { id: '2', name: 'here"', age: '25' }
            ];
            const resultObjectList = setLineListValue(lineList);
            const result = resultObjectList[1];

            expect(resultObjectList.length).to.equal(expectObjectList.length);

            expect(result.id).to.equal(expectObjectList[1].id);
            expect(result.name).to.equal(expectObjectList[1].name);
            expect(result.age).to.equal(expectObjectList[1].age);

            done();
        });

        it('Line with quote of blank in the middle', done => {
            const lineList = ['id,name,age', '1,"",17', '2,here",25'];

            const expectObjectList = [
                { id: '1', name: '', age: '17' },
                { id: '2', name: 'here"', age: '25' }
            ];
            const resultObjectList = setLineListValue(lineList);
            const result = resultObjectList[1];

            expect(resultObjectList.length).to.equal(expectObjectList.length);

            expect(result.id).to.equal(expectObjectList[1].id);
            expect(result.name).to.equal(expectObjectList[1].name);
            expect(result.age).to.equal(expectObjectList[1].age);

            done();
        });
    });

    describe('Line with special case at first: ', () => {
        it('Line list with blank field turn to object list at first', done => {
            const lineList = ['name,age', ',25', 'クム　高,'];

            const expectObjectList = [
                { name: '', age: '25' },
                { name: 'クム　高', age: '' }
            ];

            const resultObjectList = setLineListValue(lineList);

            expect(resultObjectList.length).to.equal(expectObjectList.length);

            expect(resultObjectList[0].name).to.equal(expectObjectList[0].name);
            expect(resultObjectList[0].age).to.equal(expectObjectList[0].age);

            done();
        });

        it('Line with comma wrapped in double quotes at first', done => {
            const lineList = [
                'name,age',
                '"absolutely ,Helen",17',
                '"Hi there" ,here",25',
                '-"-"-,'
            ];

            const expectObjectList = [
                { name: 'absolutely ,Helen', age: '17' },
                { name: 'Hi there" ,here', age: '25' },
                { name: '-"-"-', age: '' }
            ];
            const resultObjectList = setLineListValue(lineList);
            const result = resultObjectList[0];

            expect(resultObjectList.length).to.equal(expectObjectList.length);

            expect(result.name).to.equal(expectObjectList[0].name);
            expect(result.age).to.equal(expectObjectList[0].age);

            done();
        });

        it('Line with quotes not as wrapper at first', done => {
            const lineList = [
                'name,age',
                '"absolutely ,Helen",17',
                '"Hi there" ,here",25',
                '-"-"-,'
            ];

            const expectObjectList = [
                { name: 'absolutely ,Helen', age: '17' },
                { name: 'Hi there" ,here', age: '25' },
                { name: '-"-"-', age: '' }
            ];
            const resultObjectList = setLineListValue(lineList);
            const result = resultObjectList[2];

            expect(resultObjectList.length).to.equal(expectObjectList.length);

            expect(result.name).to.equal(expectObjectList[2].name);
            expect(result.age).to.equal(expectObjectList[2].age);

            done();
        });

        it('Line with quotes and comma wrapped in quote at first', done => {
            const lineList = [
                'name,age',
                '"absolutely ,Helen",17',
                '"Hi "there" ,here",25',
                '-"-"-,'
            ];

            const expectObjectList = [
                { name: 'absolutely ,Helen', age: '17' },
                { name: 'Hi "there" ,here', age: '25' },
                { name: '-"-"-', age: '' }
            ];
            const resultObjectList = setLineListValue(lineList);
            const result = resultObjectList[1];

            expect(resultObjectList.length).to.equal(expectObjectList.length);

            expect(result.name).to.equal(expectObjectList[1].name);
            expect(result.age).to.equal(expectObjectList[1].age);

            done();
        });
    });

    describe('Line with special case at last: ', () => {
        it('Line list with blank field turn to object list at last', done => {
            const lineList = ['id,name', '2,', '3,クム　高'];

            const expectObjectList = [
                { id: '2', name: '', age: '25' },
                { id: '3', name: 'クム　高', age: '' }
            ];

            const resultObjectList = setLineListValue(lineList);

            expect(resultObjectList.length).to.equal(expectObjectList.length);

            expect(resultObjectList[0].id).to.equal(expectObjectList[0].id);
            expect(resultObjectList[0].name).to.equal(expectObjectList[0].name);

            done();
        });

        it('Line with comma wrapped in double quotes at last', done => {
            const lineList = [
                'id,name',
                '1,"absolutely ,Helen"',
                '2,"Hi there" ,here"',
                '3,-"-"-,'
            ];

            const expectObjectList = [
                { id: '1', name: 'absolutely ,Helen' },
                { id: '2', name: 'Hi there" ,here' },
                { id: '3', name: '-"-"-' }
            ];
            const resultObjectList = setLineListValue(lineList);
            const result = resultObjectList[0];

            expect(resultObjectList.length).to.equal(expectObjectList.length);

            expect(result.id).to.equal(expectObjectList[0].id);
            expect(result.name).to.equal(expectObjectList[0].name);

            done();
        });

        it('Line with quotes not as wrapper at last', done => {
            const lineList = [
                'id,name',
                '1,"absolutely ,Helen"',
                '2,"Hi there" ,here"',
                '3,-"-"-'
            ];

            const expectObjectList = [
                { id: '1', name: 'absolutely ,Helen' },
                { id: '2', name: 'Hi there" ,here' },
                { id: '3', name: '-"-"-' }
            ];
            const resultObjectList = setLineListValue(lineList);
            const result = resultObjectList[2];

            expect(resultObjectList.length).to.equal(expectObjectList.length);

            expect(result.id).to.equal(expectObjectList[2].id);
            expect(result.name).to.equal(expectObjectList[2].name);

            done();
        });

        it('Line with quotes and comma wrapped in quote at last', done => {
            const lineList = [
                'id,name',
                '1,"absolutely ,Helen"',
                '2,"Hi "there" ,here"',
                '3,-"-"-'
            ];

            const expectObjectList = [
                { id: '1', name: 'absolutely ,Helen' },
                { id: '2', name: 'Hi "there" ,here' },
                { id: '3', name: '-"-"-' }
            ];
            const resultObjectList = setLineListValue(lineList);
            const result = resultObjectList[1];

            expect(resultObjectList.length).to.equal(expectObjectList.length);

            expect(result.id).to.equal(expectObjectList[1].id);
            expect(result.name).to.equal(expectObjectList[1].name);

            done();
        });
    });

    describe('Uncommon case', () => {
        it('Header blank', done => {
            done();
        });

        it('Un balance items', done => {
            done();
        });

        it('Duplicate header', done => {
            done();
        });
    });
});

describe('Read CSV', () => {
    describe('Read csv list', () => {});
});

describe('Write CSV', () => {
    describe('Write csv list', () => {});
});
