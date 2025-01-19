import { Fade } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { FadeTransitionProps } from './types'

const FadeTransition = ({ children }: FadeTransitionProps) => {
  const location = useLocation()

  return (
    <Fade in={true} timeout={300} key={location.pathname} appear={true}>
      <div>{children}</div>
    </Fade>
  )
}

export default FadeTransition
