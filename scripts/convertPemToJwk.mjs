import pkg from 'node-jose'
const { JWK } = pkg
import fs from 'fs'
import { json } from 'stream/consumers'

const privateKey = fs.readFileSync('certs/privateKey.pem', 'utf8')

async function convertToJWK() {
   const keystore = JWK.createKeyStore()
   const key = await keystore.add(privateKey, 'pem')

   console.log(JSON.stringify(key))
}

convertToJWK().catch(console.error)
