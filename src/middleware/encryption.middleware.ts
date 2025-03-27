
// src/middleware/encryption.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { KeyService } from 'src/utils/key.service';

@Injectable()
export class EncryptionMiddleware implements NestMiddleware {
    constructor(private readonly keyService: KeyService) {
        this.use = this.use.bind(this);
    }

    
    use(req: Request, res: Response, next: NextFunction) {

        const publicKey = this.keyService.getPublicKey();

        res.setHeader('1s-Public-Key', publicKey);
        next();
    }
}