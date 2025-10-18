/**
 * Type-Safe Validation System
 * Provides runtime validation with compile-time type inference
 */

import { AppError, ErrorCategory } from '../errors/AppError';

/**
 * Validation result
 */
export interface ValidationResult<T> {
  success: boolean;
  data: T | null;
  errors: ValidationError[];
}

/**
 * Single validation error
 */
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * Base validator class
 */
export abstract class Validator<T> {
  abstract validate(value: unknown): ValidationResult<T>;

  /**
   * Validate or throw error
   */
  validateOrThrow(value: unknown): T {
    const result = this.validate(value);
    if (!result.success) {
      const messages = result.errors.map(e => `${e.field}: ${e.message}`).join('; ');
      throw new AppError(`Validation failed: ${messages}`, {
        category: ErrorCategory.VALIDATION,
      });
    }
    return result.data!;
  }
}

/**
 * String validator
 */
export class StringValidator extends Validator<string> {
  private minLength?: number;
  private maxLength?: number;
  private pattern?: RegExp;
  private transform?: (value: string) => string;
  private customValidator?: (value: string) => ValidationError | null;

  min(length: number): this {
    this.minLength = length;
    return this;
  }

  max(length: number): this {
    this.maxLength = length;
    return this;
  }

  matches(pattern: RegExp): this {
    this.pattern = pattern;
    return this;
  }

  email(): this {
    this.pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return this;
  }

  url(): this {
    this.pattern = /^(https?:\/\/).+/;
    return this;
  }

  trim(): this {
    this.transform = s => s.trim();
    return this;
  }

  lowercase(): this {
    this.transform = s => s.toLowerCase();
    return this;
  }

  uppercase(): this {
    this.transform = s => s.toUpperCase();
    return this;
  }

  custom(validator: (value: string) => ValidationError | null): this {
    this.customValidator = validator;
    return this;
  }

  validate(value: unknown): ValidationResult<string> {
    const errors: ValidationError[] = [];

    if (typeof value !== 'string') {
      errors.push({
        field: 'value',
        message: 'Must be a string',
        code: 'TYPE_ERROR',
      });
      return { success: false, data: null, errors };
    }

    let str = value;
    if (this.transform) {
      str = this.transform(str);
    }

    if (this.minLength !== undefined && str.length < this.minLength) {
      errors.push({
        field: 'length',
        message: `Must be at least ${this.minLength} characters`,
        code: 'MIN_LENGTH',
      });
    }

    if (this.maxLength !== undefined && str.length > this.maxLength) {
      errors.push({
        field: 'length',
        message: `Must be at most ${this.maxLength} characters`,
        code: 'MAX_LENGTH',
      });
    }

    if (this.pattern && !this.pattern.test(str)) {
      errors.push({
        field: 'pattern',
        message: 'Invalid format',
        code: 'PATTERN_MISMATCH',
      });
    }

    if (this.customValidator) {
      const error = this.customValidator(str);
      if (error) {
        errors.push(error);
      }
    }

    return {
      success: errors.length === 0,
      data: errors.length === 0 ? str : null,
      errors,
    };
  }
}

/**
 * Number validator
 */
export class NumberValidator extends Validator<number> {
  private min?: number;
  private max?: number;
  private integer?: boolean;

  minimum(value: number): this {
    this.min = value;
    return this;
  }

  maximum(value: number): this {
    this.max = value;
    return this;
  }

  int(): this {
    this.integer = true;
    return this;
  }

  validate(value: unknown): ValidationResult<number> {
    const errors: ValidationError[] = [];
    let num: number | null = null;

    if (typeof value === 'number') {
      num = value;
    } else if (typeof value === 'string') {
      const parsed = parseFloat(value);
      if (!isNaN(parsed)) {
        num = parsed;
      }
    }

    if (num === null) {
      errors.push({
        field: 'value',
        message: 'Must be a number',
        code: 'TYPE_ERROR',
      });
      return { success: false, data: null, errors };
    }

    if (this.integer && !Number.isInteger(num)) {
      errors.push({
        field: 'value',
        message: 'Must be an integer',
        code: 'NOT_INTEGER',
      });
    }

    if (this.min !== undefined && num < this.min) {
      errors.push({
        field: 'value',
        message: `Must be at least ${this.min}`,
        code: 'TOO_SMALL',
      });
    }

    if (this.max !== undefined && num > this.max) {
      errors.push({
        field: 'value',
        message: `Must be at most ${this.max}`,
        code: 'TOO_LARGE',
      });
    }

    return {
      success: errors.length === 0,
      data: errors.length === 0 ? num : null,
      errors,
    };
  }
}

/**
 * Object validator for type-safe object validation
 */
export class ObjectValidator<T extends Record<string, unknown>> extends Validator<T> {
  private schema: Record<string, Validator<unknown>> = {};
  private strict: boolean = true;

  field<K extends keyof T>(name: K, validator: Validator<T[K]>): this {
    this.schema[String(name)] = validator;
    return this;
  }

  nonStrict(): this {
    this.strict = false;
    return this;
  }

  validate(value: unknown): ValidationResult<T> {
    const errors: ValidationError[] = [];

    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      errors.push({
        field: 'value',
        message: 'Must be an object',
        code: 'TYPE_ERROR',
      });
      return { success: false, data: null, errors };
    }

    const obj = value as Record<string, unknown>;
    const result: Record<string, unknown> = {};

    // Validate declared fields
    for (const [field, validator] of Object.entries(this.schema)) {
      const fieldValue = obj[field];
      const validation = validator.validate(fieldValue);

      if (!validation.success) {
        errors.push(...validation.errors.map(e => ({
          ...e,
          field: `${field}.${e.field}`,
        })));
      } else {
        result[field] = validation.data;
      }
    }

    // Check for unknown fields in strict mode
    if (this.strict) {
      for (const key of Object.keys(obj)) {
        if (!(key in this.schema)) {
          errors.push({
            field: key,
            message: 'Unknown field',
            code: 'UNKNOWN_FIELD',
          });
        }
      }
    }

    return {
      success: errors.length === 0,
      data: errors.length === 0 ? (result as T) : null,
      errors,
    };
  }
}

/**
 * Array validator
 */
export class ArrayValidator<T> extends Validator<T[]> {
  private itemValidator: Validator<T>;
  private minItems?: number;
  private maxItems?: number;

  constructor(itemValidator: Validator<T>) {
    super();
    this.itemValidator = itemValidator;
  }

  min(count: number): this {
    this.minItems = count;
    return this;
  }

  max(count: number): this {
    this.maxItems = count;
    return this;
  }

  validate(value: unknown): ValidationResult<T[]> {
    const errors: ValidationError[] = [];

    if (!Array.isArray(value)) {
      errors.push({
        field: 'value',
        message: 'Must be an array',
        code: 'TYPE_ERROR',
      });
      return { success: false, data: null, errors };
    }

    if (this.minItems !== undefined && value.length < this.minItems) {
      errors.push({
        field: 'length',
        message: `Must have at least ${this.minItems} items`,
        code: 'TOO_FEW',
      });
    }

    if (this.maxItems !== undefined && value.length > this.maxItems) {
      errors.push({
        field: 'length',
        message: `Must have at most ${this.maxItems} items`,
        code: 'TOO_MANY',
      });
    }

    const result: T[] = [];
    for (let i = 0; i < value.length; i++) {
      const validation = this.itemValidator.validate(value[i]);
      if (!validation.success) {
        errors.push(...validation.errors.map(e => ({
          ...e,
          field: `[${i}].${e.field}`,
        })));
      } else {
        result.push(validation.data!);
      }
    }

    return {
      success: errors.length === 0,
      data: errors.length === 0 ? result : null,
      errors,
    };
  }
}

/**
 * Factory functions for creating validators
 */
export const validators = {
  string: () => new StringValidator(),
  number: () => new NumberValidator(),
  object: <T extends Record<string, unknown>>() => new ObjectValidator<T>(),
  array: <T,>(itemValidator: Validator<T>) => new ArrayValidator(itemValidator),
};
