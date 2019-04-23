import crypto from 'crypto-js'
import randomNumber from 'random-number-csprng'
import { BaseConnector } from '@discipl/core-baseconnector'
import { asciiToTrytes, trytesToAscii } from '@iota/converter'

class IotaConnector extends BaseConnector {
    constructor() {
        super();
        this.iota = null;
        this.Mam = null;
        this.offLoadMode = false;
    }

    getName() {
        return 'iota';
    }

    configure(iota, mam) {
        this.iota = iota;
        this.Mam = mam;
    }

    async newIdentity() {
        const seed = await this.seedGen();
        const state = this.Mam.init(this.iota, seed, 2);


        const pubkey = this.Mam.getRoot(state);

        return { 'pubkey': pubkey, 'privkey': seed, 'mamstate': state };
    }
    async claim(ssid, data) {
        console.log('start methode claim');



        let latest = await this.getLatestClaim(ssid);
        console.log('dit is latest: ', latest);

        var trytes = asciiToTrytes(JSON.stringify(
            { 'data': data, 'pubkey': ssid.pubkey, 'previous': latest }))
        console.log('dit is trytes', trytes);

        var message = this.Mam.create(ssid.mamstate, trytes)

        ssid.mamstate = message.state;
        if (!this.offloadMode)
            console.log('ik ga attache');

        await this.Mam.attach(message.payload, message.address, 3, 9)
        console.log('ik heb geattached, dit is messageadres', message.address);

        return message.address

    }

    async get(reference, ssid) {

        let nwState = this.Mam.init('https://testnet140.tangle.works');

        // publishAll()
        //     .then(async root => {
        //         // Output syncronously once fetch is completed

        //         const result = await this.Mam.fetch(root, mode)
        //         console.log('kom ik hier in then');


        //         result.messages.forEach(message => console.log('Fetched and parsed', JSON.parse(trytesToAscii(message)), '\n'))
        //     })

        console.log('zit nu voor fetch dit is reference: ', reference);

        var resp = await this.Mam.fetchSingle(reference, 'public', null);
        console.log('dit is precies na resp', resp);

        if (resp.payload) {

            let data = JSON.parse(trytesToAscii(resp.payload))
            console.log('zit ik in resp payload');

            return { 'data': data.data, 'previous': data.previous, 'next': resp.nextRoot }
        }
        return null
    }

    async getLatestClaim(ssid) {
        console.log('nu in latest claim methode');

        if (!Object.keys(ssid).includes('mamstate')) {
            console.log('doe ik de if in getlatestclaim??');
            ssid.mamstate = this.Mam.init(this.iota, ssid.privkey, 2);
        }
        let latest = null
        let current = ssid.pubkey
        let start = 1
        while (current != null) {
            console.log('curenntttttt = ssid.pubkey: ', current);

            let res = await this.get(current, ssid)
            console.log('dit is res', res);

            if (res == null) {
                return latest
            }
            ssid.mamstate.channel.next_root = res.next
            ssid.mamstate.channel.start = start
            start++
            latest = current
            current = res.next
        }
        throw Error('Unexpected exception at verify()')
    }

    async verify(ssid, data) {
        let current = ssid.pubkey
        let start = 1
        while (current != null) {
            let res = await this.get(current, ssid)
            if (res == null) {
                return null
            }
            if (JSON.stringify(data) == JSON.stringify(res.data)) {
                return current
            }
            current = res.next
        }
        return current
    }

    async getDidOfClaim() { throw new TypeError('getDidOfClaim is not implemented'); }
    async import() { throw new TypeError('import is not implemented'); }
    async observe() { throw new TypeError('observe is not implemented'); }


    //-----------------------------------------------

    // Note : taken from: https://github.com/Haarlem/digitale-waardepapieren/blob/develop/ClaimServer/helpers/seedGen.js
    async seedGen() {
        var length = 81
        var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ9"
        var result = []

        for (var i = 0; i < length; i++) {
            var num = await randomNumber(0, (charset.length * Math.floor(255 / charset.length)) - 1)
            result.push(charset[num % charset.length])
        }

        return new Promise(function (resolve, reject) {
            resolve(result.join(""))
        })
    }
}

export default IotaConnector
