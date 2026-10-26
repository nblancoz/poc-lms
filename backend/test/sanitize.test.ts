import { chatMessageSchema } from '../src/schemas/tutor.schema';
import { sanitizeUserMessage } from '../src/utils/sanitize';

describe('User Input Sanitizer (sanitizeUserMessage)', () => {
  it('strips active executable tags like <script> and <iframe>', () => {
    const input = 'Hola tutor <script>alert("xss")</script> ¿qué significa carry-on?';
    const output = sanitizeUserMessage(input);
    expect(output).not.toContain('<script>');
    expect(output).not.toContain('alert');
    expect(output).toContain('Hola tutor');
    expect(output).toContain('¿qué significa carry-on?');
  });

  it('neutralizes inline event handler attributes like onerror and onclick', () => {
    const input = 'Tengo una duda <img src=x onerror=alert(1)> sobre equipaje';
    const output = sanitizeUserMessage(input);
    expect(output).not.toContain('onerror');
    expect(output).toContain('Tengo una duda');
    expect(output).toContain('sobre equipaje');
  });

  it('removes invisible zero-width spaces and control characters', () => {
    const input = 'Hola\u200B\u200C\u200D\uFEFF mundo\x00\x08';
    const output = sanitizeUserMessage(input);
    expect(output).toBe('Hola mundo');
  });

  it('normalizes Unicode characters using NFKC', () => {
    // Full-width latin characters 'Ｈｅｌｌｏ' should normalize to 'Hello'
    const fullWidth = '\uFF28\uFF45\uFF4C\uFF4C\uFF4F';
    const output = sanitizeUserMessage(fullWidth);
    expect(output).toBe('Hello');
  });

  it('rejects empty or entirely stripped messages in chatMessageSchema', () => {
    const onlyXSS = '<script>alert(1)</script>';
    const result = chatMessageSchema.safeParse({ message: onlyXSS });
    expect(result.success).toBe(false);
  });

  it('validates and preserves clean messages in chatMessageSchema', () => {
    const cleanMessage = '¿Qué diferencia hay entre travel y trip?';
    const result = chatMessageSchema.safeParse({ message: cleanMessage });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBe(cleanMessage);
    }
  });
});
