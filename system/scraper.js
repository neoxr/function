const axios = require('axios')
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const FormData = require('form-data')
const { fromBuffer } = require('file-type')
global.creator = `@neoxrs – Wildan Izzudin`

module.exports = class Scraper {
   /* Chat AI
    * @param {String} bid
    * @param {String} key
    * @param {String} text
    */
   chatAI = (bid, key, text) => {
      return new Promise(async (resolve) => {
         try {
            let json = await (await axios.get('http://api.brainshop.ai/get?bid=' + bid + '&key=' + key + '&uid=neoxr&msg=' + encodeURI(text))).data
            if (typeof json.cnt == 'undefined') return resolve({
               creator: global.creator,
               status: false
            })
            resolve({
               cretor: global.creator,
               status: true,
               msg: json.cnt
            })
         } catch (e) {
            console.log(e)
            return resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }

   /* Simsimi Chat
    * @param {String} text
    */
   simsimi = (text, lang = 'id') => {
      return new Promise(async (resolve) => {
         try {
            let json = await (await axios.post('https://simsimi.vn/web/simtalk', `text=${encodeURI(text)}&lc=${lang}`, {
               headers: {
                  'Accept': '*/*',
                  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                  'Referer': 'https://simsimi.net/',
                  'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36'
               }
            })).data
            if (json.success.match(new RegExp('Aku tidak mengerti', 'g'))) return resolve({
               creator: global.creator,
               status: false
            })
            resolve({
               cretor: global.creator,
               status: true,
               msg: json.success
            })
         } catch (e) {
            console.log(e)
            return resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }

   /* Simsimi Chat V2
    * @param {String} text
    */
   simsimiV2 = (text) => {
      return new Promise(async (resolve) => {
         try { // https://simsimi.net/ & https://simsimi.info
            let json = await (await axios.get('https://api.simsimi.net/v2/?text=' + encodeURI(text) + '&lc=id')).data
            if (json.success.match(new RegExp('Aku tidak mengerti', 'g'))) return resolve({
               creator: global.creator,
               status: false
            })
            resolve({
               cretor: global.creator,
               status: true,
               msg: json.success
            })
         } catch (e) {
            console.log(e)
            return resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }

   /* URL Shortener
    * @param {String} url
    */
   shorten = (url) => {
      return new Promise(async (resolve) => {
         try {
            let params = new URLSearchParams()
            params.append('url', url)
            let json = await (await fetch('https://s.nxr.my.id/api', {
               method: 'POST',
               body: params
            })).json()
            if (json.error) return resolve({
               creator: global.creator,
               status: false
            })
            resolve({
               creator: global.creator,
               status: true,
               data: {
                  url: 'https://s.nxr.my.id/r/' + json.data.code
               }
            })
         } catch (e) {
            console.log(e)
            resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }

   /* Image Uploader (telegra.ph)
    * @param {Buffer} buffer
    */
   uploadImage = async (str) => {
      return new Promise(async resolve => {
         try {
            const image = Buffer.isBuffer(str) ? str : str.startsWith('http') ? await (await axios.get(str, {
               responseType: 'arraybuffer'
            })).data : str
            const { ext } = await fromBuffer(image)
            let form = new FormData
            form.append('file', Buffer.from(image), 'image.' + ext)
            const json = await (await axios.post('https://telegra.ph/upload', form, {
               headers: {
                  "Accept": "*/*",
                  "User-Agent": "Mozilla/5.0 (Linux; Android 6.0.1; SM-J500G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Mobile Safari/537.36",
                  "Origin": "https://telegra.ph",
                  "Referer": "https://telegra.ph",
                  "Referrer-Policy": "strict-origin-when-cross-origin",
                  "sec-ch-ua": '"Chromium";v="107", "Not=A?Brand";v="24"',
                  "sec-ch-ua-platform": "Android",
                  "sec-fetch-dest": "empty",
                  "sec-fetch-mode": "cors",
                  "sec-fetch-site": "same-origin",
                  "x-requested-with": "XMLHttpRequest",
                  ...form.getHeaders()
               }
            })).data
            if (!json || json.length < 1) return resolve({
               creator: global.creator,
               status: false,
               msg: 'Failed to upload!'
            })
            resolve({
               creator: global.creator,
               status: true,
               data: {
                  url: 'https://telegra.ph' + json[0].src
               }
            })
         } catch (e) {
            console.log(e)
            resolve({
               creator: global.creator,
               status: false,
               msg: e.message
            })
         }
      })
   }

   /* Image Uploader V2 (srv.neoxr.tk) [Temp]
    * @param {Buffer} buffer
    */
   uploadImageV2 = (buffer) => {
      return new Promise(async (resolve, reject) => {
         try {
            const {
               ext
            } = await fromBuffer(buffer)
            let form = new FormData
            form.append('someFiles', buffer, 'tmp.' + ext)
            let json = await (await fetch(`https://srv.neoxr.tk/api/upload`, {
               method: 'POST',
               body: form
            })).json()
            resolve(json)
         } catch (e) {
            console.log(e)
            return resolve({
               creator: global.creator,
               status: false,
               msg: e.message
            })
         }
      })
   }

   /* File Uploader (srv.neoxr.tk) [Permanent]
    * @param {Buffer} buffer
    */
   uploadFile = (buffer) => {
      return new Promise(async (resolve, reject) => {
         try {
            const {
               ext
            } = await fromBuffer(buffer)
            let form = new FormData
            form.append('someFiles', buffer, 'file.' + ext)
            let json = await (await fetch(`https://srv.neoxr.tk/v2/upload`, {
               method: 'POST',
               body: form
            })).json()
            resolve(json)
         } catch (e) {
            console.log(e)
            return resolve({
               creator: global.creator,
               status: false,
               msg: e.message
            })
         }
      })
   }

   /* Temp File Upload (file.io)
    * @param {Buffer} buffer
    * @param {String} name
    */
   uploadFileV2 = (buffer, name) => {
      return new Promise(async (resolve) => {
         try {
            if (!Buffer.isBuffer(buffer)) return resolve({
               status: false
            })
            let {
               ext
            } = await fromBuffer(buffer) || {}
            let extention = (typeof ext == 'undefined') ? 'txt' : ext
            let form = new FormData
            form.append('file', buffer, name + '.' + extention)
            const json = await (await fetch('https://file.io/', {
               method: 'POST',
               headers: {
                  Accept: '*/*',
                  'Accept-Language': 'en-US,enq=0.9',
                  'User-Agent': 'GoogleBot'
               },
               body: form
            })).json()
            if (!json.success) return resolve({
               creator: global.creator,
               status: false
            })
            delete json.success
            delete json.status
            resolve({
               creator: global.creator,
               status: true,
               data: json
            })
         } catch (e) {
            resolve({
               creator: global.creator,
               status: false
            })
         }
      })
   }
}