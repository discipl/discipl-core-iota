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
    let tmpSsid;
    let tmpReference;
    beforeEach(function () {
        iotaConnector = new IotaConnector();
        iotaObj = new composeAPI({ provider: 'https://testnet140.tangle.works' });

        // iotaObj.getNodeInfo()
        //     .then(info => console.log('Info over de IOTA node', info))
        //     .catch(error => {
        //         console.log(`Request error: ${error.message}`)
        //     });

        iotaConnector.configure(iotaObj, Mam);
    });

    it('should return the name of the connector', async () => {
        expect(iotaConnector.getName()).to.equal('iota');
    });

    it('should generate and return a seed length 81', async () => {
        let seed = await iotaConnector.seedGen();
        expect(seed.length).to.be.equal(81);
    });

    it('should return an object with new identity', async () => {
        tmpSsid = await iotaConnector.newIdentity();
        console.log('dit is tmpssid', tmpSsid);
        expect(tmpSsid).not.to.be.null;
    });

    //get methode
    it('should get something', async function () {
        console.log('log in get tmpssid: ', tmpSsid);

        let iets = await iotaConnector.get('YCFEZMWAW9XQUGDVBXBVJOPLYOIJLBDXZBFOWJZYDEZPQHINGYDPWV9TRVMJYQNIRDJWAUOKWHARPTVON');
        console.log('krijgt get terug', iets);

    });

    //getLatestClaim methode

    it('should do a claim', async function () {
        this.timeout(20000);
        tmpReference = await iotaConnector.claim(tmpSsid, { 'need': '1dingvandenieuwebla' });
        tmpReference = await iotaConnector.claim(tmpSsid, { 'need': '2soortkoekvandekaasboer' });
        tmpReference = await iotaConnector.claim(tmpSsid, { 'need': '3vleesvandesoepbakker' });
        tmpReference = await iotaConnector.claim(tmpSsid, { 'need': '4warmebrooduitconstructie' });
        tmpReference = await iotaConnector.claim(tmpSsid, { 'need': '5tafelsgemaaktinijsland' });
        tmpReference = await iotaConnector.claim(tmpSsid, { 'need': '6dingvandenieuwebla' });
        tmpReference = await iotaConnector.claim(tmpSsid, { 'need': '7soortkoekvandekaasboer' });
        tmpReference = await iotaConnector.claim(tmpSsid, { 'need': '8vleesvandesoepbakker' });
        tmpReference = await iotaConnector.claim(tmpSsid, { 'need': '9warmebrooduitconstructie' });
        tmpReference = await iotaConnector.claim(tmpSsid, { 'need': '10tafelsgemaaktinijsland' });
        let laatste = await iotaConnector.getLatestClaim(tmpSsid);
        console.log('latestclaimtest', laatste);

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
