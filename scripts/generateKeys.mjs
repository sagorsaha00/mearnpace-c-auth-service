import crypto, { generateKeyPairSync } from 'crypto'
import fs from 'fs'


const { privateKey, publicKey } = generateKeyPairSync('rsa', {
   modulusLength: 2048,
   publicKeyEncoding: { type: 'spki', format: 'pem' },
   privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
})


console.log('privateKey', privateKey)
console.log('publicKey', publicKey)

fs.writeFileSync('certs/privateKey.pem', privateKey)
fs.writeFileSync('certs/publicKey.pem', publicKey)