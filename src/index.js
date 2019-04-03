import crypto from 'crypto-js'
import randomNumber from 'random-number-csprng'
import { BaseConnector } from '@discipl/core-baseconnector'

class IotaConnector extends BaseConnector {
    constructor() {
        super();
        this.iota = null;
        this.Mam = null;
        this.offLoadMode = true;
    }

    getName() {
        return 'iota';
    }

    configure(iota, mam) {
        this.iota = iota;
        this.Mam = mam;
    }

    async getDidOfClaim() { throw new TypeError('getDidOfClaim is not implemented'); }
    async newIdentity() { throw new TypeError('newIdentity is not implemented'); }
    async claim() { throw new TypeError('claim is not implemented'); }
    async verify() { throw new TypeError('verify is not implemented'); }
    async get() { throw new TypeError('get is not implemented'); }
    async observe() { throw new TypeError('observe is not implemented'); }
    async getLatestClaim() { throw new TypeError('getLatestClaim is not implemented'); }
    async getDidOfClaim() { throw new TypeError('getDidOfClaim is not implemented'); }
    async import() { throw new TypeError('import is not implemented'); }

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


    async getDidOfClaim(reference) {
        throw new TypeError('getDidOfClaim is not implemented')
    }

    async getLatestClaim(ssid) {
        throw new TypeError('getLatestClaim is not implemented')
    }

    async newIdentity() {
        throw new TypeError('newIdentity is not implemented')
    }

    /**
     * Claim does a call to the requested NLX backend and saves the result to be retrieved by get
     *
     * @param {string} ssid - Unused for this connector
     * @param {object} data - Specifies the request to be made to NLX
     * @param {string} data.path - Path to be appended to the outway endpoint. This should be of the form /<organisation>/<service>/<endpoint
     * @param {object} data.params - Query parameters to be added to the request
     * @returns {Promise<string>} Identifier to retrieve the result
     */
    async claim(ssid, data) {
        let response = await axios.get(this.outwayEndpoint + data.path, { 'params': data.params })

        let index = crypto.enc.Base64.stringify(crypto.lib.WordArray.random(64))

        this.cache[index] = response.data

        return index
    }

    async get(reference, ssid = null) {
        return this.cache[reference]
    }

    async observe(ssid) {
        throw new TypeError('Subscribe is not implemented')
    }
}

export default IotaConnector
