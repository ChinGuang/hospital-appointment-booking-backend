import { AuthJwtService } from '../../services/auth-jwt/auth-jwt.service';
import { AuthUtils } from '../../utils/auth';

export abstract class BaseAuthGuard {
  constructor(protected readonly authJwtService: AuthJwtService) {}

  protected extractUserFromToken(
    request: unknown,
  ): (object & Record<'userId', unknown> & Record<'exp', unknown>) | null {
    const token = AuthUtils.getAuthTokenFromRequest(request);
    if (token) {
      try {
        const decoded = this.authJwtService.verify(token);
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
            return null;
          }
          return decoded;
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        return null;
      }
    }
    return null;
  }
}
