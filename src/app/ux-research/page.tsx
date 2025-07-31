/**
 * UXResearchPage - Kullanıcı deneyimi dashboard'u.
 * @returns {JSX.Element} UX araştırma ve analiz dashboard'u.
 */

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { BarChart3, Users, Clock, TrendingUp, MessageCircle, Star, Activity } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import FeedbackWidget from '@/components/ui/FeedbackWidget'

interface AnalyticsData {
  totalUsers: number
  totalSessions: number
  avgSessionDuration: number
  portfolioCreationRate: number
  templateUsage: Record<string, number>
  userJourney: Record<string, number>
  feedback: {
    averageRating: number
    totalFeedback: number
    recentFeedback: Array<{
      rating: number
      feedback: string
      type: string
      createdAt: string
    }>
  }
}

export default function UXResearchPage() {
  const { data: session } = useSession()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  const fetchAnalyticsData = useCallback(async () => {
    try {
      const response = await fetch(`/api/analytics?days=${timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90}`)
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      }
    } catch (error) {
      console.error('Analytics fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [timeRange]);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <Card variant="glass" className="p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erişim Reddedildi</h1>
          <p className="text-gray-600">Bu sayfayı görüntülemek için giriş yapmanız gerekiyor.</p>
        </Card>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="glass border-b border-white/20 shadow-glass">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">UX Araştırma Dashboard</h1>
              <p className="text-gray-600">Kullanıcı deneyimi analizi ve araştırma sonuçları</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7d">Son 7 gün</option>
                <option value="30d">Son 30 gün</option>
                <option value="90d">Son 90 gün</option>
              </select>
              <Button variant="gradient" icon={Activity}>
                Rapor İndir
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Kullanıcı</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData?.totalUsers || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Toplam Oturum</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData?.totalSessions || 0}
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ortalama Oturum</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((analyticsData?.avgSessionDuration || 0) / 1000 / 60)} dk
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </Card>

          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Portfolio Oluşturma</p>
                <p className="text-2xl font-bold text-gray-900">
                  %{Math.round((analyticsData?.portfolioCreationRate || 0) * 100)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Template Usage */}
          <Card variant="glass" className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Şablon Kullanımı</h3>
            <div className="space-y-3">
              {analyticsData?.templateUsage && Object.entries(analyticsData.templateUsage).map(([template, count]) => (
                <div key={template} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">
                    {template.replace('-', ' ')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(count / Math.max(...Object.values(analyticsData.templateUsage))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* User Journey */}
          <Card variant="glass" className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kullanıcı Yolculuğu</h3>
            <div className="space-y-3">
              {analyticsData?.userJourney && Object.entries(analyticsData.userJourney).map(([step, count]) => (
                <div key={step} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">
                    {step.replace('_', ' ')}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(count / Math.max(...Object.values(analyticsData.userJourney))) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Feedback Section */}
        <Card variant="glass" className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Kullanıcı Geri Bildirimi</h3>
            <div className="flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-500 fill-current" />
              <span className="text-lg font-bold text-gray-900">
                {analyticsData?.feedback?.averageRating !== undefined ? analyticsData.feedback.averageRating.toFixed(1) : '0.0'}
              </span>
              <span className="text-sm text-gray-600">
                / 5 ({analyticsData?.feedback?.totalFeedback !== undefined ? analyticsData.feedback.totalFeedback : 0} değerlendirme)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Feedback */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Son Geri Bildirimler</h4>
              <div className="space-y-3">
                {analyticsData?.feedback?.recentFeedback?.slice(0, 5)?.map((feedback, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < feedback.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(feedback.createdAt).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{feedback.feedback}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {feedback.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback Stats */}
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Geri Bildirim İstatistikleri</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm text-gray-700">Pozitif (4-5 yıldız)</span>
                  <span className="text-sm font-medium text-green-700">
                    {analyticsData?.feedback?.recentFeedback?.filter(f => f.rating >= 4)?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm text-gray-700">Nötr (3 yıldız)</span>
                  <span className="text-sm font-medium text-yellow-700">
                    {analyticsData?.feedback?.recentFeedback?.filter(f => f.rating === 3)?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="text-sm text-gray-700">Negatif (1-2 yıldız)</span>
                  <span className="text-sm font-medium text-red-700">
                    {analyticsData?.feedback?.recentFeedback?.filter(f => f.rating <= 2)?.length || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Items */}
        <Card variant="glass" className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksiyon Öğeleri</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="gradient" icon={MessageCircle} className="w-full">
              Kullanıcı Anketi Başlat
            </Button>
            <Button variant="secondary" icon={Users} className="w-full">
              Usability Test Planla
            </Button>
            <Button variant="secondary" icon={BarChart3} className="w-full">
              Detaylı Rapor Oluştur
            </Button>
          </div>
        </Card>
      </div>

      {/* Feedback Widget */}
      <FeedbackWidget />
    </div>
  )
}