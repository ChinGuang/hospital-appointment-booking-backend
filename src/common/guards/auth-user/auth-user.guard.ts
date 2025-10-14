import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthJwtService } from '../../services/auth-jwt/auth-jwt.service';

@Injectable()
export class AuthUserGuard implements CanActivate {
  constructor(private readonly authJwtService: AuthJwtService) {}

  private unauthorizedHandle(): never {
    throw new UnauthorizedException('Invalid Token');
  }

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
            const currentTime = Math.floor(Date.now() / 1000);
            // Check token expiration if 'exp' field exists
            if (decoded.exp < currentTime) {
              console.log('Token is expired');
              this.unauthorizedHandle();
            }
            request['user'] = decoded;
            return true;
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          this.unauthorizedHandle();
        }
      }
    }
    this.unauthorizedHandle();
  }
}
