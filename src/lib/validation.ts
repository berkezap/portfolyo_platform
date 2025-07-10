import { z } from 'zod'

// Sanitization helpers
export const sanitizeString = (str: string): string => {
  return str
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .replace(/on\w+='[^']*'/gi, '') // Remove event handlers with single quotes
}

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - remove dangerous tags and attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^>]*>/gi, '')
    .replace(/<object\b[^>]*>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/<meta\b[^>]*>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
}

// Portfolio Generation Schema
export const portfolioGenerationSchema = z.object({
  template: z.enum([
    'modern-developer',
    'creative-portfolio',
    'professional-tech',
    'minimalist-professional',
    'creative-technologist',
    'storyteller',
  ]),
  selectedRepos: z.array(
    z.string()
      .min(1, 'Repository name cannot be empty')
      .max(100, 'Repository name too long')
      .regex(/^[a-zA-Z0-9\-_\.]+$/, 'Invalid repository name format')
  )
    .min(1, 'At least one repository must be selected')
    .max(10, 'Maximum 10 repositories allowed'),
  cvUrl: z.string()
    .url('Invalid CV URL')
    .refine(url => url.startsWith('https://'), 'CV URL must use HTTPS')
    .optional()
    .or(z.literal('')),
  userBio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .transform(sanitizeString)
    .optional(),
  userEmail: z.string()
    .email('Invalid email format')
    .refine(email => email.length <= 254, 'Email too long')
    .optional()
    .or(z.literal('')),
  linkedinUrl: z.string()
    .url('Invalid LinkedIn URL')
    .refine(url => url.includes('linkedin.com'), 'Must be a LinkedIn URL')
    .refine(url => url.startsWith('https://'), 'LinkedIn URL must use HTTPS')
    .optional()
    .or(z.literal(''))
})

// Portfolio Update Schema
export const portfolioUpdateSchema = z.object({
  template: z.enum([
    'modern-developer',
    'creative-portfolio',
    'professional-tech',
    'minimalist-professional',
    'creative-technologist',
    'storyteller',
  ]).optional(),
  selectedRepos: z.array(
    z.string()
      .min(1, 'Repository name cannot be empty')
      .max(100, 'Repository name too long')
      .regex(/^[a-zA-Z0-9\-_\.]+$/, 'Invalid repository name format')
  )
    .min(1, 'At least one repository must be selected')
    .max(10, 'Maximum 10 repositories allowed')
    .optional(),
  cvUrl: z.string()
    .url('Invalid CV URL')
    .refine(url => url.startsWith('https://'), 'CV URL must use HTTPS')
    .optional()
    .or(z.literal('')),
  userBio: z.string()
    .max(500, 'Bio must be less than 500 characters')
    .transform(sanitizeString)
    .optional(),
})

// Contact Form Schema (for future use)
export const contactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, 'Name can only contain letters and spaces')
    .transform(sanitizeString),
  email: z.string()
    .email('Invalid email format')
    .refine(email => email.length <= 254, 'Email too long'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .transform(sanitizeString)
})

// Validation middleware helper
export const validateRequest = async <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; error: string }> => {
  try {
    const validatedData = await schema.parseAsync(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.issues
        .map((err) => `${err.path.join('.')}: ${err.message}`)
        .join(', ')
      return { success: false, error: errorMessage }
    }
    return { success: false, error: 'Validation failed' }
  }
} 