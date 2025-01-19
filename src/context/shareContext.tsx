import { ReactNode, useState } from 'react'
import { ShareMemoryPayload } from './types'
import { ShareMemoryContext } from './contexts'
import { ShareModal } from '../features/share'

export function ShareProvider({ children }: { children: ReactNode }) {
  const [share, setShare] = useState<ShareMemoryPayload | null>(null)
  const onClose = () => setShare(null)
  const shareMemory = async (share: ShareMemoryPayload): Promise<void> => {
    console.log('Sharing memory', share)
    setShare(share)
  }
  return (
    <ShareMemoryContext.Provider value={{ shareMemory }}>
      {children}
      <ShareModal
        title={share?.title || ''}
        description={share?.description || ''}
        url={share?.url || ''}
        open={!!share}
        onClose={onClose}
      />
    </ShareMemoryContext.Provider>
  )
}
