import { RefObject } from 'react'

export interface ScrollDetectionOptions {
  /**
   * Time in milliseconds to wait before hiding the indicator after scrolling stops
   */
  hideDelay?: number

  /**
   * Time in milliseconds to debounce scroll events
   */
  scrollDebounce?: number

  /**
   * Threshold to consider an element "in view" (0 to 1)
   */
}

export interface ScrollDetectionResult<T> {
  /**
   * Whether the indicator should be shown
   */
  showIndicator: boolean

  /**
   * The currently visible item
   */
  currentItem: T | null

  /**
   * Reference to attach to the scrollable container
   */
  containerRef: RefObject<HTMLDivElement | null>
}
