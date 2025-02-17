import { CSSProperties } from 'react'

export interface ScrollIndicatorProps {
  /**
   * The text to display in the indicator
   */
  text: string

  /**
   * Whether the indicator is visible
   */
  show: boolean

  /**
   * Optional custom styles for the container
   */
  containerStyle?: CSSProperties
}
