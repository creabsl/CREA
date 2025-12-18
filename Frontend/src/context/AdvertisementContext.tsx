import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface Advertisement {
  id: string
  image: string
  link?: string
  startDate: string
  endDate: string
}

interface AdvertisementContextType {
  advertisements: Advertisement[]
  activeAdvertisements: Advertisement[]
  addAdvertisement: (ad: Omit<Advertisement, 'id'>) => void
  removeAdvertisement: (id: string) => void
  dismissAdvertisement: (id: string) => void
  isDismissed: (id: string) => boolean
}

const AdvertisementContext = createContext<AdvertisementContextType | undefined>(undefined)

export function AdvertisementProvider({ children }: { children: ReactNode }) {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>(() => {
    const saved = localStorage.getItem('crea_advertisements')
    return saved ? JSON.parse(saved) : []
  })

  const [dismissedAds, setDismissedAds] = useState<string[]>(() => {
    const saved = localStorage.getItem('crea_dismissed_ads')
    return saved ? JSON.parse(saved) : []
  })

  // Save to localStorage whenever advertisements change
  useEffect(() => {
    localStorage.setItem('crea_advertisements', JSON.stringify(advertisements))
  }, [advertisements])

  // Save dismissed ads to localStorage
  useEffect(() => {
    localStorage.setItem('crea_dismissed_ads', JSON.stringify(dismissedAds))
  }, [dismissedAds])

  // Get active advertisements based on date range
  const activeAdvertisements = advertisements.filter(ad => {
    if (dismissedAds.includes(ad.id)) return false
    
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const start = new Date(ad.startDate)
    const end = new Date(ad.endDate)
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
    return now >= start && now <= end
  })

  const addAdvertisement = (ad: Omit<Advertisement, 'id'>) => {
    const newAd: Advertisement = {
      ...ad,
      id: Date.now().toString()
    }
    setAdvertisements(prev => [...prev, newAd])
  }

  const removeAdvertisement = (id: string) => {
    setAdvertisements(prev => prev.filter(ad => ad.id !== id))
    setDismissedAds(prev => prev.filter(adId => adId !== id))
  }

  const dismissAdvertisement = (id: string) => {
    setDismissedAds(prev => [...prev, id])
  }

  const isDismissed = (id: string) => {
    return dismissedAds.includes(id)
  }

  return (
    <AdvertisementContext.Provider value={{
      advertisements,
      activeAdvertisements,
      addAdvertisement,
      removeAdvertisement,
      dismissAdvertisement,
      isDismissed
    }}>
      {children}
    </AdvertisementContext.Provider>
  )
}

export function useAdvertisements() {
  const context = useContext(AdvertisementContext)
  if (!context) {
    throw new Error('useAdvertisements must be used within AdvertisementProvider')
  }
  return context
}
