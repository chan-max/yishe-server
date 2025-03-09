

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const authGuard = new (AuthGuard('jwt'))();
        try {
            await authGuard.canActivate(context);
        } catch (err) {
            // 如果认证失败，不抛出异常，而是继续执行
            return true;
        }
        return true;
    }
}
