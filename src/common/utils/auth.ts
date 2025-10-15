function getAuthTokenFromRequest(request: unknown): string | null {
  if (
    request &&
    typeof request === 'object' &&
    'headers' in request &&
    typeof request.headers === 'object'
  ) {
    const authHeader: unknown = request.headers?.['authorization'];
    if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }
  }
  return null;
}

export const AuthUtils = {
  getAuthTokenFromRequest,
};
