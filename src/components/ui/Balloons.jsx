import { useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import { balloons } from 'balloons-js'

const Balloons = forwardRef(function Balloons({ className }, ref) {
  const containerRef = useRef(null)

  const launchAnimation = useCallback(() => {
    balloons()
  }, [])

  useImperativeHandle(ref, () => ({ launchAnimation }), [launchAnimation])

  return <div ref={containerRef} className={className} />
})

export { Balloons }
