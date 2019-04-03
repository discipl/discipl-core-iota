import { expect } from 'chai';
import IotaConnector from '../src/index';
import * as Mam from '@iota/mam';
import { composeAPI } from '@iota/core';

// console.log(new IotaConnector());
// console.log(iotaObj);
// console.log(iotaObj.getNodeInfo((error, success) => {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log(success);
//     }
// }));

describe('disciple-iota-connector', function () {
    // it('should return the name of the given connector', function () {
    //     assert.equal([1, 2, 3].indexOf(4), -1);
    // });
    let iotaConnector;
    let iotaObj;
    beforeEach(function () {
        iotaConnector = new IotaConnector();
        iotaObj = new composeAPI({ provider: 'https://node02.iotatoken.nl:443' });
        iotaConnector.configure(iotaObj, Mam)
    });
    it('should return the name of the connector', async () => {
        expect(iotaConnector.getName()).to.equal('iota');
    });

    it('should generate and return a seed length 81', async () => {
        let seed = await iotaConnector.seedGen();
        expect(seed.length).to.be.equal(81);
    });
});






/* eslint-env mocha */
/* eslint-disable no-unused-expressions */


// describe('disciple-nlx-connector', () => {
//     it('should present a name', async () => {
//         let nlxConnector = new NLXConnector()
//         expect(nlxConnector.getName()).to.equal('nlx')
//     })

//     it('should make the correct call', async () => {
//         let nlxConnector = new NLXConnector()
//         nlxConnector.configure('http://localhost:1337')
//         let getStub = sinon.stub(axios, 'get').returns({ 'data': { 'value': { 'woonplaats': 'Sesamstraat' } } })
//         let requestSpecification = { 'path': '/haarlem/Basisregistratiepersonen/RaadpleegIngeschrevenPersoonNAW', 'params': { 'burgerservicenummer': 1337 } }

//         let identifier = await nlxConnector.claim(null, requestSpecification)

//         expect(getStub.callCount).to.equal(1)
//         expect(getStub.args[0]).to.deep.equal(['http://localhost:1337/haarlem/Basisregistratiepersonen/RaadpleegIngeschrevenPersoonNAW', { 'params': { 'burgerservicenummer': 1337 } }])

//         let result = await nlxConnector.get(identifier)
//         expect(result.value.woonplaats).to.equal('Sesamstraat')
//     })
// })
