// import CryptoJS from 'crypto-js'
// import { BaseConnector } from '@discipl/core-baseconnector'
// import randomNumber from 'random-number-csprng'

// class IotaConnectorOld extends BaseConnector {

//   constructor() {
//     super()
//     this.iota = null
//     this.Mam = null
//     this.offloadMode = true
//   }

//   getName() {
//     return 'iota'
//   }

//   configure(iota, mam) {
//     this.Mam = mam
//     this.iota = iota
//   }

//   setOffLoadMode(mode) {
//     this.offloadMode = mode
//   }

//   // Note : taken from: https://github.com/Haarlem/digitale-waardepapieren/blob/develop/ClaimServer/helpers/seedGen.js
//   async seedGen() {
//     var length = 81
//     var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ9"
//     var result = []

//     for (var i = 0; i < length; i++) {
//       var num = await randomNumber(0, (charset.length * Math.floor(255 / charset.length)) - 1)
//       result.push(charset[num % charset.length])
//     }

//     return new Promise(function (resolve, reject) {
//       resolve(result.join(""))
//     })
//   }

//   async getSsidOfClaim(reference) {
//     data = await this.get(reference, null)
//     if (data != null)
//       return { 'pubkey': data.pubkey }
//     return null
//   }

//   async getLatestClaim(ssid) {
//     if (!Object.keys(ssid).includes('mamstate')) {
//       ssid.mamstate = this.Mam.init(this.iota, ssid.privkey, 2);
//     }
//     let latest = null
//     let current = ssid.pubkey
//     let start = 1
//     while (current != null) {
//       let res = await this.get(current, ssid)
//       if (res == null) {
//         return latest
//       }
//       ssid.mamstate.channel.next_root = res.next
//       ssid.mamstate.channel.start = start
//       start++
//       latest = current
//       current = res.next
//     }
//     throw Error('Unexpected exception at verify()')
//   }

//   async newSsid() {
//     const seed = await this.seedGen()
//     const state = this.Mam.init(this.iota, seed, 2)
//     const pubkey = this.Mam.getRoot(state)
//     return { 'pubkey': pubkey, 'privkey': seed, 'mamstate': state }
//   }

//   async claim(ssid, data) {
//     let latest = await this.getLatestClaim(ssid)
//     var trytes = this.iota.utils.toTrytes(JSON.stringify({ 'data': data, 'pubkey': ssid.pubkey, 'previous': latest }))
//     var message = this.Mam.create(ssid.mamstate, trytes)
//     ssid.mamstate = message.state;
//     if (!this.offloadMode)
//       await this.Mam.attach(message.payload, message.address)
//     return message.address
//   }

//   async get(reference, ssid) {
//     var resp = await this.Mam.fetchSingle(reference, 'public', null)
//     if (resp) {
//       let data = JSON.parse(this.iota.utils.fromTrytes(resp.payload))
//       return { 'data': data.data, 'previous': data.previous, 'next': resp.nextRoot }
//     }
//     return null
//   }

//   /**
//    * Verifies existence of a claim with the given data in the channel of the given ssid
//    * instead of going from the end to the beginning of the channel, we go from the beginning to the end, updating the mamstate in the ssid
//    * and make getLatestClaim use this for its implementation instead of the other way around
//    */
//   async verify(ssid, data) {
//     let current = ssid.pubkey
//     let start = 1
//     while (current != null) {
//       let res = await this.get(current, ssid)
//       if (res == null) {
//         return null
//       }
//       if (JSON.stringify(data) == JSON.stringify(res.data)) {
//         return current
//       }
//       current = res.next
//     }
//     return current
//   }

//   async subscribe(ssid) {
//     throw Error('Not yet implemented')
//   }
// }

// export default IotaConnectorOld
