const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

// const readStream = fs.createReadStream('./file.txt')
// const gzipStream = zlib.createGzip()
// const writeStream = fs.createWriteStream('./newFile.txt')
const AppendInitVect = require('./appendInitVector')

function getCipherKey(password){
    return crypto.createHash('sha256').update(password).digest()
}

// readStream.on('data', (chunk) => {
//     // console.log(chunk.toString('utf8'))
//     writeStream.write(chunk)
// })

function encrypt({file, password}){
    // Generate a secure, pseudo random initialization vector.
    const initVect = crypto.randomBytes(16)

    // generate a cipher key from password
    const CIPHER_KEY = getCipherKey(password)
    const readStream = fs.createReadStream(file)
    const gzipStream = zlib.createGzip()

    const cipher = crypto.createCipheriv('aes256', CIPHER_KEY, initVect)
    const appendInitVector = new AppendInitVect(initVect)

    // create a write stream with different file extension

    const writeStream = fs.createWriteStream(path.join(file+".enc"))

    readStream.pipe(gzipStream).pipe(cipher).pipe(appendInitVector).pipe(writeStream)
}

encrypt({file: './file.txt', password: 'dogzrgr8'})