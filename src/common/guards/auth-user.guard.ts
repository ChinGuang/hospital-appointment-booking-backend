import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthJwtService } from '../services/auth-jwt/auth-jwt.service';

@Injectable()
export class AuthUserGuard implements CanActivate {
  constructor(private readonly authJwtService: AuthJwtService) {}
  canActivate(context: ExecutionContext): boolean {
    const request: unknown = context.switchToHttp().getRequest();
    if (
      request &&
      typeof request === 'object' &&
      'headers' in request &&
      typeof request.headers === 'object'
    ) {
      const authHeader: unknown = request.headers?.['authorization'];
      if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        try {
          const decoded = this.authJwtService.verify(token);
          console.log('Decoded token:', decoded);
          if (
            decoded &&
            typeof decoded === 'object' &&
            'userId' in decoded &&
            'exp' in decoded &&
            typeof decoded.exp === 'number'
          ) {
            console.log(Date.now() / 1000, decoded.exp);
            // Check token expiration if 'exp' field exists
            if (decoded.exp < Date.now() / 1000) {
              console.log('Token is expired');
              return false;
            }
            request['user'] = decoded;
            return true;
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          return false;
        }
      }
    }
    return false;
  }
}
