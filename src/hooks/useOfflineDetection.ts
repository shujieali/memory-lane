import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTE_PATHS } from '../Routes/constants'

export const useOfflineDetection = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine)
  const navigate = useNavigate()

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true)
      navigate(ROUTE_PATHS.offline)
    }

    const handleOnline = () => {
      setIsOffline(false)
      // Go back when connection is restored
      navigate(-1)
    }

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [navigate])

  return isOffline
}
