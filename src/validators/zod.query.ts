import { z } from 'zod';

function preprocessEmptyStringToUndefined(value: unknown) {
  if (typeof value === 'string' && value.trim() === '') return undefined;
  return value;
}

export const zQueryStringOptional = () => z.preprocess(preprocessEmptyStringToUndefined, z.string()).optional();

export const zQueryString = () => z.preprocess(preprocessEmptyStringToUndefined, z.string());

export const zQueryNumber = () => z.preprocess(preprocessEmptyStringToUndefined, z.coerce.number());
export const zQueryNumberOptional = () => zQueryNumber().optional();

export const zQueryBoolean = () =>
  z.preprocess((value) => {
    if (typeof value === 'string') {
      const s = value.trim().toLowerCase();
      if (s === 'true' || s === '1') return true;
      if (s === 'false' || s === '0') return false;
    }
    return value;
  }, z.boolean());

export const zQueryBooleanOptional = () => zQueryBoolean().optional();

export const zQueryJsonObjectOptional = <T extends z.ZodTypeAny>(schema: T) =>
  z
    .preprocess((value) => {
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (!trimmed) return undefined;
        try {
          return JSON.parse(trimmed);
        } catch {
          return value;
        }
      }
      return value;
    }, schema)
    .optional();

export const zQueryJsonObject = <T extends z.ZodTypeAny>(schema: T) =>
  z.preprocess((value) => {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (!trimmed) return value;
      try {
        return JSON.parse(trimmed);
      } catch {
        return value;
      }
    }
    return value;
  }, schema);
