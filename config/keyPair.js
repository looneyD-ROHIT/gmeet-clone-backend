import path from 'path';
import { URL } from 'url';
import fs from 'fs';

const currentFilePath = import.meta.url;
const currentDirPath = new URL('.', currentFilePath).pathname;
export const publicKey = fs.readFileSync(path.join(currentDirPath, 'keys', 'public-key.pem'), 'utf-8');
export const privateKey = fs.readFileSync(path.join(currentDirPath, 'keys', 'private-key.pem'), 'utf-8');