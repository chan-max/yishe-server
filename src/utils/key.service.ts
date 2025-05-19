
import { Injectable } from '@nestjs/common';
const JSEncrypt = require('node-jsencrypt');
import CryptoJS from 'crypto-js'

@Injectable()
export class KeyService {
    private encryptor: any;
    private decryptor: any;
    private publicKey: any;
    private privateKey: any;

    constructor() {
        this.generateKeyPair();
    }


    symmetricDecrypt(encryptedMessage, secretKey) {
        return CryptoJS.AES.decrypt(encryptedMessage, secretKey).toString(CryptoJS.enc.Utf8);
    }

    symmetricEncrypt(encryptedMessage, secretKey) {
        return CryptoJS.AES.encrypt(encryptedMessage, secretKey).toString();
    }


    format(key) {
        return key.replace(/-----BEGIN PUBLIC KEY-----/g, '')
            .replace(/-----END PUBLIC KEY-----/g, '')
            .replace(/\n/g, '')
            .trim();
    }

    private generateKeyPair() {
        this.encryptor = new JSEncrypt();
        this.decryptor = new JSEncrypt();

        // 生成密钥对
        const keySize = 2048; // 密钥长度
        const keys = this.encryptor.getKey(keySize as any);
        this.publicKey = this.format(keys.getPublicKey());
        this.privateKey = this.format(keys.getPrivateKey());
    }

    getPublicKey(): any {
        return this.publicKey;
    }

    getPrivateKey(): any {
        return this.privateKey;
    }

    encrypt(data: string): any {
        this.encryptor.setPublicKey(this.publicKey);
        return this.encryptor.encrypt(data);
    }

    decrypt(data: string): any {
        this.decryptor.setPrivateKey(this.privateKey);
        return this.decryptor.decrypt(data);
    }
}