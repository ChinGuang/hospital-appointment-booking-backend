import { UnauthorizedException } from '@nestjs/common';

function unauthorizedTokenHandle(): never {
  throw new UnauthorizedException('Invalid or expired token');
}

export const ErrorUtils = {
  unauthorizedTokenHandle,
};
