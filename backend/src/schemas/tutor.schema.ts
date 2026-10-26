import { z } from 'zod';
import { sanitizeUserMessage } from '../utils/sanitize';

export const chatMessageSchema = z.object({
  message: z
    .string({
      error: 'Message is required and must be a string',
    })
    .trim()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message cannot exceed 1000 characters')
    .transform((val) => sanitizeUserMessage(val))
    .refine((val) => val.length > 0, {
      message: 'Message cannot be empty or solely contain invalid content',
    }),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
