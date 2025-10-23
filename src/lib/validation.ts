import { z } from 'zod';
import { TEMPLATES } from '@/config/templates';

// Gelişmiş sanitization helpers
export const sanitizeString = (str: string): string => {
  return str
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .replace(/on\w+='[^']*'/gi, '') // Remove event handlers with single quotes
    .replace(/<iframe\b[^>]*>/gi, '') // Remove iframe tags
    .replace(/<object\b[^>]*>/gi, '') // Remove object tags
    .replace(/<embed\b[^>]*>/gi, '') // Remove embed tags
    .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
    .replace(/['"`]/g, ''); // Remove dangerous characters
};

export const sanitizeHtml = (html: string): string => {
  // Enhanced HTML sanitization - remove dangerous tags and attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^>]*>/gi, '')
    .replace(/<object\b[^>]*>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/<meta\b[^>]*>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/['"`]/g, '');
};

// SQL injection pattern detection
const sqlInjectionPatterns = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
  /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
  /(\b(OR|AND)\b\s+['"]\w+['"]\s*=\s*['"]\w+['"])/i,
  /(--|\/\*|\*\/|;)/,
  /(\b(WAITFOR|DELAY)\b)/i,
  /(\b(BENCHMARK|SLEEP)\b)/i,
];

// XSS pattern detection
const xssPatterns = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i,
  /javascript:/i,
  /vbscript:/i,
  /data:/i,
  /on\w+\s*=/i,
  /<iframe\b[^>]*>/i,
  /<object\b[^>]*>/i,
  /<embed\b[^>]*>/i,
];

// Güvenli string validation
const validateSecureString = (str: string) => {
  if (sqlInjectionPatterns.some((pattern) => pattern.test(str))) {
    throw new Error('Potentially dangerous SQL pattern detected');
  }
  if (xssPatterns.some((pattern) => pattern.test(str))) {
    throw new Error('Potentially dangerous XSS pattern detected');
  }
  return str;
};

// Portfolio Generation Schema
export const portfolioGenerationSchema = z.object({
  template: z.enum(TEMPLATES.map((t) => t.slug) as [string, ...string[]]),
  selectedRepos: z
    .array(
      z
        .string()
        .min(1, 'Repository name cannot be empty')
        .max(100, 'Repository name too long')
        .regex(/^[a-zA-Z0-9\-_\.]+$/, 'Invalid repository name format')
        .refine(validateSecureString, 'Repository name contains potentially dangerous content'),
    )
    .min(1, 'At least one repository must be selected')
    .max(10, 'Maximum 10 repositories allowed'),
  cvUrl: z
    .string()
    .url('Invalid CV URL')
    .refine((url) => url.startsWith('https://'), 'CV URL must use HTTPS')
    .refine(validateSecureString, 'CV URL contains potentially dangerous content')
    .optional()
    .or(z.literal('')),
  userBio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .transform(sanitizeString)
    .refine(validateSecureString, 'Bio contains potentially dangerous content')
    .optional(),
  userEmail: z
    .string()
    .email('Invalid email format')
    .refine((email) => email.length <= 254, 'Email too long')
    .refine(validateSecureString, 'Email contains potentially dangerous content')
    .optional()
    .or(z.literal('')),
  linkedinUrl: z
    .string()
    .url('Invalid LinkedIn URL')
    .refine((url) => url.includes('linkedin.com'), 'Must be a LinkedIn URL')
    .refine((url) => url.startsWith('https://'), 'LinkedIn URL must use HTTPS')
    .refine(validateSecureString, 'LinkedIn URL contains potentially dangerous content')
    .optional()
    .or(z.literal('')),
});

// Portfolio Update Schema
export const portfolioUpdateSchema = z.object({
  template: z
    .enum([
      'professional-tech',
      'minimalist-professional',
      'creative-portfolio',
      // Legacy templates for backward compatibility
      'modern-developer',
      'creative-technologist',
      'storyteller',
    ])
    .optional(),
  selectedRepos: z
    .array(
      z
        .string()
        .min(1, 'Repository name cannot be empty')
        .max(100, 'Repository name too long')
        .regex(/^[a-zA-Z0-9\-_\.]+$/, 'Invalid repository name format'),
    )
    .min(1, 'At least one repository must be selected')
    .max(10, 'Maximum 10 repositories allowed')
    .optional(),
  cvUrl: z
    .string()
    .url('Invalid CV URL')
    .refine((url) => url.startsWith('https://'), 'CV URL must use HTTPS')
    .optional()
    .or(z.literal('')),
  userBio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .transform(sanitizeString)
    .optional(),
});

// Contact Form Schema (for future use)
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Name can only contain letters and spaces')
    .transform(sanitizeString),
  email: z
    .string()
    .email('Invalid email format')
    .refine((email) => email.length <= 254, 'Email too long'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .transform(sanitizeString),
});

// Validation middleware helper
export const validateRequest = async <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): Promise<{ success: true; data: T } | { success: false; error: string }> => {
  try {
    const validatedData = await schema.parseAsync(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      return { success: false, error: errorMessage };
    }
    return { success: false, error: 'Validation failed' };
  }
};
