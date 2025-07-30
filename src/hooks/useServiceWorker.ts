import { useEffect, useState } from 'react'

interface ServiceWorkerState {
  isSupported: boolean
  isInstalled: boolean
  isUpdated: boolean
  isLoading: boolean
  error: string | null
}

export const useServiceWorker = () => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: false,
    isInstalled: false,
    isUpdated: false,
    isLoading: true,
    error: null,
  })

  useEffect(() => {
    // Service Worker desteğini kontrol et
    if (!('serviceWorker' in navigator)) {
      setState(prev => ({
        ...prev,
        isSupported: false,
        isLoading: false,
        error: 'Service Worker desteklenmiyor'
      }))
      return
    }

    setState(prev => ({ ...prev, isSupported: true }))

    // Service Worker'ı kaydet
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        })

        console.log('Service Worker kaydedildi:', registration)

        // Service Worker durumunu izle
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState(prev => ({ ...prev, isUpdated: true }))
              }
            })
          }
        })

        // Service Worker mesajlarını dinle
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'CACHE_UPDATED') {
            console.log('Cache güncellendi')
          }
        })

        setState(prev => ({
          ...prev,
          isInstalled: true,
          isLoading: false
        }))

      } catch (error) {
        console.error('Service Worker kayıt hatası:', error)
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: 'Service Worker kaydedilemedi'
        }))
      }
    }

    // Service Worker zaten yüklü mü kontrol et
    if (navigator.serviceWorker.controller) {
      setState(prev => ({
        ...prev,
        isInstalled: true,
        isLoading: false
      }))
    } else {
      registerServiceWorker()
    }

    // Service Worker güncellemelerini dinle
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker controller değişti')
      setState(prev => ({ ...prev, isUpdated: false }))
    })

  }, [])

  // Service Worker'ı güncelle
  const updateServiceWorker = async () => {
    if (!navigator.serviceWorker.controller) {
      return
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration()
      if (registration && registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
      }
    } catch (error) {
      console.error('Service Worker güncelleme hatası:', error)
    }
  }

  // Cache'i temizle
  const clearCache = async () => {
    try {
      const cacheNames = await caches.keys()
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      )
      console.log('Cache temizlendi')
    } catch (error) {
      console.error('Cache temizleme hatası:', error)
    }
  }

  // Offline durumunu kontrol et
  const checkOfflineStatus = () => {
    return !navigator.onLine
  }

  // Network durumunu dinle
  useEffect(() => {
    const handleOnline = () => {
      console.log('Çevrimiçi')
    }

    const handleOffline = () => {
      console.log('Çevrimdışı')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return {
    ...state,
    updateServiceWorker,
    clearCache,
    checkOfflineStatus
  }
}

// Service Worker mesajları için yardımcı fonksiyonlar
export const sendMessageToSW = (message: any) => {
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage(message)
  }
}

// Cache durumunu kontrol et
export const checkCacheStatus = async () => {
  try {
    const cacheNames = await caches.keys()
    const cacheStatus = await Promise.all(
      cacheNames.map(async (cacheName) => {
        const cache = await caches.open(cacheName)
        const keys = await cache.keys()
        return {
          name: cacheName,
          size: keys.length
        }
      })
    )
    return cacheStatus
  } catch (error) {
    console.error('Cache durumu kontrol hatası:', error)
    return []
  }
}

// Service Worker performans metrikleri
export const getSWPerformanceMetrics = async () => {
  try {
    const registration = await navigator.serviceWorker.getRegistration()
    if (!registration) {
      return null
    }

    return {
      scope: registration.scope,
      updateViaCache: registration.updateViaCache,
      installing: !!registration.installing,
      waiting: !!registration.waiting,
      active: !!registration.active
    }
  } catch (error) {
    console.error('Service Worker performans metrikleri alınamadı:', error)
    return null
  }
}

export default useServiceWorker 