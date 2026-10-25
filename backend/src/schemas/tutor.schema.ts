import { z } from 'zod';

export const chatMessageSchema = z.object({
  message: z
    .string({
      error: 'Message is required and must be a string',
    })
    .trim()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message cannot exceed 1000 characters'),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;
