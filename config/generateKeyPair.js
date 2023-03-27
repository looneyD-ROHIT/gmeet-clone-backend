import crypto from 'crypto';
import path from 'path';
import { URL } from 'url';
import fs from 'fs';
const fsPromises = fs.promises;

(async () => {
    // Generate an RSA public-private key pair
    crypto.generateKeyPair('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem'
        }
    }, async (err, publicKey, privateKey) => {
        const currentFilePath = import.meta.url;
        const currentDirPath = new URL('.', currentFilePath).pathname;
        await fsPromises.writeFile(path.join(currentDirPath, 'keys', 'public-key.pem'), publicKey);
        await fsPromises.writeFile(path.join(currentDirPath, 'keys', 'private-key.pem'), privateKey);
    });
})();

