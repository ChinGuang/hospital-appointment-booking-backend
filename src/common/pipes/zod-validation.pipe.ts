import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodType } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  async transform(value: unknown) {
    try {
      const parsedValue = await this.schema.parseAsync(value);
      return parsedValue;
    } catch (error: unknown) {
      console.error(error);
      throw new BadRequestException('Validation failed');
    }
  }
}
