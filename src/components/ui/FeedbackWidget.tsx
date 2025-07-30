import React, { useState } from 'react'
import { Star, MessageCircle, X, Send, Smile, Meh, Frown } from 'lucide-react'
import Button from './Button'
import Card from './Card'

interface FeedbackWidgetProps {
  onClose?: () => void
  className?: string
}

interface FeedbackData {
  rating: number
  feedback: string
  type: 'general' | 'usability' | 'feature'
  page: string
}

const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ onClose, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [step, setStep] = useState<'initial' | 'rating' | 'feedback' | 'thanks'>('initial')
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    rating: 0,
    feedback: '',
    type: 'general',
    page: typeof window !== 'undefined' ? window.location.pathname : '/'
  })

  const handleRating = (rating: number) => {
    setFeedbackData(prev => ({ ...prev, rating }))
    setStep('feedback')
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData)
      })

      if (response.ok) {
        setStep('thanks')
        setTimeout(() => {
          setIsOpen(false)
          setStep('initial')
          setFeedbackData({
            rating: 0,
            feedback: '',
            type: 'general',
            page: typeof window !== 'undefined' ? window.location.pathname : '/'
          })
        }, 3000)
      }
    } catch (error) {
      console.error('Feedback submission error:', error)
    }
  }

  const getEmoji = (rating: number) => {
    if (rating >= 4) return <Smile className="w-6 h-6 text-green-500" />
    if (rating >= 3) return <Meh className="w-6 h-6 text-yellow-500" />
    return <Frown className="w-6 h-6 text-red-500" />
  }

  if (!isOpen) {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          variant="primary"
          size="lg"
          icon={MessageCircle}
          onClick={() => setIsOpen(true)}
          className="shadow-xl hover-lift"
        >
          Geri Bildirim
        </Button>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 w-96 ${className}`}>
      <Card variant="glass" className="p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Geri Bildiriminiz</h3>
          <Button
            variant="secondary"
            size="sm"
            icon={X}
            onClick={() => {
              setIsOpen(false)
              setStep('initial')
              onClose?.()
            }}
            className="p-2"
          >
            {/* Sadece ikonlu buton için boş children */}
            ""
          </Button>
        </div>

        {/* Content */}
        {step === 'initial' && (
          <div className="space-y-4">
            <p className="text-gray-600">Deneyiminizi nasıl değerlendirirsiniz?</p>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => handleRating(rating)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Star className={`w-8 h-8 ${
                    rating <= feedbackData.rating 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'
                  }`} />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'feedback' && (
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              {getEmoji(feedbackData.rating)}
              <span className="text-lg font-medium">
                {feedbackData.rating}/5 puan verdiniz
              </span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Geri bildirim türü
              </label>
              <select
                value={feedbackData.type}
                onChange={(e) => setFeedbackData(prev => ({ 
                  ...prev, 
                  type: e.target.value as 'general' | 'usability' | 'feature' 
                }))}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="general">Genel Deneyim</option>
                <option value="usability">Kullanılabilirlik</option>
                <option value="feature">Özellik Önerisi</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Detaylı geri bildiriminiz (isteğe bağlı)
              </label>
              <textarea
                value={feedbackData.feedback}
                onChange={(e) => setFeedbackData(prev => ({ 
                  ...prev, 
                  feedback: e.target.value 
                }))}
                placeholder="Deneyiminizi paylaşın..."
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              />
            </div>

            <div className="flex space-x-3">
              <Button
                variant="secondary"
                onClick={() => setStep('initial')}
                className="flex-1"
              >
                Geri
              </Button>
              <Button
                variant="primary"
                icon={Send}
                onClick={handleSubmit}
                className="flex-1"
              >
                Gönder
              </Button>
            </div>
          </div>
        )}

        {step === 'thanks' && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Smile className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Teşekkürler!</h3>
            <p className="text-gray-600">
              Geri bildiriminiz için teşekkür ederiz. Deneyiminizi iyileştirmek için kullanacağız.
            </p>
          </div>
        )}
      </Card>
    </div>
  )
}

export default FeedbackWidget 