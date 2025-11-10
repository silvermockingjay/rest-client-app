import { describe, it, expect } from 'vitest';
import { getAuthSchema } from './schema';

describe('getAuthSchema', () => {
  const schema = getAuthSchema();

  it('validates correct data', async () => {
    const validData = { name: 'John', email: 'john@example.com', password: 'Pass1234!' };
    await expect(schema.validate(validData)).resolves.toEqual(validData);
  });

  it('fails when name is missing', async () => {
    const data = { name: '', email: 'john@example.com', password: 'Pass1234!' };
    await expect(schema.validate(data)).rejects.toThrow('Name is required');
  });

  it('fails when email format is invalid', async () => {
    const data = { name: 'John', email: 'invalid', password: 'Pass1234!' };
    await expect(schema.validate(data)).rejects.toThrow(
      'Expected email format: username@example.com'
    );
  });

  it('fails when password is too short', async () => {
    const data = { name: 'John', email: 'john@example.com', password: 'P1' };
    await expect(schema.validate(data)).rejects.toThrow('Password must be at least 8 characters');
  });

  it('fails when password has no letters', async () => {
    const data = { name: 'John', email: 'john@example.com', password: '12345678' };
    await expect(schema.validate(data)).rejects.toThrow(
      'Password must contain at least one letter'
    );
  });

  it('fails when password has no numbers', async () => {
    const data = { name: 'John', email: 'john@example.com', password: 'Password' };
    await expect(schema.validate(data)).rejects.toThrow(
      'Password must contain at least one number'
    );
  });
  it('fails when password has no special character', async () => {
    const data = { name: 'John', email: 'john@example.com', password: 'Password1' };
    await expect(schema.validate(data)).rejects.toThrow('Special symbol is required');
  });
});
