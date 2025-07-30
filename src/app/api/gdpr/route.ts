import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { 
  deleteUserData, 
  updateUserData, 
  exportUserData, 
  saveUserConsent, 
  getUserConsent,
  cleanupExpiredData 
} from '@/lib/gdpr'
import { createSecureResponse } from '@/lib/security'
import * as Sentry from '@sentry/nextjs'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return createSecureResponse({ error: 'Unauthorized' }, 401)
    }
    
    const body = await request.json()
    const { action, data } = body
    
    const userId = session.user.email
    
    switch (action) {
      case 'delete':
        // Right to be forgotten
        const deleteResult = await deleteUserData(userId)
        return createSecureResponse({
          success: deleteResult.success,
          deletedRecords: deleteResult.deletedRecords,
          message: 'Your data has been deleted successfully'
        })
        
      case 'update':
        // Right to rectification
        const updateResult = await updateUserData(userId, data)
        return createSecureResponse({
          success: updateResult.success,
          updatedRecords: updateResult.updatedRecords,
          message: 'Your data has been updated successfully'
        })
        
      case 'export':
        // Right to data portability
        const exportResult = await exportUserData(userId)
        return createSecureResponse({
          success: exportResult.success,
          data: exportResult.data,
          message: 'Your data has been exported successfully'
        })
        
      case 'consent':
        // Consent management
        const consentResult = await saveUserConsent({
          userId,
          analytics: data.analytics || false,
          feedback: data.feedback || false,
          marketing: data.marketing || false,
          thirdParty: data.thirdParty || false,
          timestamp: new Date().toISOString()
        })
        
        return createSecureResponse({
          success: consentResult,
          message: consentResult ? 'Consent saved successfully' : 'Failed to save consent'
        })
        
      default:
        return createSecureResponse({ error: 'Invalid action' }, 400)
    }
  } catch (error) {
    console.error('[GDPR API] Error:', error)
    Sentry.captureException(error)
    return createSecureResponse({ error: 'Internal server error' }, 500)
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return createSecureResponse({ error: 'Unauthorized' }, 401)
    }
    
    const userId = session.user.email
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    switch (action) {
      case 'consent':
        // Get user consent
        const consent = await getUserConsent(userId)
        return createSecureResponse({
          success: true,
          consent: consent || {
            userId,
            analytics: false,
            feedback: false,
            marketing: false,
            thirdParty: false,
            timestamp: null
          }
        })
        
      case 'rights':
        // Get user GDPR rights
        return createSecureResponse({
          success: true,
          rights: {
            rightToAccess: true,
            rightToRectification: true,
            rightToErasure: true,
            rightToPortability: true,
            rightToRestrictProcessing: true,
            rightToObject: true
          },
          retentionPeriods: {
            portfolioData: '2 years',
            analyticsData: '3 months',
            feedbackData: '6 months',
            sessionData: '1 month'
          }
        })
        
      default:
        return createSecureResponse({ error: 'Invalid action' }, 400)
    }
  } catch (error) {
    console.error('[GDPR API] Error:', error)
    Sentry.captureException(error)
    return createSecureResponse({ error: 'Internal server error' }, 500)
  }
}

// Admin endpoint for data cleanup (cron job için)
export async function DELETE(request: NextRequest) {
  try {
    // Admin authentication (basit API key kontrolü)
    const authHeader = request.headers.get('authorization')
    const apiKey = process.env.GDPR_CLEANUP_API_KEY
    
    if (!apiKey || authHeader !== `Bearer ${apiKey}`) {
      return createSecureResponse({ error: 'Unauthorized' }, 401)
    }
    
    const cleanupResult = await cleanupExpiredData()
    
    return createSecureResponse({
      success: cleanupResult.success,
      cleanedRecords: cleanupResult.cleanedRecords,
      message: `Cleaned ${cleanupResult.cleanedRecords} expired records`
    })
  } catch (error) {
    console.error('[GDPR Cleanup API] Error:', error)
    Sentry.captureException(error)
    return createSecureResponse({ error: 'Internal server error' }, 500)
  }
} 