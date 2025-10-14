import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthUserGuard } from './auth-user.guard';

describe('AuthUserGuard', () => {
  let guard: AuthUserGuard;
  let mockAuthJwtService: any;

  beforeEach(() => {
    mockAuthJwtService = {
      verify: jest.fn(),
    };
    guard = new AuthUserGuard(mockAuthJwtService);
  });

  const createMockContext = (headers: object = {}) =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers,
        }),
      }),
    }) as unknown as ExecutionContext;

  it('should throw unauthorizedException if no authorization header', () => {
    const context = createMockContext({});
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw unauthorizedException if authorization header is not Bearer', () => {
    const context = createMockContext({ authorization: 'Basic abc' });
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw unauthorizedException if token verification throws error', () => {
    mockAuthJwtService.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });
    const context = createMockContext({ authorization: 'Bearer invalidtoken' });
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw unauthorizedException if decoded token does not have userId or exp', () => {
    mockAuthJwtService.verify.mockReturnValue({});
    const context = createMockContext({ authorization: 'Bearer validtoken' });
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw unauthorizedException if token is expired', () => {
    const expiredExp = Math.floor(Date.now() / 1000) - 10;
    mockAuthJwtService.verify.mockReturnValue({ userId: 1, exp: expiredExp });
    const context = createMockContext({ authorization: 'Bearer validtoken' });
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should return true and attach user if token is valid and not expired', () => {
    const validExp = Math.floor(Date.now() / 1000) + 1000;
    const decoded = { userId: 1, exp: validExp };
    mockAuthJwtService.verify.mockReturnValue(decoded);

    const req: any = { headers: { authorization: 'Bearer validtoken' } };
    const context = {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
    expect(req.user).toEqual(decoded);
  });

  it('should throw unauthorizedException if request is not an object', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => null,
      }),
    } as unknown as ExecutionContext;
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('should throw unauthorizedException if headers is not an object', () => {
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({ headers: null }),
      }),
    } as unknown as ExecutionContext;
    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});
