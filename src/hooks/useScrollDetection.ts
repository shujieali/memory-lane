import { useCallback, useEffect, useState, useRef, useMemo } from 'react'
import { debounce } from 'lodash'
import type { ScrollDetectionOptions, ScrollDetectionResult } from './types'

/**
 * Hook for detecting scroll position and visible items in a list
 *
 * @example
 * ```tsx
 * const { showIndicator, currentItem, containerRef } = useScrollDetection(
 *   memories,
 *   { hideDelay: 1500 }
 * )
 * ```
 *
 * @param items - Array of items to track
 * @param options - Configuration options
 * @returns ScrollDetectionResult
 */
export function useScrollDetection<T>(
  items: T[],
  options: ScrollDetectionOptions = {},
): ScrollDetectionResult<T> {
  const { hideDelay = 1500, scrollDebounce = 100 } = options

  const [showIndicator, setShowIndicator] = useState(false)
  const [currentItem, setCurrentItem] = useState<T | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const debouncedHideIndicator = useMemo(
    () => debounce(() => setShowIndicator(false), hideDelay),
    [hideDelay],
  )

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return

    const scrollContainer = containerRef.current.closest(
      '[data-scroll-container]',
    )
    if (!scrollContainer) return

    // Find items that are currently visible
    const containerRect = scrollContainer.getBoundingClientRect()
    const middleY = containerRect.height / 2

    // Find the item closest to the middle of the viewport
    const children = Array.from(containerRef.current.children)
    let closestChild: Element | null = null
    let minDistance = Infinity

    children.forEach((child) => {
      const rect = child.getBoundingClientRect()
      const childMiddle = rect.top + rect.height / 2
      const distance = Math.abs(childMiddle - middleY)

      if (distance < minDistance) {
        minDistance = distance
        closestChild = child
      }
    })

    if (closestChild) {
      const index = children.indexOf(closestChild)
      if (index >= 0 && index < items.length) {
        setCurrentItem(items[index])
        setShowIndicator(true)
        debouncedHideIndicator()
      }
    }
  }, [items, debouncedHideIndicator])

  const throttledScroll = useMemo(
    () =>
      debounce(handleScroll, scrollDebounce, { leading: true, trailing: true }),
    [handleScroll, scrollDebounce],
  )

  useEffect(() => {
    const scrollContainer = containerRef.current?.closest(
      '[data-scroll-container]',
    )
    if (!scrollContainer) return

    scrollContainer.addEventListener('scroll', throttledScroll)

    return () => {
      scrollContainer.removeEventListener('scroll', throttledScroll)
      throttledScroll.cancel()
      debouncedHideIndicator.cancel()
    }
  }, [throttledScroll, debouncedHideIndicator])

  return {
    showIndicator,
    currentItem,
    containerRef,
  }
}
