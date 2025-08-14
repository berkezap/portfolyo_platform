import * as Sentry from '@sentry/nextjs';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

interface ErrorContext {
  endpoint?: string;
  userId?: string;
  action?: string;
  data?: any;
}

interface StandardErrorResponse {
  error: string;
  message: string;
  details?: any;
  traceId: string;
  timestamp: string;
}

export function createErrorResponse(
  error: string | Error,
  message: string,
  status: number = 500,
  context?: ErrorContext,
  details?: any
): NextResponse {
  const traceId = randomUUID();
  const timestamp = new Date().toISOString();
  
  // Sentry'ye gönder
  Sentry.captureException(error instanceof Error ? error : new Error(error), {
    tags: {
      api: context?.endpoint || 'unknown',
      action: context?.action || 'unknown',
    },
    extra: {
      traceId,
      userId: context?.userId,
      requestData: context?.data,
      details,
    },
  });

  const errorResponse: StandardErrorResponse = {
    error: error instanceof Error ? error.message : error,
    message,
    details,
    traceId,
    timestamp,
  };

  console.error(`[API Error] ${context?.endpoint || 'Unknown'} - ${message}`, {
    traceId,
    error: error instanceof Error ? error.stack : error,
    context,
  });

  return NextResponse.json(errorResponse, { status });
}

export function createSuccessResponse(data: any, status: number = 200): NextResponse {
  return NextResponse.json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  }, { status });
}
