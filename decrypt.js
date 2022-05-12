const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

function getCipherKey(password){
    return crypto.createHash('sha256').update(password).digest()
}

function decrypt({file, password}){
    const readInitVect = fs.createReadStream(file, {end: 15})
    let initVect
    readInitVect.on('data', (chunk) => {
        initVect = chunk
    })

    readInitVect.on('close', () => {
        const cipherKey = getCipherKey(password)
        const readStream = fs.createReadStream(file, {start: 16})
        const decipher = crypto.createDecipheriv('aes256', cipherKey, initVect)

        const unzip = zlib.createGunzip()
        const writeStream = fs.createWriteStream(file+".unenc")

        readStream.pipe(decipher).pipe(unzip).pipe(writeStream)
    })

}

decrypt({file: './file.txt.enc', password: "dogzrgr8"})
