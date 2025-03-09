import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HeaderMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        res.setHeader('1s-copyright', '1s.design');
        next();
    }
}