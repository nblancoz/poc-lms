/**
 * Sanitizes user chat input for the AI tutor to prevent:
 * 1. Stored XSS and malicious HTML/script injection.
 * 2. Invisible zero-width and control characters used in prompt injection bypasses.
 * 3. Excessive or malformed Unicode formatting.
 */
export function sanitizeUserMessage(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // 1. Normalize Unicode (NFKC) to resolve homoglyphs and compatibility characters
  let clean = input.normalize('NFKC');

  // 2. Remove invisible zero-width spaces and formatting markers
  clean = clean.replace(/[\u200B-\u200D\uFEFF]/g, '');

  // 3. Remove non-printable control characters (preserve \n, \r, \t)
  // eslint-disable-next-line no-control-regex
  clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  // 4. Strip dangerous active script/embedded tags
  clean = clean.replace(
    /<\s*(script|style|iframe|object|embed|applet)[\s\S]*?<\s*\/\s*\1\s*>/gi,
    '',
  );
  clean = clean.replace(/<\s*(script|style|iframe|object|embed|applet)[^>]*\/?>/gi, '');

  // 5. Neutralize dangerous event handler attributes (e.g. onerror=, onclick=) and javascript: protocol
  clean = clean.replace(/\bon\w+\s*=\s*(['"]).*?\1/gi, '');
  clean = clean.replace(/\bon\w+\s*=\s*[^>\s]+/gi, '');
  clean = clean.replace(/javascript:\s*/gi, '');

  return clean.trim();
}
